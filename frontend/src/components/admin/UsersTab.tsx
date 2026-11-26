import { useState, useMemo, useEffect } from 'react';
import {
  Users, Search, RefreshCw, Edit2, Trash2, Plus,
  Shield, Phone, Mail, User as UserIcon, Briefcase, Lock, Eye, EyeOff
} from 'lucide-react';
import { useUsers, User, UserRole } from '../../hooks/useUsers';
import { AdminSection } from './AdminDashboard';
import { API_BASE_URL } from '../../App';
import thaiAddressData from '../../utils/thai_address.json';

// ─── Nav item ──────────────────────────────────────────────────────────────────

export const usersNavItem = {
  id: 'users' as AdminSection,
  label: 'Users',
  desc: 'จัดการผู้ใช้งานระบบ',
  icon: Users,
  color: '#ec4899',
};

// ─── Role Configs ──────────────────────────────────────────────────────────────

const roleConfig: Record<UserRole, { label: string; color: string; bg: string }> = {
  customer:   { label: 'ลูกค้า (Customer)',       color: '#2563eb', bg: '#eff6ff' },
  staff_tech: { label: 'เจ้าหน้าที่เทคนิค (Staff)',   color: '#0d9488', bg: '#f0fdfa' },
  admin:      { label: 'ผู้ดูแลระบบ (Admin)',       color: '#dc2626', bg: '#fee2e2' },
  financial:  { label: 'การเงิน (Financial)',      color: '#7c3aed', bg: '#f5f3ff' },
};

// ─── Formatting helper ──────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ─── Custom Creatable Dropdown ──────────────────────────────────────────────

