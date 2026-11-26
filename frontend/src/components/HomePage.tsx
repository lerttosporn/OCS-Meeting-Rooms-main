import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from '../App';
import { createPortal } from "react-dom";
import { useMonthlyBookings } from '../hooks/useMonthlyBookings';
import {
  Building2,
  Clock,
  Shield,
  Award,
  Briefcase,
  Users,
  GraduationCap,
  MessageSquare,
  Calendar,
  Package,
  Phone,
  Mail,
  Facebook,
  Monitor,
  Video,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import RoomSlider, { RoomType } from "./room-slider/RoomSlider";
import RateSlider from "./rate-slider/RateSlider";
import computerRoomImg from "../assets/computer-room.png";
import computerRoomNewImg from "../assets/computer-room-new2.jpg";
import classroomImg from "../assets/classroom.jpg";
import buildingImg from "../assets/ocs-building.jpg";
import theatreRoomImg from "../assets/theatre-room.jpg";
import teleconferenceRoomImg from "../assets/teleconference-room.jpg";
import { seminarImages, computerImages, teleconferenceImages } from '../utils/roomImages';

interface HomePageProps {
  isDarkMode: boolean;
  userId?: number | null;
  onNavigateCalendar?: () => void;
}

export function HomePage({ isDarkMode, userId = null, onNavigateCalendar }: HomePageProps) {
  const [selectedType, setSelectedType] = useState<RoomType | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liveRooms, setLiveRooms] = useState<any[]>([]);
  const [isLoadingLiveRooms, setIsLoadingLiveRooms] = useState(true);
  const monthInputRef = useRef<HTMLInputElement>(null);
  const [selectedLiveRoom, setSelectedLiveRoom] = useState<any>(null);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${yyyy}-${mm}`;
  });

  const formatMonthThai = (ym: string) => {
    if (!ym) return '';
    const [y, m] = ym.split('-');
    const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return `${thaiMonths[parseInt(m, 10) - 1]} ${y}`;
  };

  const { bookings: monthlyBookings } = useMonthlyBookings(selectedMonth, 'confirmed');

  useEffect(() => {
    const fetchLiveRooms = async () => {
      try {
        setIsLoadingLiveRooms(true);
        // ฟอร์แมตข้อมูลให้เข้ากับ UI ของการ์ด
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        const determineStatus = (r: any) => {
          if (!r.start_date || !r.start_time || !r.end_time) return 'reserved';
          const rDate = r.start_date ? new Date(r.start_date).toLocaleDateString('en-CA') : '';
          
          if (rDate < currentDate) return 'ended';
          if (rDate === currentDate && r.end_time < currentTime) return 'ended';

          if (rDate === currentDate && r.start_time <= currentTime && r.end_time >= currentTime) {
            return 'in_use';
          }
          return 'reserved';
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
            date: formatDateThai(r.start_date),
            isUserBooking: r.customer_id === userId
          }));

        setLiveRooms(allRooms);
      } catch (err) {
        console.error("Failed to fetch live rooms:", err);
      } finally {
        setIsLoadingLiveRooms(false);
      }
    };
    fetchLiveRooms();
  }, [monthlyBookings, userId]);

  const roomTypes: RoomType[] = [
    {
      icon: Users,
      name: 'Seminar Rooms',
      thaiName: 'ห้องอบรมสัมมนาแบบบรรยาย',
      capacity: '30-130 คน',
      image: classroomImg,
      images: [classroomImg, ...seminarImages],
      features: [
        "คอมพิวเตอร์วิทยากร",
        "โปรเจคเตอร์ & เครื่องเสียง",
        "ไมโครโฟน",
        "อินเทอร์เน็ต",
      ],
      idealFor: 'อบรม, สัมมนา, บรรยาย',
      description: "ห้องสำหรับอบรม/สัมมนาแบบบรรยาย มีอุปกรณ์พื้นฐานครบครัน พร้อมให้บริการสำหรับทุกประเภทการฝึกอบรม",
      equipmentList: [
        "คอมพิวเตอร์โน้ตบุ๊คสำหรับวิทยากร จำนวน 1 เครื่อง",
        "โต๊ะและเก้าอี้ตามความจุห้อง",
        "โปรเจคเตอร์และจอรับภาพ",
        "ชุดอุปกรณ์เครื่องเสียงและไมโครโฟนแบบมีสาย จำนวน 1 ชุด",
        "ไมโครโฟนไร้สาย 1 ตัว*",
        "อินเทอร์เน็ต พร้อมบัญชีผู้ใช้อินเทอร์เน็ตสำหรับเครื่องวิทยากร จำนวน 2 บัญชี"
      ],
      requirement: 'ไม่มีคอมพิวเตอร์สำหรับผู้เข้าอบรม และไม่อนุญาตให้ผู้เข้าอบรมนำคอมพิวเตอร์ส่วนตัวมา เนื่องจากมีห้องคอมพิวเตอร์ให้บริการ',
    },
    {
      icon: Monitor,
      name: 'Computer Rooms',
      thaiName: 'ห้องอบรมคอมพิวเตอร์',
      capacity: '30-100 คน',
      image: computerRoomNewImg,
      images: [computerRoomNewImg, ...computerImages],
      features: [
        "คอมพิวเตอร์วิทยากรและผู้เข้าอบรม",
        "อินเทอร์เน็ตความเร็วสูง",
        "โปรเจคเตอร์",
        "อุปกรณ์สื่อการสอน",
      ],
      idealFor: 'อบรมด้าน IT, Workshop ซอฟต์แวร์',
      description: "ห้องอบรมที่มีคอมพิวเตอร์สำหรับทั้งวิทยากรและผู้เข้าอบรม พร้อมอุปกรณ์สื่อการสอนและอินเทอร์เน็ต",
      equipmentList: [
        "คอมพิวเตอร์โน้ตบุ๊คสำหรับวิทยากร จำนวน 1 เครื่อง",
        "คอมพิวเตอร์สำหรับผู้เข้าอบรมตามจำนวนความจุห้อง",
        "โต๊ะและเก้าอี้ตามความจุห้อง",
        "โปรเจคเตอร์และจอรับภาพ",
        "ชุดอุปกรณ์เครื่องเสียงและไมโครโฟนแบบมีสาย จำนวน 1 ชุด",
        "ไมโครโฟนไร้สาย 1 ตัว*",
        "อินเทอร์เน็ต พร้อมบัญชีผู้ใช้อินเทอร์เน็ตสำหรับเครื่องวิทยากร และผู้เข้าอบรม ตามจำนวนความจุห้อง"
      ],
      requirement: 'ขอความร่วมมือ ไม่อนุญาตให้นำอาหารและเครื่องดื่มเข้าภายในห้องอบรม เพื่อป้องกันความเสียหายที่อาจเกิดขึ้นกับเครื่องคอมพิวเตอร์ ทั้งนี้ จัดให้มีจุดวางอาหารและเครื่องดื่มบริเวณหน้าห้อง',
    },
    {
      icon: Video,
      name: 'Tele-Conference Rooms',
      thaiName: 'ห้องการเรียนการสอนทางไกล',
      capacity: '1-25 คน',
      image: teleconferenceRoomImg,
      images: [teleconferenceRoomImg, ...teleconferenceImages.slice(0, 2)],
      features: [
        "ระบบประชุมทางไกล",
        "กล้อง HD & ไมโครโฟน",
        "จอแสดงผล",
        "อินเทอร์เน็ตความเร็วสูง",
      ],
      idealFor: 'เรียน/สอนทางไกล',
      description: "ห้องสำหรับเรียนหรือประชุมทางไกลผ่านระบบเครือข่าย มีอุปกรณ์ประชุมและสื่อสารครบครัน",
      equipmentList: [
        "คอมพิวเตอร์โน้ตบุ๊คสำหรับอาจารย์ผู้สอน จำนวน 1 เครื่อง",
        "โต๊ะและเก้าอี้ตามความจุห้อง",
        "ชุดอุปกรณ์ทางไกลผ่านระบบเครือข่าย พร้อมไมโครโฟน จำนวน 1 ชุด",
        "อินเทอร์เน็ตแบบมีสาย"
      ],
      requirement: 'ห้องการเรียนการสอนทางไกล ให้บริการเฉพาะจัดการเรียนการสอนทางไกลผ่านระบบเครือข่ายของหน่วยงานภายในมก. เท่านั้น',
    }
  ];

  const handleNextImage = () => {
    if (selectedType && selectedType.images) {
      setCurrentImageIndex((prev) => (prev + 1) % (selectedType.images?.length || 1));
    }
  };

  const handlePrevImage = () => {
    if (selectedType && selectedType.images) {
      setCurrentImageIndex((prev) => (prev - 1 + (selectedType.images?.length || 1)) % (selectedType.images?.length || 1));
    }
  };

  const openModal = (roomType: RoomType) => {
    setSelectedType(roomType);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedType(null);
  };

  const rates = [
    {
      type: "Classroom (ห้องบรรยาย)",
      hourly: null,
      halfDay: 1950,
      fullDay: 3500,
      features: ["30-130 people", "Whiteboard", "Projector", "Flexible seating"],
    },
    {
      type: "Computer Classroom",
      hourly: null,
      halfDay: 5850,
      fullDay: 11300,
      features: ["30-100 people", "PCs included", "High-speed internet", "Technical support"],
    },

    {
      type: "Tele-Conference",
      hourly: null,
      halfDay: 800,
      fullDay: 1500,
      features: ["1-25 people", "HD Webcams", "Premium Audio", "Dual displays"],
    },
  ];

  return (
    <div className={`${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      {/* Hero Section */}
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes floatA {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-18px) scale(1.04); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(14px) scale(0.97); }
        }
        @keyframes numPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(147,197,253,0.45), 0 0 30px rgba(100,180,255,0.25); }
          50%       { box-shadow: 0 0 0 8px rgba(147,197,253,0), 0 0 40px rgba(100,180,255,0.4); }
        }
        .hero-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hero-card:hover {
          transform: translateY(-4px) scale(1.015);
          box-shadow: 0 28px 70px rgba(0,0,0,0.38) !important;
        }
      `}</style>
      <div className="py-20 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${computerRoomImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(3px)',
            transform: 'scale(1.05)'
          }}
        />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(15,32,65,0.94) 0%, rgba(10,20,45,0.99) 100%)'
              : 'linear-gradient(135deg, rgba(14,40,90,0.88) 0%, rgba(22,54,110,0.93) 50%, rgba(28,60,128,0.90) 100%)'
          }}
        />
        {/* Floating decorative circles */}
        <div style={{
          position: 'absolute', zIndex: 1, width: '340px', height: '340px',
          borderRadius: '50%', top: '-80px', left: '-80px',
          background: 'rgba(147,197,253,0.07)',
          animation: 'floatA 7s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', zIndex: 1, width: '220px', height: '220px',
          borderRadius: '50%', bottom: '40px', right: '5%',
          background: 'rgba(96,165,250,0.06)',
          animation: 'floatB 9s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', zIndex: 1, width: '130px', height: '130px',
          borderRadius: '50%', top: '30%', right: '18%',
          background: 'rgba(255,255,255,0.04)',
          animation: 'floatA 11s ease-in-out infinite 2s', pointerEvents: 'none',
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1
              className="text-5xl md:text-6xl mb-6 font-black text-white drop-shadow-lg"
              style={{
                color: '#ffffff',
                fontFamily: "'Noto Sans Thai', 'Inter', sans-serif",
                letterSpacing: '-1px',
                animation: 'heroFadeUp 0.7s ease-out both',
              }}
            >
              Welcome to OCS Meeting Rooms
            </h1>
            <p
              className="text-lg md:text-xl max-w-4xl mx-auto leading-relaxed font-light"
              style={{
                color: 'rgba(255,255,255,0.85)', fontWeight: 300, letterSpacing: '0.02em',
                animation: 'heroFadeUp 0.7s ease-out 0.15s both',
              }}
            >
              สำนักบริการคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์ ให้บริการเช่าห้องการเรียนการสอน <br />
              ห้องประชุม ห้องอบรมคอมพิวเตอร์ ฯลฯ พร้อมด้วยโสตทัศนูปกรณ์ที่ทันสมัย<br />
              ความจุตั้งแต่ 20-300 ที่นั่ง สำหรับหน่วยงานภายในและภายนอกมหาวิทยาลัยเกษตรศาสตร์
            </p>
          </div>

          {/* Bottom Cards Row */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6 pb-14" style={{ animation: 'heroFadeUp 0.7s ease-out 0.3s both' }}>

            {/* ===== Left: Terms Card (mimics login formCard style) ===== */}
            <div className="flex flex-col">
              <h2
                className="text-lg font-semibold text-white text-center mb-4"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)', letterSpacing: '0.04em' }}
              >
                ข้อกำหนดการใช้บริการ
              </h2>
              <div
                className="hero-card"
                style={{
                  flex: 1,
                  position: 'relative',
                  background: 'rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  borderRadius: '1.5rem',
                  padding: '1.75rem 1.5rem',
                  border: '1px solid rgba(255,255,255,0.18)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.28)',
                  overflow: 'hidden',
                }}
              >
                {/* Decorative circles like login page */}
                <div style={{
                  position: 'absolute', width: '220px', height: '220px',
                  borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
                  top: '-60px', right: '-60px', pointerEvents: 'none'
                }} />
                <div style={{
                  position: 'absolute', width: '160px', height: '160px',
                  borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
                  bottom: '-40px', left: '-40px', pointerEvents: 'none'
                }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
                  {/* Stat 1 */}
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.75rem' }}>
                      จองล่วงหน้าอย่างน้อย
                    </p>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '76px', height: '76px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.12)',
                      border: '2px solid rgba(147,197,253,0.4)',
                      animation: 'numPulse 2.8s ease-in-out infinite',
                      margin: '0 auto 0.5rem'
                    }}>
                      <span style={{
                        fontSize: '2.4rem', fontWeight: 900, color: '#fff',
                        textShadow: '0 0 22px rgba(147,197,253,0.9)', lineHeight: 1
                      }}>7</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem', fontWeight: 500 }}>วันทำการ</p>
                  </div>

                  {/* Divider */}
                  <div style={{ position: 'absolute', left: '50%', top: '10%', bottom: '10%', width: '1px', background: 'rgba(255,255,255,0.15)' }} />

                  {/* Stat 2 */}
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.75rem' }}>
                      ชำระเงินก่อนใช้บริการ
                    </p>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '76px', height: '76px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.12)',
                      border: '2px solid rgba(147,197,253,0.4)',
                      animation: 'numPulse 2.8s ease-in-out infinite 1.4s',
                      margin: '0 auto 0.5rem'
                    }}>
                      <span style={{
                        fontSize: '2.4rem', fontWeight: 900, color: '#fff',
                        textShadow: '0 0 22px rgba(147,197,253,0.9)', lineHeight: 1
                      }}>3</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem', fontWeight: 500 }}>วันทำการ</p>
                  </div>
                </div>

                {/* Parking Info */}
                <div style={{
                  marginTop: '1rem',
                  paddingTop: '0.875rem',
                  borderTop: '1px solid rgba(255,255,255,0.12)',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <p style={{
                    color: 'rgba(219,234,254,0.9)',
                    fontSize: '0.8rem',
                    fontWeight: 400,
                    lineHeight: 1.7,
                    margin: 0,
                    textAlign: 'center'
                  }}>
                    🚗 <strong style={{ fontWeight: 600 }}>ที่จอดรถวิทยากร</strong> ห้องละ 2 คัน<br />
                    ผู้เข้าอบรมจอดได้ที่ <strong style={{ fontWeight: 600 }}>อาคารจอดรถงามวงศ์วาน 1, 2</strong><br />
                    นำบัตรมาประทับตราที่ รปภ. ชั้น 1 อาคาร OCS<br />
                    รับส่วนลด <strong style={{ fontWeight: 600 }}>20 บาท/คัน/วัน</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* ===== Right: Contact Card — ContactPage design system ===== */}
            <div className="flex flex-col">
              <h2
                className="text-lg font-semibold text-white text-center mb-4"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)', letterSpacing: '0.04em' }}
              >
                สอบถามข้อมูลเพิ่มเติม
              </h2>

              <div style={{
                flex: 1, position: 'relative',
                background: 'rgba(255,255,255,0.10)',
                backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                borderRadius: '1.5rem',
                border: '1px solid rgba(255,255,255,0.18)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.28)',
                overflow: 'hidden',
              }}>
                {/* Decorative orbs */}
                <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: -70, left: -70, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', bottom: -45, right: -45, pointerEvents: 'none' }} />

                {/* Card header */}
                <div style={{ padding: '1.4rem 1.4rem 0.75rem', position: 'relative', zIndex: 1 }}>
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.8)' }}>
                    ติดต่อสอบถาม
                  </p>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.1)' }} />
                </div>

                {/* Contact rows */}
                <div style={{ padding: '0.5rem 1rem 1.25rem', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>

                  {/* Phone row */}
                  <div
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', background: 'rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '0.85rem 1rem', border: '1px solid rgba(255,255,255,0.11)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: 'rgba(96,165,250,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Phone className="w-5 h-5" style={{ color: '#93c5fd' }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: '0 0 4px', fontSize: '0.67rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#93c5fd' }}>โทรศัพท์</p>
                      <p style={{ margin: 0, fontSize: '0.84rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500, lineHeight: 1.65 }}>
                        0-2562-0951-6 ต่อ 622509, 622523<br />
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.76rem' }}>ในวันและเวลาราชการ</span>
                      </p>
                    </div>
                  </div>

                  {/* Email row */}
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', background: 'rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '0.85rem 1rem', border: '1px solid rgba(255,255,255,0.11)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: 'rgba(96,165,250,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Mail className="w-5 h-5" style={{ color: '#93c5fd' }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: '0 0 4px', fontSize: '0.67rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#93c5fd' }}>อีเมล</p>
                      <p style={{ margin: 0, fontSize: '0.84rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>roombooking-ocs@ku.ac.th</p>
                    </div>
                  </div>

                  {/* Facebook CTA */}
                  <a
                    href="https://www.facebook.com/OCSseminar.rooms"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.875rem',
                      background: 'rgba(24,119,242,0.16)', borderRadius: '1rem',
                      padding: '0.85rem 1rem',
                      border: '1px solid rgba(24,119,242,0.32)',
                      textDecoration: 'none', transition: 'all 0.22s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(24,119,242,0.28)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 10px 28px rgba(24,119,242,0.35)';
                      e.currentTarget.style.borderColor = 'rgba(24,119,242,0.55)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(24,119,242,0.16)';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = 'rgba(24,119,242,0.32)';
                    }}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: 'rgba(24,119,242,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Facebook className="w-5 h-5" style={{ color: '#60a5fa' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: '0 0 3px', fontSize: '0.67rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#93c5fd' }}>Facebook</p>
                      <p style={{ margin: 0, fontSize: '0.84rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>บริการห้องอบรมสัมมนา by OCS KU</p>
                    </div>
                    <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.6rem', padding: '0.3rem 0.7rem' }}>
                      <ExternalLink className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.7)' }} />
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}></span>
                    </div>
                  </a>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Types of Meeting Rooms Section */}
      <div className={`py-20 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <style>{`
          @keyframes homeModalPopIn {
            0% { opacity: 0; transform: scale(0.95) translateY(20px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes homeBackdropFadeIn {
            0% { opacity: 0; backdrop-filter: blur(0px); }
            100% { opacity: 1; backdrop-filter: blur(12px); }
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2
              className={`text-4xl mb-6 font-bold ${isDarkMode ? "text-white" : "text-gray-900"
                }`}
            >
              Types of Meeting Rooms
            </h2>
            <p
              className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
            >
              Discover the perfect space for every type of meeting or event
            </p>
          </div>
          <RoomSlider roomTypes={roomTypes} isDarkMode={isDarkMode} onCardClick={openModal} />
        </div>
      </div>

      {/* Modal Popup for Room Details */}
      {selectedType && createPortal(
        <div
          className="fixed inset-0 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/70 backdrop-blur-md"
          style={{ zIndex: 99999, animation: 'homeBackdropFadeIn 0.3s ease-out forwards' }}
          onClick={closeModal}
        >
          <div
            className={`relative w-full max-w-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[85vh] ${isDarkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-900'}`}
            style={{ zIndex: 100000, animation: 'homeModalPopIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Carousel */}
            <div className="relative w-full h-64 sm:h-80 bg-gray-900 group">
              <img
                src={selectedType.images?.[currentImageIndex] || selectedType.image}
                alt={`${selectedType.thaiName} view ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {(selectedType.images?.length || 0) > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                    className="absolute z-[60] shadow-xl flex items-center justify-center transition-colors hover:bg-black/80"
                    style={{ left: '16px', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white' }}
                  >
                    <ChevronLeft className="w-8 h-8 text-white" style={{ color: 'white' }} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                    className="absolute z-[60] shadow-xl flex items-center justify-center transition-colors hover:bg-black/80"
                    style={{ right: '16px', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white' }}
                  >
                    <ChevronRight className="w-8 h-8 text-white" style={{ color: 'white' }} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 z-[60]">
                    {selectedType.images?.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(idx);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-blue-400 w-5' : 'bg-white/50 hover:bg-white/80'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  <selectedType.icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedType.thaiName}</h2>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selectedType.name}</p>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">อุปกรณ์พื้นฐานประจำห้อง</h3>
                  {selectedType.equipmentList ? (
                    <ul className={`space-y-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedType.equipmentList.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={`leading-relaxed text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedType.description}
                    </p>
                  )}
                </div>

                {selectedType.requirement && (
                  <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-red-900/10 border-red-900/30' : 'bg-red-50 border-red-100'}`}>
                    <h3 className={`text-sm font-bold mb-1 flex items-center gap-2 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                      <span>⚠️ ข้อกำหนด</span>
                    </h3>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                      {selectedType.requirement}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Live Room Status Section */}
      <div className="py-20 relative overflow-hidden">
        {/* Background Image - Building */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${buildingImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(3px)',
            transform: 'scale(1.1)'
          }}
        />

        {/* Navy Blue Gradient Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(10, 20, 45, 0.97) 0%, rgba(15, 30, 60, 0.99) 100%)'
              : 'linear-gradient(135deg, rgba(20, 45, 90, 0.93) 0%, rgba(26, 58, 110, 0.96) 50%, rgba(30, 64, 128, 0.93) 100%)'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-8">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px',
              padding: '0.3rem 0.9rem', marginBottom: '0.75rem'
            }}>
              <span style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#4ade80', boxShadow: '0 0 8px #4ade80',
                display: 'inline-block', animation: 'pulse 2s infinite'
              }} />
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em' }}>
                LIVE STATUS
              </span>
            </div>
            <h2 style={{
              fontSize: '2rem', fontWeight: 800, color: '#fff',
              fontFamily: "'Noto Sans Thai', 'Inter', sans-serif",
              lineHeight: 1.2, marginBottom: 0
            }}>
              ห้องที่กำลังใช้งาน
            </h2>
          </div>

          {/* Mock Calendar Panel */}
          <div style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '1.75rem',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
            overflow: 'hidden',
          }}>
            {/* Panel Top Bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem 1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', position: 'relative' }}
                  onClick={() => {
                    if (monthInputRef.current) {
                      try {
                        monthInputRef.current.showPicker();
                      } catch (e) {
                        monthInputRef.current.focus();
                      }
                    }
                  }}
                >
                  <Calendar size={18} color="rgba(255,255,255,0.75)" />
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>
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
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[{ label: 'กำลังใช้งาน', color: '#4ade80' }, { label: 'จองแล้ว', color: '#f87171' }].map((status, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: status.color,
                      display: 'inline-block'
                    }} />
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>{status.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1px',
              background: 'rgba(255,255,255,0.06)',
              padding: '1px'
            }}>
              {isLoadingLiveRooms ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#fff', gridColumn: '1 / -1' }}>กำลังโหลดข้อมูลห้อง...</div>
              ) : liveRooms.length > 0 ? liveRooms.map((r, idx) => {
                const statusColor = r.status === 'in_use' ? '#4ade80' : '#f87171';
                const statusLabel = r.status === 'in_use' ? 'กำลังใช้งาน' : 'จองแล้ว';
                return (
                  <div key={idx} style={{
                    background: 'rgba(255,255,255,0.04)',
                    padding: '0.9rem 1rem 0.85rem',
                    display: 'flex', flexDirection: 'column', gap: '0.65rem',
                    transition: 'background 0.2s',
                    cursor: 'pointer',
                  }}
                    onClick={() => setSelectedLiveRoom(r)}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.09)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  >
                    {/* Room name & status badge */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.3rem' }}>
                          <Calendar size={12} color="rgba(255,255,255,0.65)" />
                          <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem', fontWeight: 500 }}>{r.date}</span>
                        </div>
                        <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', margin: 0, lineHeight: 1.3 }}>{r.room}</p>
                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', margin: '0.15rem 0 0' }}>{r.floor}</p>
                      </div>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        background: `${statusColor}18`,
                        border: `1px solid ${statusColor}55`,
                        borderRadius: '999px', padding: '0.2rem 0.6rem',
                        flexShrink: 0,
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor, display: 'inline-block' }} />
                        <span style={{ color: statusColor, fontSize: '0.7rem', fontWeight: 600 }}>{statusLabel}</span>
                      </div>
                    </div>

                    {/* Event info */}
                    {r.event ? (
                      <div style={{
                        background: 'rgba(255,255,255,0.06)', borderRadius: '0.75rem',
                        padding: '0.6rem 0.75rem', borderLeft: `3px solid ${statusColor}`
                      }}>
                        <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.82rem', margin: '0 0 0.2rem' }}>{r.event}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.35rem' }}>
                          <Clock size={11} color="rgba(255,255,255,0.45)" />
                          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem' }}>{r.time}</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        background: 'rgba(74,222,128,0.07)', borderRadius: '0.75rem',
                        padding: '0.6rem 0.75rem', borderLeft: '3px solid rgba(74,222,128,0.4)',
                        display: 'flex', alignItems: 'center', gap: '0.4rem'
                      }}>
                        <span style={{ color: '#4ade80', fontSize: '0.78rem' }}>ไม่มีการจองในช่วงนี้</span>
                      </div>
                    )}


                  </div>
                );
              }) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#fff', gridColumn: '1 / -1' }}>ไม่มีรายการในเดือนนี้</div>
              )}
            </div>

            {/* Panel Footer */}
            <div style={{
              padding: '0.65rem 1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.03)'
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                background: 'rgba(59,130,246,0.15)',
                border: '1px solid rgba(59,130,246,0.3)',
                borderRadius: '0.5rem', padding: '0.3rem 0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
                onClick={onNavigateCalendar}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(59,130,246,0.3)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(59,130,246,0.15)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <Calendar size={13} color="#93c5fd" />
                <span style={{ color: '#93c5fd', fontSize: '0.75rem', fontWeight: 600 }}>ดูปฏิทินเต็ม</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Room Rates Section */}
      <div className={`py-20 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2
              className={`text-4xl mb-6 font-bold ${isDarkMode ? "text-white" : "text-gray-900"
                }`}
            >
              Room Rates
            </h2>
            <p
              className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
            >
              Transparent pricing for all our meeting spaces. Choose what works
              best for you.
            </p>
          </div>

          <RateSlider rates={rates} isDarkMode={isDarkMode} />

          <div
            className={`rounded-2xl p-10 lg:p-12 border-2 shadow-xl ${isDarkMode
              ? "bg-gray-900 border-gray-700"
              : "bg-white border-gray-200"
              }`}
          >
            <h3
              className={`text-3xl mb-8 font-bold ${isDarkMode ? "text-white" : "text-gray-900"
                }`}
            >
              ข้อปฏิบัติการใช้บริการห้อง
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "จองหรือยกเลิกห้อง ต้องแจ้งล่วงหน้าอย่างน้อย 7 วันทำการ และยกเลิกก่อนใช้งาน 5 วันทำการ",
                "หากนำเซิร์ฟเวอร์หรือซอฟต์แวร์มาติดตั้งเอง ต้องแจ้งล่วงหน้า 5 วัน และทดสอบระบบก่อนใช้งานจริง 3 วัน พร้อมห้ามใช้ซอฟต์แวร์ไม่มีลิขสิทธิ์",
                "การเตรียมห้องและทดสอบระบบ ทำได้ในเวลาราชการ ใช้เวลาไม่เกิน 1–2 ชั่วโมง ฟรี หากเกินเวลาคิดค่าบริการตามปกติ",
                "หากพบปัญหาอุปกรณ์หรือระบบในห้อง ให้ติดต่อเจ้าหน้าที่ที่เกี่ยวข้องเท่านั้น",
                "การนำอุปกรณ์เสริมหรืออุปกรณ์จัดนิทรรศการมาใช้ ต้องแจ้งเจ้าหน้าที่และรับผิดชอบเรื่องความเข้ากันได้ของอุปกรณ์",
                "หากต้องใช้อินเทอร์เน็ต ต้องขอบัญชีใช้งานชั่วคราวล่วงหน้า และผู้ใช้ต้องรับผิดชอบการใช้งานบัญชี",
                "การใช้งานนอกเวลาราชการ มีค่าธรรมเนียมเพิ่มเติมวันละ 1,000–2,000 บาท",
                "หากนำอาหารหรือร้านค้าภายนอกเข้ามาเอง ต้องชำระค่าจัดการสิ่งแวดล้อม 1,000 บาทต่อวัน",
                "ผู้ใช้ต้องแจ้งผู้เข้าร่วมให้ปฏิบัติตามกฎของสถานที่ และรับผิดชอบความเสียหายที่เกิดขึ้น",
                "ผู้ใช้ต้องใช้สถานที่อย่างเหมาะสม ไม่ผิดกฎหมาย และไม่ก่อให้เกิดความเสียหายต่อหน่วยงาน",
              ].map((rule, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${isDarkMode ? 'bg-gray-800/50 border-gray-700 hover:border-blue-500/50' : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                    }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                    {idx + 1}
                  </div>
                  <p className={`mt-0.5 text-sm md:text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Room Details Modal */}
      {selectedLiveRoom && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedLiveRoom(null)} />
          <div
            className="relative w-full max-w-md p-6"
            style={{
              animation: 'homeModalPopIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              background: 'rgba(243, 244, 246, 0.9)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '1.75rem',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
              color: '#111827'
            }}
          >
            <button onClick={() => setSelectedLiveRoom(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors" style={{ color: '#6b7280' }}>
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-5 pr-8 pb-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
              <h3 className="text-xl font-bold" style={{ color: '#1f2937' }}>รายละเอียดการใช้งาน</h3>
              <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full text-xs font-bold" style={{ background: selectedLiveRoom.status === 'in_use' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248, 113, 113, 0.15)', color: selectedLiveRoom.status === 'in_use' ? '#4ade80' : '#f87171' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: selectedLiveRoom.status === 'in_use' ? '#4ade80' : '#f87171' }}></span>
                {selectedLiveRoom.status === 'in_use' ? 'กำลังใช้งาน' : 'จองแล้ว'}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.4rem', borderRadius: '0.5rem' }}>
                  <Briefcase className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.1rem' }}>หัวข้อ / โครงการ</p>
                  <p className="font-medium" style={{ color: '#111827' }}>{selectedLiveRoom.event}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.4rem', borderRadius: '0.5rem' }}>
                  <Building2 className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.1rem' }}>ห้องและชั้น</p>
                  <p className="font-medium" style={{ color: '#111827' }}>{selectedLiveRoom.room}</p>
                  <p style={{ fontSize: '0.8rem', color: '#4b5563', marginTop: '0.1rem' }}>{selectedLiveRoom.floor}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div style={{ background: 'rgba(249, 115, 22, 0.1)', padding: '0.4rem', borderRadius: '0.5rem' }}>
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.1rem' }}>วันและเวลา</p>
                  <p className="font-medium" style={{ color: '#111827' }}>{selectedLiveRoom.date} <span style={{ color: '#9ca3af', margin: '0 0.3rem' }}>·</span> {selectedLiveRoom.time}</p>
                </div>
              </div>
            </div>


          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
