import React, { useState } from 'react';
import { X, Users, MapPin, Calendar, Clock, Monitor, Coffee, Car, Check, Lock } from 'lucide-react';
import { UserRole } from '../App';
import { MeetingRoom } from '../hooks/useRooms';
import { CartItem } from '../types/booking';
import { LoginPromptModal } from './LoginPromptModal';
import { useHolidays } from '../hooks/useHolidays';

interface BookingFormModalProps {
  room: MeetingRoom;
  isDarkMode: boolean;
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onBookNow: (item: Omit<CartItem, 'id'>) => void;
  initialDate?: string;
  userRole: UserRole;
  onGoToLogin: () => void;
}

const THAI_HOLIDAYS_2024_2025: string[] = [
  '2024-01-01','2024-02-24','2024-04-06','2024-04-13','2024-04-14','2024-04-15',
  '2024-05-01','2024-05-04','2024-05-22','2024-06-03','2024-07-20','2024-07-28',
  '2024-08-12','2024-10-13','2024-10-23','2024-12-05','2024-12-10','2024-12-31',
  '2025-01-01','2025-02-12','2025-04-06','2025-04-13','2025-04-14','2025-04-15',
  '2025-05-01','2025-05-05','2025-06-03','2025-07-10','2025-07-28','2025-08-12',
];

