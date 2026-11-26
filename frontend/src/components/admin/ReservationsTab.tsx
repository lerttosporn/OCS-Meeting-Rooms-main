import { useState, useMemo } from 'react';
import {
  Calendar, Search, RefreshCw, ChevronDown, ChevronUp,
  User, DollarSign, FileText, Clock, CheckCircle, XCircle,
} from 'lucide-react';
import { AdminSection } from './AdminDashboard';
import { useBookings, Booking, BookingStatus } from '../../hooks/useBookings';

// ─── Nav item ──────────────────────────────────────────────────────────────────

export const reservationsNavItem = {
  id: 'reservations' as AdminSection,
  label: 'Reservations',
  desc: 'ดูข้อมูลการจองทั้งหมด',
  icon: Calendar,
  color: '#f59e0b',
};

// ─── Badge configs ──────────────────────────────────────────────────────────────

const bookingStatusConfig: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  draft:     { label: 'แบบร่าง',    color: '#64748b', bg: '#f1f5f9' },
  approved:  { label: 'อนุมัติแล้ว', color: '#2563eb', bg: '#dbeafe' },
  confirmed: { label: 'ยืนยันแล้ว', color: '#059669', bg: '#d1fae5' },
  completed: { label: 'เสร็จสิ้น',  color: '#7c3aed', bg: '#ede9fe' },
  cancel:    { label: 'ยกเลิกแล้ว', color: '#dc2626', bg: '#fee2e2' },
};

const paymentStatusConfig = {
  unpaid:   { label: 'ยังไม่ชำระ', color: '#d97706', bg: '#fef3c7' },
  paid:     { label: 'ชำระแล้ว',  color: '#059669', bg: '#d1fae5' },
  refunded: { label: 'คืนเงินแล้ว', color: '#dc2626', bg: '#fee2e2' },
};

// ─── Helper ────────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatAmount(n: number | string) {
  return Number(n).toLocaleString('th-TH', { minimumFractionDigits: 2 });
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const cfg = bookingStatusConfig[status] ?? bookingStatusConfig.draft;
  return (
    <span style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}30` }}
      className="admin-booking-status">
      {cfg.label}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const cfg = paymentStatusConfig[status as keyof typeof paymentStatusConfig]
    ?? { label: status, color: '#64748b', bg: '#f1f5f9' };
  return (
    <span style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}30` }}
      className="admin-booking-status">
      {cfg.label}
    </span>
  );
}

// ─── Row with expand ────────────────────────────────────────────────────────────

interface BookingRowProps {
  booking: Booking;
  onApprove: (id: number, nextStatus: BookingStatus) => Promise<void>;
}

