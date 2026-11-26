import { useMemo } from 'react';
import {
  TrendingUp, BarChart3, DollarSign, Calendar, Building2, Users, LayoutDashboard
} from 'lucide-react';
import { Room, AdminSection } from './AdminDashboard';
import { statusConfig } from './badges';

export interface StatCard {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
  color: string;
  bg: string;
}

export const dashboardNavItem = {
  id: 'dashboard' as AdminSection,
  label: 'Dashboard',
  desc: 'ภาพรวมระบบและสถิติ',
  icon: LayoutDashboard,
  color: '#3b82f6'
};

interface DashboardTabProps {
  rooms: Room[];
  rawBookings: any[];
  todayBookings: any[];
  setActiveSection: (sec: any) => void;
}

export function DashboardTab({ rooms, rawBookings, todayBookings, setActiveSection }: DashboardTabProps) {
  // Derive monthlyData from rawBookings
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
        stats[month].revenue += Number(b.total_amount) || 0;
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

  // Derive global stats
  const stats: StatCard[] = useMemo(() => {
    return [
      { label: 'ห้องทั้งหมด', value: rooms.length.toString(), change: 'อัพเดตล่าสุด', positive: true, icon: Building2, color: '#2563eb', bg: '#eff6ff' },
      { label: 'รายได้รวม (บาท)', value: monthlyData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString(), change: 'ปีนี้', positive: true, icon: DollarSign, color: '#059669', bg: '#ecfdf5' },
      { label: 'การจองวันนี้', value: todayBookings.length.toString(), change: 'วันนี้', positive: true, icon: Calendar, color: '#d97706', bg: '#fffbeb' },
      { label: 'การจองทั้งหมด', value: rawBookings?.length.toString() || '0', change: 'ทั้งหมด', positive: true, icon: Users, color: '#7c3aed', bg: '#f5f3ff' },
    ];
  }, [rooms.length, monthlyData, todayBookings.length, rawBookings?.length]);

  const paidBookings = useMemo(() => todayBookings.filter((b: any) => b.type === 'ชำระเงินแล้ว'), [todayBookings]);
  const freeBookings = useMemo(() => todayBookings.filter((b: any) => b.type === 'ยังไม่ชำระเงิน'), [todayBookings]);
  const totalRevenue = useMemo(() => paidBookings.reduce((sum, b) => sum + b.amount, 0), [paidBookings]);
  const paidPercent = useMemo(() => {
    if (todayBookings.length === 0) return 0;
    return Math.round((paidBookings.length / todayBookings.length) * 100);
  }, [paidBookings.length, todayBookings.length]);

  const maxBarValue = useMemo(() => {
    return Math.max(...monthlyData.map(d => d.bookings), 1);
  }, [monthlyData]);

  return (
    <div className="admin-section">
      {/* Stats */}
      <div className="admin-stats-grid">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="admin-stat-card" style={{ '--card-accent': s.color } as React.CSSProperties}>
              <div className="admin-stat-icon" style={{ backgroundColor: s.bg }}>
                <Icon size={22} style={{ color: s.color }} />
              </div>
              <div className="admin-stat-info">
                <p className="admin-stat-label">{s.label}</p>
                <p className="admin-stat-value">{s.value}</p>
                <p className={`admin-stat-change ${s.positive ? 'positive' : 'negative'}`}>
                  <TrendingUp size={12} />
                  {s.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="admin-charts-row">
        {/* Bar Chart */}
        <div className="admin-card admin-chart-main">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <BarChart3 size={18} />
              การจองห้องรายเดือน
            </h3>
            <span className="admin-badge-blue">ปี 2568</span>
          </div>
          <div className="admin-bar-chart">
            {monthlyData.map((d, i) => (
              <div key={i} className="admin-bar-item">
                <div className="admin-bar-track">
                  <div
                    className="admin-bar-fill"
                    style={{ height: `${(d.bookings / maxBarValue) * 100}%` }}
                    title={`${d.bookings} การจอง`}
                  />
                </div>
                <span className="admin-bar-label">{d.month}</span>
                <span className="admin-bar-value">{d.bookings}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="admin-card admin-chart-side">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <DollarSign size={18} />
              การรับเงิน
            </h3>
          </div>
          <div className="admin-pie-container">
            <svg viewBox="0 0 120 120" className="admin-pie-svg">
              <circle cx="60" cy="60" r="45" fill="none" stroke="#e0e7ff" strokeWidth="22" />
              <circle cx="60" cy="60" r="45" fill="none" stroke="#2563eb" strokeWidth="22"
                strokeDasharray={`${paidPercent * 2.827} ${282.7}`}
                strokeDashoffset="0"
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dasharray 1s ease' }}
              />
              <text x="60" y="56" textAnchor="middle" fontSize="16" fontWeight="700" fill="#1e3a8a">{paidPercent}%</text>
              <text x="60" y="70" textAnchor="middle" fontSize="8" fill="#64748b">ชำระเงินแล้ว</text>
            </svg>
          </div>
          <div className="admin-pie-legend">
            <div className="admin-pie-legend-item">
              <span className="admin-legend-dot" style={{ backgroundColor: '#2563eb' }} />
              <span>ชำระเงินแล้ว</span>
              <span className="admin-legend-count">{paidBookings.length} ครั้ง</span>
            </div>
            <div className="admin-pie-legend-item">
              <span className="admin-legend-dot" style={{ backgroundColor: '#e0e7ff' }} />
              <span>ยังไม่ชำระเงิน</span>
              <span className="admin-legend-count">{freeBookings.length} ครั้ง</span>
            </div>
            <div className="admin-pie-revenue">
              <span>รายได้วันนี้</span>
              <span className="admin-pie-revenue-value">฿{totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Room Status Overview */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <Building2 size={18} />
            สถานะห้องปัจจุบัน
          </h3>
          <button className="admin-link-btn" onClick={() => setActiveSection('rooms')}>
            ดูทั้งหมด
          </button>
        </div>
        <div className="admin-room-status-grid">
          {Object.entries(statusConfig).map(([status, cfg]) => {
            const count = rooms.filter(r => r.status === status).length;
            const Icon = cfg.icon;
            return (
              <div key={status} className="admin-room-status-card" style={{ borderColor: `${cfg.color}30` }}>
                <div className="admin-room-status-icon" style={{ backgroundColor: cfg.bg }}>
                  <Icon size={20} style={{ color: cfg.color }} />
                </div>
                <div>
                  <p className="admin-room-status-count" style={{ color: cfg.color }}>{count}</p>
                  <p className="admin-room-status-label">{cfg.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today Bookings */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <Calendar size={18} />
            การจองวันนี้
          </h3>
          <span className="admin-badge-gray">{todayBookings.length} รายการ</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>รหัส</th>
                <th>ห้อง</th>
                <th>ผู้จอง</th>
                <th>เวลา</th>
                <th>ประเภท</th>
                <th>ค่าธรรมเนียม</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {todayBookings.map((b, i) => (
                <tr key={i}>
                  <td><span className="admin-mono">{b.id}</span></td>
                  <td><span className="admin-room-name">{b.room}</span></td>
                  <td>{b.user}</td>
                  <td><span className="admin-time-chip">{b.time}</span></td>
                  <td>
                    <span className={`admin-type-badge ${b.type === 'ชำระเงินแล้ว' ? 'paid' : 'free'}`}>
                      {b.type}
                    </span>
                  </td>
                  <td>
                    <span className="admin-amount">
                      {b.amount > 0 ? `฿${b.amount.toLocaleString()}` : '-'}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-booking-status ${b.status}`}>
                      {b.status === 'confirmed' ? 'ยืนยันแล้ว' : b.status === 'draft' ? 'รอยืนยัน' : 'กำลังใช้งาน'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
