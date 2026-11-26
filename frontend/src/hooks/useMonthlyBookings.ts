import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../App';

export interface MonthlyBooking {
  booking_id: number;
  booking_status: string;
  booking_detail_id: number;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  topic?: string;
  room_id: number;
  room_name?: string;
  floor?: string;
  room_type_id?: number;
  customer_name?: string;
  organization?: string;
}

export function useMonthlyBookings(yearMonth: string, status?: string) {
  const [bookings, setBookings] = useState<MonthlyBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (!yearMonth) {
      setBookings([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      
      // Parse the base month and calculate range (prev, current, next 1, next 2)
      // This ensures we have enough data even if the user navigates a few months in the calendar
      const [yearStr, monthStr] = yearMonth.split('-');
      const baseDate = new Date(parseInt(yearStr), parseInt(monthStr) - 1, 1);
      
      const monthsToFetch = [-1, 0, 1, 2].map(offset => {
        const d = new Date(baseDate);
        d.setMonth(d.getMonth() + offset);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        return `${y}-${m}`;
      });

      const allBookings: MonthlyBooking[] = [];
      const query = status ? `?status=${status}` : '';

      // Fetch all months concurrently
      const fetchPromises = monthsToFetch.map(async (m) => {
        const url = `${API_BASE_URL}/bookings/month/${m}${query}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          return data;
        }
        return [];
      });

      const results = await Promise.all(fetchPromises);
      results.forEach(data => {
        if (Array.isArray(data)) {
          allBookings.push(...data);
        }
      });

      setBookings(allBookings);
    } catch (e) {
      console.error('[useMonthlyBookings] Failed to load bookings:', e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [yearMonth, status]);

  return { bookings, loading, error, refetch: fetchBookings };
}
