import { X, LogIn, UserPlus } from 'lucide-react';

interface LoginPromptModalProps {
  isDarkMode: boolean;
  onClose: () => void;
  onGoToLogin: () => void;
}

export function LoginPromptModal({ isDarkMode, onClose, onGoToLogin }: LoginPromptModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full relative"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '384px',
          background: isDarkMode
            ? 'linear-gradient(145deg, #1f2937, #111827)'
            : '#ffffff',
          borderRadius: '1.5rem',
          border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 text-center">
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #0066cc22, #0066cc11)', border: '1px solid #0066cc33' }}
          >
            <span className="text-3xl">🔒</span>
          </div>

          <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            กรุณาเข้าสู่ระบบก่อน
          </h3>
          <p className={`text-sm mb-6 leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            คุณต้องมีบัญชีและเข้าสู่ระบบก่อนจึงจะสามารถ
            จองห้องประชุมได้
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onGoToLogin}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, #0066cc, #004da6)' }}
            >
              <LogIn className="w-4 h-4" />
              เข้าสู่ระบบ / Sign In
            </button>
            <button
              onClick={onGoToLogin}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border transition-all duration-200 hover:-translate-y-0.5 ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              <UserPlus className="w-4 h-4" />
              สมัครสมาชิก / Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
