import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../App';

// ─── Types (mirrors backend schema + bookings.service.ts output) ───────────────

export type BookingStatus = 'draft' | 'approved' | 'confirmed' | 'completed' | 'cancel';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface Booking {
  booking_id: number;
  customer_id: number;
  staff_id: number;
  total_amount: number;
  discount_amount: number;
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  notes: string | null;
  bookingdate: string;
  customer_name: string;
  staff_name: string;
  room_name?: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  topic?: string;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useBookings(status?: BookingStatus) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url = status
        ? `${API_BASE_URL}/bookings?status=${encodeURIComponent(status)}`
        : `${API_BASE_URL}/bookings`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const data: Booking[] = await res.json();
      setBookings(data);
    } catch (e) {
      console.error('[useBookings] Failed to load bookings:', e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [status]);

  const updateBookingStatus = useCallback(async (
    id: number,
    booking_status: BookingStatus,
    payment_status?: string,
  ) => {
    const body: Record<string, string> = { booking_status };
    if (payment_status) body.payment_status = payment_status;

    const res = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${res.status}`);
    }
    await fetchBookings();
    return res.json();
  }, [fetchBookings]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings, updateBookingStatus };
}

