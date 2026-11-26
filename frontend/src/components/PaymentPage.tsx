import React, { useRef } from 'react';
import { Printer, ArrowLeft, CheckCircle, Clock, Info } from 'lucide-react';
import { CartItem } from '../types/booking';
import ocsLogo from '../assets/ocs-logo.png';

interface PaymentPageProps {
  cartItems: CartItem[];
  organizerName: string;
  isDarkMode: boolean;
  onBack: () => void;
  onDone: () => void;
}

export function PaymentPage({ cartItems, organizerName, isDarkMode, onBack, onDone }: PaymentPageProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
  const today = new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} py-8 px-4`}>

      {/* Actions bar - hidden on print */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
        >
          <ArrowLeft className="w-4 h-4" />
          กลับ
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-100 text-green-700 font-semibold text-sm border border-green-200">
            <CheckCircle className="w-4 h-4" />
            บันทึกการจองสำเร็จแล้ว
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-semibold shadow-md transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #0066cc, #004da6)' }}
          >
            <Printer className="w-4 h-4" />
            พิมพ์ใบนำฝาก
          </button>
        </div>
      </div>

      {/* Status Banner - hidden on print */}
      <div className="max-w-4xl mx-auto mb-5 print:hidden">
        <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: '#fffbeb', border: '1px solid #fcd34d' }}>
          <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#d97706' }} />
          <div>
            <p className="font-bold text-sm" style={{ color: '#92400e' }}>รอการตรวจสอบชำระเงิน</p>
            <p className="text-xs mt-1" style={{ color: '#78350f' }}>
              กรุณาชำระเงินผ่านธนาคาร TTB (Comp. Code: 2577) ตามใบนำฝากด้านล่าง
              หลังชำระเงินแล้ว เจ้าหน้าที่จะตรวจสอบและส่งอีเมลยืนยันการจองให้ท่าน
            </p>
          </div>
        </div>
      </div>

      {/* Payment Slip */}
      <div
        ref={printRef}
        className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden print:shadow-none print:rounded-none"
        style={{ fontFamily: '"TH Sarabun New", Sarabun, sans-serif', color: '#000', fontSize: '14px' }}
      >

        {/* TOP STRIP */}
        <div
          className="text-white text-right text-xs px-6 py-1.5"
          style={{ backgroundColor: '#1d4ed8' }}
        >
          สำหรับผู้ชำระเงิน
        </div>

        {/* HEADER ROW */}
        <div className="flex flex-col sm:flex-row items-start gap-5 px-6 pt-5 pb-4 border-b border-gray-300">

          {/* Logo + Name */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <img
              src={ocsLogo}
              alt="OCS Logo"
              className="w-16 h-16 object-contain flex-shrink-0"
            />
            <div>
              <div className="font-bold text-base leading-tight">สำนักบริการคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์</div>
              <div className="text-xs text-gray-600 mt-0.5">50 ถนนงามวงศ์วาน แขวงลาดยาว เขตจตุจักร กรุงเทพมหานคร 10900</div>
            </div>
          </div>

          {/* Branch + Date */}
          <div className="text-sm shrink-0 space-y-1.5 w-full sm:w-auto sm:text-right">
            <div className="flex sm:justify-end items-center gap-2">
              <span className="whitespace-nowrap">สาขาผู้รับฝาก</span>
              <span className="inline-block border-b border-gray-500 w-36" />
            </div>
            <div className="flex sm:justify-end items-center gap-2">
              <span className="whitespace-nowrap">วันที่/Date</span>
              <span className="inline-block border-b border-gray-500 w-36 pl-1 text-sm">{today}</span>
            </div>
          </div>
        </div>

        {/* TTB + Comp Code */}
        <div className="flex flex-wrap items-center gap-4 px-6 py-4 border-b border-gray-300">
          {/* TTB Logo (text-based) */}
          <div className="flex items-center gap-1">
            <span className="font-black text-4xl" style={{ color: '#ff6600', letterSpacing: '-2px' }}>ttb</span>
            <span className="text-sm ml-2 leading-tight">ธนาคารทหารไทยธนชาต</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Comp. Code :</span>
            <span className="text-5xl font-extrabold">2577</span>
          </div>
        </div>

        {/* FORM FIELDS */}
        <div className="px-6 py-5 space-y-4 border-b border-gray-300">

          {/* 1. ชื่อโครงการ */}
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-sm font-semibold whitespace-nowrap">1. ชื่อโครงการ/ชื่อผู้ฝาก</span>
              <div className="flex-1 border-b border-gray-500 pb-0.5 min-w-[150px] min-h-[22px] text-sm">
                {organizerName}
              </div>
            </div>
            <div className="border-b border-gray-400 min-h-[22px] mt-1" />
          </div>

          {/* 2. รหัสคณะ */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold w-60 shrink-0">2. รหัสคณะ (Ref. No.1)</span>
            <div className="flex">
              {['0','1','5','2','0','0','0','0','1','0'].map((d, i) => (
                <div
                  key={i}
                  className="w-8 h-8 flex items-center justify-center text-sm font-bold"
                  style={{
                    border: '1px solid #9ca3af',
                    borderRight: i < 9 ? 'none' : '1px solid #9ca3af',
                    background: '#f9fafb'
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>

          {/* 3. เลขประจำตัวประชาชน */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold w-60 shrink-0">3. รหัสเลขประจำตัวประชาชน (Ref. No.1)</span>
            <div className="flex">
              {Array(13).fill('').map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 flex items-center justify-center text-sm"
                  style={{
                    border: '1px solid #9ca3af',
                    borderRight: i < 12 ? 'none' : '1px solid #9ca3af',
                    background: '#fff'
                  }}
                />
              ))}
            </div>
          </div>

          {/* 4. รหัสโครงการ */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold w-60 shrink-0">4. รหัสโครงการพัฒนาวิชาการ/รหัสรายได้ (Ref. No.2)</span>
            <div className="flex">
              {['1','0','4','','','','','','',''].map((d, i) => (
                <div
                  key={i}
                  className="w-8 h-8 flex items-center justify-center text-sm font-bold"
                  style={{
                    border: '1px solid #9ca3af',
                    borderRight: i < 9 ? 'none' : '1px solid #9ca3af',
                    background: d ? '#f0f9ff' : '#fff'
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PAYMENT TABLE */}
        <div className="px-6 py-4 border-b border-gray-300 overflow-x-auto">
          <table className="w-full border-collapse text-sm" style={{ minWidth: '480px' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th className="py-2 px-3 text-center font-semibold" style={{ border: '1px solid #9ca3af', width: '25%' }}>
                  หมายเลขเช็ค<br /><span className="font-normal text-xs text-gray-500">Cheque No.</span>
                </th>
                <th className="py-2 px-3 text-center font-semibold" style={{ border: '1px solid #9ca3af', width: '25%' }}>
                  เช็คลงวันที่<br /><span className="font-normal text-xs text-gray-500">Date</span>
                </th>
                <th className="py-2 px-3 text-center font-semibold" style={{ border: '1px solid #9ca3af', width: '25%' }}>
                  ชื่อธนาคาร / สาขา<br /><span className="font-normal text-xs text-gray-500">Bank / Branch</span>
                </th>
                <th className="py-2 px-3 text-center font-semibold" style={{ border: '1px solid #9ca3af', width: '25%' }}>
                  จำนวนเงิน<br /><span className="font-normal text-xs text-gray-500">Amount (Baht)</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Cheque row */}
              <tr>
                <td style={{ border: '1px solid #9ca3af', height: '48px' }} />
                <td style={{ border: '1px solid #9ca3af' }} />
                <td style={{ border: '1px solid #9ca3af' }} />
                <td className="text-right pr-3 font-bold" style={{ border: '1px solid #9ca3af' }}>
                  {totalPrice > 0 ? totalPrice.toLocaleString() : ''}
                </td>
              </tr>
              {/* Cash row */}
              <tr>
                <td style={{ border: '1px solid #9ca3af', padding: '8px 12px' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ border: '2px solid #6b7280' }} />
                    <div>
                      <div className="font-semibold text-sm">เงินสด</div>
                      <div className="text-xs text-gray-500">Cash</div>
                    </div>
                  </div>
                </td>
                <td colSpan={2} style={{ border: '1px solid #9ca3af', padding: '8px 12px' }}>
                  <div className="border-b border-gray-400 pb-1 text-xs text-gray-500 italic">
                    โปรดเขียนจำนวนเงินเป็นตัวหนังสือ / Please write amount in words
                  </div>
                </td>
                <td className="text-right pr-3 font-bold" style={{ border: '1px solid #9ca3af' }}>
                  {totalPrice > 0 ? totalPrice.toLocaleString() : ''}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* NOTES */}
        <div className="px-6 py-4 border-b border-gray-300">
          <p className="text-sm font-bold mb-2">หมายเหตุ</p>
          <p className="text-xs text-gray-700 leading-relaxed">
            – กรณีชำระด้วยเช็ค มหาวิทยาลัยฯ จะถือว่าการชำระเงินสมบูรณ์ต่อเมื่อธนาคารเรียกเก็บเงินตามเช็คได้<br />
            – ธนาคารจะรับเช็คที่อยู่ในสำนักทะเบียนผู้ชี้เลียงกันเท่านั้น
          </p>
        </div>

        {/* BOTTOM ROW: รหัสรายได้ + Collector */}
        <div className="px-6 py-5 flex flex-wrap items-start justify-between gap-6">
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-6">
              <span className="font-bold">รหัสรายได้ (./Ref. No.2)</span>
              <span className="font-bold">รหัส</span>
              <span className="font-bold">ประเภทการฝากเงิน</span>
            </div>
            <div className="flex items-center gap-6 pl-4">
              <span className="font-bold text-xl">104</span>
              <span className="text-gray-700">รายได้ค่าเช่า</span>
            </div>
          </div>
          <div className="text-center">
            <div className="w-32 h-16 mb-1" style={{ border: '1px solid #9ca3af' }} />
            <div className="text-xs text-gray-600">ผู้รับเงิน / Collector</div>
          </div>
        </div>

        {/* DEPOSITOR ROW */}
        <div className="px-6 pb-5 flex flex-wrap items-center gap-6 text-sm border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 flex-1 min-w-[160px]">
            <span className="whitespace-nowrap font-medium">ชื่อผู้นำฝาก</span>
            <div className="flex-1 border-b border-gray-400 min-h-[20px] pl-1">{organizerName}</div>
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-[140px]">
            <span className="whitespace-nowrap font-medium">โทรศัพท์</span>
            <div className="flex-1 border-b border-gray-400 min-h-[20px]" />
          </div>
        </div>

        {/* BOOKING SUMMARY (screen only) */}
        <div className="mx-6 mb-6 rounded-2xl p-4 text-sm print:hidden" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-blue-600" />
            <p className="font-bold text-blue-800">รายละเอียดการจอง</p>
          </div>
          <div className="space-y-1.5">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-wrap justify-between text-blue-700 py-1.5 border-b border-blue-100 last:border-0 gap-2">
                <span className="font-medium">{item.room.name}</span>
                <span className="text-xs text-blue-600">{item.date} — {item.timeSlot}</span>
                <span className="font-semibold ml-auto">{item.price.toLocaleString()} ฿</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-blue-900 mt-2 pt-2 border-t border-blue-200 text-base">
              <span>รวมทั้งหมด</span>
              <span>{totalPrice.toLocaleString()} ฿</span>
            </div>
          </div>
        </div>
      </div>

      {/* Done Button */}
      <div className="max-w-4xl mx-auto mt-6 flex justify-center print:hidden">
        <button
          onClick={onDone}
          className="px-12 py-3 rounded-2xl text-white font-bold text-sm shadow-lg transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #0066cc, #004da6)' }}
        >
          เสร็จสิ้น — กลับสู่หน้าหลัก
        </button>
      </div>
    </div>
  );
}
