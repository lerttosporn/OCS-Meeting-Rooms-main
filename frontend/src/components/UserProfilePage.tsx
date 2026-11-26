import { useState, useEffect } from 'react';
import {
  User, Mail, Phone, Building2, Save, X,
  Pencil, BadgeCheck, CalendarDays, CheckCircle, AlertCircle, Loader2,
} from 'lucide-react';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { API_BASE_URL } from '../App';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  department: string;
  image: string;
}

interface UserProfilePageProps {
  isDarkMode: boolean;
  profile: UserProfile;
  userId: number | null;
  onUpdateProfile: (newProfile: UserProfile) => void;
}

// ─── Site-wide primary: Navy Blue (matches Header + HomePage) ─────────────
const PRIMARY       = '#0056b3';
const PRIMARY_DARK  = '#003d82';
const PRIMARY_LIGHT = '#dbeafe';
const PRIMARY_GLOW  = 'rgba(0, 86, 179, 0.15)';
const GRADIENT      = 'linear-gradient(135deg, #14294a 0%, #1a3a6e 50%, #1e4080 100%)';

// ─── Info Card ───────────────────────────────────────────────────────────────
function InfoCard({
  icon, label, value, isDarkMode,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isDarkMode: boolean;
}) {
  return (
    <div style={{
      borderRadius: '14px',
      padding: '16px 18px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
      background: isDarkMode ? 'rgba(255,255,255,0.04)' : '#f0f6ff',
      border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.08)' : '#dbeafe'}`,
    }}>
      <span style={{
        width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isDarkMode ? PRIMARY_GLOW : PRIMARY_LIGHT,
        color: PRIMARY,
      }}>
        {icon}
      </span>
      <div style={{ minWidth: 0 }}>
        <p style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          marginBottom: '5px',
        }}>
          {label}
        </p>
        <p style={{
          fontSize: '15px', fontWeight: 700,
          color: isDarkMode ? '#f9fafb' : '#111827',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {value || <span style={{ fontWeight: 400, color: isDarkMode ? '#6b7280' : '#9ca3af' }}>—</span>}
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function UserProfilePage({ isDarkMode, profile, userId, onUpdateProfile }: UserProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile>(profile);

  const { updateProfile, loading, error, success, validationErrors, clearErrors } = useUpdateProfile();

  // Fetch latest profile from API on mount
  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem('ocs_token');
    fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data) return;
        const fullName = `${data.first_name} ${data.last_name || ''}`.trim();
        const freshProfile = {
          name: fullName,
          email: data.email,
          phone: data.phone_number || '',
          department: data.position || '',
          image: profile.image,
        };
        setDraft(freshProfile);
        onUpdateProfile(freshProfile);
      })
      .catch(err => console.error('[UserProfilePage] Failed to fetch profile:', err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const pageBg  = isDarkMode ? '#0f172a' : '#f0f6ff';
  const cardBg  = isDarkMode ? '#1e293b' : '#ffffff';
  const border  = isDarkMode ? 'rgba(255,255,255,0.08)' : '#dbeafe';
  const txtMain = isDarkMode ? '#f9fafb' : '#111827';
  const txtSub  = isDarkMode ? '#9ca3af' : '#6b7280';

  const cardShadow = isDarkMode
    ? '0 4px 24px rgba(0,0,0,0.4)'
    : '0 4px 32px rgba(0, 86, 179, 0.10)';

  const handleSave = async () => {
    if (!userId) {
      alert('ไม่พบข้อมูล User กรุณาล็อกอินใหม่อีกครั้ง');
      return;
    }

    // Split "First Last" back into first_name / last_name
    const nameParts = draft.name.trim().split(/\s+/);
    const first_name = nameParts[0] || '';
    const last_name  = nameParts.slice(1).join(' ') || undefined;

    const result = await updateProfile(userId, {
      first_name,
      last_name,
      phone_number: draft.phone || undefined,
      position: draft.department || undefined,
    });

    if (result) {
      // Update parent state with fresh data from API
      const updatedUser = result as any;
      const fullName = `${updatedUser.first_name} ${updatedUser.last_name || ''}`.trim();
      onUpdateProfile({
        name: fullName,
        email: profile.email,
        phone: updatedUser.phone_number || '',
        department: updatedUser.position || '',
        image: profile.image,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setDraft(profile);
    setIsEditing(false);
    clearErrors();
  };

  const handleStartEdit = () => {
    setDraft(profile);
    setIsEditing(true);
    clearErrors();
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '11px 14px',
    borderRadius: '12px',
    border: `1.5px solid ${hasError ? '#ef4444' : border}`,
    background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f0f6ff',
    color: txtMain,
    fontSize: '14px',
    fontWeight: 500,
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  });

  return (
    <div style={{ minHeight: '100vh', background: pageBg, padding: '48px 24px 80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* ── Success / Error Toast ──────────────────────────────── */}
        {success && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '14px 18px', borderRadius: '14px',
            background: '#dcfce7', border: '1px solid #86efac',
            animation: 'fadeIn 0.3s ease',
          }}>
            <CheckCircle style={{ width: '18px', height: '18px', color: '#16a34a', flexShrink: 0 }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#15803d' }}>
              บันทึกข้อมูลสำเร็จ!
            </span>
          </div>
        )}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '14px 18px', borderRadius: '14px',
            background: '#fef2f2', border: '1px solid #fca5a5',
          }}>
            <AlertCircle style={{ width: '18px', height: '18px', color: '#dc2626', flexShrink: 0 }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#dc2626' }}>{error}</span>
          </div>
        )}

        {/* ── Page Title Row ────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
        }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: txtMain, margin: 0 }}>My Profile</h1>
            <p style={{ fontSize: '13px', color: txtSub, marginTop: '4px' }}>
              Manage your personal information
            </p>
          </div>

          {!isEditing ? (
            <button
              id="btn-edit-profile"
              onClick={handleStartEdit}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '12px',
                background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
                color: '#fff', fontWeight: 700, fontSize: '14px',
                border: 'none', cursor: 'pointer',
                boxShadow: `0 4px 14px ${PRIMARY}55`,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 18px ${PRIMARY}66`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 14px ${PRIMARY}55`;
              }}
            >
              <Pencil style={{ width: '15px', height: '15px' }} />
              Edit Profile
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                id="btn-cancel-profile"
                onClick={handleCancel}
                disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 18px', borderRadius: '12px',
                  background: 'transparent', border: `1px solid ${border}`,
                  color: txtSub, fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                  transition: 'background 0.15s',
                  opacity: loading ? 0.5 : 1,
                }}
                onMouseEnter={e => !loading && (e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.06)' : '#f0f6ff')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <X style={{ width: '14px', height: '14px' }} />
                Cancel
              </button>
              <button
                id="btn-save-profile"
                onClick={handleSave}
                disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '10px 20px', borderRadius: '12px',
                  background: loading
                    ? '#9ca3af'
                    : 'linear-gradient(135deg, #16a34a, #15803d)',
                  color: '#fff', fontWeight: 700, fontSize: '14px',
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(22,163,74,0.35)',
                  transition: 'background 0.2s, box-shadow 0.2s',
                }}
              >
                {loading ? (
                  <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Save style={{ width: '14px', height: '14px' }} />
                )}
                {loading ? 'กำลังบันทึก...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {/* ── Hero Card ─────────────────────────────────────────── */}
        <div style={{
          borderRadius: '20px', background: cardBg,
          border: `1px solid ${border}`, boxShadow: cardShadow,
          overflow: 'hidden',
        }}>
          {/* Gradient banner */}
          <div style={{
            height: '100px', background: GRADIENT, position: 'relative',
            paddingBottom: '16px',
          }}>
            <div style={{
              position: 'absolute', right: '-30px', top: '-50px',
              width: '180px', height: '180px', borderRadius: '9999px',
              background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', right: '80px', bottom: '-20px',
              width: '100px', height: '100px', borderRadius: '9999px',
              background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
            }} />
          </div>

          <div style={{ padding: '0 28px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginTop: '24px', marginBottom: '20px' }}>
              <div style={{
                width: '76px', height: '76px', borderRadius: '18px',
                background: `linear-gradient(135deg, ${PRIMARY}cc, ${PRIMARY_DARK})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `3px solid ${cardBg}`,
                boxShadow: `0 4px 20px ${PRIMARY}44`,
                flexShrink: 0,
              }}>
                <User style={{ width: '34px', height: '34px', color: '#fff' }} />
              </div>
              <div style={{ paddingBottom: '4px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: txtMain, margin: 0, lineHeight: 1.2 }}>
                  {profile.name || 'Full Name'}
                </h2>
                <p style={{ fontSize: '13px', color: txtSub, marginTop: '3px' }}>
                  {profile.department || 'Department'}
                </p>
              </div>
            </div>

            {/* Badges row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '30px',
                background: isDarkMode ? 'rgba(255,255,255,0.06)' : '#f0f6ff',
                border: `1px solid ${border}`,
              }}>
                <CalendarDays style={{ width: '13px', height: '13px', color: PRIMARY }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: txtSub }}>
                  Member since May 2026
                </span>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '30px',
                background: '#dcfce7', border: '1px solid #bbf7d0',
              }}>
                <BadgeCheck style={{ width: '13px', height: '13px', color: '#16a34a' }} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#15803d' }}>Verified Account</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Info / Edit Card ──────────────────────────────────── */}
        <div style={{
          borderRadius: '20px', background: cardBg,
          border: `1px solid ${border}`, boxShadow: cardShadow,
          padding: '24px',
        }}>
          <h3 style={{
            fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: PRIMARY, marginBottom: '18px',
          }}>
            {isEditing ? 'Edit Information' : 'Personal Information'}
          </h3>

          {!isEditing ? (
            /* ── View Mode ── */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '12px',
            }}>
              <InfoCard icon={<User  style={{ width: '16px', height: '16px' }} />} label="Full Name"            value={profile.name}       isDarkMode={isDarkMode} />
              <InfoCard icon={<Mail  style={{ width: '16px', height: '16px' }} />} label="Email Address"        value={profile.email}      isDarkMode={isDarkMode} />
              <InfoCard icon={<Phone style={{ width: '16px', height: '16px' }} />} label="Phone Number"         value={profile.phone}      isDarkMode={isDarkMode} />
              <InfoCard icon={<Building2 style={{ width: '16px', height: '16px' }} />} label="Department / Position" value={profile.department} isDarkMode={isDarkMode} />
            </div>
          ) : (
            /* ── Edit Mode ── */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}>
              {/* Full Name */}
              <div>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em',
                  textTransform: 'uppercase', color: txtSub, marginBottom: '8px',
                }}>
                  <span style={{ color: PRIMARY }}><User style={{ width: '15px', height: '15px' }} /></span>
                  Full Name *
                </label>
                <input
                  id="input-full-name"
                  type="text"
                  value={draft.name}
                  onChange={e => setDraft(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="ชื่อ นามสกุล"
                  style={inputStyle(!!validationErrors.first_name)}
                  onFocus={e  => (e.target.style.borderColor = validationErrors.first_name ? '#ef4444' : PRIMARY)}
                  onBlur={e   => (e.target.style.borderColor = validationErrors.first_name ? '#ef4444' : border)}
                />
                {validationErrors.first_name && (
                  <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                    {validationErrors.first_name}
                  </p>
                )}
              </div>

              {/* Email (read-only) */}
              <div>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em',
                  textTransform: 'uppercase', color: txtSub, marginBottom: '8px',
                }}>
                  <span style={{ color: PRIMARY }}><Mail style={{ width: '15px', height: '15px' }} /></span>
                  Email Address
                </label>
                <input
                  type="email"
                  value={draft.email}
                  readOnly
                  style={{
                    ...inputStyle(false),
                    opacity: 0.6,
                    cursor: 'not-allowed',
                  }}
                  title="ไม่สามารถเปลี่ยน Email ได้"
                />
                <p style={{ fontSize: '11px', color: txtSub, marginTop: '4px' }}>
                  ไม่สามารถเปลี่ยน Email ได้
                </p>
              </div>

              {/* Phone */}
              <div>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em',
                  textTransform: 'uppercase', color: txtSub, marginBottom: '8px',
                }}>
                  <span style={{ color: PRIMARY }}><Phone style={{ width: '15px', height: '15px' }} /></span>
                  Phone Number
                </label>
                <input
                  id="input-phone"
                  type="text"
                  value={draft.phone}
                  onChange={e => setDraft(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="เช่น 0812345678"
                  style={inputStyle(!!validationErrors.phone_number)}
                  onFocus={e  => (e.target.style.borderColor = validationErrors.phone_number ? '#ef4444' : PRIMARY)}
                  onBlur={e   => (e.target.style.borderColor = validationErrors.phone_number ? '#ef4444' : border)}
                />
                {validationErrors.phone_number ? (
                  <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                    {validationErrors.phone_number}
                  </p>
                ) : (
                  <p style={{ fontSize: '11px', color: txtSub, marginTop: '4px' }}>
                    ตัวเลข 7-10 หลัก (ไม่ต้องใส่ขีดกลาง)
                  </p>
                )}
              </div>

              {/* Department */}
              <div>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em',
                  textTransform: 'uppercase', color: txtSub, marginBottom: '8px',
                }}>
                  <span style={{ color: PRIMARY }}><Building2 style={{ width: '15px', height: '15px' }} /></span>
                  Department / Position
                </label>
                <input
                  id="input-department"
                  type="text"
                  value={draft.department}
                  onChange={e => setDraft(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="เช่น ฝ่ายไอที / Manager"
                  style={inputStyle(false)}
                  onFocus={e  => (e.target.style.borderColor = PRIMARY)}
                  onBlur={e   => (e.target.style.borderColor = border)}
                />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
