import { CheckCircle, Clock, AlertCircle, Users, MonitorCheck, Wifi } from 'lucide-react';
import { RoomStatus, RoomType } from './AdminDashboard';

export const statusConfig = {
  available: { label: 'ว่าง', color: '#10b981', bg: '#d1fae5', icon: CheckCircle },
  reserved: { label: 'กำลังใช้งาน', color: '#3b82f6', bg: '#dbeafe', icon: Clock },
  maintenance: { label: 'ซ่อมบำรุง', color: '#ef4444', bg: '#fee2e2', icon: AlertCircle },
};

export const roomTypeConfig = {
  seminar: { label: 'ห้องสัมมนา', icon: Users, color: '#6366f1' },
  computer: { label: 'ห้องคอมพิวเตอร์', icon: MonitorCheck, color: '#0ea5e9' },
  distance_learning: { label: 'ห้องสอนทางไกล', icon: Wifi, color: '#8b5cf6' },
};

export function StatusBadge({ status }: { status: RoomStatus }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}30` }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium">
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

export function RoomTypeBadge({ type }: { type: RoomType }) {
  const cfg = roomTypeConfig[type];
  const Icon = cfg.icon;
  return (
    <span style={{ color: cfg.color, backgroundColor: `${cfg.color}15` }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium">
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}
