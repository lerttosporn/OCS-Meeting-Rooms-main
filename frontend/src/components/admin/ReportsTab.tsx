import { useState, useMemo } from 'react';
import {
  Download, Calendar, DollarSign, Building2, Users, TrendingUp, FileText
} from 'lucide-react';
import { Room, RoomType, AdminSection } from './AdminDashboard';
import { RoomTypeBadge } from './badges';

export const reportsNavItem = {
  id: 'reports' as AdminSection,
  label: 'Reports',
  desc: 'ดูรายงานและกราฟสรุปผล',
  icon: FileText,
  color: '#8b5cf6'
};

interface ReportsTabProps {
  rooms: Room[];
  monthlyData: { month: string; bookings: number; revenue: number }[];
  todayBookings: any[];
}

export function ReportsTab({ rooms, monthlyData, todayBookings }: ReportsTabProps) {
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly'>('daily');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);

  const paidBookings = useMemo(() => todayBookings.filter((b: any) => b.type === 'ชำระเงินแล้ว'), [todayBookings]);
  const totalRevenue = useMemo(() => paidBookings.reduce((sum, b) => sum + b.amount, 0), [paidBookings]);

  const uniqueUsersCount = useMemo(() => {
    const users = new Set(todayBookings.map((b: any) => b.user));
    return users.size;
  }, [todayBookings]);

  const roomsUsedToday = useMemo(() => {
    const map = new Map<string, any>();
    const parseHours = (timeStr: string) => {
      const parts = timeStr.split('-');
      if (parts.length === 2) {
        const start = parts[0].trim().split(':');
        const end = parts[1].trim().split(':');
        const startH = parseInt(start[0] || '0') + parseInt(start[1] || '0') / 60;
        const endH = parseInt(end[0] || '0') + parseInt(end[1] || '0') / 60;
        return Math.max(0, endH - startH);
      }
      return 0;
    };

    todayBookings.forEach((b: any) => {
      if (b.status === 'cancel') return;
      const hours = parseHours(b.time);
      if (map.has(b.room)) {
        const item = map.get(b.room);
        item.bookings += 1;
        item.hours += hours;
        item.revenue += b.amount;
      } else {
        const roomInfo = rooms.find(r => r.name === b.room);
        map.set(b.room, {
          name: b.room,
          type: roomInfo?.type || 'seminar',
          bookings: 1,
          hours: hours,
          revenue: b.amount
        });
      }
    });
    return Array.from(map.values());
  }, [todayBookings, rooms]);

  return (
    <div className="admin-section">
      {/* Report Filters */}
      <div className="admin-card">
        <div className="admin-report-filters">
          <div className="admin-period-toggle">
            <button className={`admin-period-btn ${reportPeriod === 'daily' ? 'active' : ''}`}
              onClick={() => setReportPeriod('daily')}>รายวัน</button>
            <button className={`admin-period-btn ${reportPeriod === 'weekly' ? 'active' : ''}`}
              onClick={() => setReportPeriod('weekly')}>รายสัปดาห์</button>
          </div>
          <input type="date" className="admin-date-input" value={reportDate}
            onChange={e => setReportDate(e.target.value)} />
          <button className="admin-btn-outline-sm">
            <Download size={14} />
            ดาวน์โหลด PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="admin-report-cards">
        <div className="admin-report-card">
          <div className="admin-report-icon" style={{ background: '#eff6ff' }}>
            <Calendar size={20} style={{ color: '#2563eb' }} />
          </div>
          <p className="admin-report-label">จำนวนการจองวันนี้</p>
          <p className="admin-report-value">{todayBookings.length} ครั้ง</p>
          <p className="admin-report-sub">วันนี้</p>
        </div>
        <div className="admin-report-card">
          <div className="admin-report-icon" style={{ background: '#ecfdf5' }}>
            <DollarSign size={20} style={{ color: '#059669' }} />
          </div>
          <p className="admin-report-label">รายได้วันนี้</p>
          <p className="admin-report-value">฿{totalRevenue.toLocaleString()}</p>
          <p className="admin-report-sub">จาก {paidBookings.length} การจอง</p>
        </div>
        <div className="admin-report-card">
          <div className="admin-report-icon" style={{ background: '#f5f3ff' }}>
            <Building2 size={20} style={{ color: '#7c3aed' }} />
          </div>
          <p className="admin-report-label">ห้องที่ใช้งานวันนี้</p>
          <p className="admin-report-value">{roomsUsedToday.length} ห้อง</p>
          <p className="admin-report-sub">จาก {rooms.filter(r => r.isActive).length} ห้องที่เปิดให้บริการ</p>
        </div>
        <div className="admin-report-card">
          <div className="admin-report-icon" style={{ background: '#fff7ed' }}>
            <Users size={20} style={{ color: '#ea580c' }} />
          </div>
          <p className="admin-report-label">ผู้ใช้งานวันนี้ (เฉพาะผู้จอง)</p>
          <p className="admin-report-value">{uniqueUsersCount} คน</p>
          <p className="admin-report-sub">ไม่รวมผู้เข้าร่วมอื่นๆ</p>
        </div>
      </div>

      {/* Rooms Used Today */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <Building2 size={18} />
            ห้องที่ใช้งานวันนี้
          </h3>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ห้อง</th>
                <th>ประเภท</th>
                <th>จำนวนการจอง</th>
                <th>ชั่วโมงรวม</th>
                <th>รายได้</th>
                <th>อัตราการใช้</th>
              </tr>
            </thead>
            <tbody>
              {roomsUsedToday.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    ไม่มีห้องที่ถูกใช้งานวันนี้
                  </td>
                </tr>
              ) : roomsUsedToday.map((r, i) => (
                <tr key={i}>
                  <td><span className="admin-room-name">{r.name}</span></td>
                  <td><RoomTypeBadge type={r.type} /></td>
                  <td className="text-center">{r.bookings} ครั้ง</td>
                  <td className="text-center">{r.hours} ชม.</td>
                  <td><span className="admin-amount">฿{r.revenue.toLocaleString()}</span></td>
                  <td>
                    <div className="admin-usage-bar-wrap">
                      <div className="admin-usage-bar">
                        <div className="admin-usage-fill" style={{ width: `${Math.min((r.hours / 8) * 100, 100)}%` }} />
                      </div>
                      <span className="admin-usage-pct">{Math.round((r.hours / 8) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly History */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <TrendingUp size={18} />
            รายงานย้อนหลังรายเดือน
          </h3>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>เดือน</th>
                <th>จำนวนการจอง</th>
                <th>รายได้รวม</th>
                <th>เฉลี่ยต่อวัน</th>
                <th>เทรนด์</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((d, i) => {
                const prev = monthlyData[i - 1];
                const delta = prev ? d.bookings - prev.bookings : 0;
                return (
                  <tr key={i}>
                    <td><strong>{d.month}</strong></td>
                    <td>{d.bookings} ครั้ง</td>
                    <td><span className="admin-amount">฿{d.revenue.toLocaleString()}</span></td>
                    <td>{Math.round(d.revenue / 30).toLocaleString()} บาท</td>
                    <td>
                      {i > 0 && (
                        <span className={`admin-trend ${delta >= 0 ? 'up' : 'down'}`}>
                          {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
