import { useState } from 'react';
import { API_BASE_URL } from '../App';
import { CartItem } from '../types/booking';

export interface CreateBookingPayload {
  customer_id: number;
  staff_id: number;
  total_amount: number;
  discount_amount?: number;
  booking_status: 'draft' | 'approved' | 'confirmed' | 'completed';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  notes?: string;
  details: {
    room_id: number;
    topic?: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    price_snapshot: number;
    overtime_fee?: number;
    car_plate1?: string;
    car_plate2?: string;
    training_format?: 'ON_SITE' | 'HYBRID';
    tools?: {
      tool_id: number;
      quantity: number;
      price_snapshot: number;
    }[];
    caterings?: {
      catering_id: number;
      quantity: number;
    }[];
    networks?: {
      package_id: number;
      account_quantity: number;
      url?: string;
      port?: string;
      delivery_email?: string;
    }[];
  }[];
}

export interface BookingResponse {
  booking_id: number;
  customer_id: number;
  total_amount: number;
  booking_status: string;
  payment_status: string;
  created_at: string;
}

/** Parse time slot string like "Morning (08:30-12:00)" into start/end times */
function parseTimeSlot(timeSlot: string): { start_time: string; end_time: string } {
  // Try to match HH:MM-HH:MM pattern
  const match = timeSlot.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
  if (match) {
    return {
      start_time: match[1] + ':00',
      end_time: match[2] + ':00',
    };
  }
  // Fallback
  return { start_time: '08:30:00', end_time: '16:30:00' };
}

/** Convert CartItems to CreateBookingPayload */
export function cartItemsToBookingPayload(
  cartItems: CartItem[],
  options?: {
    customer_id?: number;
    staff_id?: number;
    notes?: string;
  }
): CreateBookingPayload {
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

  const details = cartItems.map((item) => {
    const { start_time, end_time } = parseTimeSlot(item.timeSlot);
    return {
      room_id: parseInt(item.room.id, 10) || 1,
      topic: options?.notes,
      start_date: item.date,
      end_date: item.date,
      start_time,
      end_time,
      price_snapshot: item.price,
      overtime_fee: item.priceBreakdown?.find(b => b.label.includes('overtime_fee') || b.label.includes('วันหยุด') || b.label.includes('นอกเวลา'))?.price || 0,
      car_plate1: item.carPlate1 || undefined,
      car_plate2: item.carPlate2 || undefined,
      training_format: item.trainingFormat ?? 'ON_SITE',
      tools: item.selectedTools?.map(t => ({
        tool_id: t.tool_id,
        quantity: t.quantity,
        price_snapshot: t.price
      })),
      caterings: item.selectedCaterings?.map(c => ({
        catering_id: c.catering_id,
        quantity: c.quantity
      })),
      networks: item.selectedNetwork ? [{
        package_id: item.selectedNetwork.package_id,
        account_quantity: item.selectedNetwork.account_quantity,
        url: item.selectedNetwork.url,
        port: item.selectedNetwork.port,
        delivery_email: item.selectedNetwork.delivery_email
      }] : undefined
    };
  });

    const customer_id = options?.customer_id ?? parseInt(localStorage.getItem('ocs_user_id') || '1', 10);
    
  return {
    customer_id: customer_id,
    staff_id: options?.staff_id ?? customer_id,
    total_amount: totalAmount,
    discount_amount: 0,
    booking_status: 'draft',
    payment_status: 'unpaid',
    notes: options?.notes,
    details,
  };
}

/** Hook for creating a booking via POST /bookings */
export function useCreateBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<number | null>(null);

  const createBooking = async (
    cartItems: CartItem[],
    options?: { customer_id?: number; staff_id?: number; notes?: string }
  ): Promise<BookingResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const payload = cartItemsToBookingPayload(cartItems, options);

      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`POST /bookings failed: HTTP ${res.status} — ${errBody}`);
      }

      const data: BookingResponse = await res.json();
      setBookingId(data.booking_id);
      return data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('[useCreateBooking]', msg);
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setBookingId(null);
  };

  return { createBooking, loading, error, bookingId, reset };
}
