import { useState, useEffect, Fragment, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertTriangle, Search, Plus, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, Edit2, Trash2, Wrench, X, Building2,
  Calendar, Clock, Briefcase, User
} from 'lucide-react';
import { RoomType, RoomStatus, AdminSection } from './AdminDashboard';
import { RoomTypeBadge, StatusBadge } from './badges';
import { RoomFormModal } from './RoomFormModal';
import { useRoomManagement } from '../../hooks/useRoomManagement';
import { useMonthlyBookings } from '../../hooks/useMonthlyBookings';

export const roomsNavItem = {
  id: 'rooms' as AdminSection,
  label: 'Room Management',
  desc: 'จัดการห้องและสถานะ',
  icon: Building2,
  color: '#10b981',
};

interface RoomManagementTabProps {
  isTechnician: boolean;
}

export function RoomManagementTab({ isTechnician }: RoomManagementTabProps) {
  const {
    rooms,
    roomsLoading,
    filteredRooms,
    paginatedRooms,
    totalPages,
    ITEMS_PER_PAGE,
    roomSearch,
    setRoomSearch,
    roomTypeFilter,
    setRoomTypeFilter,
    roomStatusFilter,
    setRoomStatusFilter,
    currentPage,
    setCurrentPage,
    showRoomModal,
    editingRoom,
    openAddModal,
    openEditModal,
    closeRoomModal,
    showTechAlert,
    setShowTechAlert,
    expandedRows,
    toggleExpandRow,
    toggleRoomStatus,
    handleSaveRoom,
    handleDeleteRoom,
    handleReportMaintenance,
  } = useRoomManagement();

  // Live Rooms State
  const monthInputRef = useRef<HTMLInputElement>(null);
  const formatMonthThai = (ym: string) => {
    if (!ym) return '';
    const [y, m] = ym.split('-');
    const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return `${thaiMonths[parseInt(m, 10) - 1]} ${y}`;
  };

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${yyyy}-${mm}`;
  });
  const { bookings: monthlyBookings } = useMonthlyBookings(selectedMonth, 'confirmed');
  const [liveRooms, setLiveRooms] = useState<any[]>([]);
  const [isLoadingLiveRooms, setIsLoadingLiveRooms] = useState(true);
  const [selectedLiveRoom, setSelectedLiveRoom] = useState<any>(null);

  useEffect(() => {
    const fetchLiveRooms = async () => {
      try {
        setIsLoadingLiveRooms(true);
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        const determineStatus = (r: any) => {
          if (!r.start_date || !r.end_date || !r.start_time || !r.end_time) return 'reserved';
          
          const rStartDate = new Date(r.start_date).toLocaleDateString('en-CA');
          const rEndDate = new Date(r.end_date).toLocaleDateString('en-CA');
          
          // If the booking's end date has passed, or it ends today but the time has passed
          if (rEndDate < currentDate) return 'ended';
          if (rEndDate === currentDate && r.end_time < currentTime) return 'ended';

          // If the booking hasn't started yet (future date, or today but future time)
          if (rStartDate > currentDate) return 'reserved';
          if (rStartDate === currentDate && r.start_time > currentTime) return 'reserved';

          // Otherwise, it has started and hasn't ended -> it's in_use
          return 'in_use';
        };

        const formatDateThai = (dateString: string) => {
          if (!dateString) return '';
          const d = new Date(dateString);
          const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
          return `${d.getDate()} ${thaiMonths[d.getMonth()]} ${d.getFullYear()}`;
        };

        const allRooms = monthlyBookings
          .filter((r: any) => {
            if (determineStatus(r) === 'ended') return false;
            const rDate = r.start_date ? new Date(r.start_date).toLocaleDateString('en-CA') : '';
            return rDate.startsWith(selectedMonth);
          })
          .map((r: any) => ({
            room: `${r.room_name} (${r.room_type_id === 1 ? 'Seminar Room' : r.room_type_id === 2 ? 'Computer Room' : 'Tele-Conference'})`,
            floor: `ชั้น ${r.floor || '-'}`,
            status: determineStatus(r),
            event: r.topic || 'ไม่มีระบุหัวข้อ',
            organizer: r.organization || r.customer_name || 'ไม่ระบุ',
            time: `${r.start_time?.substring(0, 5)} - ${r.end_time?.substring(0, 5)}`,
            date: r.start_date === r.end_date 
              ? formatDateThai(r.start_date)
              : `${formatDateThai(r.start_date)} - ${formatDateThai(r.end_date)}`,
          }));

        setLiveRooms(allRooms);
      } catch (err) {
        console.error("Failed to fetch live rooms:", err);
      } finally {
        setIsLoadingLiveRooms(false);
      }
    };
    fetchLiveRooms();
  }, [monthlyBookings]);

  return (
    <div className="admin-section">
      {/* Tech Alert Issues Banner */}
      {rooms.filter(r => r.technicalIssue).length > 0 && (
        <div className="admin-tech-alert-banner">
          <AlertTriangle size={18} />
          <span>มี {rooms.filter(r => r.technicalIssue).length} ห้องที่แจ้งปัญหาทางเทคนิค</span>
          <button className="admin-btn-outline-sm" onClick={() => setRoomStatusFilter('maintenance')}>
            ดูรายละเอียด
          </button>
        </div>
      )}

      {/* Toolbar + Table card */}
      <div className="admin-card">
        <div className="admin-toolbar">
          {/* Search */}
          <div className="admin-search-wrap">
            <Search size={16} className="admin-search-icon" />
            <input
              className="admin-search-input"
              placeholder="ค้นหาห้อง..."
              value={roomSearch}
              onChange={e => setRoomSearch(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="admin-filters">
            <select
              className="admin-select"
              value={roomTypeFilter}
              onChange={e => setRoomTypeFilter(e.target.value as RoomType | 'all')}
            >
              <option value="all">ทุกประเภท</option>
              <option value="seminar">ห้องสัมมนา</option>
              <option value="computer">ห้องคอมพิวเตอร์</option>
              <option value="distance_learning">ห้องสอนทางไกล</option>
            </select>

            <select
              className="admin-select"
              value={roomStatusFilter}
              onChange={e => setRoomStatusFilter(e.target.value as RoomStatus | 'all')}
            >
              <option value="all">ทุกสถานะ</option>
              <option value="available">ว่าง</option>
              <option value="reserved">กำลังใช้งาน / จองแล้ว</option>
              <option value="maintenance">ซ่อมบำรุง</option>
            </select>
          </div>

          {/* Add button */}
          {!isTechnician && (
            <button className="admin-btn-primary" onClick={openAddModal}>
              <Plus size={16} />
              เพิ่มห้องใหม่
            </button>
          )}
        </div>

        {/* Table */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 40 }} />
                <th>ชื่อห้อง</th>
                <th>ประเภท</th>
                <th>ความจุ</th>
                <th>ค่าธรรมเนียม</th>
                <th>สถานะ</th>
                <th>เปิด/ปิด</th>
                <th>ปัญหา</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {roomsLoading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    <div style={{
                      display: 'inline-block', width: 24, height: 24,
                      border: '3px solid #e2e8f0', borderTop: '3px solid #10b981',
                      borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '0.5rem',
                    }} />
                    <div>กำลังโหลดข้อมูลห้อง...</div>
                  </td>
                </tr>
              ) : paginatedRooms.length === 0 ? (
                <tr>
                  <td colSpan={9} className="admin-empty-row">ไม่พบห้องที่ตรงกับเงื่อนไข</td>
                </tr>
              ) : (
                paginatedRooms.map(room => (
                  <Fragment key={room.id}>
                    {/* Main row */}
                    <tr className={expandedRows.has(room.id) ? 'admin-row-expanded' : ''}>
                      <td>
                        <button className="admin-expand-btn" onClick={() => toggleExpandRow(room.id)}>
                          {expandedRows.has(room.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </td>
                      <td>
                        <div className="admin-room-cell">
                          <span className="admin-room-name">{room.name}</span>
                          <span className="admin-floor-tag">ชั้น {room.floor}</span>
                        </div>
                      </td>
                      <td><RoomTypeBadge type={room.type} /></td>
                      <td><span className="admin-capacity">{room.capacity} คน</span></td>
                      <td><span className="admin-fee">฿{room.fee.toLocaleString()}</span></td>
                      <td><StatusBadge status={room.status} /></td>
                      <td>
                        <button
                          className={`admin-toggle ${room.isActive ? 'active' : ''}`}
                          onClick={() => !isTechnician && toggleRoomStatus(room.id)}
                          disabled={isTechnician}
                          title={room.isActive ? 'คลิกเพื่อปิดห้อง' : 'คลิกเพื่อเปิดห้อง'}
                        >
                          <span className="admin-toggle-thumb" />
                        </button>
                      </td>
                      <td>
                        {room.technicalIssue ? (
                          <button className="admin-issue-btn" onClick={() => setShowTechAlert(room.id)}>
                            <AlertTriangle size={13} />
                            ดูปัญหา
                          </button>
                        ) : (
                          <span className="admin-no-issue">ปกติ</span>
                        )}
                      </td>
                      <td>
                        <div className="admin-action-btns">
                          {!isTechnician && (
                            <>
                              {/* Edit */}
                              <button
                                className="admin-action-btn edit"
                                title="แก้ไข"
                                onClick={() => openEditModal(room)}
                              >
                                <Edit2 size={14} />
                              </button>
                              {/* Delete */}
                              <button
                                className="admin-action-btn delete"
                                title="ลบห้อง"
                                onClick={() => handleDeleteRoom(room.id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                          {/* Maintenance */}
                          <button
                            className="admin-action-btn wrench"
                            title="แจ้งซ่อม"
                            onClick={() => setShowTechAlert(room.id)}
                          >
                            <Wrench size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {expandedRows.has(room.id) && (
                      <tr className="admin-row-detail">
                        <td colSpan={9}>
                          <div className="admin-row-detail-content">
                            {room.technicalIssue && (
                              <div>
                                <p className="admin-detail-label">ปัญหาที่พบ</p>
                                <p className="admin-issue-text">{room.technicalIssue}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="admin-pagination">
            <span className="admin-pagination-info">
              แสดง {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredRooms.length)} จาก {filteredRooms.length} ห้อง
            </span>
            <div className="admin-pagination-btns">
              <button className="admin-page-btn" disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}>
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`admin-page-btn ${p === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(p)}>{p}</button>
              ))}
              <button className="admin-page-btn" disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tech Alert Modal */}
      {showTechAlert !== null && (() => {
        const room = rooms.find(r => r.id === showTechAlert);
        if (!room) return null;
        return (
          <div className="admin-modal-overlay" onClick={() => setShowTechAlert(null)}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
              <div className="admin-modal-header">
                <div className="admin-modal-title-row">
                  <AlertTriangle size={20} style={{ color: '#f59e0b' }} />
                  <h3>ปัญหาทางเทคนิค — {room.name}</h3>
                </div>
                <button className="admin-modal-close" onClick={() => setShowTechAlert(null)}>
                  <X size={18} />
                </button>
              </div>
              <div className="admin-modal-body">
                {room.technicalIssue ? (
                  <div className="admin-issue-detail">
                    <p className="admin-issue-label">ปัญหาที่พบ:</p>
                    <p className="admin-issue-desc">{room.technicalIssue}</p>
                  </div>
                ) : (
                  <p className="admin-no-issue-text">ยังไม่มีปัญหาที่รายงาน</p>
                )}
                <div className="admin-modal-actions">
                  <button className="admin-btn-danger" onClick={() => {
                    handleReportMaintenance(room.id);
                    setShowTechAlert(null);
                  }}>
                    <Wrench size={15} />
                    แจ้งซ่อมบำรุง
                  </button>
                  <button className="admin-btn-outline" onClick={() => setShowTechAlert(null)}>
                    ปิด
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Live Rooms Section */}
      <div className="admin-card mt-6" style={{ marginTop: '1.5rem' }}>
        <div className="admin-toolbar" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
            สถานะห้องรายเดือน
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', position: 'relative', background: '#f8fafc', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
              onClick={() => {
                if (monthInputRef.current) {
                  try { monthInputRef.current.showPicker(); } catch (e) { monthInputRef.current.focus(); }
                }
              }}
            >
              <Calendar size={16} color="#64748b" />
              <span style={{ color: '#334155', fontWeight: 600, fontSize: '0.9rem' }}>
                {formatMonthThai(selectedMonth)}
              </span>
              <input
                ref={monthInputRef}
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{ position: 'absolute', opacity: 0, width: '0', height: '0', pointerEvents: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[{ label: 'กำลังใช้งาน', color: '#10b981' }, { label: 'จองแล้ว', color: '#f59e0b' }].map((status, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: status.color, display: 'inline-block' }} />
                  <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>{status.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
          padding: '0.5rem'
        }}>
          {isLoadingLiveRooms ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', gridColumn: '1 / -1' }}>กำลังโหลดข้อมูลห้อง...</div>
          ) : liveRooms.length > 0 ? liveRooms.map((r, idx) => {
            const statusColor = r.status === 'in_use' ? '#10b981' : '#f59e0b';
            const statusBg = r.status === 'in_use' ? '#d1fae5' : '#fef3c7';
            const statusLabel = r.status === 'in_use' ? 'กำลังใช้งาน' : 'จองแล้ว';
            return (
              <div key={idx} style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
                padding: '1rem',
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
                transition: 'all 0.2s',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
                onClick={() => setSelectedLiveRoom(r)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div>
                    <p style={{ color: '#0f172a', fontWeight: 700, fontSize: '1rem', margin: 0 }}>{r.room}</p>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0.15rem 0 0' }}>{r.floor}</p>
                  </div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    background: statusBg,
                    border: `1px solid ${statusColor}40`,
                    borderRadius: '999px', padding: '0.2rem 0.6rem',
                    flexShrink: 0,
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor, display: 'inline-block' }} />
                    <span style={{ color: statusColor, fontSize: '0.7rem', fontWeight: 600 }}>{statusLabel}</span>
                  </div>
                </div>

                <div style={{
                  background: '#f8fafc', borderRadius: '0.5rem',
                  padding: '0.6rem 0.75rem', borderLeft: `3px solid ${statusColor}`
                }}>
                  <p style={{ color: '#334155', fontWeight: 600, fontSize: '0.85rem', margin: '0 0 0.3rem' }}>{r.event}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={12} color="#64748b" />
                    <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{r.time}</span>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', gridColumn: '1 / -1' }}>ไม่มีรายการในเดือนนี้</div>
          )}
        </div>
      </div>

      {/* Live Room Details Modal for Admin */}
      {selectedLiveRoom && createPortal(
        <div className="admin-modal-overlay" onClick={() => setSelectedLiveRoom(null)} style={{ zIndex: 10000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', width: '100%', background: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div className="admin-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div className="admin-modal-title-row" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={20} style={{ color: '#3b82f6' }} />
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>รายละเอียดการใช้งาน</h3>
              </div>
              <button className="admin-modal-close" onClick={() => setSelectedLiveRoom(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>
            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', alignSelf: 'flex-start', padding: '0.3rem 0.75rem', borderRadius: '999px', background: selectedLiveRoom.status === 'in_use' ? '#d1fae5' : '#fef3c7', border: `1px solid ${selectedLiveRoom.status === 'in_use' ? '#10b98140' : '#f59e0b40'}` }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: selectedLiveRoom.status === 'in_use' ? '#10b981' : '#f59e0b' }} />
                <span style={{ color: selectedLiveRoom.status === 'in_use' ? '#10b981' : '#f59e0b', fontSize: '0.8rem', fontWeight: 600 }}>{selectedLiveRoom.status === 'in_use' ? 'กำลังใช้งาน' : 'จองแล้ว'}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ background: '#eff6ff', padding: '0.5rem', borderRadius: '0.5rem' }}>
                  <Briefcase size={16} color="#3b82f6" />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.1rem 0' }}>หัวข้อ / โครงการ</p>
                  <p style={{ fontWeight: 500, color: '#0f172a', margin: 0 }}>{selectedLiveRoom.event}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ background: '#f5f3ff', padding: '0.5rem', borderRadius: '0.5rem' }}>
                  <Building2 size={16} color="#8b5cf6" />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.1rem 0' }}>ห้องและชั้น</p>
                  <p style={{ fontWeight: 500, color: '#0f172a', margin: 0 }}>{selectedLiveRoom.room}</p>
                  <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0.1rem 0 0 0' }}>{selectedLiveRoom.floor}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ background: '#fff7ed', padding: '0.5rem', borderRadius: '0.5rem' }}>
                  <Clock size={16} color="#ea580c" />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.1rem 0' }}>วันและเวลา</p>
                  <p style={{ fontWeight: 500, color: '#0f172a', margin: 0 }}>{selectedLiveRoom.date} <span style={{ color: '#cbd5e1', margin: '0 0.3rem' }}>·</span> {selectedLiveRoom.time}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ background: '#f0fdf4', padding: '0.5rem', borderRadius: '0.5rem' }}>
                  <User size={16} color="#16a34a" />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.1rem 0' }}>หน่วยงาน / ผู้จัด</p>
                  <p style={{ fontWeight: 500, color: '#0f172a', margin: 0 }}>{selectedLiveRoom.organizer}</p>
                </div>
              </div>
            </div>
            <div className="admin-modal-actions" style={{ marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="admin-btn-outline" onClick={() => setSelectedLiveRoom(null)} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 500 }}>
                ปิด
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Add / Edit Room Modal */}
      {showRoomModal && (
        <RoomFormModal
          room={editingRoom}
          onClose={closeRoomModal}
          onSave={handleSaveRoom}
        />
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
