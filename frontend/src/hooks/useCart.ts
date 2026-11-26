import { useState, useEffect, useCallback, useRef } from 'react';
import { API_BASE_URL } from '../App';
import { CartItem } from '../types/booking';
import { MeetingRoom } from './useRooms';

// ─────────────────────────────────────────────────────────────────────────────
// Types (kept for backwards-compat with BookingModal / useCreateBooking)
// ─────────────────────────────────────────────────────────────────────────────

export interface CartResponse {
  cart_id: number;
  user_id: number;
  created_at: string;
}

export interface CreateCartItemPayload {
  cart_id: number;
  room_id: number;
  room_rate_id: number;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
}

export interface CartItemResponse {
  cart_item_id: number;
  cart_id: number;
  room_id: number;
  room_rate_id: number;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Parse time slot string "Morning (08:30-12:00)" → {start_time, end_time} */
function parseTimeSlot(timeSlot: string): { start_time: string; end_time: string } {
  const match = timeSlot.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
  if (match) {
    return { start_time: match[1] + ':00', end_time: match[2] + ':00' };
  }
  return { start_time: '08:30:00', end_time: '16:30:00' };
}

/** Convert backend start_time/end_time back to frontend slot label */
function timeToSlotLabel(startTime?: string, endTime?: string): string {
  if (!startTime || !endTime) return 'Full Day (08:30-16:30)';
  const s = startTime.substring(0, 5);
  const e = endTime.substring(0, 5);
  if (s === '08:30' && e === '12:00') return 'Morning (08:30-12:00)';
  if (s === '13:00' && e === '16:30') return 'Afternoon (13:00-16:30)';
  return `${s}-${e}`;
}

/** Map a backend cart_item row to a frontend CartItem */
function mapBackendItem(bi: any): CartItem {
  const room: MeetingRoom = {
    id: String(bi.room_id),
    name: bi.room_name ?? `ห้อง #${bi.room_id}`,
    type: [],
    capacity: 0,
    floor: 0,
    size: 0,
    amenities: [],
    description: '',
    available: true,
    status: 'available',
    image: '',
    priceHalfDay: Number(bi.price) ?? 0,
    priceFullDay: Number(bi.price) ?? 0,
  };
  return {
    id: String(bi.cart_item_id),
    room,
    date: bi.start_date,
    timeSlot: timeToSlotLabel(bi.start_time, bi.end_time),
    price: Number(bi.price) ?? 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Low-level API helpers (kept for BookingModal / useCreateBooking backward compat)
// ─────────────────────────────────────────────────────────────────────────────

export async function ensureCart(userId: number): Promise<CartResponse> {
  const res = await fetch(`${API_BASE_URL}/carts/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`POST /carts/${userId} failed: HTTP ${res.status} — ${body}`);
  }
  return res.json();
}

export async function addCartItem(payload: CreateCartItemPayload): Promise<CartItemResponse> {
  const res = await fetch(`${API_BASE_URL}/cart-items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`POST /cart-items failed: HTTP ${res.status} — ${body}`);
  }
  return res.json();
}

export async function syncCartItems(
  userId: number,
  cartItems: CartItem[]
): Promise<{ cart: CartResponse; cartItemResults: CartItemResponse[] }> {
  const cart = await ensureCart(userId);
  const cartItemResults = await Promise.all(
    cartItems.map((item) => {
      const { start_time, end_time } = parseTimeSlot(item.timeSlot);
      const payload: CreateCartItemPayload = {
        cart_id: cart.cart_id,
        room_id: parseInt(item.room.id, 10) || 1,
        room_rate_id: parseInt(item.room.id, 10) || 1,
        start_date: item.date,
        end_date: item.date,
        start_time,
        end_time,
      };
      return addCartItem(payload);
    })
  );
  return { cart, cartItemResults };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main React Hook — manages cart state fully via backend API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * useCart — full cart state management connected to backend.
 *
 * Usage:
 *   const { cartItems, loading, addToCart, removeFromCart, clearCart } = useCart(userId);
 */
export function useCart(userId: number = 1) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const addToCart = async (item: CartItem): Promise<boolean> => {
    const duplicate = cartItems.some(
      (c) => c.room.id === item.room.id && c.date === item.date && c.timeSlot === item.timeSlot
    );
    if (duplicate) {
      alert(`${item.room.name} วันที่ ${item.date} ช่วง ${item.timeSlot} มีในตะกร้าแล้ว`);
      return false;
    }

    setCartItems((prev) => [...prev, item]);
    return true;
  };

  // ── Remove item ─────────────────────────────────────────────────────────
  const removeFromCart = async (cartItemId: string): Promise<void> => {
    setCartItems((prev) => prev.filter((c) => c.id !== cartItemId));
  };

  // ── Clear cart ──────────────────────────────────────────────────────────
  const clearCart = async (): Promise<void> => {
    setCartItems([]);
    setCartId(null);
  };

  // ── Kept for backward compat (BookingModal uses this) ──────────────────
  const syncItems = async (uid: number, items: CartItem[]) =>
    syncCartItems(uid, items);

  const reset = () => {
    setError(null);
    setCartId(null);
    setCartItems([]);
  };

  // Legacy wrappers
  const createCart = (uid: number) =>
    ensureCart(uid).then((c) => { setCartId(c.cart_id); return c; });

  const addItem = (payload: CreateCartItemPayload) =>
    addCartItem(payload);

  return {
    // New API
    cartItems,
    cartId,
    loading,
    error,
    addToCart,
    removeFromCart,
    clearCart,
    // Legacy (used by BookingModal / useCreateBooking)
    syncItems,
    createCart,
    addItem,
    reset,
  };
}
