import { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown, UserCircle2, BookMarked } from 'lucide-react';
import { PageType, UserRole } from '../App';

interface UserProfileDropdownProps {
  isDarkMode: boolean;
  userName: string;
  userRole: UserRole;
  onNavigate: (page: PageType) => void;
  onLogout: () => void;
}

const ROLE_CONFIG: Record<UserRole, { label: string; color: string; bg: string }> = {
  guest:      { label: 'Guest',     color: '#9ca3af', bg: '#f3f4f6' },
  customer:   { label: 'User',      color: '#0066cc', bg: '#dbeafe' },
  admin:      { label: 'Admin',     color: '#7c3aed', bg: '#ede9fe' },
  staff_tech: { label: 'Technical', color: '#059669', bg: '#d1fae5' },
  financial:  { label: 'Finance',   color: '#d97706', bg: '#fef3c7' },
};

export function UserProfileDropdown({
  isDarkMode,
  userName,
  userRole,
  onNavigate,
  onLogout,
}: UserProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ปิด dropdown เมื่อคลิกนอกพื้นที่
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const role = ROLE_CONFIG[userRole];

  const menuItems = [
    {
      icon: <UserCircle2 className="w-4 h-4" />,
      label: 'Profile',
      danger: false,
      onClick: () => { setOpen(false); onNavigate('profile'); },
    },
    {
      icon: <BookMarked className="w-4 h-4" />,
      label: 'การจองของฉัน',
      danger: false,
      onClick: () => { setOpen(false); onNavigate('my-bookings' as PageType); },
    },
    {
      icon: <LogOut className="w-4 h-4" />,
      label: 'Logout',
      danger: true,
      onClick: () => { setOpen(false); onLogout(); },
    },
  ];

  return (
    // wrapper: hidden บน mobile, flex บน desktop — ไม่ใช่บน relative container
    <div className="hidden xl:flex items-center">
      {/* relative container สำหรับ position dropdown */}
      <div ref={containerRef} style={{ position: 'relative', zIndex: 9999 }}>

        {/* ── Trigger Button ── */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={open}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '9999px',
            paddingLeft: '4px',
            paddingRight: '12px',
            paddingTop: '4px',
            paddingBottom: '4px',
            border: `1px solid ${open
              ? (isDarkMode ? '#6b7280' : '#93c5fd')
              : (isDarkMode ? '#4b5563' : '#e5e7eb')}`,
            background: open
              ? (isDarkMode ? '#374151' : '#eff6ff')
              : (isDarkMode ? '#1f2937' : '#ffffff'),
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: open ? 'inset 0 1px 3px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          {/* Avatar */}
          <span
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${role.color}bb, ${role.color})`,
              flexShrink: 0,
            }}
          >
            <User style={{ width: '16px', height: '16px', color: '#fff' }} />
          </span>

          {/* Name */}
          <span style={{
            fontSize: '14px',
            fontWeight: 600,
            color: isDarkMode ? '#f9fafb' : '#111827',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}>
            {userName || 'User'}
          </span>

          {/* Chevron */}
          <ChevronDown
            style={{
              width: '14px',
              height: '14px',
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          />
        </button>

        {/* ── Dropdown Panel (conditional render — ไม่ใช้ opacity-0 toggle) ── */}
        {open && (
          <div
            role="menu"
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 8px)',
              width: '208px',
              borderRadius: '16px',
              background: isDarkMode ? '#1f2937' : '#ffffff',
              border: `1px solid ${isDarkMode ? '#374151' : '#f3f4f6'}`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.10)',
              zIndex: 9999,
              overflow: 'hidden',
              animation: 'dropdownSlide 0.18s ease-out forwards',
            }}
          >
            {/* Header section */}
            <div
              style={{
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: isDarkMode
                  ? `linear-gradient(135deg, ${role.color}20, ${role.color}08)`
                  : `linear-gradient(135deg, ${role.color}14, ${role.color}04)`,
                borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
              }}
            >
              <span
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${role.color}bb, ${role.color})`,
                  flexShrink: 0,
                  boxShadow: `0 2px 8px ${role.color}44`,
                }}
              >
                <User style={{ width: '20px', height: '20px', color: '#fff' }} />
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: isDarkMode ? '#f9fafb' : '#111827',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {userName || 'User'}
                </div>
                <span style={{
                  display: 'inline-block',
                  marginTop: '2px',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '1px 8px',
                  borderRadius: '9999px',
                  color: role.color,
                  background: role.bg,
                }}>
                  {role.label}
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <div style={{ padding: '6px 0' }}>
              {menuItems.map((item, i) => (
                <div key={i}>
                  {item.danger && (
                    <div style={{
                      height: '1px',
                      background: isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                      margin: '4px 0'
                    }} />
                  )}
                  <button
                    role="menuitem"
                    onClick={item.onClick}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 16px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: item.danger
                      ? (isDarkMode ? '#f87171' : '#dc2626')
                      : (isDarkMode ? '#d1d5db' : '#374151'),
                    textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = item.danger
                      ? (isDarkMode ? 'rgba(239,68,68,0.12)' : '#fef2f2')
                      : (isDarkMode ? 'rgba(255,255,255,0.06)' : '#f9fafb');
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }}
                >
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: item.danger
                        ? (isDarkMode ? 'rgba(239,68,68,0.15)' : '#fee2e2')
                        : (isDarkMode ? 'rgba(255,255,255,0.08)' : '#f3f4f6'),
                    }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* keyframes สำหรับ slide animation */}
      <style>{`
        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
