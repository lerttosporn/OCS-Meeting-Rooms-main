import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../App';

// ─── Room type (source of truth — mirrors schema.sql `room` table) ────────────
export interface MeetingRoom {
  id: string;
  name: string;
  type: string[];
  priceHalfDay: number;
  priceFullDay: number;
  image: string;
  capacity: number;
  floor: number;
  size: number;
  amenities: string[];
  description: string;
  available: boolean;
  status: 'available' | 'maintenance' | 'reserved';
}

// ─── Raw types from backend (matching schema.sql) ─────────────────────────────

interface RawRoomRate {
  room_rate_id: number;
  room_id: number;
  rate_name: string;        // e.g. "ครึ่งวัน", "เต็มวัน"
  start_time: string;       // "08:30:00"
  end_time: string;         // "12:00:00"
  price: string | number;   // decimal comes as string from pg
}

interface RawRoom {
  room_id: number;
  org_id: number;
  room_type_id: number;
  room_name: string;
  capacity: number;
  floor: number;
  room_status: 'available' | 'maintenance' | 'reserved';
  // Joined fields (if backend includes them)
  room_type_name?: string;
  description?: string;
  room_rates?: RawRoomRate[];
  // Legacy / alternative field names
  name?: string;
  type?: string | string[];
  priceHalfDay?: number;
  priceFullDay?: number;
  amenities?: string[];
  image?: string;
  size?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Map Thai room_type name → frontend type key */
function mapRoomType(typeName: string): string[] {
  const n = typeName || '';
  if (n.includes('คอมพิวเตอร์')) return ['computer'];
  if (n.includes('บรรยาย') || n.includes('อบรม')) return ['classroom'];
  if (n.includes('ใหญ่') || n.includes('Auditorium')) return ['theatre'];
  if (n.includes('ทางไกล') || n.includes('Video')) return ['tele-conference'];
  if (n.includes('จัดเลี้ยง') || n.includes('Catering')) return ['catering'];
  return ['classroom'];
}

/** Pick the half-day rate price from room_rates array */
function pickHalfDayPrice(rates?: RawRoomRate[]): number {
  if (!rates || rates.length === 0) return 1500;
  const half = rates.find(r =>
    r.rate_name?.includes('ครึ่ง') || r.rate_name?.toLowerCase().includes('half')
  );
  return Number(half?.price ?? rates[0].price ?? 1500);
}

/** Pick the full-day rate price from room_rates array */
function pickFullDayPrice(rates?: RawRoomRate[]): number {
  if (!rates || rates.length === 0) return 3000;
  const full = rates.find(r =>
    r.rate_name?.includes('เต็ม') || r.rate_name?.toLowerCase().includes('full')
  );
  return Number(full?.price ?? rates[rates.length - 1].price ?? 3000);
}

/** Map a raw room record to the frontend MeetingRoom interface */
function mapRoom(r: RawRoom): MeetingRoom {
  const roomName = r.room_name || r.name || 'Unknown Room';
  const typeName = r.room_type_name || (Array.isArray(r.type) ? r.type[0] : r.type) || '';

  // Override type for known room name patterns
  let roomType = mapRoomType(typeName);
  if (roomName.includes('901') || roomName.includes('915') || roomName.includes('ทางไกล')) {
    roomType = ['tele-conference'];
  }

  return {
    id: String(r.room_id || ''),
    name: roomName,
    type: roomType,
    priceHalfDay: r.priceHalfDay ?? pickHalfDayPrice(r.room_rates),
    priceFullDay: r.priceFullDay ?? pickFullDayPrice(r.room_rates),
    image: r.image ?? '',
    capacity: r.capacity ?? 0,
    floor: r.floor ?? 0,
    size: r.size ?? 0,
    amenities: Array.isArray(r.amenities) ? r.amenities : [],
    description: r.description ?? '',
    available: r.room_status !== 'maintenance',
    status: r.room_status,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRooms() {
  const [rooms, setRooms] = useState<MeetingRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/rooms`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const data: RawRoom[] = await res.json();
      setRooms(data.map(mapRoom));
    } catch (e) {
      console.error('[useRooms] Failed to load rooms:', e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const updateRoomStatus = async (id: number, status: 'available' | 'maintenance' | 'reserved') => {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('ocs_token') ? { 'Authorization': `Bearer ${localStorage.getItem('ocs_token')}` } : {})
        },
        body: JSON.stringify({ room_status: status }),
      });
      if (!res.ok) throw new Error('Failed to update room status');
      await fetchRooms();
      return await res.json();
    } catch (err) {
      console.error('[useRooms] Error updating room status', err);
      throw err;
    }
  };

  const createRoom = async (roomData: {
    org_id: number;
    room_type_id: number;
    room_name: string;
    capacity: number;
    floor: number;
    room_status: 'available' | 'maintenance' | 'reserved';
  }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('ocs_token') ? { 'Authorization': `Bearer ${localStorage.getItem('ocs_token')}` } : {})
        },
        body: JSON.stringify(roomData),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to create room');
      }
      await fetchRooms();
      return await res.json();
    } catch (err) {
      console.error('[useRooms] Error creating room', err);
      throw err;
    }
  };

  const updateRoom = async (id: number, roomData: Partial<{
    org_id: number;
    room_type_id: number;
    room_name: string;
    capacity: number;
    floor: number;
    room_status: 'available' | 'maintenance' | 'reserved';
  }>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('ocs_token') ? { 'Authorization': `Bearer ${localStorage.getItem('ocs_token')}` } : {})
        },
        body: JSON.stringify(roomData),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to update room');
      }
      await fetchRooms();
      return await res.json();
    } catch (err) {
      console.error('[useRooms] Error updating room', err);
      throw err;
    }
  };

  const deleteRoom = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/${id}`, {
        method: 'DELETE',
        headers: {
          ...(localStorage.getItem('ocs_token') ? { 'Authorization': `Bearer ${localStorage.getItem('ocs_token')}` } : {})
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to delete room');
      }
      await fetchRooms();
      return await res.json();
    } catch (err) {
      console.error('[useRooms] Error deleting room', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return {
    rooms,
    loading,
    error,
    refetch: fetchRooms,
    updateRoomStatus,
    createRoom,
    updateRoom,
    deleteRoom,
  };
}