function CreatableDropdown({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value);

  useEffect(() => {
    setSearch(value);
  }, [value]);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));
  const exactMatch = options.some(o => o.toLowerCase() === search.toLowerCase());

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder={placeholder}
        required
        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
      />
      {isOpen && search.trim() && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, marginTop: 4, zIndex: 100, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', maxHeight: 200, overflowY: 'auto' }}>
          {filtered.map(opt => (
            <div
              key={opt}
              onMouseDown={() => { onChange(opt); setSearch(opt); setIsOpen(false); }}
              style={{ padding: '0.5rem 0.75rem', cursor: 'pointer', fontSize: '0.85rem', color: '#334155' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {opt}
            </div>
          ))}
          {!exactMatch && search.trim() && (
            <div
              onMouseDown={() => { onChange(search.trim()); setIsOpen(false); }}
              style={{ padding: '0.5rem 0.75rem', cursor: 'pointer', fontSize: '0.85rem', color: '#2563eb', fontWeight: 500, borderTop: filtered.length ? '1px solid #f1f5f9' : 'none' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Plus size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              เพิ่ม "{search.trim()}" เป็นหน่วยงานใหม่
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function UsersTab() {
  const { users, loading, error, refetch, createUser, updateUser, deleteUser } = useUsers();
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  
  const [organizations, setOrganizations] = useState<{ org_id: number; org_name: string }[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/organizations`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load organizations');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setOrganizations(data);
        }
      })
      .catch(err => console.error('Error loading organizations:', err));
  }, []);
  
  // Form states for modal
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [orgInput, setOrgInput] = useState('');
  const [cardId, setCardId] = useState('');
  
  const [orgType, setOrgType] = useState<'public' | 'private'>('private');
  const [addrNumber, setAddrNumber] = useState('');
  const [addrSoi, setAddrSoi] = useState('');
  const [addrRoad, setAddrRoad] = useState('');
  const [addrSubDistrict, setAddrSubDistrict] = useState('');
  const [addrDistrict, setAddrDistrict] = useState('');
  const [addrProvince, setAddrProvince] = useState('');
  const [addrZip, setAddrZip] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const resetForm = () => {
    setFirstName(''); setLastName(''); setEmail('');
    setRole('customer'); setPhone(''); setPosition('');
    setOrgInput(''); setCardId(''); setPassword(''); setConfirmPassword('');
    setOrgType('private');
    setAddrNumber(''); setAddrSoi(''); setAddrRoad(''); setAddrSubDistrict('');
    setAddrDistrict(''); setAddrProvince(''); setAddrZip('');
    setSaveError(null);
  };

  const provinces = useMemo(() => Array.from(new Set(thaiAddressData.map(item => item.province))).sort(), []);
  const amphoes = useMemo(() => {
    if (!addrProvince) return [];
    return Array.from(new Set(thaiAddressData.filter(item => item.province === addrProvince).map(item => item.amphoe))).sort();
  }, [addrProvince]);
  const districts = useMemo(() => {
    if (!addrProvince || !addrDistrict) return [];
    return Array.from(new Set(thaiAddressData.filter(item => item.province === addrProvince && item.amphoe === addrDistrict).map(item => item.district))).sort();
  }, [addrProvince, addrDistrict]);
  const zipcodes = useMemo(() => {
    if (!addrProvince || !addrDistrict || !addrSubDistrict) return [];
    return Array.from(new Set(thaiAddressData.filter(item => item.province === addrProvince && item.amphoe === addrDistrict && item.district === addrSubDistrict).map(item => item.zipcode))).sort();
  }, [addrProvince, addrDistrict, addrSubDistrict]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAddrProvince(e.target.value);
    setAddrDistrict('');
    setAddrSubDistrict('');
    setAddrZip('');
  };
  const handleAmphoeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAddrDistrict(e.target.value);
    setAddrSubDistrict('');
    setAddrZip('');
  };
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setAddrSubDistrict(val);
    const zips = Array.from(new Set(thaiAddressData.filter(item => item.province === addrProvince && item.amphoe === addrDistrict && item.district === val).map(item => item.zipcode))).sort();
    if (zips.length === 1) setAddrZip(String(zips[0]));
    else setAddrZip('');
  };

  // Summary statistics
  const stats = useMemo(() => {
    return {
      total:     users.length,
      customer:  users.filter(u => u.role === 'customer').length,
      staff:     users.filter(u => u.role === 'staff_tech').length,
      admin:     users.filter(u => u.role === 'admin').length,
      financial: users.filter(u => u.role === 'financial').length,
    };
  }, [users]);

  // Client-side search filters
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u =>
      String(u.id).includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.first_name.toLowerCase().includes(q) ||
      (u.last_name && u.last_name.toLowerCase().includes(q)) ||
      u.role.toLowerCase().includes(q) ||
      (u.position && u.position.toLowerCase().includes(q))
    );
  }, [users, search]);

  // Open ADD modal
  const handleAddClick = () => {
    resetForm();
    setIsAddMode(true);
  };

  // Open EDIT modal with user details pre-filled
  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFirstName(user.first_name);
    setLastName(user.last_name || '');
    setEmail(user.email);
    setRole(user.role);
    setPhone(user.phone_number || '');
    setPosition(user.position || '');
    const org = organizations.find(o => o.org_id === user.org_id);
    setOrgInput(org ? org.org_name : '');
    setOrgType('private');
    setAddrNumber(''); setAddrSoi(''); setAddrRoad(''); setAddrSubDistrict('');
    setAddrDistrict(''); setAddrProvince(''); setAddrZip('');
    setCardId(user.card_id || '');
    setPassword('');
    setConfirmPassword('');
    setSaveError(null);
  };

  const isNewOrg = orgInput.trim() !== '' && !organizations.some(o => o.org_name === orgInput.trim());

  const resolveOrgId = async (input: string): Promise<number> => {
    if (!input.trim()) return 1; // fallback
    const matched = organizations.find(o => o.org_name === input.trim());
    if (matched) return matched.org_id;

    const fullAddressParts = [];
    if (addrNumber.trim()) fullAddressParts.push(`เลขที่ ${addrNumber.trim()}`);
    if (addrSoi.trim()) fullAddressParts.push(`ซอย ${addrSoi.trim()}`);
    if (addrRoad.trim()) fullAddressParts.push(`ถนน ${addrRoad.trim()}`);
    if (addrSubDistrict.trim()) fullAddressParts.push(`แขวง/ตำบล ${addrSubDistrict.trim()}`);
    if (addrDistrict.trim()) fullAddressParts.push(`เขต/อำเภอ ${addrDistrict.trim()}`);
    if (addrProvince.trim()) fullAddressParts.push(`จังหวัด ${addrProvince.trim()}`);
    if (addrZip.trim()) fullAddressParts.push(addrZip.trim());
    const fullAddress = fullAddressParts.join(' ');

    // Create new organization
    if (isNewOrg && !fullAddress) {
      throw new Error('กรุณาระบุที่อยู่สำหรับหน่วยงานใหม่');
    }

    const res = await fetch(`${API_BASE_URL}/organizations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        org_name: input.trim(),
        org_type: orgType,
        org_code: `AUTO-${Date.now()}`,
        address: fullAddress || '-'
      })
    });
    if (!res.ok) throw new Error('ไม่สามารถเพิ่มหน่วยงานใหม่ได้');
    const newOrg = await res.json();
    
    // Refresh organizations list in background
    fetch(`${API_BASE_URL}/organizations`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setOrganizations(data); })
      .catch(() => {});

    return newOrg.org_id;
  };

  // Perform POST API request for new user
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) { setSaveError('กรุณากรอกชื่อจริง'); return; }
    if (!email.trim())     { setSaveError('กรุณากรอกอีเมล'); return; }
    if (!password.trim())  { setSaveError('กรุณากรอกรหัสผ่าน'); return; }
    if (password !== confirmPassword) { setSaveError('รหัสผ่านไม่ตรงกัน'); return; }
    try {
      setSaving(true); setSaveError(null);
      const finalOrgId = await resolveOrgId(orgInput);
      
      await createUser({
        email, password, first_name: firstName,
        last_name: lastName || undefined, role,
        phone_number: phone || undefined,
        position: position || undefined,
        org_id: finalOrgId,
        card_id: cardId || undefined,
      });
      setIsAddMode(false);
      resetForm();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'ไม่สามารถเพิ่มผู้ใช้งานได้');
    } finally { setSaving(false); }
  };

  // Perform PATCH API request
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!firstName.trim()) {
      setSaveError('กรุณากรอกชื่อจริง');
      return;
    }
    if (password && password !== confirmPassword) {
      setSaveError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);
      
      const finalOrgId = await resolveOrgId(orgInput);
      
      await updateUser(editingUser.id, {
        first_name: firstName,
        last_name: lastName || undefined,
        role,
        phone_number: phone || undefined,
        position: position || undefined,
        org_id: finalOrgId,
        card_id: cardId || undefined,
        password: password || undefined,
      });

      setEditingUser(null);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setSaving(false);
    }
  };

  // Perform DELETE API request
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
  };

  return (
    <div className="admin-section">
      {/* ── Summary statistics chips ── */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {(Object.entries({
          total:     { label: 'ผู้ใช้ทั้งหมด',   color: '#ec4899', bg: '#fdf2f8' },
          customer:  { label: 'ลูกค้า',        color: '#2563eb', bg: '#eff6ff' },
          staff:     { label: 'เทคนิค/สตาฟ',    color: '#0d9488', bg: '#f0fdfa' },
          admin:     { label: 'ผู้ดูแลระบบ',     color: '#dc2626', bg: '#fee2e2' },
          financial: { label: 'การเงิน',       color: '#7c3aed', bg: '#f5f3ff' },
        }) as [keyof typeof stats, {label:string;color:string;bg:string}][]).map(([key, cfg]) => (
          <div key={key} style={{
            background: cfg.bg, border: `1px solid ${cfg.color}30`,
            borderRadius: 12, padding: '0.5rem 1rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: cfg.color }}>{stats[key]}</span>
            <span style={{ fontSize: '0.78rem', color: cfg.color }}>{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* ── Main card list ── */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <Users size={18} /> รายชื่อผู้ใช้งานระบบทั้งหมด
          </h3>
          <button className="admin-btn-outline-sm" onClick={refetch} disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : undefined }} />
            รีเฟรช
          </button>
        </div>

        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="admin-search-wrap" style={{ flex: 1 }}>
            <Search size={14} className="admin-search-icon" />
            <input
              id="users-search"
              type="text"
              className="admin-search-input"
              placeholder="ค้นหาด้วยชื่อ, อีเมล, ตำแหน่ง หรือบทบาท..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            className="admin-btn-primary"
            onClick={handleAddClick}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}
          >
            <Plus size={15} /> เพิ่มผู้ใช้งาน
          </button>
        </div>

        {/* User table lists */}
        {error ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
            ⚠️ โหลดข้อมูลผู้ใช้ไม่สำเร็จ: {error}
          </div>
        ) : loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
            <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: 8 }} />
            <div>กำลังโหลดข้อมูล...</div>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>No.</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>ข้อมูลติดต่อ</th>
                  <th>ตำแหน่ง / หน่วยงาน (Organization)</th>
                  <th>บทบาท</th>
                  <th>วันที่สมัคร</th>
                  <th style={{ width: 100, textAlign: 'center' }}>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="admin-empty-row">
                      ไม่พบข้อมูลผู้ใช้งานระบบ
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, idx) => {
                    const rCfg = roleConfig[user.role] ?? roleConfig.customer;
                    return (
                      <tr key={user.id}>
                        <td className="admin-mono" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                          {idx + 1}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#1e293b' }}>
                            {user.first_name} {user.last_name || ''}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', fontSize: '0.78rem' }}>
                            <span style={{ color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Mail size={11} /> {user.email}
                            </span>
                            {user.phone_number && (
                              <span style={{ color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Phone size={11} /> {user.phone_number}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                            {user.position || '-'}
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>
                              {user.org_name || '-'}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{
                            color: rCfg.color, background: rCfg.bg,
                            border: `1px solid ${rCfg.color}30`,
                            padding: '3px 10px', borderRadius: 20,
                            fontSize: '0.72rem', fontWeight: 600,
                            display: 'inline-block'
                          }}>
                            {rCfg.label}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {formatDate(user.created_at)}
                        </td>
                        <td>
                          <div className="admin-action-btns" style={{ justifyContent: 'center' }}>
                            <button className="admin-action-btn edit" title="แก้ไขผู้ใช้งาน"
                              onClick={() => handleEditClick(user)}>
                              <Edit2 size={13} />
                            </button>
                            <button className="admin-action-btn delete" title="ลบผู้ใช้งาน"
                              onClick={() => handleDeleteClick(user)}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Edit user overlay modal dialog ── */}
      {editingUser && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, animation: 'fadeIn 0.2s ease-out',
        }}>
          <form onSubmit={handleSave} style={{
            background: 'white', borderRadius: 16,
            width: '100%', maxWidth: 520, padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
            display: 'flex', flexDirection: 'column', gap: '1.25rem',
            border: '1px solid #e2e8f0',
          }}>
            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit2 size={18} style={{ color: '#ec4899' }} /> แก้ไขข้อมูลผู้ใช้งาน: {editingUser.first_name} {editingUser.last_name || ''}
              </h3>
              <button type="button" onClick={() => setEditingUser(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }}>
                ✕
              </button>
            </div>

            {/* Error notifications */}
            {saveError && (
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '0.5rem 0.75rem', color: '#dc2626', fontSize: '0.8rem' }}>
                ⚠️ {saveError}
              </div>
            )}

            {/* Form grid body */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                  <UserIcon size={12} style={{ display: 'inline', marginRight: 4 }} />ชื่อจริง *
                </label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
              </div>
              
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                  นามสกุล
                </label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                  <Mail size={12} style={{ display: 'inline', marginRight: 4 }} />อีเมล (ไม่สามารถแก้ไขได้)
                </label>
                <input type="email" value={email} disabled
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#94a3b8', fontSize: '0.85rem', cursor: 'not-allowed', boxSizing: 'border-box' }} />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                  <Lock size={12} style={{ display: 'inline', marginRight: 4 }} />รหัสผ่านใหม่ (เว้นว่างไว้ถ้าไม่ต้องการเปลี่ยน)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ position: 'relative' }}>
                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="รหัสผ่านใหม่"
                      style={{ width: '100%', padding: '0.5rem 2.2rem 0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="ยืนยันรหัสผ่านใหม่"
                      style={{ width: '100%', padding: '0.5rem 2.2rem 0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex' }}>
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                  <Shield size={12} style={{ display: 'inline', marginRight: 4 }} />บทบาทหลัก (Role)
                </label>
                <select value={role} onChange={e => setRole(e.target.value as UserRole)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', background: 'white' }}>
                  <option value="customer">ลูกค้า (Customer)</option>
                  <option value="staff_tech">เจ้าหน้าที่เทคนิค (Staff)</option>
                  <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                  <option value="financial">การเงิน (Financial)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                  <Phone size={12} style={{ display: 'inline', marginRight: 4 }} />เบอร์โทรศัพท์
                </label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} maxLength={10}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                  <Briefcase size={12} style={{ display: 'inline', marginRight: 4 }} />ตำแหน่งงาน
                </label>
                <input type="text" value={position} onChange={e => setPosition(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
              </div>

              <div style={{ gridColumn: isNewOrg ? 'span 2' : 'span 1' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                  <Briefcase size={12} style={{ display: 'inline', marginRight: 4 }} />หน่วยงาน / องค์กร *
                </label>
                <CreatableDropdown
                  value={orgInput}
                  onChange={setOrgInput}
                  options={organizations.map(o => o.org_name)}
                  placeholder="เลือกหรือพิมพ์เพิ่มหน่วยงาน"
                />
              </div>

              {isNewOrg && (
                <>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                      ประเภทหน่วยงาน (ใหม่) *
                    </label>
                    <select value={orgType} onChange={e => setOrgType(e.target.value as 'public' | 'private')}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', background: 'white' }}>
                      <option value="private">หน่วยงานภายใน</option>
                      <option value="public">หน่วยงานภายนอก</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                      ที่อยู่หน่วยงาน (ใหม่) *
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                      <input type="text" value={addrNumber} onChange={e => setAddrNumber(e.target.value)} required placeholder="เลขที่ *" style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
                      <input type="text" value={addrSoi} onChange={e => setAddrSoi(e.target.value)} placeholder="ซอย (ถ้ามี)" style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
                      <input type="text" value={addrRoad} onChange={e => setAddrRoad(e.target.value)} placeholder="ถนน (ถ้ามี)" style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
                      <select value={addrProvince} onChange={handleProvinceChange} required style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', background: 'white' }}>
                        <option value="" disabled>จังหวัด *</option>
                        {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <select value={addrDistrict} onChange={handleAmphoeChange} required disabled={!addrProvince} style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', background: 'white' }}>
                        <option value="" disabled>เขต/อำเภอ *</option>
                        {amphoes.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                      <select value={addrSubDistrict} onChange={handleDistrictChange} required disabled={!addrDistrict} style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', background: 'white' }}>
                        <option value="" disabled>แขวง/ตำบล *</option>
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <select value={addrZip} onChange={e => setAddrZip(e.target.value)} required disabled={!addrSubDistrict || zipcodes.length === 0} style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', background: 'white' }}>
                        <option value="" disabled>รหัสไปรษณีย์ *</option>
                        {zipcodes.map(z => <option key={z} value={String(z)}>{z}</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                  รหัสบัตรประชาชน (Card ID)
                </label>
                <input type="text" value={cardId} onChange={e => setCardId(e.target.value)} maxLength={13}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
              </div>
            </div>

            {/* Modal actions footer */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setEditingUser(null)} disabled={saving}
                style={{
                  background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8,
                  padding: '0.5rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                }}>
                ยกเลิก
              </button>
              
              <button type="submit" disabled={saving}
                style={{
                  background: 'linear-gradient(135deg, #ec4899, #db2777)', color: 'white', border: 'none', borderRadius: 8,
                  padding: '0.5rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(236,72,153,0.2)'
                }}>
                {saving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Add user overlay modal dialog ── */}
      {isAddMode && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, animation: 'fadeIn 0.2s ease-out',
        }}>
          <form onSubmit={handleCreate} style={{
            background: 'white', borderRadius: 16,
            width: '100%', maxWidth: 520, padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
            display: 'flex', flexDirection: 'column', gap: '1.25rem',
            border: '1px solid #e2e8f0',
          }}>
            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} style={{ color: '#ec4899' }} /> เพิ่มผู้ใช้งานใหม่
              </h3>
              <button type="button" onClick={() => { setIsAddMode(false); resetForm(); }}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }}>
                ✕
              </button>
            </div>

            {/* Error */}
            {saveError && (
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '0.5rem 0.75rem', color: '#dc2626', fontSize: '0.8rem' }}>
                ⚠️ {saveError}
              </div>
            )}

            {/* Form grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                  <UserIcon size={12} style={{ display: 'inline', marginRight: 4 }} />ชื่อจริง *
                </label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>นามสกุล</label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                  <Mail size={12} style={{ display: 'inline', marginRight: 4 }} />อีเมล *
                </label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                  <Lock size={12} style={{ display: 'inline', marginRight: 4 }} />รหัสผ่าน *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ position: 'relative' }}>
                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="รหัสผ่าน"
                      style={{ width: '100%', padding: '0.5rem 2.2rem 0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="ยืนยันรหัสผ่าน"
                      style={{ width: '100%', padding: '0.5rem 2.2rem 0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex' }}>
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                  <Shield size={12} style={{ display: 'inline', marginRight: 4 }} />บทบาท (Role)
                </label>
                <select value={role} onChange={e => setRole(e.target.value as UserRole)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', background: 'white', boxSizing: 'border-box' }}>
                  <option value="customer">ลูกค้า (Customer)</option>
                  <option value="staff_tech">เจ้าหน้าที่เทคนิค (Staff)</option>
                  <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                  <option value="financial">การเงิน (Financial)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                  <Phone size={12} style={{ display: 'inline', marginRight: 4 }} />เบอร์โทรศัพท์
                </label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} maxLength={10}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                  <Briefcase size={12} style={{ display: 'inline', marginRight: 4 }} />ตำแหน่งงาน
                </label>
                <input type="text" value={position} onChange={e => setPosition(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>

              <div style={{ gridColumn: isNewOrg ? 'span 2' : 'span 1' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                  <Briefcase size={12} style={{ display: 'inline', marginRight: 4 }} />หน่วยงาน / องค์กร *
                </label>
                <CreatableDropdown
                  value={orgInput}
                  onChange={setOrgInput}
                  options={organizations.map(o => o.org_name)}
                  placeholder="เลือกหรือพิมพ์เพิ่มหน่วยงาน"
                />
              </div>

              {isNewOrg && (
                <>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                      ประเภทหน่วยงาน (ใหม่) *
                    </label>
                    <select value={orgType} onChange={e => setOrgType(e.target.value as 'public' | 'private')}
                      style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', background: 'white' }}>
                      <option value="private">หน่วยงานภายใน</option>
                      <option value="public">หน่วยงานภายนอก</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
                      ที่อยู่หน่วยงาน (ใหม่) *
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                      <input type="text" value={addrNumber} onChange={e => setAddrNumber(e.target.value)} required placeholder="เลขที่ *" style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
                      <input type="text" value={addrSoi} onChange={e => setAddrSoi(e.target.value)} placeholder="ซอย (ถ้ามี)" style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
                      <input type="text" value={addrRoad} onChange={e => setAddrRoad(e.target.value)} placeholder="ถนน (ถ้ามี)" style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
                      <select value={addrProvince} onChange={handleProvinceChange} required style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', background: 'white' }}>
                        <option value="" disabled>จังหวัด *</option>
                        {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <select value={addrDistrict} onChange={handleAmphoeChange} required disabled={!addrProvince} style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', background: 'white' }}>
                        <option value="" disabled>เขต/อำเภอ *</option>
                        {amphoes.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                      <select value={addrSubDistrict} onChange={handleDistrictChange} required disabled={!addrDistrict} style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', background: 'white' }}>
                        <option value="" disabled>แขวง/ตำบล *</option>
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <select value={addrZip} onChange={e => setAddrZip(e.target.value)} required disabled={!addrSubDistrict || zipcodes.length === 0} style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', background: 'white' }}>
                        <option value="" disabled>รหัสไปรษณีย์ *</option>
                        {zipcodes.map(z => <option key={z} value={String(z)}>{z}</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => { setIsAddMode(false); resetForm(); }} disabled={saving}
                style={{ background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, padding: '0.5rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                ยกเลิก
              </button>
              <button type="submit" disabled={saving}
                style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)', color: 'white', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(236,72,153,0.2)' }}>
                {saving ? 'กำลังเพิ่ม...' : 'เพิ่มผู้ใช้งาน'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {userToDelete && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease-out'
        }}>
          <div className="admin-card" style={{ width: 400, maxWidth: '90%', textAlign: 'center' }}>
            <h3 style={{ marginTop: 0, color: '#ef4444' }}>ยืนยันการลบผู้ใช้งาน</h3>
            <p style={{ color: '#475569', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              คุณต้องการลบผู้ใช้งาน <strong>{userToDelete.first_name} {userToDelete.last_name || ''}</strong> ใช่หรือไม่?<br />
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>การลบนี้จะลบประวัติการจองทั้งหมดที่เกี่ยวข้องด้วย (ไม่สามารถกู้คืนได้)</span>
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button type="button" onClick={() => setUserToDelete(null)}
                style={{ background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, padding: '0.5rem 1.25rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                ยกเลิก
              </button>
              <button type="button" onClick={async () => {
                try {
                  await deleteUser(userToDelete.id);
                  setUserToDelete(null);
                } catch (err) {
                  alert(err instanceof Error ? err.message : 'ลบผู้ใช้ไม่สำเร็จ');
                  setUserToDelete(null);
                }
              }}
                style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, padding: '0.5rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(239,68,68,0.2)' }}>
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Basic Keyframe Animations in header style */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