function BookingRow({ booking, onApprove }: BookingRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [actionType, setActionType] = useState<BookingStatus | null>(null);
  const bsCfg = bookingStatusConfig[booking.booking_status];

  const handleApprove = async () => {
    setActionType('approved');
    try {
      await onApprove(booking.booking_id, 'approved');
    } finally {
      setActionType(null);
    }
  };

  const handleCancel = async () => {
    setActionType('cancel');
    try {
      await onApprove(booking.booking_id, 'cancel');
    } finally {
      setActionType(null);
    }
  };

  const actionInProgress = actionType !== null;

  return (
    <>
      <tr style={{ borderLeft: `3px solid ${bsCfg?.color ?? '#e2e8f0'}` }}>
        <td>
          <button className="admin-expand-btn" onClick={() => setExpanded(v => !v)}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </td>
        <td className="admin-mono">
          BK{String(booking.booking_id).padStart(4, '0')}
        </td>
        <td>
          <div className="admin-room-cell">
            <span className="admin-room-name">{booking.customer_name || '-'}</span>
          </div>
        </td>
        <td>
          <div className="admin-room-cell">
            <span className="admin-room-name" style={{ fontSize: '0.82rem', color: '#475569' }}>
              {booking.room_name || '-'}
            </span>
          </div>
        </td>
        <td>
          <PaymentStatusBadge status={booking.payment_status} />
        </td>
        <td className="admin-amount">
          ฿{formatAmount(booking.total_amount)}
        </td>
        <td style={{ fontSize: '0.78rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
          {formatDate(booking.bookingdate)}
        </td>
        <td>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <BookingStatusBadge status={booking.booking_status} />
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                id={`approve-btn-${booking.booking_id}`}
                onClick={handleApprove}
                disabled={actionInProgress || booking.booking_status !== 'draft'}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  background: (actionInProgress || booking.booking_status !== 'draft')
                    ? '#cbd5e1'
                    : 'linear-gradient(135deg, #10b981, #059669)',
                  color: (actionInProgress || booking.booking_status !== 'draft') ? '#94a3b8' : 'white',
                  border: 'none', borderRadius: 8,
                  padding: '0.35rem 0.75rem', fontSize: '0.78rem', fontWeight: 600,
                  cursor: (actionInProgress || booking.booking_status !== 'draft') ? 'not-allowed' : 'pointer',
                  boxShadow: (actionInProgress || booking.booking_status !== 'draft') ? 'none' : '0 2px 8px rgba(16,185,129,0.2)',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!actionInProgress && booking.booking_status === 'draft') {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,185,129,0.3)';
                  }
                }}
                onMouseLeave={e => {
                  if (!actionInProgress && booking.booking_status === 'draft') {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(16,185,129,0.2)';
                  }
                }}
              >
                {actionType === 'approved'
                  ? <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />
                  : <CheckCircle size={12} />}
                {actionType === 'approved' ? 'กำลังอนุมัติ...' : 'Approve'}
              </button>

              <button
                id={`cancel-btn-${booking.booking_id}`}
                onClick={handleCancel}
                disabled={actionInProgress || booking.booking_status !== 'draft'}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  background: (actionInProgress || booking.booking_status !== 'draft')
                    ? '#cbd5e1'
                    : 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: (actionInProgress || booking.booking_status !== 'draft') ? '#94a3b8' : 'white',
                  border: 'none', borderRadius: 8,
                  padding: '0.35rem 0.75rem', fontSize: '0.78rem', fontWeight: 600,
                  cursor: (actionInProgress || booking.booking_status !== 'draft') ? 'not-allowed' : 'pointer',
                  boxShadow: (actionInProgress || booking.booking_status !== 'draft') ? 'none' : '0 2px 8px rgba(239,68,68,0.2)',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!actionInProgress && booking.booking_status === 'draft') {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,68,68,0.3)';
                  }
                }}
                onMouseLeave={e => {
                  if (!actionInProgress && booking.booking_status === 'draft') {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(239,68,68,0.2)';
                  }
                }}
              >
                {actionType === 'cancel'
                  ? <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />
                  : <XCircle size={12} />}
                {actionType === 'cancel' ? 'กำลังยกเลิก...' : 'Cancel'}
              </button>
            </div>
          </div>
        </td>
      </tr>

      {expanded && (
        <tr className="admin-row-detail">
          <td colSpan={8}>
            <div className="admin-row-detail-content" style={{ padding: '0.25rem 0', gap: '2.5rem' }}>
              <div>
                <div className="admin-detail-label"><User size={11} style={{ display:'inline', marginRight:4 }} />ลูกค้า</div>
                <div style={{ fontSize: '0.85rem' }}>{booking.customer_name}</div>
              </div>
              <div>
                <div className="admin-detail-label"><Calendar size={11} style={{ display:'inline', marginRight:4 }} />รายละเอียดห้อง</div>
                <div style={{ fontSize: '0.85rem' }}>{booking.room_name || '-'}</div>
              </div>
              <div>
                <div className="admin-detail-label"><DollarSign size={11} style={{ display:'inline', marginRight:4 }} />ส่วนลด</div>
                <div style={{ fontSize: '0.85rem' }}>฿{formatAmount(booking.discount_amount)}</div>
              </div>
              <div>
                <div className="admin-detail-label"><Clock size={11} style={{ display:'inline', marginRight:4 }} />วันเวลาที่ใช้งาน</div>
                <div style={{ fontSize: '0.85rem' }}>
                  {booking.start_date ? (
                    <>
                      {formatDate(booking.start_date)} {booking.start_time} - {booking.end_date !== booking.start_date ? formatDate(booking.end_date) + ' ' : ''}{booking.end_time}
                    </>
                  ) : (
                    '-'
                  )}
                </div>
              </div>
              <div>
                <div className="admin-detail-label"><Clock size={11} style={{ display:'inline', marginRight:4 }} />วันที่สร้างรายการ</div>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>{formatDate(booking.bookingdate)}</div>
              </div>
              {booking.topic && (
                <div>
                  <div className="admin-detail-label"><FileText size={11} style={{ display:'inline', marginRight:4 }} />หัวข้อการประชุม</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>{booking.topic}</div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: BookingStatus | ''; label: string }[] = [
  { value: '', label: 'ทุกสถานะ' },
  { value: 'draft',     label: 'แบบร่าง' },
  { value: 'approved',  label: 'อนุมัติแล้ว' },
  { value: 'confirmed', label: 'ยืนยันแล้ว' },
  { value: 'completed', label: 'เสร็จสิ้น' },
  { value: 'cancel',    label: 'ยกเลิกแล้ว' },
];

const PAGE_SIZE = 15;

export function ReservationsTab() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [approveError, setApproveError] = useState<string | null>(null);

  const { bookings, loading, error, refetch, updateBookingStatus } = useBookings(statusFilter || undefined);

  const handleApprove = async (id: number, nextStatus: BookingStatus) => {
    setApproveError(null);
    try {
      await updateBookingStatus(id, nextStatus);
    } catch (e) {
      setApproveError(e instanceof Error ? e.message : 'ดำเนินการไม่สำเร็จ');
    }
  };

  // Client-side search by customer name / booking id
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter(b =>
      String(b.booking_id).includes(q) ||
      b.customer_name?.toLowerCase().includes(q) ||
      b.room_name?.toLowerCase().includes(q)
    );
  }, [bookings, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page when filters change
  const handleStatusChange = (v: BookingStatus | '') => {
    setStatusFilter(v);
    setPage(1);
  };
  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  // Summary counts
  const counts = useMemo(() => {
    const all = bookings;
    return {
      total:     all.length,
      draft:     all.filter(b => b.booking_status === 'draft').length,
      approved:  all.filter(b => b.booking_status === 'approved').length,
      confirmed: all.filter(b => b.booking_status === 'confirmed').length,
      completed: all.filter(b => b.booking_status === 'completed').length,
    };
  }, [bookings]);

  return (
    <div className="admin-section">
      {/* ── Summary stat chips ── */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {(Object.entries({
          total:     { label: 'ทั้งหมด',       color: '#0056b3', bg: '#eff6ff' },
          draft:     { label: 'แบบร่าง',       color: '#64748b', bg: '#f1f5f9' },
          approved:  { label: 'อนุมัติ',        color: '#2563eb', bg: '#dbeafe' },
          confirmed: { label: 'ยืนยัน',         color: '#059669', bg: '#d1fae5' },
          completed: { label: 'เสร็จสิ้น',      color: '#7c3aed', bg: '#ede9fe' },
        }) as [keyof typeof counts, {label:string;color:string;bg:string}][]).map(([key, cfg]) => (
          <div key={key} style={{
            background: cfg.bg, border: `1px solid ${cfg.color}30`,
            borderRadius: 12, padding: '0.5rem 1rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: cfg.color }}>{counts[key]}</span>
            <span style={{ fontSize: '0.78rem', color: cfg.color }}>{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* ── Approve error banner ── */}
      {approveError && (
        <div style={{
          background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10,
          padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.875rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>⚠️ {approveError}</span>
          <button onClick={() => setApproveError(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {/* ── Main table card ── */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <Calendar size={18} /> รายการการจองทั้งหมด
          </h3>
          <button className="admin-btn-outline-sm" onClick={refetch} disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : undefined }} />
            รีเฟรช
          </button>
        </div>

        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="admin-search-wrap">
            <Search size={14} className="admin-search-icon" />
            <input
              id="reservations-search"
              type="text"
              className="admin-search-input"
              placeholder="ค้นหาเลข Booking, ชื่อลูกค้า, รายละเอียดห้อง..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>
          <div className="admin-filters">
            <select
              id="reservations-status-filter"
              className="admin-select"
              value={statusFilter}
              onChange={e => handleStatusChange(e.target.value as BookingStatus | '')}
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        {error ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
            ⚠️ โหลดข้อมูลไม่สำเร็จ: {error}
          </div>
        ) : loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
            <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: 8 }} />
            <div>กำลังโหลด...</div>
          </div>
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: 32 }}></th>
                    <th>เลขที่</th>
                    <th>ลูกค้า</th>
                    <th>รายละเอียดห้อง</th>
                    <th>สถานะการชำระ</th>
                    <th>ยอดรวม</th>
                    <th>วันที่จอง</th>
                    <th>การดำเนินการ (Actions)</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="admin-empty-row">
                        ไม่พบข้อมูลการจอง
                      </td>
                    </tr>
                  ) : (
                    paginated.map(b => (
                      <BookingRow key={b.booking_id} booking={b} onApprove={handleApprove} />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="admin-pagination">
                <span className="admin-pagination-info">
                  แสดง {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} จาก {filtered.length} รายการ
                </span>
                <div className="admin-pagination-btns">
                  <button className="admin-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <button key={p} className={`admin-page-btn${page === p ? ' active' : ''}`} onClick={() => setPage(p)}>
                        {p}
                      </button>
                    );
                  })}
                  <button className="admin-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
