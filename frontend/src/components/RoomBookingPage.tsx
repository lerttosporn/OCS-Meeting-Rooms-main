import React, { useState } from 'react';
import { ArrowLeft, Users, MapPin, Clock, Monitor, Coffee, Car, Check, Lock, ChevronDown, Calendar, Info } from 'lucide-react';
import { UserRole, API_BASE_URL } from '../App';
import { MeetingRoom } from '../hooks/useRooms';
import { useTools } from '../hooks/useTools';
import { useHolidays } from '../hooks/useHolidays';
import { useCatering } from '../hooks/useCatering';
import { useNetworkPackages } from '../hooks/useNetworkPackages';
import { useMonthlyBookings } from '../hooks/useMonthlyBookings';
import { CartItem } from '../types/booking';
import { BookingModal } from './BookingModal';
import { DatePicker, ConfigProvider } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import thTH from 'antd/locale/th_TH';
import 'dayjs/locale/th';
import { format, addDays } from 'date-fns';
import { th } from 'date-fns/locale';

dayjs.locale('th');
import computerRoomNewImg from '../assets/computer-room-new2.jpg';
import classroomImg from '../assets/classroom.jpg';
import theatreRoomImg from '../assets/theatre-room.jpg';
import teleconferenceRoomImg from '../assets/teleconference-room.jpg';
import room301Img from '../assets/rooms/301.png';
import room302Img from '../assets/rooms/302.png';
import room303Img from '../assets/rooms/303.png';
import room304Img from '../assets/rooms/304.png';
import room306Img from '../assets/rooms/306.jpg';
import room402Img from '../assets/rooms/402.jpg';
import room403Img from '../assets/rooms/403.png';
import room404Img from '../assets/rooms/404.png';
import room405Img from '../assets/rooms/405.png';
import room406Img from '../assets/rooms/406.png';
import room407Img from '../assets/rooms/407.png';
import room408Img from '../assets/rooms/408.png';
import room409Img from '../assets/rooms/409.png';
import room501_5Img from '../assets/rooms/501_5.png';
import room506_9_11Img from '../assets/rooms/506_9_11.png';
import room510Img from '../assets/rooms/510.png';
import room801Img from '../assets/rooms/801.png';
import room802Img from '../assets/rooms/802.png';
import room803Img from '../assets/rooms/803.png';
import room804Img from '../assets/rooms/804.png';
import room805Img from '../assets/rooms/805.png';
import room806Img from '../assets/rooms/806.png';
import room901Img from '../assets/rooms/901.png';
import room906Img from '../assets/rooms/906.jpg';
import room911Img from '../assets/rooms/911.png';
import room912Img from '../assets/rooms/912.png';
import room913Img from '../assets/rooms/913.png';
import room915Img from '../assets/rooms/915.png';
import { LoginPromptModal } from './LoginPromptModal';

const SPECIFIC_ROOM_IMAGE: Record<string, string> = {
  '301': room301Img, '302': room302Img, '303': room303Img, '304': room304Img, '306': room306Img,
  '402': room402Img, '403': room403Img, '404': room404Img, '405': room405Img,
  '406': room406Img, '407': room407Img, '408': room408Img, '409': room409Img,
  '501': room501_5Img, '502': room501_5Img, '503': room501_5Img, '504': room501_5Img, '505': room501_5Img,
  '506': room506_9_11Img, '507': room506_9_11Img, '508': room506_9_11Img, '509': room506_9_11Img, '511': room506_9_11Img,
  '510': room510Img,
  '801': room801Img, '802': room802Img, '803': room803Img, '804': room804Img, '805': room805Img, '806': room806Img,
  '901': room901Img, '906': room906Img, '911': room911Img, '912': room912Img, '913': room913Img, '915': room915Img,
};

interface RoomBookingPageProps {
  room: MeetingRoom;
  isDarkMode: boolean;
  onBack: () => void;
  onAddToCart: (item: CartItem) => boolean | void;
  onBookNow?: (item: Omit<CartItem, 'id'>) => void;
  initialDate?: string;
  userRole: UserRole;
  userEmail?: string;
  onGoToLogin: () => void;
}

