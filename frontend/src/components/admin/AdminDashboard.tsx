import { useState, useMemo } from 'react';
import { ChevronLeft, Wrench, Settings } from 'lucide-react';
import './AdminDashboard.css';
import { useAdmin } from '../../hooks/useAdmin';
import ocsLogo from '../../assets/ocs-logo.png';

export type RoomStatus = 'available' | 'maintenance' | 'reserved';
export type RoomType = 'seminar' | 'computer' | 'distance_learning';
export type AdminSection = 'menu' | 'dashboard' | 'rooms' | 'reservations' | 'reports' | 'users' | 'settings' | 'tools';

export interface Room {
  id: number;
  name: string;
  type: RoomType;
  capacity: number;
  fee: number;
  status: RoomStatus;
  isActive: boolean;
  technicalIssue: string | null;
  floor: string;
  equipment: string[];
}

import { DashboardTab, dashboardNavItem } from './DashboardTab';
import { RoomManagementTab, roomsNavItem } from './RoomManagementTab';
import { ReportsTab, reportsNavItem } from './ReportsTab';
import { ToolsManagementTab, toolsNavItem } from './ToolsManagementTab';
import { SettingsTab, settingsNavItem } from './SettingsTab';
import { ReservationsTab, reservationsNavItem } from './ReservationsTab';
import { UsersTab, usersNavItem } from './UsersTab';

interface AdminDashboardProps {
  userRole?: string;
  userName?: string;
  onNavigateBack?: () => void;
  onLogout?: () => void;
}

