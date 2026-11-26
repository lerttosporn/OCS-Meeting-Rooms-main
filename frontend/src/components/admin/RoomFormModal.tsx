import { useState } from 'react';
import { X } from 'lucide-react';
import { Room, RoomType, RoomStatus } from './AdminDashboard';

interface RoomFormModalProps {
  room: Room | null;
  onClose: () => void;
  onSave: (data: Omit<Room, 'id'>) => void;
}

export function RoomFormModal({ room, onClose, onSave }: RoomFormModalProps) {
  const [form, setForm] = useState<Omit<Room, 'id'>>({
    name: room?.name || '',
    type: room?.type || 'seminar',
    capacity: room?.capacity || 20,
    fee: room?.fee || 1000,
    status: room?.status || 'available',
    isActive: room?.isActive ?? true,
    technicalIssue: room?.technicalIssue || null,
    floor: room?.floor || '1',
    equipment: room?.equipment || [],
  });


  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal admin-modal-lg" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{room ? 'แก้ไขห้อง' : 'เพิ่มห้องใหม่'}</h3>
          <button className="admin-modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="admin-modal-body">
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label>ชื่อห้อง</label>
              <input className="admin-setting-input" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="admin-form-group">
              <label>ชั้น</label>
              <input className="admin-setting-input" value={form.floor}
                onChange={e => setForm(f => ({ ...f, floor: e.target.value }))} />
            </div>
            <div className="admin-form-group">
              <label>ประเภทห้อง</label>
              <select className="admin-select-full" value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value as RoomType }))}>
                <option value="seminar">ห้องสัมมนา</option>
                <option value="computer">ห้องคอมพิวเตอร์</option>
                <option value="distance_learning">ห้องสอนทางไกล</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>
                สถานะการใช้งาน
                {room && (
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 400 }}>
                    (ไม่สามารถแก้ไขได้จากหน้านี้)
                  </span>
                )}
              </label>
              <select
                className="admin-select-full"
                value={form.status}
                disabled={!!room}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as RoomStatus }))}
                style={room ? { opacity: 0.6, cursor: 'not-allowed', background: '#f1f5f9' } : undefined}
              >
                <option value="available">ว่าง</option>
                <option value="reserved">กำลังใช้งาน / จองแล้ว</option>
                <option value="maintenance">ซ่อมบำรุง</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>ความจุ (คน)</label>
              <input className="admin-setting-input" type="number" value={form.capacity}
                onChange={e => setForm(f => ({ ...f, capacity: +e.target.value }))} />
            </div>
            <div className="admin-form-group">
              <label>ค่าธรรมเนียม (บาท/ชั่วโมง)</label>
              <input className="admin-setting-input" type="number" value={form.fee}
                onChange={e => setForm(f => ({ ...f, fee: +e.target.value }))} />
            </div>
          </div>

          <div className="admin-modal-actions" style={{ marginTop: '1.5rem' }}>
            <button className="admin-btn-primary" onClick={() => onSave(form)}>
              {room ? 'บันทึกการแก้ไข' : 'เพิ่มห้อง'}
            </button>
            <button className="admin-btn-outline" onClick={onClose}>ยกเลิก</button>
          </div>
        </div>
      </div>
    </div>
  );
}
