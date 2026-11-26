import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../App';

export interface BookingWithRoom {
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
  price_snapshot: number | string;
  total_amount?: number | string;
  booking_status?: string;
  payment_status?: string;
  notes?: string;
  created_at?: string;
  car_plate1?: string;
  car_plate2?: string;
}

export function useUserBookingsByStatus(userId: number | null, status: string) {
  const [bookings, setBookings] = useState<BookingWithRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (!userId || !status) {
      setBookings([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const url = `${API_BASE_URL}/bookings/user/${userId}/status/${status}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setBookings(data);
    } catch (e) {
      console.error('[useUserBookingsByStatus] Failed to load bookings:', e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userId, status]);

  return { bookings, loading, error, refetch: fetchBookings };
}