const THAI_HOLIDAYS: string[] = [
  // 2025 (รวมชดเชย)
  '2025-01-01', '2025-02-12', '2025-04-06', '2025-04-07', '2025-04-13', '2025-04-14', '2025-04-15',
  '2025-05-01', '2025-05-05', '2025-06-03', '2025-07-10', '2025-07-21', '2025-07-28', '2025-08-12',
  '2025-10-13', '2025-10-23', '2025-12-05', '2025-12-10', '2025-12-31',
  // 2026 (รวมชดเชย)
  '2026-01-01', '2026-03-03', '2026-04-06', '2026-04-13', '2026-04-14', '2026-04-15',
  '2026-05-01', '2026-05-04', '2026-05-31', '2026-06-01', '2026-06-03', '2026-07-28', '2026-07-29',
  '2026-08-12', '2026-10-13', '2026-10-23', '2026-12-05', '2026-12-07', '2026-12-10', '2026-12-31',
];

const translateTechnicalInfo = (text?: string) => {
  if (!text) return '';
  if (text.includes('ports other than 80 or 443')) return 'หากใช้พอร์ตอื่นนอกเหนือจาก 80 หรือ 443 โปรดระบุ URL และพอร์ต';
  if (text.includes('own DHCP system')) return 'ผู้ใช้งานต้องเตรียมระบบ DHCP ของตนเอง';
  if (text.includes('configure the IP address')) return 'ผู้ใช้งานต้องกำหนดค่า IP address บนเซิร์ฟเวอร์ด้วยตนเอง';
  return text;
};

