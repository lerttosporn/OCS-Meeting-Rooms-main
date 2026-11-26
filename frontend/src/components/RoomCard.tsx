import { useState } from 'react';
import { Users, Maximize, Check, Calendar, Clock } from 'lucide-react';
import { SearchFilters } from '../App';
import { MeetingRoom } from '../hooks/useRooms';
import { CartItem, TimeSlot } from '../types/booking';

interface RoomCardProps {
  room: MeetingRoom;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  isDarkMode: boolean;
  filters: SearchFilters;
  onViewDetails?: (room: MeetingRoom) => void;
}

export function RoomCard({ room, onAddToCart, isDarkMode, filters, onViewDetails }: RoomCardProps) {
  return (
    <div 
      className={`shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-300 flex flex-col border overflow-hidden ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}
      style={{
        borderRadius: '1.5rem',
        background: isDarkMode ? 'linear-gradient(145deg, #1f2937, #111827)' : 'linear-gradient(145deg, #ffffff, #f3f4f6)'
      }}
    >
      <div className="relative h-64 overflow-hidden shrink-0">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        <div 
          className="absolute top-4 right-4 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-md border border-white/20"
          style={{ background: 'linear-gradient(135deg, rgba(0,86,179,0.95), rgba(0,61,130,0.95))' }}
        >
          เริ่มต้น {room.priceHalfDay} บาท
        </div>
        {!room.available && (
          <div className="absolute top-4 left-4 text-white px-3 py-1 rounded-full" style={{ backgroundColor: '#d32f2f' }}>
            Booked
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className={`text-2xl mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{room.name}</h3>
        
        <div className={`flex items-center gap-4 mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className="text-sm">Up to {room.capacity} people</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="w-4 h-4" />
            <span className="text-sm">{room.size} sq ft</span>
          </div>
        </div>

        <p className={`mb-4 flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{room.description}</p>

        <div className="space-y-2 mb-6">
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <div key={index} className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Check className="w-4 h-4" style={{ color: '#00c853' }} />
              <span>{amenity}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => onViewDetails && onViewDetails(room)}
          disabled={!room.available}
          className="w-full text-white py-4 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-auto font-bold shadow-lg hover:shadow-xl hover:-translate-y-1"
          style={{ 
            background: room.available ? 'linear-gradient(135deg, #0066cc, #004da6)' : 'linear-gradient(135deg, #ef4444, #b91c1c)',
            opacity: room.available ? 1 : 0.6
          }}
        >
          {room.available ? 'View Details' : 'Not Available'}
        </button>
      </div>
    </div>
  );
}
