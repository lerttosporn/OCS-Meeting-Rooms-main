import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingCart, X, Trash2, Calendar, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import { CartItem } from '../types/booking';
import { BookingModal } from './BookingModal';

interface FloatingCartProps {
  cartItems: CartItem[];
  isDarkMode: boolean;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  loading?: boolean;
  userRole?: string; // ซ่อนตะกร้าถ้ายังไม่ login
}

export function FloatingCart({ cartItems: cartItemsProp, isDarkMode, onRemoveItem, onClearCart, loading = false, userRole = 'guest' }: FloatingCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [popIn, setPopIn] = useState(false);
  const prevLengthRef = useRef(0);

  // Fallback ป้องกัน undefined
  const cartItems = cartItemsProp ?? [];

  // Debug log
  useEffect(() => {
    console.log('[FloatingCart] cartItems updated:', cartItems.length, cartItems);
  }, [cartItems]);

  // Pop-in animation เมื่อเพิ่ม item ใหม่
  useEffect(() => {
    if (cartItems.length > prevLengthRef.current) {
      setPopIn(true);
      const t = setTimeout(() => setPopIn(false), 600);
      prevLengthRef.current = cartItems.length;
      return () => clearTimeout(t);
    }
    prevLengthRef.current = cartItems.length;
  }, [cartItems.length]);

  // ปิด panel อัตโนมัติถ้า cart ว่าง
  useEffect(() => {
    if (cartItems.length === 0) setIsOpen(false);
  }, [cartItems.length]);

  // ซ่อนถ้ายังไม่ login (เป็น guest) หรือ cart ว่าง
  if (userRole === 'guest' || cartItems.length === 0) return null;

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const bg = isDarkMode ? '#1f2937' : '#ffffff';
  const borderColor = isDarkMode ? '#374151' : '#e5e7eb';
  const textMain = isDarkMode ? '#f9fafb' : '#111827';
  const textSub = isDarkMode ? '#9ca3af' : '#6b7280';
  const cardBg = isDarkMode ? '#111827' : '#f8fafc';

  // ── Render ทุกอย่างเข้า document.body โดยตรง ผ่าน Portal ──────────────
  // วิธีนี้ข้ามปัญหา stacking context / transform / overflow ของ parent ทั้งหมด
  return createPortal(
    <>
      {/* ── Floating Cart Button ─────────────────────────────────────── */}
      {/* ซ่อนด้วย opacity+scale เมื่อ drawer เปิด เพื่อป้องกัน UI ซ้อนทับ */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="เปิดตะกร้าการจอง"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          borderRadius: '16px',
          border: 'none',
          color: '#ffffff',
          fontWeight: 700,
          cursor: isOpen ? 'default' : 'pointer',
          pointerEvents: isOpen ? 'none' : 'auto',
          background: 'linear-gradient(135deg, #0066cc, #004da6)',
          boxShadow: isOpen ? 'none' : '0 8px 32px rgba(0,102,204,0.4)',
          // ซ่อน/แสดงด้วย opacity + scale — ไม่ unmount ทำให้ transition ลื่น
          opacity: isOpen ? 0 : 1,
          transform: isOpen
            ? 'scale(0.7) translateY(8px)'
            : popIn
              ? 'scale(1.12) translateY(-2px)'
              : 'scale(1) translateY(0)',
          transition: [
            'opacity 0.25s ease',
            'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            'box-shadow 0.25s ease',
          ].join(', '),
        }}
        onMouseEnter={e => {
          if (!isOpen) e.currentTarget.style.transform = 'scale(1.04) translateY(-3px)';
        }}
        onMouseLeave={e => {
          if (!isOpen) e.currentTarget.style.transform = 'scale(1) translateY(0)';
        }}
      >
        {/* ไอคอน + badge */}
        <div style={{ position: 'relative' }}>
          <ShoppingCart style={{ width: '20px', height: '20px' }} />
          <span
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#ef4444',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {cartItems.length}
          </span>
        </div>
        <span style={{ fontSize: '14px' }}>ตะกร้า</span>
        <span style={{ fontSize: '14px', opacity: 0.8 }}>·</span>
        <span style={{ fontSize: '14px' }}>{totalPrice.toLocaleString()} ฿</span>
      </button>

      {/* ── Cart Panel Backdrop ──────────────────────────────────────── */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99998,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {/* ── Cart Panel ────────────────────────────────────────────── */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '400px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '24px 24px 0 0',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              margin: '0',
              background: bg,
              border: `1px solid ${borderColor}`,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: `1px solid ${borderColor}`,
                flexShrink: 0,
                background: 'linear-gradient(135deg, #0066cc, #004da6)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart style={{ width: '20px', height: '20px', color: '#fff' }} />
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#fff' }}>ตะกร้าการจอง</h2>
                <span
                  style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)', color: '#fff',
                    fontSize: '12px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {cartItems.length}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {cartItems.length > 0 && (
                  <button
                    onClick={onClearCart}
                    disabled={loading}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      fontSize: '12px', color: 'rgba(255,255,255,0.7)',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      padding: '4px 8px', borderRadius: '8px',
                      opacity: loading ? 0.5 : 1,
                    }}
                  >
                    <Trash2 style={{ width: '14px', height: '14px' }} />
                    {loading ? '...' : 'ล้างทั้งหมด'}
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '6px', borderRadius: '8px', background: 'transparent',
                    border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  <X style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>

            {/* Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cartItems.map((item, idx) => (
                <div
                  key={item.id}
                  style={{ borderRadius: '16px', overflow: 'hidden', border: `1px solid ${borderColor}`, backgroundColor: cardBg }}
                >
                  <div
                    style={{
                      padding: '10px 16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: isDarkMode ? '#1e3a5f' : '#eff6ff',
                      borderBottom: `1px solid ${borderColor}`,
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: isDarkMode ? '#93c5fd' : '#1d4ed8' }}>
                        {item.room.name}
                      </p>
                      <p style={{ margin: 0, fontSize: '11px', color: textSub }}>รายการที่ {idx + 1}</p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      disabled={loading}
                      style={{
                        padding: '6px', borderRadius: '8px', background: 'transparent',
                        border: 'none', cursor: 'pointer', color: '#f87171',
                        opacity: loading ? 0.4 : 1,
                      }}
                    >
                      <X style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>

                  <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar style={{ width: '14px', height: '14px', flexShrink: 0, color: textSub }} />
                      <span style={{ fontSize: '12px', color: textMain }}>
                        {new Date(item.date + 'T00:00:00').toLocaleDateString('th-TH', {
                          weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock style={{ width: '14px', height: '14px', flexShrink: 0, color: textSub }} />
                      <span style={{ fontSize: '12px', color: textMain }}>{item.timeSlot}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', borderTop: `1px solid ${borderColor}` }}>
                      <span style={{ fontSize: '12px', color: textSub }}>ราคา</span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#0056b3' }}>
                        {item.price.toLocaleString()} ฿
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ flexShrink: 0, borderTop: `1px solid ${borderColor}`, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: bg }}>
              {/* Total */}
              <div
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 16px', borderRadius: '16px',
                  background: isDarkMode ? '#1e3a5f' : '#eff6ff',
                  border: `1px solid ${isDarkMode ? '#2d5a9e' : '#bfdbfe'}`,
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: '12px', color: textSub }}>ยอดรวมทั้งหมด ({cartItems.length} ห้อง)</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0056b3' }}>
                    {totalPrice.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 600 }}>฿</span>
                  </p>
                </div>
              </div>

              {/* Notice */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '8px 12px', borderRadius: '12px', background: '#fef3c7', border: '1px solid #fcd34d' }}>
                <AlertCircle style={{ width: '14px', height: '14px', flexShrink: 0, marginTop: '2px', color: '#d97706' }} />
                <p style={{ margin: 0, fontSize: '12px', color: '#92400e' }}>
                  ตรวจสอบรายการก่อนยืนยัน กดจองเพื่อชำระเงิน
                </p>
              </div>

              {/* Book All Button */}
              <button
                onClick={() => { setIsOpen(false); setShowBookingModal(true); }}
                style={{
                  width: '100%', padding: '14px', borderRadius: '16px',
                  border: 'none', color: '#fff', fontWeight: 700, fontSize: '16px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '8px',
                  background: 'linear-gradient(135deg, #0066cc, #004da6)',
                  boxShadow: '0 4px 16px rgba(0,102,204,0.35)',
                }}
              >
                <ShoppingCart style={{ width: '20px', height: '20px' }} />
                จองทั้งหมด {cartItems.length} ห้อง
                <ChevronRight style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Confirmation Modal */}
      {showBookingModal && (
        <BookingModal
          cartItems={cartItems}
          isDarkMode={isDarkMode}
          onBookingSuccess={onClearCart}
          onClose={() => {
            setShowBookingModal(false);
          }}
        />
      )}
    </>,
    document.body  // ← render ตรงเข้า body ข้าม parent ทุกตัว
  );
}
