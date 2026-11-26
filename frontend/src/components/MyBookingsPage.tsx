import { useState } from 'react';
import { Calendar, Clock, Users, DollarSign, RefreshCw, BookOpen, ChevronRight, Car } from 'lucide-react';
import { useMyBookings, BookingDetail, BookingStatus } from '../hooks/useMyBookings';

interface MyBookingsPageProps {
  isDarkMode: boolean;
  userId: number | null;
}

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Partial<Record<BookingStatus, { label: string; color: string; bg: string; dot: string }>> = {
  draft:     { label: 'รอยืนยัน',   color: '#d97706', bg: '#fef3c7', dot: '#f59e0b' },
  confirmed: { label: 'ยืนยันแล้ว', color: '#059669', bg: '#d1fae5', dot: '#10b981' },
  completed: { label: 'เสร็จสิ้น',    color: '#7c3aed', bg: '#ede9fe', dot: '#8b5cf6' },
  cancel:    { label: 'ยกเลิก',      color: '#dc2626', bg: '#fee2e2', dot: '#ef4444' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  const normalizedDate = dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00';
  const d = new Date(normalizedDate);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('th-TH', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });
}

function formatTime(t: string) {
  return t?.slice(0, 5) ?? '-';
}

// ─── Booking Card ─────────────────────────────────────────────────────────────