export function AdminDashboard({
  userRole = 'admin',
  userName,
  onNavigateBack,
  onLogout
}: AdminDashboardProps) {
  const { rooms: rawRooms, bookings: rawBookings, loading } = useAdmin();
  const [activeSection, setActiveSection] = useState<AdminSection>('menu');

  // Map backend rooms to AdminDashboard Room type
  const rooms: Room[] = useMemo(() => {
    if (!rawRooms || rawRooms.length === 0) return [];
    return rawRooms.map((r: any) => ({
      id: r.room_id,
      name: r.room_name || r.name || 'Unknown Room',
      type: (r.room_type_name?.includes('คอมพิวเตอร์') ? 'computer' : 
             r.room_type_name?.includes('ทางไกล') ? 'distance_learning' : 'seminar') as RoomType,
      capacity: r.capacity || 0,
      fee: 2500, // Hardcoded default
      status: r.room_status as RoomStatus,
      isActive: r.room_status !== 'maintenance',
      technicalIssue: null,
      floor: String(r.floor || '1'),
      equipment: r.amenities || []
    }));
  }, [rawRooms]);

  const todayBookings = useMemo(() => {
    if (!rawBookings || rawBookings.length === 0) return [];
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Attempt to filter bookings for today based on bookingdate or details
    const todays = rawBookings.filter((b: any) => b.bookingdate && b.bookingdate.startsWith(todayStr));
    
    if (todays.length === 0) return [];
    
    return todays.map((b: any) => ({
      id: `BK${String(b.booking_id).padStart(3, '0')}`,
      room: b.room_name || 'ไม่ระบุห้อง',
      user: b.customer_name || 'ไม่ระบุผู้ใช้',
      time: '09:00 - 12:00', // We don't have start/end time in findAll yet, so leave as default or parse if needed.
      type: b.payment_status === 'paid' ? 'ชำระเงินแล้ว' : 'ยังไม่ชำระเงิน',
      amount: Number(b.total_amount) || 0,
      status: b.booking_status === 'draft' ? 'draft' : b.booking_status === 'confirmed' ? 'confirmed' : 'in_use'
    }));
  }, [rawBookings]);

  // Derive monthlyData from all bookings
  const monthlyData = useMemo(() => {
    const stats: Record<number, { bookings: number; revenue: number }> = {};
    for (let i = 1; i <= 12; i++) {
      stats[i] = { bookings: 0, revenue: 0 };
    }
    
    rawBookings.forEach((b: any) => {
      if (b.bookingdate) {
        const date = new Date(b.bookingdate);
        const month = date.getMonth() + 1;
        stats[month].bookings += 1;
        if (b.payment_status === 'paid') {
          stats[month].revenue += Number(b.total_amount) || 0;
        }
      }
    });
    
    const monthLabels = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return Object.keys(stats).map(key => {
      const monthNum = parseInt(key, 10);
      return {
        month: monthLabels[monthNum - 1],
        bookings: stats[monthNum].bookings,
        revenue: stats[monthNum].revenue
      };
    });
  }, [rawBookings]);

  const isTechnician = userRole === 'staff_tech';

  // ─── Handlers ─────────────────────────────────────────────

  // ─── Menu Items ───────────────────────────────────────────────
  const navItems = useMemo(() => [
    dashboardNavItem,
    roomsNavItem,
    reservationsNavItem,
    reportsNavItem,
    usersNavItem,
    toolsNavItem,
    ...((!isTechnician) ? [settingsNavItem] : []),
  ], [isTechnician]);

  // ─── Render Sections ────────────────────────────────────────
  const renderMenu = () => (
    <div className="admin-menu-container">
      <div className="admin-menu-header">
        <h2>ยินดีต้อนรับสู่ Admin Dashboard</h2>
        <p>เลือกเมนูที่ต้องการเพื่อเริ่มต้นการจัดการระบบ</p>
      </div>
      <div className="admin-menu-grid">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button key={item.id} className="admin-menu-card" onClick={() => setActiveSection(item.id)}>
              <div className="admin-menu-card-icon" style={{ backgroundColor: item.color + '15', color: item.color }}>
                <Icon size={40} />
              </div>
              <div className="admin-menu-card-content">
                <h3 className="admin-menu-card-title">{item.label}</h3>
                <p className="admin-menu-card-desc">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="admin-root">
      <main className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            {activeSection !== 'menu' && (
              <button className="admin-back-btn" onClick={() => setActiveSection('menu')}>
                <ChevronLeft size={20} /> กลับเมนูหลัก
              </button>
            )}
            {activeSection === 'menu' && (
              <div className="admin-logo-wrapper">
                <img src={ocsLogo} alt="OCS Meeting Rooms Logo" className="admin-ocs-img" />
                <div className="admin-logo-text-col">
                  <h1 className="admin-logo-h1">OCS</h1>
                  <p className="admin-logo-p">Admin Management</p>
                </div>
              </div>
            )}
          </div>
          
          {activeSection !== 'menu' && (
            <div className="admin-topbar-center">
              <h1 className="admin-page-title">
                {navItems.find(n => n.id === activeSection)?.label}
              </h1>
            </div>
          )}

          <div className="admin-topbar-right">
            <div className="admin-user-info">
              <div className="admin-user-avatar">
                {isTechnician ? <Wrench size={16} /> : <Settings size={16} />}
              </div>
              <div className="admin-user-text">
                <p className="admin-user-name">{userName || (isTechnician ? 'Technician' : 'Admin')}</p>
                <p className="admin-user-role">{isTechnician ? 'ช่างเทคนิค' : 'ผู้ดูแลระบบ'}</p>
              </div>
            </div>
            {onLogout && (
              <button className="admin-logout-btn" onClick={onLogout}>
                ลงชื่อออก
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">
          {activeSection === 'menu' && renderMenu()}
          {activeSection === 'dashboard' && (
            <DashboardTab
              rooms={rooms}
              rawBookings={rawBookings}
              todayBookings={todayBookings}
              setActiveSection={setActiveSection}
            />
          )}
          {activeSection === 'rooms' && (
            <RoomManagementTab
              isTechnician={isTechnician}
            />
          )}
          {activeSection === 'reservations' && <ReservationsTab />}
          {activeSection === 'reports' && (
            <ReportsTab
              rooms={rooms}
              monthlyData={monthlyData}
              todayBookings={todayBookings}
            />
          )}
          {activeSection === 'users' && <UsersTab />}
          {activeSection === 'tools' && (
            <ToolsManagementTab isTechnician={isTechnician} />
          )}
          {activeSection === 'settings' && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}
