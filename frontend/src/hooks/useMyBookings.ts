import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../App';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BookingStatus = 'draft' | 'approved' | 'confirmed' | 'completed' | 'cancel';

export interface BookingDetail {
  booking_id: number;
  customer_id: number;
  booking_detail_id: number;
  room_id: number;
  room_name: string;
  topic?: string;
  start_date: string;     // "YYYY-MM-DD"
  end_date: string;
  start_time: string;     // "HH:MM:SS"
  end_time: string;
  price_snapshot: number;
  total_amount: number;
  status: BookingStatus;
  payment_status?: string;
  notes?: string;
  created_at?: string;
  car_plate1?: string;
  car_plate2?: string;
}

interface RawRow {
  booking_id: number;
  customer_id: number;
  booking_detail_id: number;
  room_id: number;
  room_name?: string;
  topic?: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  price_snapshot: string | number;
  total_amount?: string | number;
  booking_status?: string;
  payment_status?: string;
  notes?: string;
  created_at?: string;
  car_plate1?: string;
  car_plate2?: string;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function mapRow(r: RawRow): BookingDetail {
  return {
    booking_id: r.booking_id,
    customer_id: r.customer_id,
    booking_detail_id: r.booking_detail_id,
    room_id: r.room_id,
    room_name: r.room_name ?? `ห้อง #${r.room_id}`,
    topic: r.topic,
    start_date: r.start_date,
    end_date: r.end_date,
    start_time: r.start_time,
    end_time: r.end_time,
    price_snapshot: Number(r.price_snapshot),
    total_amount: Number(r.total_amount ?? r.price_snapshot),
    status: (r.booking_status as BookingStatus) ?? 'draft',
    payment_status: r.payment_status,
    notes: r.notes,
    created_at: r.created_at,
    car_plate1: r.car_plate1,
    car_plate2: r.car_plate2,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useMyBookings(userId: number | null, status: 'all' | BookingStatus = 'all') {
  const [bookings, setBookings] = useState<BookingDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (!userId) {
      setBookings([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const url = status === 'all' 
        ? `${API_BASE_URL}/bookings/user/${userId}`
        : `${API_BASE_URL}/bookings/user/${userId}/status/${status}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data: RawRow[] = await res.json();
      // Sort newest booking first
      setBookings(
        data.map(mapRow).sort(
          (a, b) => b.booking_id - a.booking_id
        )
      );
    } catch (e) {
      console.error('[useMyBookings] Failed to load bookings:', e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_status: 'cancel' }),
      });
      if (!res.ok) {
        throw new Error(`Failed to cancel booking: ${res.statusText}`);
      }
      // re-fetch to reflect the cancelled status
      await fetchBookings();
      return true;
    } catch (e) {
      console.error('[useMyBookings] Failed to cancel booking:', e);
      return false;
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userId, status]);

  return { bookings, loading, error, refetch: fetchBookings, cancelBooking };
}