export function BookingFormModal({ room, isDarkMode, onClose, onAddToCart, onBookNow, initialDate, userRole, onGoToLogin }: BookingFormModalProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate || '');
  const [selectedSlot, setSelectedSlot] = useState('morning');
  const [overtimeStart, setOvertimeStart] = useState('16:30');
  const [overtimeEnd, setOvertimeEnd] = useState('18:30');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Equipment
  const [hasInstructor, setHasInstructor] = useState(false);
  const [instructorComputer, setInstructorComputer] = useState('self');
  const [projectorCount, setProjectorCount] = useState('');
  const [speakerCount, setSpeakerCount] = useState('');
  const [signboardCount, setSignboardCount] = useState('');
  const [chairSignCount, setChairSignCount] = useState('');
  const [whiteboardCount, setWhiteboardCount] = useState('');
  const [movingBoardCount, setMovingBoardCount] = useState('');
  const [tableCount, setTableCount] = useState('');
  const [podium, setPodium] = useState(false);
  const [other, setOther] = useState('');
  const [network, setNetwork] = useState(false);

  // Food
  const [foodOption, setFoodOption] = useState('none');
  const [breakType, setBreakType] = useState('none');
  const [lunchType, setLunchType] = useState('none');

  // Parking
  const [parking1, setParking1] = useState('');
  const [parking2, setParking2] = useState('');

  const { holidays: apiHolidays } = useHolidays();

  const isGuest = userRole === 'guest';

  const isHoliday = (d: string) => {
    if (!d) return false;
    const day = new Date(d).getDay();
    return day === 0 || day === 6 || apiHolidays.includes(d) || THAI_HOLIDAYS_2024_2025.includes(d);
  };

  const getPrice = () => {
    let base = selectedSlot === 'fullday' ? room.priceFullDay : room.priceHalfDay;
    let surcharge = 0;
    if (isHoliday(selectedDate)) surcharge = 2000;
    else if (selectedSlot === 'overtime') surcharge = 1000;
    return base + surcharge;
  };

  const getSlotLabel = () => {
    if (selectedSlot === 'morning') return 'Morning (08:30-12:00)';
    if (selectedSlot === 'afternoon') return 'Afternoon (13:00-16:30)';
    if (selectedSlot === 'fullday') return 'Full Day (08:30-16:30)';
    return `Overtime (${overtimeStart}-${overtimeEnd})`;
  };

  const handleSubmit = (bookNow: boolean) => {
    if (isGuest) { setShowLoginPrompt(true); return; }
    if (!selectedDate) { alert('กรุณาเลือกวันที่'); return; }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minD = new Date(today);
    minD.setDate(minD.getDate() + 7);
    const selD = new Date(selectedDate);
    selD.setHours(0, 0, 0, 0);
    if (selD < minD) {
      alert('กรุณาเลือกวันจองล่วงหน้าอย่างน้อย 7 วัน');
      return;
    }

    const item = { room, date: selectedDate, timeSlot: getSlotLabel(), price: getPrice() };
    if (bookNow) onBookNow(item);
    else onAddToCart(item);
  };

  const bg = isDarkMode ? '#1f2937' : '#ffffff';
  const bg2 = isDarkMode ? '#111827' : '#f8fafc';
  const border = isDarkMode ? '#374151' : '#e5e7eb';
  const text = isDarkMode ? '#f9fafb' : '#111827';
  const muted = isDarkMode ? '#9ca3af' : '#6b7280';
  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,31,63,0.75)', backdropFilter: 'blur(4px)' }}>
        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border" style={{ background: bg, borderColor: border }}>
          
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b" style={{ background: bg, borderColor: border }}>
            <div>
              <h2 className="text-lg font-bold" style={{ color: text }}>{room.name}</h2>
              <p className="text-xs mt-0.5" style={{ color: muted }}>
                <Users className="inline w-3 h-3 mr-1" />สูงสุด {room.capacity} คน
                <span className="mx-2">·</span>
                <MapPin className="inline w-3 h-3 mr-1" />ชั้น {room.id.charAt(0)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs" style={{ color: muted }}>ราคาเริ่มต้น</p>
                <p className="text-base font-bold" style={{ color: '#0056b3' }}>{room.priceHalfDay.toLocaleString()} ฿</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: muted }}>
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-6 py-5 space-y-5">

            {/* Guest warning */}
            {isGuest && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: '#fff3cd', border: '1px solid #ffc107' }}>
                <Lock className="w-4 h-4 flex-shrink-0" style={{ color: '#856404' }} />
                <span style={{ color: '#856404' }}>
                  กรุณา{' '}
                  <button onClick={() => { onClose(); onGoToLogin(); }} className="font-bold underline">เข้าสู่ระบบ</button>
                  {' '}เพื่อจองห้อง
                </span>
              </div>
            )}

            {/* Training Type */}
            <div className="rounded-xl p-4 border" style={{ background: bg2, borderColor: border }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: muted }}>
                <Calendar className="inline w-3.5 h-3.5 mr-1" />รูปแบบการจัดอบรม
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'lecture', label: 'บรรยาย' },
                  { value: 'computer', label: 'ปฏิบัติการคอม' },
                  { value: 'hybrid', label: 'Hybrid (Online)' },
                ].map(t => (
                  <label key={t.value} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-xs font-medium transition-all ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}
                    style={{ background: isDarkMode ? '#1f2937' : '#fff' }}>
                    <input type="radio" name="trainingType" value={t.value} defaultChecked={t.value === 'lecture'} className="accent-blue-600" />
                    {t.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="rounded-xl p-4 border" style={{ background: bg2, borderColor: border }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: muted }}>
                <Clock className="inline w-3.5 h-3.5 mr-1" />วันและเวลา
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: muted }}>
                    วันที่จอง * <span className="text-[10px] text-blue-500 ml-1 font-normal">(จองล่วงหน้าอย่างน้อย 7 วัน)</span>
                  </label>
                  <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                    min={(() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 7);
                      return d.toISOString().split('T')[0];
                    })()} 
                    disabled={isGuest} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: muted }}>ช่วงเวลา *</label>
                  <select value={selectedSlot} onChange={e => setSelectedSlot(e.target.value)} disabled={isGuest} className={inputCls}>
                    <option value="morning">เช้า 08:30-12:00 ({room.priceHalfDay.toLocaleString()} ฿)</option>
                    <option value="afternoon">บ่าย 13:00-16:30 ({room.priceHalfDay.toLocaleString()} ฿)</option>
                    <option value="fullday">เต็มวัน 08:30-16:30 ({room.priceFullDay.toLocaleString()} ฿)</option>
                    <option value="overtime">นอกเวลา (+1,000 ฿)</option>
                  </select>
                </div>
              </div>
              {selectedSlot === 'overtime' && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: muted }}>เวลาเริ่ม</label>
                    <input type="time" value={overtimeStart} onChange={e => setOvertimeStart(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: muted }}>เวลาสิ้นสุด</label>
                    <input type="time" value={overtimeEnd} onChange={e => setOvertimeEnd(e.target.value)} className={inputCls} />
                  </div>
                </div>
              )}
              {selectedDate && isHoliday(selectedDate) && (
                <p className="mt-2 text-xs font-medium" style={{ color: '#d97706' }}>⚠️ วันหยุด/เสาร์-อาทิตย์ มีค่าธรรมเนียมเพิ่ม 2,000 ฿</p>
              )}
              {selectedDate && (() => {
                const selD = new Date(selectedDate);
                selD.setHours(0, 0, 0, 0);
                const minD = new Date();
                minD.setHours(0, 0, 0, 0);
                minD.setDate(minD.getDate() + 7);
                return selD < minD;
              })() && (
                <p className="mt-2 text-xs font-medium text-red-500">❌ ไม่สามารถจองได้: ต้องจองล่วงหน้าอย่างน้อย 7 วัน</p>
              )}
            </div>

            {/* Equipment */}
            <div className="rounded-xl p-4 border" style={{ background: bg2, borderColor: border }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: muted }}>
                <Monitor className="inline w-3.5 h-3.5 mr-1" />อุปกรณ์โสตทัศนูปกรณ์
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: text }}>
                  <input type="checkbox" checked={hasInstructor} onChange={e => setHasInstructor(e.target.checked)} className="accent-blue-600 w-4 h-4" />
                  คอมพิวเตอร์วิทยากร
                </label>
                {hasInstructor && (
                  <select value={instructorComputer} onChange={e => setInstructorComputer(e.target.value)} className={inputCls}>
                    <option value="self">ผู้ใช้บริการนำมาเอง</option>
                    <option value="ocs">ใช้ของสำนักงาน</option>
                  </select>
                )}
                <div className="flex items-center gap-2">
                  <label className="text-sm whitespace-nowrap" style={{ color: text }}>โปรเจคเตอร์</label>
                  <input type="number" min="0" placeholder="จำนวน" value={projectorCount} onChange={e => setProjectorCount(e.target.value)} className={`${inputCls} w-24`} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm whitespace-nowrap" style={{ color: text }}>เครื่องขยายเสียง+ไมค์</label>
                  <input type="number" min="0" placeholder="จำนวน" value={speakerCount} onChange={e => setSpeakerCount(e.target.value)} className={`${inputCls} w-24`} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm whitespace-nowrap" style={{ color: text }}>โต๊ะลงทะเบียน</label>
                  <input type="number" min="0" placeholder="จำนวน" value={signboardCount} onChange={e => setSignboardCount(e.target.value)} className={`${inputCls} w-24`} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm whitespace-nowrap" style={{ color: text }}>เก้าอี้ลงทะเบียน</label>
                  <input type="number" min="0" placeholder="จำนวน" value={chairSignCount} onChange={e => setChairSignCount(e.target.value)} className={`${inputCls} w-24`} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm whitespace-nowrap" style={{ color: text }}>White Board</label>
                  <input type="number" min="0" placeholder="จำนวน" value={whiteboardCount} onChange={e => setWhiteboardCount(e.target.value)} className={`${inputCls} w-24`} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm whitespace-nowrap" style={{ color: text }}>จอพลาสมาเคลื่อนที่</label>
                  <input type="number" min="0" placeholder="จำนวน" value={movingBoardCount} onChange={e => setMovingBoardCount(e.target.value)} className={`${inputCls} w-24`} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm whitespace-nowrap" style={{ color: text }}>โต๊ะพับ</label>
                  <input type="number" min="0" placeholder="จำนวน" value={tableCount} onChange={e => setTableCount(e.target.value)} className={`${inputCls} w-24`} />
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: text }}>
                  <input type="checkbox" checked={podium} onChange={e => setPodium(e.target.checked)} className="accent-blue-600 w-4 h-4" />
                  โพเดียมสำหรับพิธีกร
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer col-span-2" style={{ color: text }}>
                  <input type="checkbox" checked={network} onChange={e => setNetwork(e.target.checked)} className="accent-blue-600 w-4 h-4" />
                  บัญชีผู้ใช้งานเครือข่ายนทรี (Internet)
                </label>
                <div className="col-span-2 flex items-center gap-2">
                  <label className="text-sm whitespace-nowrap" style={{ color: text }}>อื่นๆ</label>
                  <input type="text" placeholder="ระบุ..." value={other} onChange={e => setOther(e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>

            {/* Food */}
            <div className="rounded-xl p-4 border" style={{ background: bg2, borderColor: border }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: muted }}>
                <Coffee className="inline w-3.5 h-3.5 mr-1" />รายการเลี้ยงอาหารว่าง/กลางวัน
              </p>
              <div className="space-y-2.5">
                {[
                  { value: 'none', label: 'ไม่จัด' },
                  { value: 'self', label: 'จัดโดยนำร้านอาหารมาเอง (ค่าระเบียบ 1,000 บาท/วัน)' },
                  { value: 'ocs', label: 'จัดโดยใช้บริการของสำนักงาน' },
                ].map(o => (
                  <label key={o.value} className="flex items-start gap-2.5 text-sm cursor-pointer" style={{ color: text }}>
                    <input type="radio" name="foodOption" value={o.value} checked={foodOption === o.value} onChange={() => setFoodOption(o.value)} className="accent-blue-600 mt-0.5 w-4 h-4" />
                    {o.label}
                  </label>
                ))}
                {foodOption === 'ocs' && (
                  <div className="grid grid-cols-2 gap-3 mt-2 ml-6">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: muted }}>อาหารว่าง+เครื่องดื่ม</label>
                      <select value={breakType} onChange={e => setBreakType(e.target.value)} className={inputCls}>
                        <option value="none">ไม่จัด</option>
                        <option value="morning">รอบเช้า</option>
                        <option value="afternoon">รอบบ่าย</option>
                        <option value="both">ทั้งสองรอบ</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: muted }}>อาหารกลางวัน</label>
                      <select value={lunchType} onChange={e => setLunchType(e.target.value)} className={inputCls}>
                        <option value="none">ไม่จัด</option>
                        <option value="box">แบบกล่อง</option>
                        <option value="buffet">แบบบุฟเฟ่ต์</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Parking */}
            <div className="rounded-xl p-4 border" style={{ background: bg2, borderColor: border }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: muted }}>
                <Car className="inline w-3.5 h-3.5 mr-1" />ที่จอดรถสำหรับวิทยากร (ไม่เกิน 2 คัน)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: muted }}>หมายเลขทะเบียน 1</label>
                  <input type="text" placeholder="เช่น กข 1234" value={parking1} onChange={e => setParking1(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: muted }}>หมายเลขทะเบียน 2</label>
                  <input type="text" placeholder="เช่น ขค 5678" value={parking2} onChange={e => setParking2(e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="rounded-xl p-4 border" style={{ borderColor: '#0056b3', background: isDarkMode ? 'rgba(0,86,179,0.1)' : '#eff6ff' }}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium" style={{ color: muted }}>ราคาสุทธิ ({getSlotLabel()})</p>
                  {isHoliday(selectedDate) && <p className="text-xs mt-0.5" style={{ color: '#d97706' }}>รวมค่าธรรมเนียมนอกเวลาราชการ 2,000 ฿</p>}
                  {selectedSlot === 'overtime' && !isHoliday(selectedDate) && <p className="text-xs mt-0.5" style={{ color: '#d97706' }}>รวมค่าธรรมเนียมล่วงเวลา 1,000 ฿</p>}
                </div>
                <p className="text-2xl font-bold" style={{ color: '#0056b3' }}>{getPrice().toLocaleString()} ฿</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pb-1">
              <button onClick={() => handleSubmit(false)} disabled={!room.available || isGuest}
                className="flex-1 py-3 rounded-xl font-semibold text-sm border transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ borderColor: border, color: text, background: isDarkMode ? '#374151' : '#f9fafb' }}>
                {isGuest && <Lock className="w-3.5 h-3.5 opacity-60" />}
                <Check className="w-4 h-4" />
                เพิ่มในตะกร้า
              </button>
              <button onClick={() => handleSubmit(true)} disabled={!room.available}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: room.available ? 'linear-gradient(135deg, #0066cc, #004da6)' : '#9ca3af' }}>
                {isGuest && <Lock className="w-3.5 h-3.5 opacity-80" />}
                {room.available ? 'จองเลย' : 'ไม่พร้อมให้บริการ'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showLoginPrompt && (
        <LoginPromptModal isDarkMode={isDarkMode} onClose={() => setShowLoginPrompt(false)} onGoToLogin={() => { setShowLoginPrompt(false); onClose(); onGoToLogin(); }} />
      )}
    </>
  );
}
