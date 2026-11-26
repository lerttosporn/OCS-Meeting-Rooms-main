import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ReservationPage } from './components/ReservationPage';
import { DownloadFormPage } from './components/DownloadFormPage';
import { DashboardPage } from './components/DashboardPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { FAQPage } from './components/FAQPage';
import { ContactPage } from './components/ContactPage';
import { LoginPage } from './components/LoginPage';
import { UserProfilePage } from './components/UserProfilePage';
import { FloatingCart } from './components/FloatingCart';
import { MyBookingsPage } from './components/MyBookingsPage';
import { FullCalendarPage } from './components/FullCalendarPage';
import { useCart } from './hooks/useCart';
import { RoleGuard } from './components/RoleGuard';
import { Footer } from './components/Footer';

export const API_BASE_URL = 'http://localhost:3001';

export interface SearchFilters {
  date: string;
  attendees: number;
  roomType: string;
}

export type UserRole = 'guest' | 'customer' | 'admin' | 'staff_tech' | 'financial';

export type PageType = 'home' | 'about' | 'types' | 'reservation' | 'rates' | 'download' | 'dashboard' | 'admin' | 'faq' | 'contact' | 'login' | 'profile' | 'my-bookings' | 'calendar';

const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    // Restore page from storage only if there's a valid saved session
    const token = localStorage.getItem('ocs_token');
    const savedPage = localStorage.getItem('ocs_current_page') as PageType | null;
    if (token && savedPage) return savedPage;
    return 'home';
  });
  const [navKey, setNavKey] = useState(0);
  const [filters, setFilters] = useState<SearchFilters>({
    date: '',
    attendees: 1,
    roomType: 'all'
  });

  // Auth state
  const [sessionLoading, setSessionLoading] = useState(() => !!localStorage.getItem('ocs_token'));
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<number | null>(() => {
    const saved = localStorage.getItem('ocs_user_id');
    return saved ? parseInt(saved, 10) : null;
  });
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    image: ''
  });

  // Cart state — backed by local API
  const { cartItems, addToCart, removeFromCart, clearCart, loading: cartLoading } = useCart(userId ?? 1);

  const handleLogin = (userData: any, token: string, isRefresh: boolean = false) => {
    setUserRole(userData.role as UserRole);
    setUserName(userData.first_name);
    setUserId(userData.id ?? null);
    setUserProfile({
      name: `${userData.first_name} ${userData.last_name || ''}`.trim(),
      email: userData.email,
      phone: userData.phone_number || '',
      department: userData.position || '',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    });
    localStorage.setItem('ocs_token', token);
    localStorage.setItem('ocs_user_id', userData.id.toString());
    
    if (!isRefresh) {
      const nextPage = (userData.role === 'admin' || userData.role === 'staff_tech') ? 'admin' : 'home';
      setCurrentPage(nextPage);
      localStorage.setItem('ocs_current_page', nextPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (window.location.pathname === '/api/auth/callback/google') {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const idToken = params.get('id_token');
      
      if (idToken) {
        fetch('http://localhost:3001/users/google-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: idToken })
        })
        .then(res => res.json())
        .then(data => {
          if (data.token) {
            handleLogin(data.user, data.token);
            window.history.replaceState({}, document.title, '/');
          }
        })
        .catch(err => console.error('Google login error:', err));
      } else {
        window.history.replaceState({}, document.title, '/');
      }
    }
  }, []);

  const handleLogout = (isRefresh: boolean = false) => {
    setUserRole('guest');
    setUserName('');
    setUserId(null);
    localStorage.removeItem('ocs_token');
    localStorage.removeItem('ocs_user_id');
    localStorage.removeItem('ocs_current_page');
    if (!isRefresh) {
      setCurrentPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('ocs_token');
    const savedUserId = localStorage.getItem('ocs_user_id');

    if (token && savedUserId) {
      const decoded = decodeJwt(token);
      // Check if token is expired
      if (!decoded || decoded.exp * 1000 < Date.now()) {
        handleLogout(true);
      } else {
        // Fetch user data
        fetch(`${API_BASE_URL}/users/${savedUserId}`)
          .then(res => {
            if (!res.ok) throw new Error('Failed to fetch user');
            return res.json();
          })
          .then(userData => {
            handleLogin(userData, token, true);
          })
          .catch(err => {
            console.error('Session restore error:', err);
            handleLogout(true);
          })
          .finally(() => setSessionLoading(false));
      }
    } else {
      setSessionLoading(false);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navigateToPage = (page: PageType) => {
    setCurrentPage(page);
    localStorage.setItem('ocs_current_page', page);
    setNavKey(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (sessionLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <div style={{ width: 40, height: 40, border: '4px solid #e2e8f0', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ fontSize: '0.9rem', margin: 0 }}>กำลังตรวจสอบสถานะการเข้าสู่ระบบ...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (currentPage === 'login') {
    return (
      <LoginPage
        isDarkMode={isDarkMode}
        onLogin={handleLogin}
        onNavigateHome={() => navigateToPage('home')}
      />
    );
  }

  if (currentPage === 'admin') {
    return (
      <RoleGuard allowedRoles={['admin', 'staff_tech']} userRole={userRole} fallback={() => navigateToPage('home')}>
        <AdminDashboard
          userRole={userRole}
          userName={userName}
          onNavigateBack={() => navigateToPage('home')}
          onLogout={handleLogout}
        />
      </RoleGuard>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage isDarkMode={isDarkMode} userId={userId} onNavigateCalendar={() => navigateToPage('calendar')} />;
      case 'reservation':
        return (
          <ReservationPage
            key={navKey}
            isDarkMode={isDarkMode}
            filters={filters}
            setFilters={setFilters}
            userRole={userRole}
            userEmail={userProfile.email}
            onGoToLogin={() => navigateToPage('login')}
            cartItems={cartItems}
            onAddToCart={addToCart}
          />
        );
      case 'download':
        return <DownloadFormPage isDarkMode={isDarkMode} />;
      case 'dashboard':
        return <RoleGuard allowedRoles={['customer', 'staff_tech', 'financial', 'admin']} userRole={userRole} fallback={() => navigateToPage('login')}>
          <DashboardPage isDarkMode={isDarkMode} />
        </RoleGuard>;
      case 'faq':
        return <FAQPage isDarkMode={isDarkMode} />;
      case 'contact':
        return <ContactPage isDarkMode={isDarkMode} />;
      case 'profile':
        return (
          <RoleGuard allowedRoles={['customer', 'staff_tech', 'financial', 'admin']} userRole={userRole} fallback={() => navigateToPage('login')}>
            <UserProfilePage
              isDarkMode={isDarkMode}
              profile={userProfile}
              userId={userId}
              onUpdateProfile={(newProfile) => {
                setUserProfile(newProfile);
                setUserName(newProfile.name.split(' ')[0]);
              }}
            />
          </RoleGuard>
        );
      case 'my-bookings':
        return (
          <RoleGuard allowedRoles={['customer', 'staff_tech', 'financial', 'admin']} userRole={userRole} fallback={() => navigateToPage('login')}>
            <MyBookingsPage isDarkMode={isDarkMode} userId={userId} />
          </RoleGuard>
        );
      case 'calendar':
        return <FullCalendarPage isDarkMode={isDarkMode} onBack={() => navigateToPage('home')} />;
      default:
        return <HomePage isDarkMode={isDarkMode} userId={userId} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {currentPage !== 'calendar' && (
        <Header
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          currentPage={currentPage}
          onNavigate={navigateToPage}
          userRole={userRole}
          userName={userName}
          onLogout={handleLogout}
        />
      )}
      <main className="flex-grow flex flex-col">
        {renderPage()}
      </main>
      {currentPage !== 'calendar' && <Footer isDarkMode={isDarkMode} />}
      <FloatingCart
        cartItems={cartItems}
        isDarkMode={isDarkMode}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        loading={cartLoading}
        userRole={userRole}
      />
    </div>
  );
}
