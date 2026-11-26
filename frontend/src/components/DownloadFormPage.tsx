import { FileText, Download, ClipboardList } from 'lucide-react';

interface DownloadFormPageProps {
  isDarkMode: boolean;
}

export function DownloadFormPage({ isDarkMode }: DownloadFormPageProps) {
  const forms = [
    {
      title: 'Room Booking Request Form',
      description: 'Use this form for offline booking requests. Fill it out and email to info@ocshotel.com',
      icon: ClipboardList,
      file: 'booking-request-form.pdf'
    },
    {
      title: 'Corporate Account Application',
      description: 'Apply for a corporate account to enjoy special rates and priority booking',
      icon: FileText,
      file: 'corporate-account-form.pdf'
    },
    {
      title: 'Catering Services Order Form',
      description: 'Pre-order catering services for your meeting or event',
      icon: ClipboardList,
      file: 'catering-order-form.pdf'
    },
    {
      title: 'Technical Support Request',
      description: 'Request additional technical support or special AV setup for your event',
      icon: FileText,
      file: 'technical-support-form.pdf'
    },
    {
      title: 'Cancellation & Modification Form',
      description: 'Request to cancel or modify your existing booking',
      icon: ClipboardList,
      file: 'cancellation-form.pdf'
    },
    {
      title: 'Feedback & Testimonial Form',
      description: 'Share your experience and help us improve our services',
      icon: FileText,
      file: 'feedback-form.pdf'
    }
  ];

  return (
    <div className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className={`text-5xl mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Download Forms
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Download and fill out the forms you need for your booking and service requests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {forms.map((form, index) => (
            <div 
              key={index}
              className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} hover:shadow-lg transition-shadow`}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: isDarkMode ? '#1e3a5f' : '#e3f2fd' }}
              >
                <form.icon className="w-6 h-6" style={{ color: '#0056b3' }} />
              </div>

              <h3 className={`text-xl mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {form.title}
              </h3>

              <p className={`mb-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {form.description}
              </p>

              <button
                className="w-full flex items-center justify-center gap-2 text-white px-4 py-3 rounded-lg transition-colors"
                style={{ backgroundColor: '#0056b3' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003d82'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          ))}
        </div>

        <div className={`mt-12 rounded-xl p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <h2 className={`text-2xl mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            How to Submit Forms
          </h2>
          <div className="space-y-4">
            <div className={`flex items-start gap-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm" style={{ backgroundColor: '#0056b3' }}>1</span>
              <p>Download the appropriate form and fill it out completely</p>
            </div>
            <div className={`flex items-start gap-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm" style={{ backgroundColor: '#0056b3' }}>2</span>
              <p>Email the completed form to info@ocshotel.com or submit in person</p>
            </div>
            <div className={`flex items-start gap-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm" style={{ backgroundColor: '#0056b3' }}>3</span>
              <p>Wait for confirmation from our team (usually within 24 hours)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
