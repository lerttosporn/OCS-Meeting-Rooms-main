import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../App';

export interface AdminDashboardData {
  rooms: any[];
  bookings: any[];
  loading: boolean;
  error: string | null;
}

export function useAdmin() {
  const [data, setData] = useState<AdminDashboardData>({
    rooms: [],
    bookings: [],
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      const [roomsRes, bookingsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/rooms`),
        fetch(`${API_BASE_URL}/bookings`)
      ]);

      if (!roomsRes.ok) throw new Error('Failed to fetch rooms');
      if (!bookingsRes.ok) throw new Error('Failed to fetch bookings');

      const rooms = await roomsRes.json();
      const bookings = await bookingsRes.json();

      setData({
        rooms,
        bookings,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error('[useAdmin] Error fetching data', err);
      setData(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : String(err)
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { ...data, refetch: fetchData };
}
