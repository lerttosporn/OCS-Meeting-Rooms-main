import { Calendar, Clock, DollarSign, TrendingUp, Users, Building2 } from 'lucide-react';

interface DashboardPageProps {
  isDarkMode: boolean;
}

export function DashboardPage({ isDarkMode }: DashboardPageProps) {
  const stats = [
    { label: 'Total Bookings', value: '156', icon: Calendar, color: '#0056b3' },
    { label: 'Active Reservations', value: '23', icon: Clock, color: '#00c853' },
    { label: 'Total Revenue', value: '$45,280', icon: DollarSign, color: '#0056b3' },
    { label: 'Growth Rate', value: '+23%', icon: TrendingUp, color: '#00c853' }
  ];

  const recentBookings = [
    { room: 'Executive Board Room', date: '2025-12-12', time: '09:00 - 11:00', client: 'Tech Corp Inc.', status: 'Confirmed' },
    { room: 'Large Conference Room', date: '2025-12-13', time: '14:00 - 17:00', client: 'Marketing Solutions', status: 'Confirmed' },
    { room: 'Training Room A', date: '2025-12-14', time: '10:00 - 16:00', client: 'HR Consulting', status: 'Pending' },
    { room: 'Huddle Room 1', date: '2025-12-15', time: '13:00 - 14:00', client: 'Startup Labs', status: 'Confirmed' },
    { room: 'Premium Conference Suite', date: '2025-12-16', time: '09:00 - 17:00', client: 'Finance Group', status: 'Confirmed' }
  ];

  const roomUtilization = [
    { room: 'Executive Board Room', utilization: 78 },
    { room: 'Large Conference Room', utilization: 92 },
    { room: 'Training Room A', utilization: 65 },
    { room: 'Huddle Room 1', utilization: 88 },
    { room: 'Premium Conference Suite', utilization: 71 }
  ];

  return (
    <div className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className={`text-5xl mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Admin Dashboard
          </h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Overview of your meeting room operations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
                <span className={`text-3xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </span>
              </div>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className={`rounded-xl p-6 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <h2 className={`text-2xl mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Bookings
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left py-3 px-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Room</th>
                  <th className={`text-left py-3 px-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date</th>
                  <th className={`text-left py-3 px-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time</th>
                  <th className={`text-left py-3 px-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Client</th>
                  <th className={`text-left py-3 px-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking, index) => (
                  <tr 
                    key={index}
                    className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <td className={`py-4 px-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{booking.room}</td>
                    <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{booking.date}</td>
                    <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{booking.time}</td>
                    <td className={`py-4 px-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{booking.client}</td>
                    <td className="py-4 px-4">
                      <span 
                        className={`px-3 py-1 rounded-full text-sm text-white ${
                          booking.status === 'Confirmed' ? 'bg-[#00c853]' : 'bg-[#ff9800]'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Room Utilization */}
        <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <h2 className={`text-2xl mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Room Utilization This Month
          </h2>
          <div className="space-y-4">
            {roomUtilization.map((room, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {room.room}
                  </span>
                  <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {room.utilization}%
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="h-2 rounded-full transition-all"
                    style={{ 
                      width: `${room.utilization}%`,
                      backgroundColor: room.utilization >= 80 ? '#00c853' : '#0056b3'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
