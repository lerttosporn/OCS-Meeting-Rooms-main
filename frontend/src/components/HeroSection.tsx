import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Users, ChevronDown, Monitor } from 'lucide-react';
import { SearchFilters } from '../App';
import computerRoomImg from '../assets/computer-room.png';
import { DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import thTH from 'antd/locale/th_TH';
import { useHolidays } from '../hooks/useHolidays';

dayjs.locale('th');

interface HeroSectionProps {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  isDarkMode: boolean;
}

function CustomDropdown({ value, options, onChange, isDarkMode }: {
  value: string | number;
  options: { label: string; value: string | number }[];
  onChange: (val: string | number) => void;
  isDarkMode: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => String(o.value) === String(value))?.label || 'Select...';

  return (
    <div className="relative w-full" style={{ zIndex: isOpen ? 99999 : 10 }} ref={ref}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-5 py-4 border rounded-2xl shadow-inner transition-all duration-300 flex items-center justify-between cursor-pointer select-none ${isDarkMode
            ? 'bg-gray-800 bg-opacity-80 border-gray-600 hover:bg-gray-700'
            : 'bg-gray-50 border-gray-200 hover:bg-white'
          } ${isOpen ? 'ring-4 ring-[#0056b3]/20 border-transparent' : ''}`}
        style={{ color: isDarkMode ? '#ffffff' : '#000000' }}
      >
        <span className="truncate font-medium">{selectedLabel}</span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : 'text-gray-400'}`} />
      </div>

      {isOpen && (
        <div
          className="absolute z-[100] w-full mt-2 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden"
          style={{
            background: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            border: isDarkMode ? '1px solid rgba(75, 85, 99, 0.5)' : '1px solid rgba(229, 231, 235, 0.5)',
            animation: 'homeDropdownSlideIn 0.2s ease-out forwards',
            transformOrigin: 'top',
          }}
        >
          <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
            {options.map((opt, i) => {
              const isSelected = String(value) === String(opt.value);
              return (
                <div
                  key={i}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-3 m-1 rounded-xl cursor-pointer transition-colors ${isSelected
                      ? (isDarkMode ? 'bg-blue-900/50 font-semibold' : 'bg-blue-50 font-semibold')
                      : (isDarkMode ? 'hover:bg-gray-700/70' : 'hover:bg-gray-100')
                    }`}
                  style={{
                    color: isSelected
                      ? (isDarkMode ? '#93c5fd' : '#1d4ed8')
                      : (isDarkMode ? '#e5e7eb' : '#000000')
                  }}
                >
                  {opt.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function HeroSection({ filters, setFilters, isDarkMode }: HeroSectionProps) {
  const { holidays: apiHolidays } = useHolidays();

  const handleFilterChange = (key: keyof SearchFilters, value: string | number) => {
    setFilters({ ...filters, [key]: value });
  };

  const attendeesOptions = [
    { value: 1, label: '1-5 คน' },
    { value: 6, label: '6-10 คน' },
    { value: 11, label: '11-20 คน' },
    { value: 21, label: '21-50 คน' },
    { value: 51, label: '51-100 คน' },
    { value: 101, label: '101-150 คน' },
    { value: 151, label: '151-200 คน' },
    { value: 201, label: '200+ คน' }
  ];

  const roomTypeOptions = [
    { value: 'all', label: 'ห้องทั้งหมด (All Types)' },
    { value: 'classroom', label: 'ห้องบรรยาย (Seminar / Theatre)' },
    { value: 'computer', label: 'ห้องคอมพิวเตอร์ (Computer)' },
    { value: 'tele-conference', label: 'ห้องประชุมทางไกล (Tele-Conference)' }
  ];

  return (
    <div className="relative text-white" style={{ zIndex: 60, overflow: 'visible' }}>
      <style>{`
        @keyframes homeDropdownSlideIn {
          from { opacity: 0; transform: scaleY(0.95) translateY(-5px); }
          to { opacity: 1; transform: scaleY(1) translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style>

      {/* Background container with overflow-hidden so blurred bg doesn't spill */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Background Image with Blur */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${computerRoomImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(3px)',
            transform: 'scale(1.05)'
          }}
        ></div>

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(15, 32, 65, 0.92) 0%, rgba(10, 20, 45, 0.98) 100%)'
              : 'linear-gradient(135deg, rgba(20, 45, 90, 0.85) 0%, rgba(26, 58, 110, 0.92) 50%, rgba(30, 64, 128, 0.88) 100%)'
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">Book Your Perfect Meeting Space</h1>
          <p className="text-lg md:text-xl" style={{ color: isDarkMode ? '#cbd5e1' : '#f0f4f8' }}>
            Professional meeting rooms equipped with modern amenities
          </p>
        </div>

        <div className={`rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-6 md:p-8 max-w-5xl mx-auto backdrop-blur-lg border transition-transform duration-500 hover:scale-[1.01] ${isDarkMode ? 'bg-black bg-opacity-50 border-gray-700' : 'bg-black bg-opacity-20 border-white border-opacity-30'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
            <div>
              <label className="block text-sm mb-2 text-white font-medium ml-1">
                <Calendar className="w-4 h-4 inline mr-1.5 mb-0.5" />
                Date
              </label>
              <ConfigProvider
                locale={thTH}
                theme={{
                  token: {
                    colorPrimary: '#2563eb',
                    borderRadius: 16,
                    fontFamily: 'inherit',
                  },
                }}
              >
                <DatePicker
                  value={filters.date ? dayjs(filters.date, 'YYYY-MM-DD') : null}
                  onChange={(date) => handleFilterChange('date', date ? date.format('YYYY-MM-DD') : '')}
                  format="DD/MM/YYYY"
                  allowClear={false}
                  inputReadOnly={true}
                  disabledDate={(current) => {
                    if (current && current < dayjs().add(7, 'day').startOf('day')) return true;
                    return false;
                  }}
                  className={`w-full px-5 py-4 border rounded-2xl shadow-inner transition-all duration-300 font-medium ${isDarkMode
                    ? 'bg-gray-800 bg-opacity-80 border-gray-600 hover:bg-gray-700 text-white'
                    : 'bg-gray-50 border-gray-200 hover:bg-white text-black'
                    }`}
                  popupClassName={isDarkMode ? 'dark-calendar-popup' : ''}
                  suffixIcon={<Calendar className={`w-5 h-5 ${filters.date ? 'text-blue-500' : 'text-gray-400'} pointer-events-none`} />}
                  cellRender={(current, info) => {
                    if (info.type !== 'date') return info.originNode;
                    const currentDjs = dayjs(current);
                    const dStr = currentDjs.format('YYYY-MM-DD');
                    const day = currentDjs.day();
                    const isWeekend = day === 0 || day === 6;
                    const isThaiHoliday = apiHolidays.includes(dStr);
                    const isHoliday = isWeekend || isThaiHoliday;
                    if (!isHoliday) return info.originNode;

                    const originElement = info.originNode as React.ReactElement<{ className?: string }>;
                    const originProps = originElement.props;
                    return React.cloneElement(originElement, {
                      className: `${originProps.className || ''} ant-picker-cell-holiday`
                    });
                  }}
                  style={{
                    color: isDarkMode ? '#ffffff' : '#000000',
                    height: '58px' // Match the height of the original input
                  }}
                />
              </ConfigProvider>
            </div>

            <div>
              <label className="block text-sm mb-2 text-white font-medium ml-1">
                <Users className="w-4 h-4 inline mr-1.5 mb-0.5" />
                Attendees
              </label>
              <CustomDropdown
                value={filters.attendees}
                options={attendeesOptions}
                onChange={(val) => handleFilterChange('attendees', val as number)}
                isDarkMode={isDarkMode}
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-white font-medium ml-1">
                <Monitor className="w-4 h-4 inline mr-1.5 mb-0.5" />
                Room Type
              </label>
              <CustomDropdown
                value={filters.roomType}
                options={roomTypeOptions}
                onChange={(val) => handleFilterChange('roomType', val as string)}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
