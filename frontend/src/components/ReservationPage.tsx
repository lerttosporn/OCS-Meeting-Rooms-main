import { useState } from 'react';
import { HeroSection } from './HeroSection';
import { RoomList } from './RoomList';
import { RoomBookingPage } from './RoomBookingPage';
import { SearchFilters, UserRole } from '../App';
import { MeetingRoom } from '../hooks/useRooms';
import { CartItem } from '../types/booking';

interface ReservationPageProps {
  isDarkMode: boolean;
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  userRole: UserRole;
  userEmail?: string;
  onGoToLogin: () => void;
  cartItems: CartItem[];
  onAddToCart: (item: CartItem) => void;
}

export function ReservationPage({ isDarkMode, filters, setFilters, userRole, userEmail, onGoToLogin, onAddToCart }: ReservationPageProps) {
  const [selectedRoom, setSelectedRoom] = useState<MeetingRoom | null>(null);

  const handleSelectRoom = (room: MeetingRoom) => {
    setSelectedRoom(room);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedRoom(null);
    setTimeout(() => {
      document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // Show booking detail page
  if (selectedRoom) {
    return (
      <RoomBookingPage
        room={selectedRoom}
        isDarkMode={isDarkMode}
        onBack={handleBack}
        initialDate={filters.date}
        userRole={userRole}
        userEmail={userEmail}
        onGoToLogin={onGoToLogin}
        onAddToCart={onAddToCart}
      />
    );
  }

  // Show room list
  return (
    <div className="pb-24">
      <HeroSection filters={filters} setFilters={setFilters} isDarkMode={isDarkMode} />
      <RoomList
        filters={filters}
        isDarkMode={isDarkMode}
        userRole={userRole}
        onGoToLogin={onGoToLogin}
        onViewRoom={handleSelectRoom}
      />
    </div>
  );
}
