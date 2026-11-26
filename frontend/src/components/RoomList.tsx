import { useMemo } from 'react';
import { RoomCardCompact } from './RoomCardCompact';
import { SearchFilters, UserRole } from '../App';
import { useRooms, MeetingRoom } from '../hooks/useRooms';
import { useRoomRates } from '../hooks/useRoomRates';
import { useMonthlyBookings } from '../hooks/useMonthlyBookings';

interface RoomListProps {
  filters: SearchFilters;
  isDarkMode: boolean;
  userRole: UserRole;
  onGoToLogin: () => void;
  onViewRoom: (room: MeetingRoom) => void;
}

const TYPE_TITLE: Record<string, string> = {
  classroom: 'Seminar & Theatre Rooms — ห้องบรรยาย',
  computer: 'Computer Rooms — ห้องคอมพิวเตอร์',
  'tele-conference': 'Tele-Conference — ห้องประชุมทางไกล',
  all: 'Our Meeting Rooms',
};

// Type priority for sorting: classroom/theatre first, computer second, tele-conference third
const TYPE_ORDER: Record<string, number> = {
  classroom: 0,
  theatre: 0,
  computer: 1,
  'tele-conference': 2,
};

export function RoomList({
  filters,
  isDarkMode,
  userRole,
  onGoToLogin,
  onViewRoom,
}: RoomListProps) {
  const { rooms, loading, error } = useRooms();
  const { rates } = useRoomRates();

  // Derive yearMonth from filter date for booking status lookup
  const yearMonth = useMemo(() => {
    if (!filters.date) {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }
    return filters.date.substring(0, 7); // "YYYY-MM"
  }, [filters.date]);

  const { bookings: monthlyBookings } = useMonthlyBookings(yearMonth);

  // Compute per-room booking status for the selected date
  const roomBookingStatus = useMemo(() => {
    const status: Record<number, { isHalfBooked: boolean; isFullyBooked: boolean }> = {};
    if (!filters.date || monthlyBookings.length === 0) return status;

    const selectedDate = filters.date; // YYYY-MM-DD

    monthlyBookings
      .filter(b => ['draft', 'approved', 'confirmed'].includes(b.booking_status))
      .forEach(b => {
        const bDate = b.start_date ? new Date(b.start_date).toLocaleDateString('en-CA') : '';
        if (bDate !== selectedDate) return;

        const roomId = b.room_id;
        if (!status[roomId]) status[roomId] = { isHalfBooked: false, isFullyBooked: false };

        const s = status[roomId];
        // Morning slot
        if (b.start_time <= '09:00:00' && b.end_time >= '12:00:00') s.isHalfBooked = true;
        // Afternoon slot
        if (b.start_time <= '13:30:00' && b.end_time >= '16:00:00') s.isHalfBooked = true;
        // Full day
        if (b.start_time <= '09:00:00' && b.end_time >= '16:00:00') {
          s.isHalfBooked = false;
          s.isFullyBooked = true;
        }
      });

    // Second pass: if both half-day slots are taken → fully booked
    Object.keys(status).forEach(roomIdStr => {
      const roomId = Number(roomIdStr);
      let morningTaken = false;
      let afternoonTaken = false;
      monthlyBookings
        .filter(b => b.room_id === roomId && ['draft', 'approved', 'confirmed'].includes(b.booking_status))
        .forEach(b => {
          const bDate = b.start_date ? new Date(b.start_date).toLocaleDateString('en-CA') : '';
          if (bDate !== selectedDate) return;
          if (b.start_time <= '09:00:00' && b.end_time >= '12:00:00') morningTaken = true;
          if (b.start_time <= '13:30:00' && b.end_time >= '16:00:00') afternoonTaken = true;
        });
      if (morningTaken && afternoonTaken) {
        status[roomId].isFullyBooked = true;
        status[roomId].isHalfBooked = false;
      }
    });

    return status;
  }, [filters.date, monthlyBookings]);

  const filteredRooms = useMemo(() => {
    // Map theatre -> classroom for display grouping
    const resolveDisplayType = (room: MeetingRoom): string => {
      const t = room.type?.[0] || 'classroom';
      return t === 'theatre' ? 'classroom' : t;
    };

    return rooms.filter((room) => {
      // Exclude ห้องโถง and catering rooms
      if (room.name && room.name.includes('โถง')) return false;
      if (room.type && room.type.includes('catering')) return false;

      // Filter by selected roomType (classroom filter also shows theatre)
      if (filters.roomType !== 'all') {
        const filterType = filters.roomType;
        const roomTypes = room.type || [];
        if (filterType === 'classroom') {
          if (!roomTypes.includes('classroom') && !roomTypes.includes('theatre')) return false;
        } else {
          if (!roomTypes.includes(filterType)) return false;
        }
      }
      if (filters.attendees > room.capacity) return false;
      return true;
    }).sort((a, b) => {
      const aOrder = TYPE_ORDER[a.type?.[0] || 'classroom'] ?? 99;
      const bOrder = TYPE_ORDER[b.type?.[0] || 'classroom'] ?? 99;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.capacity - b.capacity;
    }).map((room) => ({ ...room, _displayType: resolveDisplayType(room) }));
  }, [rooms, filters, rates]);

  // Merge live rates into room objects
  const roomsWithLiveRates = useMemo(() => {
    if (rates.length === 0) return filteredRooms;
    return filteredRooms.map((room) => {
      const roomId = Number(room.id);
      const roomRates = rates.filter((r) => r.room_id === roomId);
      if (roomRates.length === 0) return room;

      const halfRate = roomRates.find(
        (r) => r.rate_name.includes('ครึ่ง') || r.rate_name.toLowerCase().includes('half')
      );
      const fullRate = roomRates.find(
        (r) => r.rate_name.includes('เต็ม') || r.rate_name.toLowerCase().includes('full')
      );

      return {
        ...room,
        priceHalfDay: halfRate ? halfRate.price : (roomRates[0]?.price ?? room.priceHalfDay),
        priceFullDay: fullRate ? fullRate.price : (roomRates[roomRates.length - 1]?.price ?? room.priceFullDay),
      };
    });
  }, [filteredRooms, rates]);

  // Sort: unavailable rooms at the bottom, then fully-booked rooms
  const sortedRooms = useMemo(() => {
    return [...roomsWithLiveRates].sort((a, b) => {
      if (a.available !== b.available) return a.available ? -1 : 1;

      const aFull = roomBookingStatus[Number(a.id)]?.isFullyBooked ?? false;
      const bFull = roomBookingStatus[Number(b.id)]?.isFullyBooked ?? false;
      if (aFull && !bFull) return 1;
      if (!aFull && bFull) return -1;
      return 0;
    });
  }, [roomsWithLiveRates, roomBookingStatus]);

  const title = TYPE_TITLE[filters.roomType] || TYPE_TITLE.all;

  return (
    <section id="rooms" className="w-full px-4 sm:px-6 lg:px-8 pb-16" style={{ backgroundColor: isDarkMode ? '#111827' : '#f0f4f8', paddingTop: '80px' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className={`text-5xl md:text-6xl mb-6 font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {filteredRooms.length} ห้องที่ตรงกับเงื่อนไข · กดที่ห้องเพื่อดูรายละเอียดและจอง
          </p>
        </div>

        {loading ? (
          <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>กำลังโหลดห้อง...</p>
        ) : error ? (
          <p className={`text-center text-red-500`}>เกิดข้อผิดพลาดในการดึงข้อมูล: {error}</p>
        ) : filteredRooms.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              ไม่พบห้องที่ตรงกับเงื่อนไข กรุณาปรับตัวกรองใหม่
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedRooms.map((room) => {
              const roomId = Number(room.id);
              const bStatus = roomBookingStatus[roomId];
              return (
                <RoomCardCompact
                  key={room.id}
                  room={room}
                  isDarkMode={isDarkMode}
                  filters={filters}
                  userRole={userRole}
                  onGoToLogin={onGoToLogin}
                  onViewRoom={onViewRoom}
                  isFullyBooked={bStatus?.isFullyBooked ?? false}
                  isHalfBooked={bStatus?.isHalfBooked ?? false}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
