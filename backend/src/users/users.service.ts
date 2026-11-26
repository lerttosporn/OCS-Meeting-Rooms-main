import {
  Injectable, Inject, NotFoundException,
  UnauthorizedException, ConflictException,
} from '@nestjs/common';
import postgres from 'postgres';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { SQL } from '../database/database.module';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto, RegisterDto, GoogleLoginDto } from './dto/auth.dto';
import { OAuth2Client } from 'google-auth-library';

const JWT_SECRET = process.env.JWT_SECRET || 'ocs-secret-key-2025';
const JWT_EXPIRES_IN = '2h';

@Injectable()
export class UsersService {
  constructor(@Inject(SQL) private sql: postgres.Sql) {}

  // ─── AUTH ─────────────────────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    // ตรวจสอบ email ซ้ำ
    const [existing] = await this.sql`
      SELECT id FROM users WHERE email = ${dto.email}
    `;
    if (existing) throw new ConflictException('อีเมลนี้ถูกใช้งานแล้ว');

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const [user] = await this.sql`
      INSERT INTO users
        (org_id, email, password, role, first_name, last_name, card_id, phone_number, position)
      VALUES
        (${dto.org_id}, ${dto.email}, ${hashedPassword}, ${dto.role},
         ${dto.first_name}, ${dto.last_name ?? null}, ${dto.card_id ?? null},
         ${dto.phone_number ?? null}, ${dto.position ?? null})
      RETURNING id, org_id, email, role, first_name, last_name, card_id,
                phone_number, position, created_at
    `;

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    return { user, token };
  }

  async login(dto: LoginDto) {
    // ดึง user รวม password เพื่อตรวจสอบ
    const [user] = await this.sql`
      SELECT id, org_id, email, password, role, first_name, last_name, card_id,
             phone_number, position, created_at
      FROM users
      WHERE email = ${dto.email}
    `;
    if (!user) throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    // ไม่ส่ง password กลับ
    const { password: _pw, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async googleLogin(dto: GoogleLoginDto) {
    const client = new OAuth2Client('425418224600-gdcmb7h6rq49nuc08frjrr5bosjgolo1.apps.googleusercontent.com');
    try {
      const ticket = await client.verifyIdToken({
        idToken: dto.token,
        audience: '425418224600-gdcmb7h6rq49nuc08frjrr5bosjgolo1.apps.googleusercontent.com',
      });
      const payload = ticket.getPayload();
      if (!payload) throw new UnauthorizedException('Invalid Google token');

      const { email, given_name, family_name } = payload;
      if (!email) throw new UnauthorizedException('Google token does not contain an email');
      
      let [user] = await this.sql`
        SELECT id, org_id, email, password, role, first_name, last_name, card_id,
               phone_number, position, created_at
        FROM users
        WHERE email = ${email}
      `;

      if (!user) {
        // Create user if not exist
        const placeholderPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
        const [newUser] = await this.sql`
          INSERT INTO users
            (org_id, email, password, role, first_name, last_name)
          VALUES
            (1, ${email}, ${placeholderPassword}, 'customer',
             ${given_name || 'Google'}, ${family_name || 'User'})
          RETURNING id, org_id, email, password, role, first_name, last_name, card_id,
                    phone_number, position, created_at
        `;
        user = newUser;
      }

      const token = jwt.sign(
        { sub: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
      );

      const { password: _pw, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token };
    } catch (err) {
      throw new UnauthorizedException('Google token verification failed');
    }
  }

  async getProfile(userId: number) {
    return this.findOne(userId);
  }

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  async findAll() {
    return await this.sql`
      SELECT u.id, u.org_id, o.org_name, u.email, u.role, u.first_name, u.last_name,
             u.phone_number, u.position, u.created_at, u.updated_at
      FROM users u
      LEFT JOIN organizations o ON u.org_id = o.org_id
      ORDER BY u.id
    `;
  }

  async findOne(id: number) {
    const [user] = await this.sql`
      SELECT id, org_id, email, role, first_name, last_name,
             phone_number, position, created_at, updated_at
      FROM users
      WHERE id = ${id}
    `;
    if (!user) throw new NotFoundException(`ไม่พบ user id ${id}`);
    return user;
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const [user] = await this.sql`
      INSERT INTO users
        (org_id, email, password, role, first_name, last_name, phone_number, position)
      VALUES
        (${dto.org_id}, ${dto.email}, ${hashedPassword}, ${dto.role},
         ${dto.first_name}, ${dto.last_name ?? null},
         ${dto.phone_number ?? null}, ${dto.position ?? null})
      RETURNING id, org_id, email, role, first_name, last_name,
                phone_number, position, created_at
    `;
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);
    const { password, role, ...rest } = dto;
    const updateData: Record<string, any> = { ...rest };

    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (role) updateData.role = this.sql`${role}::role_t`;
    updateData.updated_at = new Date();

    const [user] = await this.sql`
      UPDATE users
      SET ${this.sql(updateData)}
      WHERE id = ${id}
      RETURNING id, org_id, email, role, first_name, last_name,
                phone_number, position, updated_at
    `;
    return user;
  }

  async remove(id: number) {
    await this.findOne(id);
    
    try {
      await this.sql.begin(async (sql) => {
        await sql`DELETE FROM cart_item WHERE cart_id IN (SELECT cart_id FROM cart WHERE user_id = ${id})`;
        await sql`DELETE FROM cart WHERE user_id = ${id}`;
        await sql`DELETE FROM payment WHERE booking_id IN (SELECT booking_id FROM booking WHERE customer_id = ${id} OR staff_id = ${id})`;
        await sql`
          DELETE FROM booking_detail_catering WHERE booking_detail_id IN (
            SELECT booking_detail_id FROM booking_detail WHERE booking_id IN (
              SELECT booking_id FROM booking WHERE customer_id = ${id} OR staff_id = ${id}
            )
          )
        `;
        await sql`
          DELETE FROM booking_detail_tools WHERE booking_detail_id IN (
            SELECT booking_detail_id FROM booking_detail WHERE booking_id IN (
              SELECT booking_id FROM booking WHERE customer_id = ${id} OR staff_id = ${id}
            )
          )
        `;
        await sql`
          DELETE FROM booking_network WHERE booking_detail_id IN (
            SELECT booking_detail_id FROM booking_detail WHERE booking_id IN (
              SELECT booking_id FROM booking WHERE customer_id = ${id} OR staff_id = ${id}
            )
          )
        `;
        await sql`
          DELETE FROM booking_penalties WHERE booking_detail_id IN (
            SELECT booking_detail_id FROM booking_detail WHERE booking_id IN (
              SELECT booking_id FROM booking WHERE customer_id = ${id} OR staff_id = ${id}
            )
          )
        `;
        await sql`DELETE FROM booking_detail WHERE booking_id IN (SELECT booking_id FROM booking WHERE customer_id = ${id} OR staff_id = ${id})`;
        await sql`DELETE FROM booking WHERE customer_id = ${id} OR staff_id = ${id}`;
        await sql`DELETE FROM tool_maintenance WHERE staff_id = ${id}`;
        await sql`DELETE FROM users WHERE id = ${id}`;
      });
    } catch (err: any) {
      console.error('Error cascading delete user:', err);
      throw new ConflictException(`ไม่สามารถลบผู้ใช้งานได้ (Cascade Failed): ${err.message || 'Unknown database error'}`);
    }

    return { message: `ลบ user id ${id} สำเร็จ` };
  }
}

