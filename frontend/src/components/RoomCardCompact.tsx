import { Users } from 'lucide-react';
import { SearchFilters, UserRole } from '../App';
import { MeetingRoom } from '../hooks/useRooms';

import computerRoomImg from "../assets/computer-room.png";
import classroomImg from "../assets/classroom.jpg";
import theatreRoomImg from "../assets/theatre-room.jpg";
import teleconferenceRoomImg from "../assets/teleconference-room.jpg";

import room301Img from "../assets/rooms/301.png";
import room302Img from "../assets/rooms/302.png";
import room303Img from "../assets/rooms/303.png";
import room304Img from "../assets/rooms/304.png";
import room306Img from "../assets/rooms/306.jpg";
import room402Img from "../assets/rooms/402.jpg";
import room403Img from "../assets/rooms/403.png";
import room404Img from "../assets/rooms/404.png";
import room405Img from "../assets/rooms/405.png";
import room406Img from "../assets/rooms/406.png";
import room407Img from "../assets/rooms/407.png";
import room408Img from "../assets/rooms/408.png";
import room409Img from "../assets/rooms/409.png";
import room501_5Img from "../assets/rooms/501_5.png";
import room506_9_11Img from "../assets/rooms/506_9_11.png";
import room510Img from "../assets/rooms/510.png";
import room801Img from "../assets/rooms/801.png";
import room802Img from "../assets/rooms/802.png";
import room803Img from "../assets/rooms/803.png";
import room804Img from "../assets/rooms/804.png";
import room805Img from "../assets/rooms/805.png";
import room806Img from "../assets/rooms/806.png";
import room901Img from "../assets/rooms/901.png";
import room906Img from "../assets/rooms/906.jpg";
import room911Img from "../assets/rooms/911.png";
import room912Img from "../assets/rooms/912.png";
import room913Img from "../assets/rooms/913.png";
import room915Img from "../assets/rooms/915.png";

interface RoomCardCompactProps {
  room: MeetingRoom;
  isDarkMode: boolean;
  filters: SearchFilters;
  userRole: UserRole;
  onGoToLogin: () => void;
  onViewRoom: (room: MeetingRoom) => void;
  isFullyBooked?: boolean;
  isHalfBooked?: boolean;
}

const TYPE_LABEL: Record<string, string> = {
  classroom: 'ห้องบรรยาย',
  computer: 'ห้องคอมพิวเตอร์',
  theatre: 'ห้องประชุม',
  'tele-conference': 'ห้องประชุมออนไลน์',
  catering: 'ห้องจัดเลี้ยง',
};

const TYPE_COLOR: Record<string, { accent: string; badge: string; badgeText: string }> = {
  classroom: { accent: '#0056b3', badge: '#e0f2fe', badgeText: '#0284c7' }, // Light blue badge
  computer: { accent: '#059669', badge: '#d1fae5', badgeText: '#065f46' },
  theatre: { accent: '#7c3aed', badge: '#ede9fe', badgeText: '#5b21b6' },
  'tele-conference': { accent: '#ea580c', badge: '#ffedd5', badgeText: '#c2410c' }, // Orange badge
  catering: { accent: '#db2777', badge: '#fce7f3', badgeText: '#9d174d' },
};

const TYPE_IMAGE: Record<string, string> = {
  classroom: classroomImg,
  computer: computerRoomImg,
  theatre: theatreRoomImg,
  'tele-conference': teleconferenceRoomImg,
  catering: classroomImg,
};

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

export function RoomCardCompact({ room, isDarkMode, onViewRoom, isFullyBooked = false, isHalfBooked = false }: RoomCardCompactProps) {
  const primaryType = (room.type && room.type[0]) || 'classroom';
  const isDisabled = !room.available || isFullyBooked;
  const { accent, badge, badgeText } = isFullyBooked
    ? { accent: '#6b7280', badge: '#f3f4f6', badgeText: '#6b7280' }
    : (TYPE_COLOR[primaryType] || TYPE_COLOR.classroom);
  const typeLabel = TYPE_LABEL[primaryType] || primaryType;

  // Try to match specific room number from the room name
  const roomNumberMatch = room.name.match(/\d+/);
  const roomNumber = roomNumberMatch ? roomNumberMatch[0] : '';
  const imageSrc = SPECIFIC_ROOM_IMAGE[roomNumber] || TYPE_IMAGE[primaryType] || classroomImg;

  const bg = isFullyBooked
    ? (isDarkMode ? '#1a1f2e' : '#f3f4f6')
    : (isDarkMode ? '#1e2433' : '#ffffff');
  const border = isFullyBooked
    ? (isDarkMode ? '#374151' : '#d1d5db')
    : (isDarkMode ? '#2d3748' : '#e8ecf0');
  const text = isFullyBooked
    ? (isDarkMode ? '#6b7280' : '#9ca3af')
    : (isDarkMode ? '#f1f5f9' : '#1a202c');
  const muted = isDarkMode ? '#64748b' : '#6b7280';

  return (
    <button
      onClick={() => !isDisabled && onViewRoom(room)}
      disabled={isDisabled}
      className={`relative group w-full text-left rounded-xl border transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 flex flex-col ${isDisabled
          ? 'opacity-70 cursor-not-allowed'
          : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
        } ${isDisabled ? 'grayscale' : ''}`}
      style={{ background: bg, borderColor: border, height: '220px' }}
    >
      {/* Room Image — 50% of card */}
      <div className="w-full overflow-hidden relative" style={{ height: '110px', flexShrink: 0 }}>
        <img
          src={imageSrc}
          alt={room.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${!isDisabled ? 'group-hover:scale-110' : ''} ${isFullyBooked ? 'grayscale' : ''}`}
        />
        {!room.available && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-bold rounded shadow-md z-10">
            ปิดการใช้งาน
          </div>
        )}
        {isHalfBooked && !isFullyBooked && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-orange-500 text-white text-[9px] font-bold rounded shadow-md z-10">
            ว่างบางช่วง
          </div>
        )}
      </div>

      <div className="px-3 py-2 flex flex-col gap-1 flex-1 overflow-hidden">
        {/* Title and Badge */}
        <div className="flex items-center justify-between gap-1">
          <span className="text-base font-bold leading-tight truncate" style={{ color: text }}>
            {room.name}
          </span>
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ml-1"
            style={{ background: badge, color: badgeText }}
          >
            {typeLabel}
          </span>
        </div>

        {/* Capacity */}
        <div className="flex items-center gap-1" style={{ color: muted }}>
          <Users className="w-3 h-3" />
          <span className="text-[11px]">สูงสุด {room.capacity} คน</span>
        </div>

        {/* Price + arrow */}
        <div className="flex items-center justify-between mt-1">
          <div>
            <span className="text-sm font-bold" style={{ color: accent }}>
              {room.priceHalfDay.toLocaleString()} ฿
            </span>
            <span className="text-[10px] font-medium ml-1" style={{ color: muted }}>
              / เริ่มต้น
            </span>
          </div>
          <div
            className="flex items-center gap-1 text-xs font-semibold transition-transform group-hover:translate-x-0.5"
            style={{ color: accent }}
          >
            <span></span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Overlay for disabled or fully booked rooms */}
      {isDisabled && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-500/30 backdrop-grayscale">
          <span className="bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg">
            {!room.available ? 'ห้องยังไม่พร้อมใช้งาน' : '🔒 จองเต็มแล้ว'}
          </span>
        </div>
      )}
    </button>
  );
}
