import { Clock, Calendar, Package } from 'lucide-react';

interface RoomsRatePageProps {
  isDarkMode: boolean;
}

export function RoomsRatePage({ isDarkMode }: RoomsRatePageProps) {
  const rates = [
    {
      type: 'Huddle Room',
      hourly: 35,
      halfDay: 120,
      fullDay: 200,
      features: ['4-8 people', 'Smart TV', 'Video conferencing', 'WiFi']
    },
    {
      type: 'Training Room',
      hourly: 65,
      halfDay: 250,
      fullDay: 450,
      features: ['15-30 people', 'Projector', 'Flexible seating', 'Whiteboards']
    },
    {
      type: 'Board Room',
      hourly: 75,
      halfDay: 300,
      fullDay: 550,
      features: ['12-20 people', '4K display', 'Premium furniture', 'Coffee service']
    }
  ];

  return (
    <div className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className={`text-5xl mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Room Rates</h1>
          <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Transparent pricing for all our meeting spaces. Choose what works best for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto gap-8 mb-12">
          {rates.map((room, index) => (
            <div 
              key={index}
              className={`rounded-2xl p-8 border-2 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-[#0056b3] ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-700' 
                  : 'bg-white border-gray-300'
              }`}
            >
              <h3 className={`text-2xl font-bold mb-8 pb-4 border-b-2 ${isDarkMode ? 'text-white border-gray-700' : 'text-gray-900 border-gray-200'}`}>
                {room.type}
              </h3>

              <div className="space-y-5 mb-8">
                <div className={`p-5 rounded-xl border-2 shadow-sm ${isDarkMode ? 'bg-gray-800 border-[#0056b3]/30' : 'bg-gradient-to-br from-blue-50 to-white border-blue-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4" style={{ color: '#0056b3' }} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Hourly Rate
                    </span>
                  </div>
                  <p className={`text-3xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${room.hourly}
                    <span className="text-sm">/hr</span>
                  </p>
                </div>

                <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" style={{ color: '#0056b3' }} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Half Day (4hrs)
                    </span>
                  </div>
                  <p className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${room.halfDay}
                  </p>
                </div>

                <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4" style={{ color: '#0056b3' }} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Full Day (8hrs)
                    </span>
                  </div>
                  <p className={`text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ${room.fullDay}
                  </p>
                </div>
              </div>

              <div className={`pt-6 border-t-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Includes:
                </p>
                <ul className="space-y-2">
                  {room.features.map((feature, idx) => (
                    <li 
                      key={idx}
                      className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: '#00c853' }}></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className={`rounded-xl p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <h2 className={`text-3xl mb-8 font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ข้อปฏิบัติการใช้บริการห้อง
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "จองหรือยกเลิกห้อง ต้องแจ้งล่วงหน้าอย่างน้อย 7 วันทำการ และยกเลิกก่อนใช้งาน 5 วันทำการ",
              "หากนำเซิร์ฟเวอร์หรือซอฟต์แวร์มาติดตั้งเอง ต้องแจ้งล่วงหน้า 5 วัน และทดสอบระบบก่อนใช้งานจริง 3 วัน พร้อมห้ามใช้ซอฟต์แวร์ไม่มีลิขสิทธิ์",
              "การเตรียมห้องและทดสอบระบบ ทำได้ในเวลาราชการ ใช้เวลาไม่เกิน 1–2 ชั่วโมง ฟรี หากเกินเวลาคิดค่าบริการตามปกติ",
              "หากพบปัญหาอุปกรณ์หรือระบบในห้อง ให้ติดต่อเจ้าหน้าที่ที่เกี่ยวข้องเท่านั้น",
              "การนำอุปกรณ์เสริมหรืออุปกรณ์จัดนิทรรศการมาใช้ ต้องแจ้งเจ้าหน้าที่และรับผิดชอบเรื่องความเข้ากันได้ของอุปกรณ์",
              "หากต้องใช้อินเทอร์เน็ต ต้องขอบัญชีใช้งานชั่วคราวล่วงหน้า และผู้ใช้ต้องรับผิดชอบการใช้งานบัญชี",
              "การใช้งานนอกเวลาราชการ มีค่าธรรมเนียมเพิ่มเติมวันละ 1,000–2,000 บาท",
              "หากนำอาหารหรือร้านค้าภายนอกเข้ามาเอง ต้องชำระค่าจัดการสิ่งแวดล้อม 1,000 บาทต่อวัน",
              "ผู้ใช้ต้องแจ้งผู้เข้าร่วมให้ปฏิบัติตามกฎของสถานที่ และรับผิดชอบความเสียหายที่เกิดขึ้น",
              "ผู้ใช้ต้องใช้สถานที่อย่างเหมาะสม ไม่ผิดกฎหมาย และไม่ก่อให้เกิดความเสียหายต่อหน่วยงาน",
            ].map((rule, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                  isDarkMode ? 'bg-gray-900/50 border-gray-700 hover:border-blue-500/50' : 'bg-white border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  {idx + 1}
                </div>
                <p className={`mt-0.5 text-sm md:text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
