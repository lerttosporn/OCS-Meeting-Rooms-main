import { Settings } from 'lucide-react';
import { AdminSection } from './AdminDashboard';

export const settingsNavItem = {
  id: 'settings' as AdminSection,
  label: 'Settings',
  desc: 'ตั้งค่าระบบ',
  icon: Settings,
  color: '#64748b'
};

export function SettingsTab() {
  return (
    <div className="admin-section">
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title"><Settings size={18} /> ตั้งค่าระบบ</h3>
        </div>
        <div className="admin-settings-grid">
          {[
            { label: 'ชื่อระบบ', value: 'OCS Meeting Rooms', type: 'text' },
            { label: 'อีเมลแจ้งเตือน', value: 'admin@ocs.ac.th', type: 'email' },
            { label: 'เวลาเปิดทำการ', value: '08:00', type: 'time' },
            { label: 'เวลาปิดทำการ', value: '20:00', type: 'time' },
          ].map((s, i) => (
            <div key={i} className="admin-setting-item">
              <label className="admin-setting-label">{s.label}</label>
              <input className="admin-setting-input" type={s.type} defaultValue={s.value} />
            </div>
          ))}
        </div>
        <button className="admin-btn-primary" style={{ marginTop: '1.5rem' }}>
          บันทึกการตั้งค่า
        </button>
      </div>
    </div>
  );
}
