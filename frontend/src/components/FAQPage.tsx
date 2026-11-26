import { useState, useRef, useEffect } from 'react';
import { HelpCircle, ChevronDown, MessageCircle, Phone } from 'lucide-react';
import computerRoomImg from '../assets/computer-room.png';

interface FAQPageProps {
  isDarkMode: boolean;
}

const faqs = [
  {
    category: 'หมวดการจองห้อง',
    questions: [
      {
        q: 'วิธีการจองห้องประชุมทำอย่างไร?',
        a: 'คุณสามารถจองห้องประชุมผ่านระบบออนไลน์ โดยเลือกห้อง วันและเวลาที่ต้องการ เพิ่มลงในตะกร้า จากนั้นกดยืนยันการจอง ระบบจะบันทึกข้อมูลและส่งสถานะการจองให้คุณทราบ'
      },
      {
        q: 'สามารถจองห้องล่วงหน้าได้กี่วัน?',
        a: 'สามารถจองห้องประชุมล่วงหน้าได้สูงสุด 7 วัน เพื่อให้การบริหารจัดการห้องเป็นไปอย่างมีประสิทธิภาพ'
      },
      {
        q: 'สามารถจองหลายห้องพร้อมกันได้หรือไม่?',
        a: 'ได้ครับ คุณสามารถเพิ่มหลายห้องหรือหลายช่วงเวลาลงใน "ตะกร้าการจอง" และดำเนินการยืนยันการจองทั้งหมดพร้อมกันได้ในครั้งเดียว'
      },
      {
        q: 'หากช่วงเวลาถูกจองแล้วจะทำอย่างไร?',
        a: 'ระบบจะแสดงสถานะว่า "ไม่ว่าง" ในช่วงเวลานั้น คุณสามารถเลือกช่วงเวลาอื่นที่ว่างในวันเดียวกัน หรือดูห้องประชุมอื่นที่มีลักษณะใกล้เคียงกันแทน'
      },
      {
        q: 'สามารถเลือกอุปกรณ์เพิ่มเติมได้หรือไม่?',
        a: 'ได้ครับ ในขั้นตอนการทำรายการจอง คุณสามารถระบุความต้องการอุปกรณ์เสริมหรือบริการเพิ่มเติม (เช่น ระบบวีดีโอคอนเฟอเรนซ์ ไมโครโฟนพิเศษ) ได้ในหน้าตะกร้า'
      }
    ]
  },
  {
    category: 'หมวดเวลาและการใช้งาน',
    questions: [
      {
        q: 'สามารถจองแบบครึ่งวันและเต็มวันต่างกันอย่างไร?',
        a: 'การจองครึ่งวันจะแบ่งเป็น ช่วงเช้า (08:30 - 12:00 น.) และ ช่วงบ่าย (13:00 - 16:30 น.) ส่วนการจองเต็มวันจะครอบคลุมตั้งแต่เวลา 08:30 - 16:30 น.'
      },
      {
        q: 'หากมีการจองครึ่งวันแล้ว สามารถจองเต็มวันได้หรือไม่?',
        a: 'หากมีผู้จองห้องไปแล้วครึ่งวัน (เช่น ช่วงเช้า) คุณจะไม่สามารถจองเต็มวันได้ แต่ยังสามารถจองในช่วงเวลาที่เหลือ (ช่วงบ่าย) หากห้องยังว่างอยู่'
      },
      {
        q: 'เวลาในการใช้งานห้องประชุมเริ่มและสิ้นสุดกี่โมง?',
        a: 'เวลาทำการปกติคือ วันจันทร์ – ศุกร์ เวลา 08:30 – 16:30 น. (ในวันและเวลาราชการ)'
      }
    ]
  },
  {
    category: 'หมวดการแก้ไขและยกเลิก',
    questions: [
      {
        q: 'สามารถแก้ไขรายการจองได้หรือไม่?',
        a: 'ปัจจุบันคุณยังไม่สามารถแก้ไขรายละเอียดได้โดยตรง หากต้องการเปลี่ยนแปลง กรุณายกเลิกการจองเดิมแล้วทำรายการใหม่ หรือติดต่อเจ้าหน้าที่'
      },
      {
        q: 'สามารถยกเลิกการจองได้อย่างไร?',
        a: 'สามารถแจ้งดำเนินการล่วงหน้าอย่างน้อย 3-5 วันทำการ'
      },
      {
        q: 'หากต้องการเปลี่ยนวันจองต้องทำอย่างไร?',
        a: 'เช่นเดียวกับการแก้ไข คุณต้องทำการยกเลิกการจองในวันเดิมก่อน แล้วจึงเริ่มขั้นตอนการจองใหม่ในวันที่ต้องการ'
      }
    ]
  },
  {
    category: 'หมวดระบบและการติดต่อ',
    questions: [
      {
        q: 'หากพบปัญหาในการใช้งานระบบต้องติดต่อที่ไหน?',
        a: 'สามารถติดต่อฝ่ายดูแลระบบได้ที่สำนักบริการคอมพิวเตอร์ โทร. 0-2562-0951-6 ต่อ 622501, 622555 หรือ Helpdesk ต่อ 622541-3 หรืออีเมล roombooking-ocs@ku.ac.th'
      },
      {
        q: 'ระบบรองรับการใช้งานผ่านมือถือหรือไม่?',
        a: 'ระบบออกแบบมาให้เป็น Responsive Design อย่างสมบูรณ์ รองรับการใช้งานผ่านสมาร์ทโฟน แท็บเล็ต และคอมพิวเตอร์ได้อย่างเต็มรูปแบบ'
      }
    ]
  }
];

