import React from 'react';

interface FooterProps {
  isDarkMode: boolean;
}

export function Footer({ isDarkMode }: FooterProps) {
  return (
    <footer
      className={`mt-auto transition-colors duration-300 rounded-t-3xl shadow-[0_-4px_15px_rgba(0,0,0,0.05)] ${
        isDarkMode ? 'bg-gray-800 text-gray-200' : 'text-gray-900'
      }`}
      style={{ backgroundColor: isDarkMode ? '' : '#c7d1d8' }}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center" style={{ paddingTop: '64px', paddingBottom: '40px' }}>
        <h3 className="font-bold tracking-wide mb-1" style={{ fontSize: '11px' }}>
          © สำนักบริการคอมพิวเตอร์ มหาวิทยาลัยเกษตรศาสตร์ | Office of Computer Services, Kasetsart University
        </h3>

        <p className={`font-medium leading-relaxed max-w-3xl ${isDarkMode ? 'text-gray-400' : 'text-gray-800'}`} style={{ fontSize: '9px' }}>
          50 มหาวิทยาลัยเกษตรศาสตร์ ถนนงามวงศ์วาน แขวงลาดยาว เขตจตุจักร กทม. 10900
          <span className="hidden sm:inline mx-2 text-gray-400">|</span>
          <br className="block sm:hidden" />
          โทร. 0-2562-0951-6
          <span className="hidden sm:inline mx-2 text-gray-400">|</span>
          <br className="block sm:hidden" />
          อีเมล. roombooking-ocs@ku.ac.th
        </p>
      </div>
    </footer>
  );
}
