import { useState } from 'react';
import { X, Check, ChevronRight, AlertCircle } from 'lucide-react';
import { CartItem } from '../types/booking';
import { useCreateBooking } from '../hooks/useCreateBooking';
import { useCart } from '../hooks/useCart';
import { useRoomRates } from '../hooks/useRoomRates';

interface BookingModalProps {
  cartItems: CartItem[];
  onClose: () => void;
  onBookingSuccess?: () => void;
  isDarkMode: boolean;
  notes?: string;
}

type Step = 'confirm' | 'payment';

const PROMPTPAY_NUMBER = '0152000010';

export function BookingModal({ cartItems, onClose, onBookingSuccess, isDarkMode, notes }: BookingModalProps) {
  const [step, setStep] = useState<Step>('confirm');
  const { createBooking, loading, error } = useCreateBooking();
  const { syncItems } = useCart();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const bg = isDarkMode ? '#1f2937' : '#ffffff';
  const textMain = isDarkMode ? '#f9fafb' : '#111827';
  const textSub = isDarkMode ? '#9ca3af' : '#6b7280';
  const cardBg = isDarkMode ? '#374151' : '#f9fafb';
  const borderColor = isDarkMode ? '#4b5563' : '#e5e7eb';

  const inputCls = `w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900'
    }`;

  const handleConfirm = async () => {
    // Sync cart items to backend cart first (best-effort)
    try {
      await syncItems(1, cartItems);
    } catch (_) {
      // non-blocking
    }
    const result = await createBooking(cartItems, { notes: notes?.trim() || undefined });
    if (result) {
      onBookingSuccess?.(); // ล้าง cart หลังจองสำเร็จ
      setStep('payment');
    }
  };

  // ── STEP 1: Booking Confirmation Details ──────────────────────────────────
  if (step === 'confirm') {
    return (
      <div
        className="fixed inset-0 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-8 overflow-y-auto"
        style={{ backgroundColor: 'rgba(0,31,63,0.75)' }}
      >
        <div
          className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-4"
          style={{ backgroundColor: bg, border: `1px solid ${borderColor}` }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">1</div>
              <h2 className="text-lg font-bold" style={{ color: textMain }}>ยืนยันรายละเอียดการจอง</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pt-2 pb-8 space-y-5">
            {/* Booking Summary Cards */}
            {cartItems.map((item, idx) => (
              <div key={item.id} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${borderColor}` }}>
                {/* Room Header */}
                <div className="px-5 py-3 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #0066cc, #004da6)' }}>
                  <div>
                    <span className="text-white font-bold text-base">{item.room.name}</span>
                    <div className="text-blue-200 text-xs mt-0.5">
                      ชั้น {item.room.id?.charAt(0)} · จุ {item.room.capacity} คน
                    </div>
                  </div>
                  <div className="text-xs text-blue-200">รายการที่ {idx + 1}</div>
                </div>

                {/* Details */}
                <div className="px-5 py-4 space-y-3" style={{ backgroundColor: cardBg }}>
                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: textSub }}>วันที่จอง</p>
                      <p className="text-sm font-medium" style={{ color: textMain }}>
                        {new Date(item.date).toLocaleDateString('th-TH', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: textSub }}>ช่วงเวลา</p>
                      <p className="text-sm font-medium" style={{ color: textMain }}>{item.timeSlot}</p>
                    </div>
                  </div>

                  {/* Meeting Topic display */}
                  {notes?.trim() && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: textSub }}>หัวข้อการประชุม</p>
                      <p className="text-sm font-medium" style={{ color: textMain }}>{notes}</p>
                    </div>
                  )}

                  {/* Price Breakdown from cart item */}
                  {item.priceBreakdown && item.priceBreakdown.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: textSub }}>รายละเอียดค่าใช้จ่าย</p>
                      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${borderColor}` }}>
                        {item.priceBreakdown.map((row, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center px-4 py-2.5 text-sm"
                            style={{
                              backgroundColor: i % 2 === 0
                                ? (isDarkMode ? '#374151' : '#fff')
                                : (isDarkMode ? '#2d3748' : '#f9fafb'),
                              borderBottom: i < item.priceBreakdown!.length - 1
                                ? `1px solid ${borderColor}` : 'none',
                            }}
                          >
                            <span style={{ color: textSub }}>{row.label}</span>
                            <span className="font-semibold" style={{ color: textMain }}>
                              {row.price.toLocaleString()} ฿
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subtotal */}
                  <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor }}>
                    <span className="text-sm font-bold" style={{ color: textMain }}>รวมรายการนี้</span>
                    <span className="text-lg font-extrabold" style={{ color: '#0056b3' }}>
                      {item.price.toLocaleString()} ฿
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Grand Total */}
            {cartItems.length > 1 && (
              <div className="flex justify-between items-center px-5 py-3 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #0066cc, #004da6)' }}>
                <span className="text-white font-bold">รวมทั้งหมด</span>
                <span className="text-white text-2xl font-extrabold">{totalPrice.toLocaleString()} ฿</span>
              </div>
            )}


            {/* API Error */}
            {error && (
              <div className="rounded-xl p-3 flex items-start gap-2" style={{ background: '#fee2e2', border: '1px solid #fca5a5' }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="px-6 pb-15 pt-2 flex gap-3 justify-center">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-4 rounded-2xl text-sm font-semibold border transition-all flex items-center justify-center hover:opacity-80 hover:shadow-xl active:scale-95 disabled:opacity-40"
              style={{ borderColor, color: textSub, backgroundColor: bg }}
            >
              ยกเลิก
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 py-4 rounded-2xl text-white text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #0066cc, #004da6)' }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  กำลังสร้างการจอง...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  ยืนยันการจอง
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 2: QR Code Payment ────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0,31,63,0.75)' }}
    >
      <div
        className="rounded-2xl shadow-2xl"
        style={{ backgroundColor: bg, border: `1px solid ${borderColor}`, width: '300px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xs">2</div>
            <h2 className="text-sm font-bold" style={{ color: textMain }}>ชำระเงิน (PromptPay)</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-center">
          {/* QR Code */}
          <div className="rounded-xl p-3" style={{ background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', border: '2px solid #bae6fd' }}>
            <img
              src={`https://promptpay.io/${PROMPTPAY_NUMBER}/${totalPrice}.png`}
              alt="PromptPay QR Code"
              className="w-36 h-36 object-contain mx-auto rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://api.qrserver.com/v1/create-qr-code/?size=144x144&data=PromptPay:${PROMPTPAY_NUMBER}:${totalPrice}`;
              }}
            />
            <p className="text-xs mt-1.5 font-semibold" style={{ color: '#0369a1' }}>สำนักบริการคอมพิวเตอร์ มก.</p>
            <p className="text-xs" style={{ color: '#64748b' }}>PromptPay: {PROMPTPAY_NUMBER}</p>
          </div>

          {/* Amount */}
          <div className="rounded-xl px-3 py-2" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
            <p className="text-xs mb-0.5" style={{ color: textSub }}>ยอดที่ต้องชำระ</p>
            <p className="text-2xl font-extrabold" style={{ color: '#059669' }}>
              {totalPrice.toLocaleString()} <span className="text-sm font-semibold">฿</span>
            </p>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-xs mt-0.5" style={{ color: textSub }}>
                <span>{item.room.name}</span>
                <span>{item.price.toLocaleString()} ฿</span>
              </div>
            ))}
          </div>

          {/* Notice */}
          <div className="rounded-xl p-2.5 flex items-start gap-2 text-left" style={{ background: '#fef3c7', border: '1px solid #fcd34d' }}>
            <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: '#d97706' }} />
            <p className="text-xs" style={{ color: '#92400e' }}>
              บันทึกหน้าจอเป็นหลักฐาน
            </p>
          </div>

          {/* Done button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-white font-bold text-sm shadow-lg transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #0066cc, #004da6)' }}
          >
            <Check className="w-4 h-4 inline mr-1.5" />
            ชำระเงินแล้ว — เสร็จสิ้น
          </button>
        </div>
      </div>
    </div>
  );
}
