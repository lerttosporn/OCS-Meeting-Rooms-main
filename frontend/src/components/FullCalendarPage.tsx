import React, { useState, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, X, ArrowLeft, Calendar,
  Clock, Building2, Users, Briefcase, Filter, RefreshCw
} from 'lucide-react';
import { useMonthlyBookings } from '../hooks/useMonthlyBookings';

interface FullCalendarPageProps {
  isDarkMode: boolean;
  onBack: () => void;
}

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];
const WEEKDAYS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

// Color tokens
const C = {
  bg: '#f0f4ff',
  surface: '#ffffff',
  surfaceHover: '#f8faff',
  border: '#dde6f8',
  borderStrong: '#b6caf5',
  navy: '#1e3a7a',
  navyLight: '#2d52a8',
  blue: '#3b82f6',
  blueSoft: '#eff4ff',
  text: '#1e2e52',
  textSub: '#6074a0',
  textMuted: '#9aaacb',
  green: '#16a34a',
  greenBg: '#dcfce7',
  red: '#dc2626',
  redBg: '#fee2e2',
  todayBg: '#dbeafe',
  selectedBg: '#bfdbfe',
};

export function FullCalendarPage({ isDarkMode, onBack }: FullCalendarPageProps) {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr);
  const [filterRoomType, setFilterRoomType] = useState('all');
  const [filterFloor, setFilterFloor] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const yearMonthStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
  const { bookings, loading, refetch } = useMonthlyBookings(yearMonthStr, 'confirmed');
  const currentTime = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;

  // All floors that exist in the system (from room data)
  const availableFloors = ['3', '4', '5', '8', '9'];

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (filterRoomType !== 'all' && String(b.room_type_id) !== filterRoomType) return false;
      if (filterFloor !== 'all' && String(b.floor) !== filterFloor) return false;
      
      // แปลงวันที่ให้อยู่ใน Timezone ของผู้ใช้ (Local) เป็น YYYY-MM-DD
      const localDate = b.start_date ? new Date(b.start_date).toLocaleDateString('en-CA') : '';
      
      // แสดงเฉพาะรายการของเดือนที่กำลังดูอยู่ (กรองตาม yearMonthStr)
      if (localDate && !localDate.startsWith(yearMonthStr)) return false;

      return true;
    });
  }, [bookings, filterRoomType, filterFloor, yearMonthStr]);

  const bookingsByDate = useMemo(() => {
    const map: Record<string, typeof bookings> = {};
    filteredBookings.forEach(b => {
      const dateKey = b.start_date ? new Date(b.start_date).toLocaleDateString('en-CA') : '';
      if (!dateKey) return;
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(b);
    });
    return map;
  }, [filteredBookings]);

  const getBookingStatus = (b: any) => {
    const bDate = b.start_date ? new Date(b.start_date).toLocaleDateString('en-CA') : '';
    if (bDate < todayStr) return 'ended';
    if (bDate === todayStr && b.end_time < currentTime) return 'ended';
    if (bDate === todayStr && b.start_time <= currentTime && b.end_time >= currentTime) return 'in_use';
    return 'reserved';
  };

  const getDotColor = (dateStr: string): 'green' | 'red' | 'none' => {
    const entries = bookingsByDate[dateStr];
    if (!entries || entries.length === 0) return 'none';
    const hasInUse = entries.some(b => getBookingStatus(b) === 'in_use');
    return hasInUse ? 'green' : 'red';
  };

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
  const calendarCells: { day: number; month: 'prev' | 'curr' | 'next'; dateStr: string }[] = [];

  for (let i = 0; i < firstDay; i++) {
    const d = daysInPrev - firstDay + 1 + i;
    const pm = viewMonth === 0 ? 12 : viewMonth;
    const py = viewMonth === 0 ? viewYear - 1 : viewYear;
    calendarCells.push({ day: d, month: 'prev', dateStr: `${py}-${String(pm).padStart(2, '0')}-${String(d).padStart(2, '0')}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({ day: d, month: 'curr', dateStr: `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}` });
  }
  const remaining = 42 - calendarCells.length;
  for (let d = 1; d <= remaining; d++) {
    const nm = viewMonth === 11 ? 1 : viewMonth + 2;
    const ny = viewMonth === 11 ? viewYear + 1 : viewYear;
    calendarCells.push({ day: d, month: 'next', dateStr: `${ny}-${String(nm).padStart(2, '0')}-${String(d).padStart(2, '0')}` });
  }

  const displayedBookings = selectedDate ? (bookingsByDate[selectedDate] || []) : filteredBookings;

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(v => v - 1); }
    else setViewMonth(m => m - 1);
  };
  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(v => v + 1); }
    else setViewMonth(m => m + 1);
  };
  const goToToday = () => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); setSelectedDate(todayStr); };

  const monthlySummary = useMemo(() => {
    let booked = 0, inUse = 0, free = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      if (!bookingsByDate[ds]) { free++; continue; }
      const hasInUse = bookingsByDate[ds].some(b => getBookingStatus(b) === 'in_use');
      if (hasInUse) inUse++; else booked++;
    }
    return { booked, inUse, free };
  }, [bookingsByDate, daysInMonth, viewMonth, viewYear]);

  const formatDateThai = (ds: string) => {
    if (!ds) return '';
    const [y, m, d] = ds.split('-');
    return `${parseInt(d)} ${THAI_MONTHS[parseInt(m) - 1]} ${y}`;
  };

  const roomTypeName = (id?: number) => {
    if (id === 1) return 'Seminar Room';
    if (id === 2) return 'Computer Room';
    if (id === 3) return 'Tele-Conference';
    return 'ห้องประชุม';
  };

  // Shared select style
  const selectStyle: React.CSSProperties = {
    background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: '0.6rem', padding: '0.4rem 0.75rem', color: C.text,
    fontSize: '0.85rem', cursor: 'pointer', outline: 'none',
    boxShadow: '0 1px 3px rgba(30,58,122,0.07)',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(160deg, #e8efff 0%, #f5f8ff 40%, #edf3ff 100%)`,
      color: C.text,
      fontFamily: "'Noto Sans Thai', 'Inter', sans-serif",
      overflowX: 'hidden',
    }}>
      <style>{`
        @keyframes calPopIn {
          0% { opacity: 0; transform: scale(0.97) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes todayPulse {
          0%, 100% { box-shadow: 0 0 0 2px #3b82f6, 0 0 14px rgba(59,130,246,0.35); }
          50%       { box-shadow: 0 0 0 3px #3b82f6, 0 0 24px rgba(59,130,246,0.55); }
        }
        .cal-cell { transition: background 0.15s, transform 0.15s; }
        .cal-cell:hover { background: #dbeafe !important; transform: scale(1.04); z-index: 1; }
        .cal-cell.is-selected { background: ${C.selectedBg} !important; }
        .cal-cell.is-today { animation: todayPulse 2.8s ease-in-out infinite; border-radius: 10px; }
        .filter-select:focus { border-color: ${C.blue} !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
        .btn-ghost { transition: all 0.18s; }
        .btn-ghost:hover { background: ${C.blueSoft} !important; color: ${C.navyLight} !important; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 99px; }
      `}</style>

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '1.75rem 1.25rem 5rem' }}>

        {/* ── Page Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="btn-ghost"
              onClick={onBack}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.45rem',
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: '0.75rem', padding: '0.5rem 1rem',
                color: C.textSub, cursor: 'pointer', fontSize: '0.875rem',
                boxShadow: '0 1px 4px rgba(30,58,122,0.08)',
              }}
            >
              <ArrowLeft size={16} /> กลับหน้าหลัก
            </button>
            <div>
              <h1 style={{ fontSize: '1.7rem', fontWeight: 800, margin: 0, color: C.navy, letterSpacing: '-0.025em' }}>
                ปฏิทินการจองห้อง
              </h1>
              <p style={{ color: C.textSub, fontSize: '0.83rem', margin: '0.15rem 0 0' }}>
                ดูสถานะการจองห้องทั้งหมดแบบรายวัน
              </p>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { label: 'กำลังใช้งาน', color: C.green, bg: C.greenBg },
              { label: 'ห้องเต็ม', color: C.red, bg: C.redBg },
              { label: 'ไม่มีการจอง', color: C.textMuted, bg: '#f1f5f9' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                <span style={{ color: C.textSub, fontSize: '0.8rem', fontWeight: 500 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '1.25rem', padding: '1rem 1.5rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap',
          boxShadow: '0 2px 12px rgba(30,58,122,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: C.navyLight, fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.15rem', minWidth: '70px' }}>
            <Filter size={15} /> ตัวกรอง
          </div>

          {[
            {
              label: 'ประเภทห้อง', value: filterRoomType, onChange: setFilterRoomType,
              options: [{ v: 'all', l: 'ทั้งหมด' }, { v: '1', l: 'Seminar Room' }, { v: '2', l: 'Computer Room' }, { v: '3', l: 'Tele-Conference' }]
            },
            {
              label: 'อาคาร / ชั้น', value: filterFloor, onChange: setFilterFloor,
              options: [{ v: 'all', l: 'ทั้งหมด' }, ...availableFloors.map(f => ({ v: f, l: `ชั้น ${f}` }))]
            },
            {
              label: 'สถานะการจอง', value: filterStatus, onChange: setFilterStatus,
              options: [{ v: 'all', l: 'ทั้งหมด' }, { v: 'in_use', l: 'กำลังใช้งาน' }, { v: 'reserved', l: 'จองแล้ว' }]
            },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', minWidth: '150px' }}>
              <label style={{ fontSize: '0.7rem', color: C.textSub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.label}</label>
              <select className="filter-select" value={f.value} onChange={e => f.onChange(e.target.value)} style={selectStyle}>
                {f.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          ))}

          <button
            onClick={refetch}
            style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: C.blueSoft, border: `1px solid ${C.borderStrong}`,
              borderRadius: '0.65rem', padding: '0.5rem 1rem',
              color: C.navyLight, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#dbeafe'; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.blueSoft; }}
          >
            <RefreshCw size={14} /> รีเฟรช
          </button>
        </div>

        {/* ── Main Layout ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 370px', gap: '1.5rem', alignItems: 'start' }}>

          {/* ── Calendar Card ── */}
          <div style={{
            background: C.surface, borderRadius: '1.5rem',
            border: `1px solid ${C.border}`, overflow: 'hidden',
            boxShadow: '0 4px 32px rgba(30,58,122,0.1)',
            animation: 'calPopIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            {/* Nav */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1.1rem 1.5rem', borderBottom: `1px solid ${C.border}`,
              background: 'linear-gradient(90deg, #f0f6ff 0%, #f8faff 100%)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {[{ fn: goToPrevMonth, Icon: ChevronLeft }, { fn: goToNextMonth, Icon: ChevronRight }].map(({ fn, Icon }, i) => (
                  i === 0 ? (
                    <button key={i} onClick={fn} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '0.6rem', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.navyLight, transition: 'all 0.15s', boxShadow: '0 1px 4px rgba(30,58,122,0.07)' }}
                      onMouseEnter={e => e.currentTarget.style.background = C.blueSoft}
                      onMouseLeave={e => e.currentTarget.style.background = C.surface}
                    ><Icon size={18} /></button>
                  ) : (
                    <>
                      <h2 key="h" style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, minWidth: '200px', textAlign: 'center', color: C.navy }}>
                        {THAI_MONTHS[viewMonth]} {viewYear}
                      </h2>
                      <button key={i} onClick={fn} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '0.6rem', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.navyLight, transition: 'all 0.15s', boxShadow: '0 1px 4px rgba(30,58,122,0.07)' }}
                        onMouseEnter={e => e.currentTarget.style.background = C.blueSoft}
                        onMouseLeave={e => e.currentTarget.style.background = C.surface}
                      ><Icon size={18} /></button>
                    </>
                  )
                ))}
              </div>
              <button onClick={goToToday} style={{ background: C.blue, border: 'none', borderRadius: '0.65rem', padding: '0.4rem 1.1rem', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(59,130,246,0.35)', transition: 'all 0.18s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >วันนี้</button>
            </div>

            {/* Weekday headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#f8faff', borderBottom: `1px solid ${C.border}` }}>
              {WEEKDAYS.map((d, i) => (
                <div key={i} style={{
                  textAlign: 'center', padding: '0.6rem 0', fontSize: '0.75rem', fontWeight: 700,
                  color: i === 0 ? C.red : i === 6 ? C.blue : C.textSub,
                  borderRight: i < 6 ? `1px solid ${C.border}` : 'none',
                }}>{d}</div>
              ))}
            </div>

            {/* Grid */}
            {loading ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: C.textMuted }}>
                <div style={{ fontSize: '1rem' }}>กำลังโหลดข้อมูล...</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {calendarCells.map((cell, idx) => {
                  const isCurr = cell.month === 'curr';
                  const isToday = cell.dateStr === todayStr;
                  const isSelected = cell.dateStr === selectedDate;
                  const dotColor = getDotColor(cell.dateStr);
                  const bookingCount = bookingsByDate[cell.dateStr]?.length || 0;

                  let bg = 'transparent';
                  if (isSelected) bg = C.selectedBg;
                  else if (isToday) bg = C.todayBg;

                  return (
                    <div
                      key={idx}
                      className={`cal-cell${isToday ? ' is-today' : ''}${isSelected ? ' is-selected' : ''}`}
                      onClick={() => isCurr && setSelectedDate(cell.dateStr)}
                      style={{
                        padding: '0.55rem 0.35rem',
                        minHeight: '76px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'flex-start', gap: '0.3rem',
                        background: bg,
                        borderRight: (idx + 1) % 7 !== 0 ? `1px solid ${C.border}` : 'none',
                        borderBottom: idx < 35 ? `1px solid ${C.border}` : 'none',
                        cursor: isCurr ? 'pointer' : 'default',
                        opacity: isCurr ? 1 : 0.35,
                        position: 'relative',
                      }}
                    >
                      <span style={{
                        fontSize: '0.88rem',
                        fontWeight: isToday ? 800 : isCurr ? 600 : 400,
                        color: isToday ? C.blue : isCurr ? C.navy : C.textMuted,
                        lineHeight: 1,
                      }}>{cell.day}</span>

                      {/* Dots */}
                      {isCurr && (
                        <div style={{ display: 'flex', gap: '3px', justifyContent: 'center' }}>
                          {dotColor === 'green' && (
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.green, display: 'inline-block' }} />
                          )}
                          {dotColor === 'red' && (
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.red, display: 'inline-block' }} />
                          )}
                          {dotColor === 'none' && (
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.textMuted, opacity: 0.35, display: 'inline-block' }} />
                          )}
                        </div>
                      )}

                      {/* Count badge */}
                      {isCurr && bookingCount > 1 && (
                        <span style={{
                          fontSize: '0.6rem', fontWeight: 700,
                          background: dotColor === 'green' ? C.greenBg : C.redBg,
                          color: dotColor === 'green' ? C.green : C.red,
                          padding: '0.05rem 0.35rem', borderRadius: '999px',
                        }}>
                          {bookingCount} รายการ
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Side Panel ── */}
          <div style={{ animation: 'calPopIn 0.32s cubic-bezier(0.16, 1, 0.3, 1)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Booking list */}
            <div style={{ background: C.surface, borderRadius: '1.5rem', border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 4px 24px rgba(30,58,122,0.09)' }}>
              <div style={{
                padding: '1rem 1.25rem', borderBottom: `1px solid ${C.border}`,
                background: 'linear-gradient(90deg, #f0f6ff 0%, #f8faff 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                    {selectedDate ? 'รายการจองวันที่' : 'รายการจองเดือน'}
                  </p>
                  <p style={{ margin: '0.1rem 0 0', fontWeight: 800, fontSize: '1rem', color: C.navy }}>
                    {selectedDate ? formatDateThai(selectedDate) : `${THAI_MONTHS[viewMonth]} ${viewYear}`}
                  </p>
                </div>
                {selectedDate && (
                  <button onClick={() => setSelectedDate(null)} style={{ background: '#f1f5f9', border: `1px solid ${C.border}`, borderRadius: '0.5rem', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.textSub }}>
                    <X size={15} />
                  </button>
                )}
              </div>

                <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '0.75rem' }}>
                {displayedBookings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: C.textMuted }}>
                    <Calendar size={32} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                      {selectedDate ? 'ไม่มีการจองในวันนี้' : 'ไม่มีรายการในเดือนนี้'}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {displayedBookings
                        .filter(b => filterStatus === 'all' || getBookingStatus(b) === filterStatus)
                        .map((b, idx) => {
                          const st = getBookingStatus(b);
                          const isInUse = st === 'in_use';
                          const statusColor = isInUse ? C.green : C.red;
                          const statusBg = isInUse ? C.greenBg : C.redBg;
                          const statusLabel = isInUse ? 'กำลังใช้งาน' : 'จองแล้ว';
                          return (
                            <div key={idx} style={{
                              background: C.surfaceHover, borderRadius: '1rem',
                              padding: '0.9rem 1rem',
                              border: `1px solid ${isInUse ? '#bbf7d0' : '#fecaca'}`,
                              transition: 'box-shadow 0.18s, background 0.18s',
                            }}
                              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,58,122,0.1)'; e.currentTarget.style.background = '#fff'; }}
                              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = C.surfaceHover; }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.7rem', color: C.textSub, fontWeight: 600 }}>{roomTypeName(b.room_type_id)}</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: statusBg, color: statusColor, fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: '999px' }}>
                                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, display: 'inline-block' }} />
                                  {statusLabel}
                                </span>
                              </div>

                              <p style={{ margin: '0 0 0.45rem', fontWeight: 700, fontSize: '0.95rem', color: C.navy }}>{b.room_name || 'ห้องประชุม'}</p>

                              {b.topic && (
                                <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                                  <Briefcase size={13} color={C.textMuted} style={{ flexShrink: 0, marginTop: 2 }} />
                                  <span style={{ fontSize: '0.82rem', color: C.textSub, lineHeight: 1.4 }}>{b.topic}</span>
                                </div>
                              )}

                              <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                                <Clock size={13} color={C.textMuted} />
                                <span style={{ fontSize: '0.82rem', color: C.textSub }}>{b.start_time?.substring(0, 5)} – {b.end_time?.substring(0, 5)}</span>
                              </div>

                              {(b.organization || b.customer_name) && (
                                <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', marginBottom: '0.2rem' }}>
                                  <Users size={13} color={C.textMuted} />
                                  <span style={{ fontSize: '0.82rem', color: C.textSub }}>{b.organization || b.customer_name}</span>
                                </div>
                              )}

                              {b.floor && (
                                <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                                  <Building2 size={13} color={C.textMuted} />
                                  <span style={{ fontSize: '0.82rem', color: C.textSub }}>ชั้น {b.floor}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>

              {/* Monthly Summary */}
              <div style={{ background: C.surface, borderRadius: '1.5rem', border: `1px solid ${C.border}`, padding: '1.25rem', boxShadow: '0 2px 12px rgba(30,58,122,0.07)' }}>
                <p style={{ margin: '0 0 1rem', fontWeight: 700, fontSize: '0.9rem', color: C.navy }}>สรุปภาพรวมเดือนนี้</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {[
                    { label: 'กำลังใช้งาน', count: monthlySummary.inUse, color: C.green, bg: C.greenBg },
                    { label: 'ห้องเต็ม', count: monthlySummary.booked, color: C.red, bg: C.redBg },
                    { label: 'ไม่มีการจอง', count: monthlySummary.free, color: C.textMuted, bg: '#f1f5f9' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 38, height: 38, borderRadius: '0.7rem', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Calendar size={17} color={item.color} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem', color: item.color }}>{item.count} วัน</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: C.textSub }}>{item.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        {/* ── Summary cards (no date selected) ── */}
        {!selectedDate && (
          <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'กำลังใช้งาน', count: monthlySummary.inUse, color: C.green, bg: C.greenBg },
              { label: 'ห้องเต็ม', count: monthlySummary.booked, color: C.red, bg: C.redBg },
              { label: 'ไม่มีการจอง', count: monthlySummary.free, color: C.textMuted, bg: '#f1f5f9' },
            ].map((s, i) => (
              <div key={i} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: '1.25rem',
                padding: '1.4rem 1.25rem', textAlign: 'center',
                boxShadow: '0 2px 12px rgba(30,58,122,0.07)',
                animation: `calPopIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s both`,
                borderTop: `4px solid ${s.color}`,
              }}>
                <p style={{ margin: '0 0 0.3rem', fontSize: '2.25rem', fontWeight: 800, color: s.color }}>{s.count}</p>
                <p style={{ margin: 0, fontSize: '0.82rem', color: C.textSub, fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