// Accordion Item Component
const FAQItem = ({ q, a, isOpen, onClick, dark }: { q: string, a: string, isOpen: boolean, onClick: () => void, dark: boolean }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`rounded-2xl transition-all duration-300 overflow-hidden border ${isOpen
          ? dark ? 'bg-blue-900/20 border-blue-500/30 shadow-[0_4px_20px_rgba(37,99,235,0.1)]' : 'bg-blue-50/50 border-blue-200 shadow-[0_4px_20px_rgba(37,99,235,0.08)]'
          : dark ? 'bg-gray-800/40 border-gray-700/50 hover:bg-gray-800 hover:border-gray-600' : 'bg-white border-gray-100 hover:border-blue-100 hover:shadow-sm'
        }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer group"
      >
        <span className={`font-semibold pr-4 transition-colors ${isOpen
            ? dark ? 'text-blue-400' : 'text-blue-700'
            : dark ? 'text-gray-200 group-hover:text-white' : 'text-gray-800 group-hover:text-blue-900'
          }`}>
          {q}
        </span>
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen
              ? dark ? 'bg-blue-500/20 text-blue-400 rotate-180' : 'bg-blue-100 text-blue-600 rotate-180'
              : dark ? 'bg-gray-700 text-gray-400 group-hover:bg-gray-600' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50'
            }`}
        >
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>

      <div
        ref={contentRef}
        className="transition-all duration-300 ease-in-out"
        style={{
          height: isOpen ? contentRef.current?.scrollHeight : 0,
          opacity: isOpen ? 1 : 0
        }}
      >
        <div className={`px-5 md:px-6 pb-6 pt-0 ${dark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
          {a}
        </div>
      </div>
    </div>
  );
};

export function FAQPage({ isDarkMode }: FAQPageProps) {
  const [openIndex, setOpenIndex] = useState<string | null>('0-0'); // Open first item by default
  const dark = isDarkMode;

  const toggleFAQ = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div style={{ minHeight: '100vh', background: dark ? '#0f172a' : '#F1F5F9', fontFamily: "'Noto Sans Thai','Inter',sans-serif" }}>

      {/* ── Hero Section (Matches Reservation & Contact) ─────────────── */}
      <div className="relative text-white overflow-hidden">
        {/* Background image with blur */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${computerRoomImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(3px)',
            transform: 'scale(1.05)',
          }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: dark
              ? 'linear-gradient(135deg, rgba(15,32,65,0.92) 0%, rgba(10,20,45,0.98) 100%)'
              : 'linear-gradient(135deg, rgba(20,45,90,0.85) 0%, rgba(26,58,110,0.92) 50%, rgba(30,64,128,0.88) 100%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.2)' }}>
              <HelpCircle className="w-4 h-4 text-blue-200" />
              <span className="text-sm font-semibold text-blue-100 tracking-wide">FAQ</span>
            </div>

            <b className="text-5xl mb-4" style={{ display: 'block', fontWeight: 800, lineHeight: 1.15 }}>
              คำถามที่พบบ่อย
            </b>
            <p className="text-xl mt-4 max-w-2xl mx-auto" style={{ color: dark ? '#cbd5e1' : '#f0f4f8', opacity: .85 }}>
              รวมคำถามและคำตอบเกี่ยวกับการใช้งานระบบจองห้องประชุม เพื่อให้คุณใช้งานได้อย่างราบรื่น
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: 64, paddingBottom: 80 }}>

        <div className="space-y-12">
          {faqs.map((category, catIdx) => (
            <div key={catIdx}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                  <MessageCircle className="w-4 h-4" />
                </div>
                <h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-[#1E3A8A]'}`}>
                  {category.category}
                </h2>
              </div>

              <div className="space-y-3">
                {category.questions.map((faq, qIdx) => {
                  const id = `${catIdx}-${qIdx}`;
                  return (
                    <FAQItem
                      key={id}
                      q={faq.q}
                      a={faq.a}
                      isOpen={openIndex === id}
                      onClick={() => toggleFAQ(id)}
                      dark={dark}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Support Card ─────────────────────────────────────────── */}
        <div className={`mt-16 rounded-3xl p-8 sm:p-10 text-center shadow-sm border transition-all ${dark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-blue-50 shadow-[0_10px_40px_rgba(0,0,0,0.03)]'
          }`}>
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6" style={{ background: dark ? 'rgba(96,165,250,.15)' : '#EFF6FF' }}>
            <Phone className={`w-7 h-7 ${dark ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <h3 className={`text-2xl font-bold mb-3 ${dark ? 'text-white' : 'text-[#1E3A8A]'}`}>
            ไม่พบคำตอบที่คุณตามหาใช่ไหม?
          </h3>
          <p className={`mb-8 max-w-lg mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            ทีมงานของเราพร้อมช่วยเหลือและตอบทุกข้อสงสัยของคุณ สามารถติดต่อเราได้ในวันและเวลาราชการ
          </p>
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              // Navigate to contact logic should ideally use the prop onNavigate, 
              // but since it's not provided in the original props, we'll just scroll.
              // We could trigger a simulated click on the contact nav if needed.
              const contactBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent === 'Contact Us');
              if (contactBtn) contactBtn.click();
            }}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}
          >
            ไปที่หน้าติดต่อเรา
          </button>
        </div>

      </div>
    </div>
  );
}
