import React, { useState } from 'react';
import { UserRole } from '../App';
import { MeetingRoom } from '../hooks/useRooms';
import { CartItem, TimeSlot } from '../types/booking';
import { X, Users, Maximize, Check, Lock } from 'lucide-react';
import { LoginPromptModal } from './LoginPromptModal';
import { useHolidays } from '../hooks/useHolidays';

interface RoomDetailsModalProps {
  room: MeetingRoom;
  isDarkMode: boolean;
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onBookNow: (item: Omit<CartItem, 'id'>) => void;
  initialDate?: string;
  userRole: UserRole;
  onGoToLogin: () => void;
}

export function RoomDetailsModal({ room, isDarkMode, onClose, onAddToCart, onBookNow, initialDate, userRole, onGoToLogin }: RoomDetailsModalProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate || '');
  const [selectedSlot, setSelectedSlot] = useState<string>('Morning (08:30-12:00)');
  const [overtimeStart, setOvertimeStart] = useState('16:30');
  const [overtimeEnd, setOvertimeEnd] = useState('18:30');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { holidays: apiHolidays } = useHolidays();

  const isGuest = userRole === 'guest';

  const isPublicHoliday = (dateString: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;

    // Sample list of Thai public holidays 2024-2025
    const thaiHolidays = [
      '2024-01-01', // New Year
      '2024-02-24', // Makha Bucha
      '2024-04-06', // Chakri Day
      '2024-04-13', '2024-04-14', '2024-04-15', // Songkran
      '2024-05-01', // Labor Day
      '2024-05-04', // Coronation Day
      '2024-05-22', // Visakha Bucha
      '2024-06-03', // HM Queen's Birthday
      '2024-07-20', // Asanha Bucha
      '2024-07-28', // HM King's Birthday
      '2024-08-12', // HM Queen Mother's Birthday
      '2024-10-13', // King Bhumibol Memorial Day
      '2024-10-23', // Chulalongkorn Day
      '2024-12-05', // King Bhumibol Birthday/Father's Day
      '2024-12-10', // Constitution Day
      '2024-12-31', // New Year's Eve
    ];

    return isWeekend || apiHolidays.includes(dateString) || thaiHolidays.includes(dateString);
  };

  const getPrice = () => {
    let basePrice = selectedSlot.includes('Full Day') ? room.priceFullDay : room.priceHalfDay;
    let surcharge = 0;
    
    const isHoliday = isPublicHoliday(selectedDate);
    
    if (isHoliday) {
      // Sat/Sun/Public Holiday is always "Outside Government Hours"
      surcharge = 2000;
    } else if (selectedSlot.includes('Overtime')) {
      // Workday overtime
      surcharge = 1000;
    }

    let overtimeHourlyFee = 0;
    
    return basePrice + surcharge + overtimeHourlyFee;
  };

  const getSlotString = () => {
    if (selectedSlot.includes('Overtime')) {
      return `Overtime (${overtimeStart} - ${overtimeEnd})`;
    }
    return selectedSlot;
  };

  const handleSubmit = (bookNow: boolean) => {
    if (isGuest) { setShowLoginPrompt(true); return; }
    if (!selectedDate) { alert('Please select a date.'); return; }
    
    // Validate 7 days in advance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minD = new Date(today);
    minD.setDate(minD.getDate() + 7);
    const selD = new Date(selectedDate);
    selD.setHours(0, 0, 0, 0);
    if (selD < minD) {
      alert('กรุณาเลือกวันจองล่วงหน้าอย่างน้อย 7 วัน (Please select a date at least 7 days in advance)');
      return;
    }

    const basePrice = selectedSlot.includes('Full Day') ? room.priceFullDay : room.priceHalfDay;
    const isHoliday = isPublicHoliday(selectedDate);
    let surcharge = 0;
    if (isHoliday) {
      surcharge = 2000;
    } else if (selectedSlot.includes('Overtime')) {
      surcharge = 1000;
    }

    const breakdown = [
      { label: `ค่าจองห้องประชุม (${getSlotString()})`, price: basePrice }
    ];
    if (surcharge > 0) {
      breakdown.push({ label: 'ค่าธรรมเนียมวันหยุด/นอกเวลา', price: surcharge });
    }

    const payload = { room, date: selectedDate, timeSlot: getSlotString(), price: getPrice(), priceBreakdown: breakdown };
    if (bookNow) onBookNow(payload); else onAddToCart(payload);
  };

  const handleGoToLoginFromPrompt = () => {
    setShowLoginPrompt(false);
    onClose();
    onGoToLogin();
  };

  return (
    <>
      <div
        className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
        style={{ backgroundColor: 'rgba(0, 31, 63, 0.7)' }}
      >
        <div
          className={`shadow-[0_20px_60px_rgba(0,0,0,0.4)] max-w-4xl w-full my-8 flex flex-col md:flex-row overflow-hidden border relative ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
          style={{ backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', borderRadius: '1.5rem' }}
        >
          {/* Left Side: Room Image */}
          <div className="w-full md:w-1/2 relative h-64 md:h-auto">
            <img src={room.image} alt={room.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute top-4 left-4">
              <div
                className="text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-md border border-white/20"
                style={{ background: 'linear-gradient(135deg, rgba(0,86,179,0.95), rgba(0,61,130,0.95))' }}
              >
                เริ่มต้น {room.priceHalfDay} บาท
              </div>
            </div>
          </div>

          {/* Right Side: Details */}
          <div className="w-full md:w-1/2 p-8 flex flex-col relative">
            <div className="flex justify-between items-start mb-4">
              <h2 className={`text-3xl font-bold pr-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{room.name}</h2>
              <button
                onClick={onClose}
                className={`absolute top-6 right-6 p-2 rounded-full shadow-md transition-all hover:scale-110 ${isDarkMode ? 'bg-gray-800 text-gray-300 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                title="Close window"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className={`flex items-center gap-4 mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className="flex items-center gap-1">
                <Users className="w-5 h-5" />
                <span>Up to {room.capacity} people</span>
              </div>
              <div className="flex items-center gap-1">
                <Maximize className="w-5 h-5" />
                <span>{room.size} sq ft</span>
              </div>
            </div>

            <p className={`mb-6 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{room.description}</p>

            <div className="mb-6">
              <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Amenities:</h4>
              <div className="grid grid-cols-2 gap-3">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Check className="w-5 h-5" style={{ color: '#00c853' }} />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Section */}
            <div className={`mt-auto pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>

              {/* Login banner for guests */}
              {isGuest && (
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4 text-sm font-medium"
                  style={{ background: 'linear-gradient(135deg, #fff3cd, #ffeaa0)', border: '1px solid #ffc107' }}
                >
                  <Lock className="w-4 h-4 flex-shrink-0" style={{ color: '#856404' }} />
                  <span style={{ color: '#856404' }}>
                    กรุณาเข้าสู่ระบบเพื่อจองห้องประชุม
                    <button
                      onClick={() => { onClose(); onGoToLogin(); }}
                      className="ml-2 underline font-bold hover:opacity-80 transition-opacity"
                    >
                      Sign In →
                    </button>
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className={`block text-sm mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Select Date * <span className="text-[10px] text-blue-500 ml-1 font-normal">(จองล่วงหน้าอย่างน้อย 7 วัน)</span>
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    min={(() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 7);
                      return d.toISOString().split('T')[0];
                    })()}
                    disabled={isGuest}
                    className={`w-full px-4 py-3 border rounded-2xl text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} ${isGuest ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Time Slot *</label>
                  {/* Time slot selection */}
                  <select
                    value={selectedSlot}
                    onChange={e => setSelectedSlot(e.target.value)}
                    disabled={isGuest}
                    className={`w-full px-4 py-3 border rounded-2xl text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} ${isGuest ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="Morning (08:30-12:00)">Morning: 08:30-12:00 ({room.priceHalfDay} บาท)</option>
                    <option value="Afternoon (13:00-16:30)">Afternoon: 13:00-16:30 ({room.priceHalfDay} บาท)</option>
                    <option value="Full Day (08:30-16:30)">Full Day: 08:30-16:30 ({room.priceFullDay} บาท)</option>
                    <option value="Overtime">Overtime: Custom Time (+ค่าบริการตามจริง)</option>
                  </select>
                </div>
              </div>

              {selectedSlot === 'Overtime' && (
                <div className="grid grid-cols-2 gap-4 mb-6 animate-in fade-in slide-in-from-top-1">
                  <div>
                    <label className={`block text-xs mb-1 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Start Time</label>
                    <input
                      type="time"
                      value={overtimeStart}
                      onChange={e => setOvertimeStart(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs mb-1 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>End Time</label>
                    <input
                      type="time"
                      value={overtimeEnd}
                      onChange={e => setOvertimeEnd(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-xl text-sm ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    />
                  </div>
                </div>
              )}

              {/* Price Note */}
              <div className={`mb-6 p-4 rounded-xl text-xs ${isDarkMode ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-50 text-gray-500'} border border-dashed ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className="font-bold mb-2 text-sm">รายละเอียดราคา:</p>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between">
                    <span>ค่าจองห้องประชุม ({selectedSlot})</span>
                    <span>{ (selectedSlot.includes('Full Day') ? room.priceFullDay : room.priceHalfDay).toLocaleString() } บาท</span>
                  </div>
                  
                  { (isPublicHoliday(selectedDate) || selectedSlot.includes('Overtime')) && (
                    <div className="flex justify-between items-center text-sm font-medium text-amber-600">
                      <span>Surcharge (Holiday/Weekend/Overtime)</span>
                      <span>+ { (isPublicHoliday(selectedDate) ? 2000 : 1000).toLocaleString() } บาท</span>
                    </div>
                  )}
                  {selectedDate && (() => {
                    const selD = new Date(selectedDate);
                    selD.setHours(0, 0, 0, 0);
                    const minD = new Date();
                    minD.setHours(0, 0, 0, 0);
                    minD.setDate(minD.getDate() + 7);
                    return selD < minD;
                  })() && (
                    <div className="flex justify-between items-center text-sm font-medium text-red-500">
                      <span>❌ ไม่สามารถจองได้: ต้องจองล่วงหน้าอย่างน้อย 7 วัน</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-700/20 flex justify-between items-center">
                  {/* Total price display */}
                  <span className="text-sm font-bold">ราคาสุทธิ:</span>
                  <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{getPrice().toLocaleString()} บาท</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={!room.available}
                  className={`flex-1 py-4 rounded-full font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                  style={room.available ? { background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)' } : {}}
                >
                  {isGuest && <Lock className="w-4 h-4 opacity-60" />}
                  Add to Cart
                </button>
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={!room.available}
                  className="flex-1 text-white py-4 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
                  style={{
                    background: room.available ? 'linear-gradient(135deg, #0066cc, #004da6)' : 'linear-gradient(135deg, #ef4444, #b91c1c)'
                  }}
                >
                  {isGuest && <Lock className="w-4 h-4 opacity-80" />}
                  {room.available ? 'Book Now' : 'Not Available'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <LoginPromptModal
          isDarkMode={isDarkMode}
          onClose={() => setShowLoginPrompt(false)}
          onGoToLogin={handleGoToLoginFromPrompt}
        />
      )}
    </>
  );
}