function BookingCard({ booking, isDarkMode, onCancel }: { booking: BookingDetail; isDarkMode: boolean; onCancel?: (id: number) => void }) {
  const bg = isDarkMode ? '#1e2433' : '#ffffff';
  const border = isDarkMode ? '#2d3748' : '#e8ecf0';
  const textMain = isDarkMode ? '#f1f5f9' : '#1a202c';
  const textSub = isDarkMode ? '#64748b' : '#6b7280';
  const cardBg = isDarkMode ? '#111827' : '#f8fafc';
  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.draft;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      {/* Card Header */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ 
          background: booking.status === 'cancel' 
            ? 'linear-gradient(135deg, #ef4444, #b91c1c)' 
            : 'linear-gradient(135deg, #0066cc, #004da6)' 
        }}
      >
        <div className="flex-1 pr-3">
          <p className="text-white font-bold text-base leading-tight">{booking.room_name}</p>
        </div>
        {/* Status Badge */}
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
          style={{ color: status.color, background: status.bg }}
        >
          <span 
            className="w-1.5 h-1.5 rounded-full flex-shrink-0" 
            style={{ background: status.dot, marginRight: '10px' }} 
          />
          {status.label}
        </span>
      </div>

      {/* Notes / Topic (Moved below header) */}
      {(booking.topic || booking.notes) && (
        <div
          className="px-5 py-3 flex items-center gap-2 border-y"
          style={{ borderColor: border, backgroundColor: bg }}
        >
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: textSub }} />
          <p className="text-xs" style={{ color: textSub }}>
            <span className="font-semibold">หัวข้อ:</span> {booking.topic || booking.notes}
          </p>
        </div>
      )}

      {/* Card Body */}
      <div className="px-5 py-4 grid grid-cols-2 gap-3" style={{ backgroundColor: cardBg }}>
        {/* Created At (Booking Date) */}
        {booking.created_at && (
          <div className="flex items-start gap-2 col-span-2 mb-1">
            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#0066cc' }} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: textSub }}>ทำรายการจองเมื่อ</p>
              <p className="text-sm font-medium" style={{ color: textMain }}>
                {formatDate(booking.created_at.split('T')[0])} เวลา {formatTime(booking.created_at.split('T')[1] || '')}
              </p>
            </div>
          </div>
        )}

        {/* Usage Duration */}
        <div className="flex items-start gap-2 col-span-2">
          <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#0066cc' }} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: textSub }}>วันที่เข้าใช้</p>
            <p className="text-sm font-medium leading-snug" style={{ color: textMain }}>
              {formatDate(booking.start_date)} <br />
              <span className="opacity-80">เวลา {formatTime(booking.start_time)} - {formatTime(booking.end_time)} น.</span>
            </p>
          </div>
        </div>



        {/* Price */}
        <div className="flex items-start gap-2">
          <span className="w-4 h-4 mt-0.5 flex-shrink-0 flex items-center justify-center font-bold text-sm" style={{ color: '#0066cc' }}>฿</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: textSub }}>ราคา</p>
            <p className="text-sm font-bold" style={{ color: '#0056b3' }}>
              {booking.price_snapshot.toLocaleString()} บาท
            </p>
          </div>
        </div>

        {/* Parking */}
        {(booking.car_plate1 || booking.car_plate2) && (
          <div className="flex items-start gap-2">
            <Car className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#0066cc' }} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: textSub }}>ที่จอดรถ</p>
              <p className="text-sm font-medium leading-snug" style={{ color: textMain }}>
                {[booking.car_plate1, booking.car_plate2].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      {booking.status !== 'completed' && booking.status !== 'cancel' && onCancel && (
        <div className="px-5 py-3 flex justify-end border-t" style={{ borderColor: border, backgroundColor: bg }}>
          <button
            onClick={() => onCancel(booking.booking_id)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all hover:bg-red-50 text-red-600 border border-red-200"
          >
            ยกเลิกการจอง
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ isDarkMode }: { isDarkMode: boolean }) {
  const border = isDarkMode ? '#2d3748' : '#e8ecf0';
  const textMain = isDarkMode ? '#f1f5f9' : '#1a202c';
  const textSub = isDarkMode ? '#64748b' : '#6b7280';
  const bg = isDarkMode ? '#1e2433' : '#ffffff';

  return (
    <div
      className="rounded-2xl p-12 text-center flex flex-col items-center gap-4"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#eff6ff' }}>
        <BookOpen className="w-8 h-8" style={{ color: '#0066cc' }} />
      </div>
      <div>
        <p className="text-lg font-bold mb-1" style={{ color: textMain }}>ยังไม่มีรายการจอง</p>
        <p className="text-sm" style={{ color: textSub }}>
          เมื่อคุณจองห้องประชุม รายการจะปรากฏที่นี่
        </p>
      </div>
    </div>
  );
}

// ─── Status Filter Tab ────────────────────────────────────────────────────────

const FILTER_TABS: { value: 'all' | BookingStatus; label: string }[] = [
  { value: 'all',       label: 'ทั้งหมด' },
  { value: 'draft',     label: 'รอยืนยัน' },
  { value: 'confirmed', label: 'ยืนยันแล้ว' },
  { value: 'completed', label: 'เสร็จสิ้น' },
  { value: 'cancel',    label: 'ยกเลิก' },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export function MyBookingsPage({ isDarkMode, userId }: MyBookingsPageProps) {
  const [filter, setFilter] = useState<'all' | BookingStatus>('all');
  
  const { bookings: allBookings, refetch: refetchAll, cancelBooking } = useMyBookings(userId, 'all');
  const { bookings, loading, error, refetch: refetchFiltered } = useMyBookings(userId, filter);

  const refetch = () => {
    refetchAll();
    refetchFiltered();
  };

  const handleCancel = async (id: number) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?')) {
      const success = await cancelBooking(id);
      if (success) {
        refetchAll();
        refetchFiltered();
      } else {
        alert('เกิดข้อผิดพลาดในการยกเลิกการจอง');
      }
    }
  };

  const filtered = bookings;

  const textMain = isDarkMode ? '#f1f5f9' : '#1a202c';
  const textSub = isDarkMode ? '#64748b' : '#6b7280';
  const tabBg = isDarkMode ? '#1e2433' : '#ffffff';
  const tabBorder = isDarkMode ? '#2d3748' : '#e8ecf0';
  const activeBg = 'linear-gradient(135deg, #0066cc, #004da6)';

  // Count per status from allBookings
  const counts: Record<string, number> = {
    all: allBookings.length,
    draft: allBookings.filter((b) => b.status === 'draft').length,
    confirmed: allBookings.filter((b) => b.status === 'confirmed').length,
    completed: allBookings.filter((b) => b.status === 'completed').length,
    cancel: allBookings.filter((b) => b.status === 'cancel').length,
  };

  return (
    <section
      className="w-full min-h-screen px-4 sm:px-6 lg:px-8 pt-10 pb-16"
      style={{ backgroundColor: isDarkMode ? '#111827' : '#f0f4f8' }}
    >
      <div className="max-w-4xl mx-auto">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: textMain }}>
              การจองของฉัน
            </h2>
            <p className="text-sm" style={{ color: textSub }}>
              {allBookings.length} รายการทั้งหมด
            </p>
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80 active:scale-95 disabled:opacity-40"
            style={{ background: isDarkMode ? '#1e2433' : '#ffffff', color: '#0066cc', border: `1px solid ${tabBorder}` }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            รีเฟรช
          </button>
        </div>

        {/* Filter Tabs */}
        <div
          className="flex gap-1 p-1 rounded-2xl mb-6 overflow-x-auto"
          style={{ background: tabBg, border: `1px solid ${tabBorder}` }}
        >
          {FILTER_TABS.map((tab) => {
            const isActive = filter === tab.value;
            const count = counts[tab.value];
            return (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0"
                style={{
                  background: isActive ? activeBg : 'transparent',
                  color: isActive ? '#ffffff' : textSub,
                  boxShadow: isActive ? '0 2px 8px rgba(0,102,204,0.35)' : 'none',
                }}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className="w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.25)' : (isDarkMode ? '#374151' : '#f3f4f6'),
                      color: isActive ? '#fff' : textSub,
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-sm" style={{ color: textSub }}>กำลังโหลดข้อมูลการจอง...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl p-6 text-center" style={{ background: '#fee2e2', border: '1px solid #fca5a5' }}>
            <p className="text-sm font-semibold text-red-700">เกิดข้อผิดพลาด: {error}</p>
            <button
              onClick={refetch}
              className="mt-3 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #0066cc, #004da6)' }}
            >
              ลองใหม่
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState isDarkMode={isDarkMode} />
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((booking) => (
              <BookingCard key={booking.booking_detail_id} booking={booking} isDarkMode={isDarkMode} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
