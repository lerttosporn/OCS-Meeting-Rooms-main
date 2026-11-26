import { MapPin, Phone, Mail, Clock, Facebook, ExternalLink } from 'lucide-react';
import computerRoomImg from '../assets/computer-room.png';

interface ContactPageProps {
  isDarkMode: boolean;
}

const contactItems = [
  {
    icon: MapPin,
    label: 'Address',
    labelTH: 'ที่อยู่',
    lines: [
      'สำนักบริการคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์',
      'เลขที่ 50 ถนนงามวงศ์วาน',
      'แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900',
    ],
  },
  {
    icon: Phone,
    label: 'Phone',
    labelTH: 'โทรศัพท์',
    lines: [
      'โทร. 0-2562-0951-6 ต่อ 622501, 622555',
      'Helpdesk ต่อ 622541-3',
      'แฟกซ์. 0-2562-0950',
    ],
  },
  {
    icon: Mail,
    label: 'Email',
    labelTH: 'อีเมล',
    lines: ['roombooking-ocs@ku.ac.th'],
  },
  {
    icon: Facebook,
    label: 'Facebook',
    labelTH: 'Facebook',
    lines: ['บริการห้องอบรมสัมมนา by OCS KU'],
    link: 'https://www.facebook.com/OCSseminar.rooms',
  },
  {
    icon: Clock,
    label: 'Hours',
    labelTH: 'เวลาทำการ',
    lines: ['วันจันทร์ – ศุกร์  เวลา 08.30 – 16.30 น.', '(วันและเวลาราชการ)'],
  },
];

export function ContactPage({ isDarkMode }: ContactPageProps) {
  const dark = isDarkMode;

  return (
    <div style={{ minHeight: '100vh', background: dark ? '#0f172a' : '#F1F5F9', fontFamily: "'Noto Sans Thai','Inter',sans-serif" }}>

      {/* ── Hero — matches HeroSection.tsx exactly ─────────────── */}
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

        {/* Gradient overlay — identical to HeroSection */}
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
          <div className="text-center mb-4">
            <b className="text-5xl mb-4" style={{ display: 'block', fontWeight: 800, lineHeight: 1.15 }}>
              Contact Us
            </b>
            <p className="text-xl mt-4" style={{ color: dark ? '#cbd5e1' : '#f0f4f8', opacity: .88 }}>
              พร้อมให้บริการและตอบทุกคำถามเกี่ยวกับการจองห้องประชุม
            </p>
          </div>

        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: 48, paddingBottom: 80 }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
            gap: 28,
            alignItems: 'start',
          }}
        >
          {/* ── Contact Info Card ─────────────────────────────── */}
          <div
            className={`rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-lg border ${dark ? 'bg-black bg-opacity-40 border-gray-700' : 'bg-white bg-opacity-90 border-white border-opacity-60'}`}
            style={{ overflow: 'hidden' }}
          >
            {/* Card header — no heavy strip, clean title */}
            <div style={{ padding: '28px 28px 0' }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: -0.5,
                  color: dark ? '#f1f5f9' : '#1E3A8A',
                }}
              >
                ข้อมูลติดต่อ
              </h2>
              <p style={{ margin: '4px 0 20px', fontSize: 13.5, color: dark ? '#94a3b8' : '#475569' }}>
                สำนักบริการคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์
              </p>
              <div style={{ height: 1, background: dark ? 'rgba(255,255,255,.08)' : 'rgba(30,58,138,.1)' }} />
            </div>

            {/* Items */}
            <div style={{ padding: '16px 20px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {contactItems.map(({ icon: Icon, labelTH, lines, link }) => (
                <div
                  key={labelTH}
                  className={`flex items-start gap-4 rounded-2xl transition-all duration-200 ${dark ? 'bg-white bg-opacity-5 border border-white border-opacity-10' : 'bg-blue-50 border border-blue-100'}`}
                  style={{ padding: '14px 16px', cursor: 'default' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(30,58,138,.14)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'none';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  {/* Glass icon orb */}
                  <div
                    style={{
                      width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                      background: dark ? 'rgba(96,165,250,.18)' : 'rgba(37,99,235,.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Icon style={{ width: 20, height: 20, color: dark ? '#93c5fd' : '#2563EB' }} />
                  </div>

                  {/* Text */}
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        margin: '0 0 4px',
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 1.2,
                        textTransform: 'uppercase',
                        color: dark ? '#60a5fa' : '#2563EB',
                      }}
                    >
                      {labelTH}
                    </p>
                    {lines.map((line, i) =>
                      link && i === 0 ? (
                        <a
                          key={i}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            fontSize: 14, fontWeight: 600,
                            color: dark ? '#93c5fd' : '#2563EB',
                            textDecoration: 'none',
                          }}
                        >
                          {line}
                          <ExternalLink style={{ width: 13, height: 13 }} />
                        </a>
                      ) : (
                        <p
                          key={i}
                          style={{
                            margin: '1px 0 0', fontSize: 14,
                            color: dark ? '#94a3b8' : '#475569',
                            lineHeight: 1.65,
                          }}
                        >
                          {line}
                        </p>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Google Map Card ───────────────────────────────── */}
          <div
            className={`rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-lg border ${dark ? 'bg-black bg-opacity-40 border-gray-700' : 'bg-white bg-opacity-90 border-white border-opacity-60'}`}
            style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            {/* Card header */}
            <div style={{ padding: '28px 28px 0' }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: -0.5,
                  color: dark ? '#f1f5f9' : '#1E3A8A',
                }}
              >
                แผนที่
              </h2>
              <p style={{ margin: '4px 0 20px', fontSize: 13.5, color: dark ? '#94a3b8' : '#475569' }}>
                สำนักบริการคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์ บางเขน
              </p>
              <div style={{ height: 1, background: dark ? 'rgba(255,255,255,.08)' : 'rgba(30,58,138,.1)' }} />
            </div>

            {/* Map */}
            <div style={{ padding: '20px 20px 28px', flex: 1 }}>
              <div
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  height: 440,
                  boxShadow: '0 4px 20px rgba(30,58,138,.12)',
                  border: dark ? '1px solid rgba(255,255,255,.08)' : '1px solid rgba(30,58,138,.1)',
                }}
              >
                <iframe
                  src="https://maps.google.com/maps?q=%E0%B8%AA%E0%B8%B3%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%84%E0%B8%AD%E0%B8%A1%E0%B8%9E%E0%B8%B4%E0%B8%A7%E0%B9%80%E0%B8%95%E0%B8%AD%E0%B8%A3%E0%B9%8C+%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%A2%E0%B9%80%E0%B8%81%E0%B8%A9%E0%B8%95%E0%B8%A3%E0%B8%A8%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B9%8C+%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%82%E0%B8%99&t=&z=17&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps - สำนักบริการคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
