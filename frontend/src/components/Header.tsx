import { Moon, Sun, Menu, X, LogIn, LogOut, User, LayoutDashboard } from 'lucide-react';
import { PageType, UserRole } from '../App';
import { useState } from 'react';
import ocsLogo from '../assets/ocs-logo.png';
import { UserProfileDropdown } from './UserProfileDropdown';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  userRole: UserRole;
  userName: string;
  userImage?: string;
  onLogout: () => void;
}



export function Header({ isDarkMode, toggleTheme, currentPage, onNavigate, userRole, userName, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', page: 'home' as PageType },
    { label: 'Reservation', page: 'reservation' as PageType },
    { label: 'FAQ', page: 'faq' as PageType },
    { label: 'Contact Us', page: 'contact' as PageType }
  ];

  const handleNavClick = (page: PageType) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const isLoggedIn = userRole !== 'guest';

  return (
    <header className={`shadow-sm sticky top-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ zIndex: 9999 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo & Site Name */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
            <img src={ocsLogo} alt="OCS Meeting Rooms Logo" className="h-12 sm:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            <div className="hidden sm:block">
              <h1 className={`text-lg sm:text-xl font-extrabold leading-tight tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'} transition-colors`}>
                OCS
              </h1>
              <p className={`text-xs sm:text-sm font-medium tracking-widest uppercase ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Meeting Rooms
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`transition-all duration-200 font-medium text-sm cursor-pointer px-2 py-1 rounded-md ${currentPage === item.page
                    ? 'text-[#0056b3] bg-blue-50/50 dark:bg-blue-900/20'
                    : isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                      : 'text-gray-700 hover:text-[#0056b3] hover:bg-gray-50'
                  }`}
              >
                {item.label}
              </button>
            ))}
            {/* Admin Dashboard shortcut (desktop) */}
            {(userRole === 'admin' || userRole === 'staff_tech') && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`hidden xl:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${currentPage === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </button>
            )}
          </nav>


          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 hover:rotate-12' : 'bg-gray-100 hover:bg-gray-200 hover:-rotate-12'}`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Auth Button */}
            {isLoggedIn ? (
              /* Logged in — show UserProfileDropdown */
              <UserProfileDropdown
                isDarkMode={isDarkMode}
                userName={userName}
                userRole={userRole}
                onNavigate={onNavigate}
                onLogout={onLogout}
              />
            ) : (
              /* Guest — show Login button */
              <button
                onClick={() => onNavigate('login')}
                className="hidden xl:flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #0066cc, #004da6)' }}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`xl:hidden p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
              ) : (
                <Menu className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className={`xl:hidden py-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`text-left py-2 px-4 rounded-lg transition-colors cursor-pointer ${currentPage === item.page
                      ? 'text-white hover:opacity-90'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  style={currentPage === item.page ? { backgroundColor: '#0056b3' } : {}}
                >
                  {item.label}
                </button>
              ))}
              {/* Admin link on mobile */}
              {(userRole === 'admin' || userRole === 'staff_tech') && (
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`flex items-center gap-2 text-left py-2 px-4 rounded-lg text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 transition-colors`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </button>
              )}
              {/* Mobile auth */}
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => { setMobileMenuOpen(false); onNavigate('profile'); }}
                    className={`flex items-center gap-3 text-left py-2 px-4 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <span className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </span>
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userName}</span>
                      <span className="text-xs opacity-60">View Profile</span>
                    </div>
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); onNavigate('my-bookings'); }}
                    className={`flex items-center gap-3 text-left py-2 px-4 rounded-lg transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-blue-900/40' : 'bg-blue-50'}`}>
                      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    </span>
                    <span className="text-sm font-medium">การจองของฉัน</span>
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                    className="flex items-center gap-3 text-left py-2 px-4 rounded-lg text-red-500 hover:bg-red-50 transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavClick('login')}
                  className="flex items-center gap-2 text-left py-2 px-4 rounded-lg text-white font-semibold"
                  style={{ backgroundColor: '#0056b3' }}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
