import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../App';

// ─── Types (mirrors schema.sql `room_rate` table) ─────────────────────────────

export interface RoomRate {
  room_rate_id: number;
  room_id: number;
  rate_name: string;      // e.g. "ครึ่งวัน", "เต็มวัน"
  start_time: string;     // "08:30:00"
  end_time: string;       // "12:00:00"
  price: number;          // parsed as number
}

// Raw response from backend (decimal price may come as string from pg)
interface RawRoomRate {
  room_rate_id: number;
  room_id: number;
  rate_name: string;
  start_time: string;
  end_time: string;
  price: string | number;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function mapRate(r: RawRoomRate): RoomRate {
  return {
    room_rate_id: r.room_rate_id,
    room_id: r.room_id,
    rate_name: r.rate_name,
    start_time: r.start_time,
    end_time: r.end_time,
    price: Number(r.price),
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRoomRates() {
  const [rates, setRates] = useState<RoomRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/room-rates`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const data: RawRoomRate[] = await res.json();
      setRates(data.map(mapRate));
    } catch (e) {
      console.error('[useRoomRates] Failed to load room rates:', e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  /** กรองเรทราคาของห้องที่ระบุ */
  const getRatesByRoomId = (roomId: number): RoomRate[] =>
    rates.filter((r) => r.room_id === roomId);

  /** หาราคาครึ่งวันของห้องที่ระบุ */
  const getHalfDayPrice = (roomId: number): number | undefined => {
    const rate = rates.find(
      (r) =>
        r.room_id === roomId &&
        (r.rate_name.includes('ครึ่ง') || r.rate_name.toLowerCase().includes('half'))
    );
    return rate ? rate.price : undefined;
  };

  /** หาราคาเต็มวันของห้องที่ระบุ */
  const getFullDayPrice = (roomId: number): number | undefined => {
    const rate = rates.find(
      (r) =>
        r.room_id === roomId &&
        (r.rate_name.includes('เต็ม') || r.rate_name.toLowerCase().includes('full'))
    );
    return rate ? rate.price : undefined;
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return {
    rates,
    loading,
    error,
    refetch: fetchRates,
    getRatesByRoomId,
    getHalfDayPrice,
    getFullDayPrice,
  };
}