export function RoomBookingPage({ room, isDarkMode, onBack, onAddToCart, initialDate, userRole, userEmail, onGoToLogin }: RoomBookingPageProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate || '');
  const [selectedSlot, setSelectedSlot] = useState('morning');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingBookingItem, setPendingBookingItem] = useState<CartItem | null>(null);
  const [addedToCartMsg, setAddedToCartMsg] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trainingFormat, setTrainingFormat] = useState<'ON_SITE' | 'HYBRID'>('ON_SITE');

  // Equipment (Tools API)
  const { tools, loading: toolsLoading } = useTools();
  const [selectedTools, setSelectedTools] = useState<Record<number, number>>({});

  // Notes
  const [meetingTopic, setMeetingTopic] = useState('');

  // Other notes
  const [otherEquip, setOtherEquip] = useState('');

  // Food
  const [foodOption, setFoodOption] = useState('none');
  const { caterings, loading: cateringLoading } = useCatering();
  const [selectedCaterings, setSelectedCaterings] = useState<Record<number, number>>({});

  // Network Packages (only for Computer Rooms)
  const { packages: networkPackages } = useNetworkPackages();
  const [selectedNetworkId, setSelectedNetworkId] = useState<number | null>(null);
  const [networkAccountQty, setNetworkAccountQty] = useState<number>(1);
  const [networkUrl, setNetworkUrl] = useState('');
  const [networkPort, setNetworkPort] = useState('');
  const [networkDeliveryEmail, setNetworkDeliveryEmail] = useState(userEmail || '');
  const [cardId, setCardId] = useState('');

  React.useEffect(() => {
    if (userEmail && !networkDeliveryEmail) {
      setNetworkDeliveryEmail(userEmail);
    }
  }, [userEmail]);

  const isComputerRoom = room.type.some(t => t.includes('คอมพิวเตอร์') || t.toLowerCase().includes('computer'));

  // Parking
  const [plate1, setPlate1] = useState('');
  const [plate2, setPlate2] = useState('');

  const { holidays: apiHolidays } = useHolidays();
  const [viewedMonth, setViewedMonth] = useState(initialDate ? initialDate.substring(0, 7) : format(new Date(), 'yyyy-MM'));

  // Fetch all bookings for the month currently being viewed to block pending/confirmed slots
  const { bookings: monthlyBookings } = useMonthlyBookings(viewedMonth);

  const { isMorningBooked, isAfternoonBooked, isFullyBooked } = React.useMemo(() => {
    let m = false;
    let a = false;

    if (selectedDate && monthlyBookings.length > 0) {
      const bks = monthlyBookings.filter(b => b.room_id === Number(room.id) && new Date(b.start_date).toLocaleDateString('en-CA') === selectedDate && ['draft', 'approved', 'confirmed'].includes(b.booking_status));
      bks.forEach(b => {
        if (b.start_time <= '09:00:00' && b.end_time >= '12:00:00') m = true;
        if (b.start_time <= '13:30:00' && b.end_time >= '16:00:00') a = true;
        if (b.start_time <= '09:00:00' && b.end_time >= '16:00:00') {
          m = true;
          a = true;
        }
      });
    }
    return { isMorningBooked: m, isAfternoonBooked: a, isFullyBooked: m && a };
  }, [selectedDate, monthlyBookings, room.id]);

  const fullyBookedDates = React.useMemo(() => {
    const dates: string[] = [];
    
    // Add fully booked dates (include draft, approved, confirmed)
    const bookedMap: Record<string, { m: boolean, a: boolean }> = {};
    monthlyBookings.filter(b => b.room_id === Number(room.id) && ['draft', 'approved', 'confirmed'].includes(b.booking_status)).forEach(b => {
      const d = new Date(b.start_date).toLocaleDateString('en-CA');
      if (!bookedMap[d]) bookedMap[d] = { m: false, a: false };
      if (b.start_time <= '09:00:00' && b.end_time >= '12:00:00') bookedMap[d].m = true;
      if (b.start_time <= '13:30:00' && b.end_time >= '16:00:00') bookedMap[d].a = true;
      if (b.start_time <= '09:00:00' && b.end_time >= '16:00:00') {
        bookedMap[d].m = true;
        bookedMap[d].a = true;
      }
    });

    Object.entries(bookedMap).forEach(([dateStr, status]) => {
      if (status.m && status.a) {
        dates.push(dateStr);
      }
    });

    return dates;
  }, [monthlyBookings, room.id]);

  React.useEffect(() => {
    // Auto adjust selected slot if current is booked
    if (selectedSlot === 'fullday' && (isMorningBooked || isAfternoonBooked)) {
      if (!isMorningBooked) setSelectedSlot('morning');
      else if (!isAfternoonBooked) setSelectedSlot('afternoon');
      else setSelectedSlot('');
    } else if (selectedSlot === 'morning' && isMorningBooked) {
      if (!isAfternoonBooked) setSelectedSlot('afternoon');
      else setSelectedSlot('');
    } else if (selectedSlot === 'afternoon' && isAfternoonBooked) {
      if (!isMorningBooked) setSelectedSlot('morning');
      else setSelectedSlot('');
    }
  }, [isMorningBooked, isAfternoonBooked, selectedSlot]);

  const isGuest = userRole === 'guest';

  const isHoliday = (d: string) => {
    if (!d) return false;
    const day = new Date(d).getDay();
    // ใช้วันหยุดจาก API หรือ fallback fallback (ถ้ามี)
    return day === 0 || day === 6 || apiHolidays.includes(d) || THAI_HOLIDAYS.includes(d);
  };

  const getPriceBreakdown = () => {
    const items = [];
    const base = selectedSlot === 'fullday' ? room.priceFullDay : room.priceHalfDay;
    items.push({ label: `ค่าห้อง (${getSlotLabel()})`, price: base });

    if (isHoliday(selectedDate)) {
      items.push({ label: 'ค่าธรรมเนียมวันหยุด/นอกเวลา', price: 2000 });
    }

    if (foodOption === 'self') {
      items.push({ label: 'ค่าธรรมเนียมนำอาหารมาเอง', price: 1000 });
    }

    // Dynamic Tools pricing
    Object.entries(selectedTools).forEach(([toolIdStr, quantity]) => {
      if (quantity > 0) {
        const tool = tools.find(t => t.tool_id === parseInt(toolIdStr));
        if (tool) {
          const unitPrice = Number(tool.unit_price) || 0;
          if (unitPrice > 0) {
            items.push({ label: `${tool.name} (${quantity} ชิ้น)`, price: quantity * unitPrice });
          }
        }
      }
    });

    return items;
  };

  const getPrice = () => {
    return getPriceBreakdown().reduce((sum, item) => sum + item.price, 0);
  };

  const getSlotLabel = () => {
    if (selectedSlot === 'morning') return 'Morning (08:30-12:00)';
    if (selectedSlot === 'afternoon') return 'Afternoon (13:00-16:30)';
    return 'Full Day (08:30-16:30)';
  };

  const handleSubmit = async (bookNow: boolean) => {
    // Guest ไม่สามารถเพิ่มตะกร้าหรือจองได้ทุกกรณี
    if (isGuest) { setShowLoginPrompt(true); return; }

    if (!meetingTopic.trim()) {
      alert('กรุณาระบุ หัวข้อการประชุม / กิจกรรม');
      return;
    }
    if (!selectedDate) {
      alert('กรุณาเลือกวันที่เข้าใช้');
      return;
    }

    // Validate 7 days in advance
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
    if (!selectedSlot) {
      alert('กรุณาเลือกช่วงเวลา');
      return;
    }

    if (isComputerRoom) {
      if (!selectedNetworkId) {
        alert('กรุณาเลือกแพ็กเกจเครือข่ายสำหรับห้องปฏิบัติการคอมพิวเตอร์');
        return;
      }
      if (!cardId.trim()) {
        alert('กรุณากรอกเลขบัตรประชาชนสำหรับแพ็กเกจเครือข่าย');
        return;
      }
      if (selectedNetworkId === 1) {
        if (!networkUrl.trim() || !networkPort.trim()) {
          alert('กรุณากรอก URL และ Port สำหรับ Package 1');
          return;
        }
      }
    }

    const dateToUse = selectedDate;

    // ป้องกันการกดย้ำๆ ระหว่างที่ระบบกำลังประมวลผล
    if (isSubmitting) return;

    const sTools = Object.entries(selectedTools)
      .filter(([_, q]) => q > 0)
      .map(([id, q]) => {
        const t = tools.find(x => x.tool_id === parseInt(id));
        return {
          tool_id: parseInt(id),
          quantity: q,
          price: Number(t?.unit_price || 0),
          name: t?.name || 'Unknown Tool'
        };
      });

    const sCaterings = Object.entries(selectedCaterings)
      .filter(([_, q]) => q > 0)
      .map(([id, q]) => {
        const c = caterings.find(x => x.catering_id === parseInt(id));
        return {
          catering_id: parseInt(id),
          quantity: q,
          name: c?.name || 'Unknown Catering'
        };
      });

    const item: CartItem = {
      id: Math.random().toString(36).substring(7),
      room,
      date: dateToUse,
      timeSlot: getSlotLabel(),
      price: getPrice(),
      priceBreakdown: getPriceBreakdown(),
      selectedTools: sTools,
      selectedCaterings: foodOption === 'ocs' ? sCaterings : [],
      selectedNetwork: (isComputerRoom && selectedNetworkId) ? {
        package_id: selectedNetworkId,
        account_quantity: networkAccountQty,
        url: networkUrl.trim() || undefined,
        port: networkPort.trim() || undefined,
        delivery_email: networkDeliveryEmail.trim() || undefined,
      } : undefined,
      carPlate1: plate1,
      carPlate2: plate2,
      trainingFormat,
    };

    try {
      setIsSubmitting(true); // <--- เริ่มแสดง Loading
      
      if (isComputerRoom && selectedNetworkId && cardId) {
        const userId = localStorage.getItem('ocs_user_id');
        if (userId) {
          await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ card_id: cardId })
          }).catch(console.error);
        }
      }

      if (bookNow) {
        setPendingBookingItem(item);
      } else {
        const ok = await onAddToCart(item);
        if (ok !== false) {
          setAddedToCartMsg(true);
          setTimeout(() => setAddedToCartMsg(false), 2500);
        }
      }
    } catch (err) {
      console.error('[handleSubmit] error:', err);
      if (!bookNow) {
        setAddedToCartMsg(true);
        setTimeout(() => setAddedToCartMsg(false), 2500);
      }
    } finally {
      setIsSubmitting(false); // <--- ปิด Loading ไม่ว่าจะสำเร็จหรือพัง
    }
  };

  const inputCls = `w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900'
    }`;

  const cardCls = `rounded-2xl shadow-md ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`;

  const getRoomImage = () => {
    // Try to match specific room number from the room name first
    const roomNumberMatch = room.name.match(/\d+/);
    const roomNumber = roomNumberMatch ? roomNumberMatch[0] : '';
    if (SPECIFIC_ROOM_IMAGE[roomNumber]) {
      return SPECIFIC_ROOM_IMAGE[roomNumber];
    }

    const rType = (room.type && Array.isArray(room.type)) ? room.type[0] : room.type;
    switch (rType) {
      case 'computer':
        return computerRoomNewImg;
      case 'classroom':
        return classroomImg;
      case 'theatre':
        return theatreRoomImg;
      case 'tele-conference':
        return teleconferenceRoomImg;
      case 'catering':
        return 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1080';
      default:
        return room.image;
    }
  };

  return (
    <>
      {/* Toast: Added to cart */}
      {addedToCartMsg && (
        <div
          className="fixed top-6 left-1/2 z-[9999] -translate-x-1/2 flex items-center gap-3 px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-2xl transition-all duration-300 animate-bounce"
          style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 8px 32px rgba(5,150,105,0.4)' }}
        >
          <span className="text-lg">🛒</span>
          เพิ่ม <strong>{room.name}</strong> ลงตะกร้าแล้ว!
        </div>
      )}

      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Hero Header with room image */}
        <div className="relative h-64 overflow-hidden">
          <img src={getRoomImage()} alt={room.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,20,50,0.65) 0%, rgba(10,20,50,0.85) 100%)' }} />

          {/* Back button */}
          <button
            onClick={onBack}
            className="absolute top-5 left-5 z-50 flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all hover:bg-white/20 backdrop-blur-sm border border-white/20 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับ
          </button>

          {/* Room title */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white text-center px-4">
            <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg mb-4">{room.name}</h1>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" /> สูงสุด {room.capacity} คน
              </span>
              <span className="w-1 h-1 rounded-full bg-white/60" />
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> ชั้น {room.floor}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/60" />
              <span>เริ่มต้น {room.priceHalfDay.toLocaleString()} ฿</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16 relative z-10">

          {/* Guest banner */}
          {isGuest && (
            <div className="mb-5 flex items-center gap-2 px-5 py-3.5 rounded-2xl shadow-sm text-sm font-medium"
              style={{ background: '#fff3cd', border: '1px solid #ffc107' }}>
              <Lock className="w-4 h-4 flex-shrink-0" style={{ color: '#856404' }} />
              <span style={{ color: '#856404' }}>
                กรุณา{' '}
                <button onClick={() => { onBack(); onGoToLogin(); }} className="font-bold underline">เข้าสู่ระบบ</button>
                {' '}เพื่อจองห้องประชุม
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* LEFT: รายละเอียดอุปกรณ์ */}
            <div className={cardCls + ' p-6'}>
              <h2 className={`text-lg font-bold mb-5 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Monitor className="w-5 h-5 text-blue-600" />
                รายละเอียดอุปกรณ์
              </h2>

              <div className="space-y-4">
                {/* Training type */}
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>รูปแบบการจัดอบรม <span className="text-red-500">*</span></p>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { v: 'ON_SITE' as const, l: 'บรรยาย/ปฏิบัติการในห้องเท่านั้น' },
                      { v: 'HYBRID' as const, l: 'Hybrid (WebEx / Zoom)' },
                    ]).map(t => (
                      <label
                        key={t.v}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer text-xs font-medium transition-all
                          ${trainingFormat === t.v
                            ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-400'
                            : isDarkMode
                              ? 'border-gray-600 text-gray-300 hover:border-gray-400'
                              : 'border-gray-200 text-gray-700 hover:border-gray-400'
                          }`}
                      >
                        <input
                          type="radio"
                          name="trainingFormat"
                          value={t.v}
                          checked={trainingFormat === t.v}
                          onChange={() => setTrainingFormat(t.v)}
                          className="accent-blue-600"
                        />
                        {t.l}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Equipment grid */}
                <div className={`rounded-xl p-4 space-y-3 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  {toolsLoading ? (
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>กำลังโหลดรายการอุปกรณ์...</p>
                  ) : tools.length === 0 ? (
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>ไม่มีอุปกรณ์เสริม</p>
                  ) : (
                    tools.filter(t => !t.status || t.status === 'available').map(tool => {
                      const priceLabel = Number(tool.unit_price) > 0 ? `(${Number(tool.unit_price).toLocaleString()} บาท/ชิ้น)` : '(ฟรี)';
                      const isNontri = tool.name.toLowerCase().includes('nontri');

                      return (
                        <div key={tool.tool_id} className="flex items-center gap-3">
                          <span className={`flex-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {tool.name} {priceLabel}
                          </span>

                          {isNontri ? (
                            <div className="w-20 flex justify-center">
                              <input
                                type="checkbox"
                                checked={!!selectedTools[tool.tool_id]}
                                onChange={e => {
                                  setSelectedTools(prev => ({ ...prev, [tool.tool_id]: e.target.checked ? 1 : 0 }));
                                }}
                                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              />
                            </div>
                          ) : (
                            <input type="number" min="0" max={tool.stock} placeholder="0"
                              value={selectedTools[tool.tool_id] || ''}
                              onChange={e => {
                                const val = parseInt(e.target.value) || 0;
                                setSelectedTools(prev => ({ ...prev, [tool.tool_id]: val }));
                              }}
                              className="w-20 px-3 py-1.5 rounded-lg border text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                              style={{ background: isDarkMode ? '#374151' : '#fff', borderColor: isDarkMode ? '#4b5563' : '#e5e7eb', color: isDarkMode ? '#fff' : '#111' }}
                            />
                          )}
                        </div>
                      );
                    })
                  )}

                  <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-600">
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>อื่นๆ</label>
                    <input type="text" placeholder="ระบุ..." value={otherEquip} onChange={e => setOtherEquip(e.target.value)} className={inputCls} />
                  </div>
                </div>

                {/* Parking */}
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Car className="inline w-3.5 h-3.5 mr-1" />ที่จอดรถวิทยากร (≤ 2 คัน)
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="ทะเบียน 1" value={plate1} onChange={e => setPlate1(e.target.value)} className={inputCls} />
                    <input type="text" placeholder="ทะเบียน 2" value={plate2} onChange={e => setPlate2(e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: รายละเอียดการจอง */}
            <div className="space-y-5">
              <div className={cardCls + ' p-6'}>
                <h2 className={`text-lg font-bold mb-5 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Calendar className="w-5 h-5 text-blue-600" />
                  รายละเอียด
                </h2>

                <div className="space-y-4">
                  {/* Meeting Topic */}
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      💼 หัวข้อการประชุม / กิจกรรม *
                    </p>
                    <input
                      type="text"
                      value={meetingTopic}
                      onChange={e => setMeetingTopic(e.target.value)}
                      placeholder="เช่น ประชุมทีมประจำเดือน, อบรมพนักงาน, สัมมนาวิชาการ..."
                      disabled={isGuest}
                      className={inputCls + (isGuest ? ' opacity-50' : '')}
                    />
                  </div>

                  {/* Date & time */}
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Clock className="inline w-3.5 h-3.5 mr-1" />วันและเวลา
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          วันที่ * <span className="text-[10px] text-blue-500 ml-1 font-normal">(จองล่วงหน้าอย่างน้อย 7 วัน)</span>
                        </label>
                        <ConfigProvider locale={thTH} theme={{ token: { colorPrimary: '#2563eb', borderRadius: 16, fontFamily: 'inherit' } }}>
                          <DatePicker
                            className="w-full flex-1 py-3 text-sm border rounded-xl transition-all focus:outline-none hover:border-blue-400 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ paddingLeft: '1rem', paddingRight: '1rem', backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', borderColor: isDarkMode ? '#4b5563' : '#e5e7eb', color: isDarkMode ? '#ffffff' : '#111827' }}
                            format="D MMMM YYYY"
                            inputReadOnly={true}
                            allowClear={false}
                            value={selectedDate ? dayjs(selectedDate, 'YYYY-MM-DD') : null}
                            onChange={(date) => {
                              const newDateStr = date ? date.format('YYYY-MM-DD') : '';
                              setSelectedDate(newDateStr);
                              if (newDateStr) setViewedMonth(newDateStr.substring(0, 7));
                            }}
                            disabledDate={(current) => {
                              // Disable if before today + 7 days
                              if (current && current < dayjs().add(7, 'day').startOf('day')) return true;
                              // Disable if fully booked
                              if (current && fullyBookedDates.includes(current.format('YYYY-MM-DD'))) return true;
                              return false;
                            }}
                            suffixIcon={<Calendar className={`w-5 h-5 ${selectedDate ? 'text-blue-500' : 'text-gray-400'} pointer-events-none`} />}
                            disabled={isGuest}
                            cellRender={(current, info) => {
                              if (info.type !== 'date') return info.originNode;
                              const currentDjs = dayjs(current);
                              const dateStr = currentDjs.format('YYYY-MM-DD');
                              const isHol = isHoliday(dateStr);
                              
                              if (!isHol) return info.originNode;

                              // Safely append our holiday class without destroying antd's node
                              const originElement = info.originNode as React.ReactElement<{ className?: string }>;
                              const originProps = originElement.props;
                              return React.cloneElement(originElement, {
                                className: `${originProps.className || ''} ant-picker-cell-holiday`
                              });
                            }}
                            popupClassName={isDarkMode ? 'dark-calendar-popup' : ''}
                          />
                        </ConfigProvider>
                      </div>
                      <div>
                        <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>ช่วงเวลา *</label>
                        <select value={selectedSlot} onChange={e => {
                          setSelectedSlot(e.target.value);
                        }} disabled={isGuest || isFullyBooked}
                          className={inputCls + (isGuest || isFullyBooked ? ' opacity-50' : '')}>
                          <option value="" disabled style={{ display: 'none' }}>เลือกช่วงเวลา</option>
                          <option value="morning" disabled={isMorningBooked}>
                            เช้า 08:30-12:00 {isMorningBooked ? '(ไม่ว่าง)' : `(${room.priceHalfDay.toLocaleString()} ฿)`}
                          </option>
                          <option value="afternoon" disabled={isAfternoonBooked}>
                            บ่าย 13:00-16:30 {isAfternoonBooked ? '(ไม่ว่าง)' : `(${room.priceHalfDay.toLocaleString()} ฿)`}
                          </option>
                          <option value="fullday" disabled={isMorningBooked || isAfternoonBooked}>
                            เต็มวัน 08:30-16:30 {(isMorningBooked || isAfternoonBooked) ? '(ไม่ว่าง)' : `(${room.priceFullDay.toLocaleString()} ฿)`}
                          </option>
                        </select>
                      </div>
                    </div>
                      {selectedDate && isHoliday(selectedDate) && (
                        <p className="mt-2 text-xs font-medium text-red-500">⚠️ วันหยุด/เสาร์-อาทิตย์ มีค่าธรรมเนียมเพิ่มเติม 2,000 ฿</p>
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
                    {isFullyBooked && (
                      <p className="mt-2 text-xs font-medium text-red-500">❌ ห้องนี้ถูกจองคิวเต็มแล้วในวันที่คุณเลือก</p>
                    )}
                  </div>

                  {/* Food */}
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Coffee className="inline w-3.5 h-3.5 mr-1" />รายการอาหาร
                    </p>
                    <div className="space-y-2">
                      {[
                        { v: 'none', l: 'ไม่จัด' },
                        { v: 'self', l: 'นำร้านอาหารมาเอง (ค่าธรรมเนียม 1,000 ฿/วัน)' },
                        { v: 'ocs', l: 'ใช้บริการของสำนักงาน' },
                      ].map(o => (
                        <label key={o.v} className={`flex items-start gap-2 text-sm cursor-pointer ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <input type="radio" name="food" value={o.v} checked={foodOption === o.v} onChange={() => setFoodOption(o.v)} className="accent-blue-600 mt-0.5" />
                          {o.l}
                        </label>
                      ))}
                    </div>
                    {foodOption === 'ocs' && (
                      <div className={`rounded-xl p-4 mt-3 space-y-3 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        {cateringLoading ? (
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>กำลังโหลดรายการอาหาร...</p>
                        ) : caterings.filter(c => c.name !== 'Self-catered').length === 0 ? (
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>ไม่มีรายการอาหารจัดเลี้ยง</p>
                        ) : (
                          caterings.filter(c => c.name !== 'Self-catered').map(catering => (
                            <div key={catering.catering_id} className="flex items-center gap-3">
                              <div className="flex-1">
                                <span className={`text-sm block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {catering.name}
                                </span>
                                {catering.description && (
                                  <span className={`text-xs block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {catering.description}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <label className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>จำนวน</label>
                                <input type="number" min="0" placeholder="0"
                                  value={selectedCaterings[catering.catering_id] || ''}
                                  onChange={e => {
                                    const val = parseInt(e.target.value) || 0;
                                    setSelectedCaterings(prev => ({ ...prev, [catering.catering_id]: val }));
                                  }}
                                  className="w-20 px-3 py-1.5 rounded-lg border text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  style={{ background: isDarkMode ? '#374151' : '#fff', borderColor: isDarkMode ? '#4b5563' : '#e5e7eb', color: isDarkMode ? '#fff' : '#111' }}
                                />
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Network Packages (Computer Room Only) */}
                  {isComputerRoom && (
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-2 mt-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Monitor className="inline w-3.5 h-3.5 mr-1" />แพ็กเกจเครือข่าย
                      </p>
                      <div className={`rounded-xl p-4 space-y-4 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <div>
                          <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>เลือกแพ็กเกจ</label>
                          <select 
                            value={selectedNetworkId || ''} 
                            onChange={e => setSelectedNetworkId(e.target.value ? Number(e.target.value) : null)}
                            className={inputCls}
                          >
                            <option value="">-- ไม่ระบุ --</option>
                            {networkPackages.map(pkg => (
                              <option key={pkg.package_id} value={pkg.package_id}>{pkg.name}</option>
                            ))}
                          </select>
                          {selectedNetworkId !== null && networkPackages.find(p => p.package_id === selectedNetworkId)?.technical_info && (
                            <div className={`mt-3 p-3 rounded-xl text-sm border flex items-start gap-2 leading-relaxed ${isDarkMode ? 'bg-blue-900/20 border-blue-800/50 text-blue-300' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
                              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-semibold block mb-0.5">ข้อมูลทางเทคนิค:</span>
                                {translateTechnicalInfo(networkPackages.find(p => p.package_id === selectedNetworkId)?.technical_info)}
                              </div>
                            </div>
                          )}
                        </div>
                        {selectedNetworkId !== null && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>จำนวนผู้ใช้งาน</label>
                              <input 
                                type="number" 
                                min="1" 
                                value={networkAccountQty} 
                                onChange={e => setNetworkAccountQty(Number(e.target.value))} 
                                className={inputCls} 
                              />
                            </div>
                            <div>
                              <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>เลขบัตรประชาชน *</label>
                              <input 
                                type="text" 
                                placeholder="13 หลัก"
                                value={cardId} 
                                onChange={e => setCardId(e.target.value)} 
                                className={inputCls} 
                              />
                            </div>
                            {selectedNetworkId === 1 && (
                              <>
                                <div>
                                  <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>URL (จำเป็น) *</label>
                                  <input 
                                    type="url" 
                                    value={networkUrl} 
                                    onChange={e => setNetworkUrl(e.target.value)} 
                                    className={inputCls} 
                                    required 
                                  />
                                </div>
                                <div>
                                  <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Port (จำเป็น) *</label>
                                  <input 
                                    type="text" 
                                    value={networkPort} 
                                    onChange={e => setNetworkPort(e.target.value)} 
                                    className={inputCls} 
                                    required 
                                  />
                                </div>
                              </>
                            )}
                            <div>
                              <label className={`block text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>อีเมลรับข้อมูล</label>
                              <input 
                                type="email" 
                                value={networkDeliveryEmail} 
                                onChange={e => setNetworkDeliveryEmail(e.target.value)} 
                                className={inputCls} 
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Price summary + actions */}
              <div className={cardCls + ' p-5'}>
                <div className="mb-4">
                  <p className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>สรุปค่าใช้จ่าย</p>

                  <div className="space-y-2 mb-4">
                    {getPriceBreakdown().map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</span>
                        <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.price.toLocaleString()} ฿</span>
                      </div>
                    ))}
                  </div>

                  <div className={`pt-3 border-t flex items-center justify-between ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>ราคาสุทธิ</p>
                    <p className="text-2xl font-extrabold" style={{ color: '#0056b3' }}>
                      {getPrice().toLocaleString()} <span className="text-sm font-semibold">฿</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={!room.available || isSubmitting || isGuest || isFullyBooked}
                    title={isGuest ? 'กรุณาเข้าสู่ระบบก่อนเพิ่มลงตะกร้า' : ''}
                    className={`flex-1 py-4 rounded-2xl font-bold text-base border transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isDarkMode ? 'border-gray-600 text-white hover:bg-gray-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {isSubmitting ? (
                      <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full flex-shrink-0" />
                    ) : (
                      <>
                        {isGuest && <Lock className="w-4 h-4 opacity-60" />}
                        <Check className="w-5 h-5" />
                      </>
                    )}
                    {isSubmitting ? 'กำลังเพิ่ม...' : isGuest ? 'เข้าสู่ระบบก่อน' : 'เพิ่มในตะกร้า'}
                  </button>
                  <button
                    onClick={() => handleSubmit(true)}
                    disabled={!room.available || isFullyBooked}
                    className="flex-1 py-4 rounded-2xl font-bold text-base text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: (room.available && !isFullyBooked) ? 'linear-gradient(135deg, #0066cc, #004da6)' : '#9ca3af' }}
                  >
                    {isGuest && <Lock className="w-4 h-4 opacity-80" />}
                    {isFullyBooked ? 'คิวเต็มแล้ว' : room.available ? 'จองเลย' : 'ไม่พร้อมให้บริการ'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLoginPrompt && (
        <LoginPromptModal isDarkMode={isDarkMode} onClose={() => setShowLoginPrompt(false)}
          onGoToLogin={() => { setShowLoginPrompt(false); onBack(); onGoToLogin(); }} />
      )}

      {pendingBookingItem && (
        <BookingModal
          cartItems={[pendingBookingItem]}
          isDarkMode={isDarkMode}
          onClose={() => setPendingBookingItem(null)}
          notes={meetingTopic}
        />
      )}
    </>
  );
}

