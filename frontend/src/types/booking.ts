// Shared frontend types — import from here instead of App.tsx
// Room type lives in useRooms.ts (source of truth)
import { MeetingRoom } from '../hooks/useRooms';

export type { MeetingRoom };
export type TimeSlot = string;

/** One booking item (room + date/time + price) */
export interface CartItem {
  id: string;
  room: MeetingRoom;
  date: string;
  timeSlot: TimeSlot;
  price: number;
  priceBreakdown?: { label: string; price: number }[];
  selectedTools?: { tool_id: number; quantity: number; price: number; name: string }[];
  selectedCaterings?: { catering_id: number; quantity: number; name: string }[];
  selectedNetwork?: {
    package_id: number;
    account_quantity: number;
    url?: string;
    port?: string;
    delivery_email?: string;
  };
  carPlate1?: string;
  carPlate2?: string;
  trainingFormat?: 'ON_SITE' | 'HYBRID';
}
