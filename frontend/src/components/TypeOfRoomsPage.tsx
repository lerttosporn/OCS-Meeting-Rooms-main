import React, { useState } from 'react';
import { Users, Monitor, Video, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { seminarImages, computerImages, teleconferenceImages } from '../utils/roomImages';
import computerRoomNewImg from "../assets/computer-room-new2.jpg";
import classroomImg from "../assets/classroom.jpg";
import teleconferenceRoomImg from "../assets/teleconference-room.jpg";

interface TypeOfRoomsPageProps {
  isDarkMode: boolean;
}

const roomTypesData = [
  {
    id: 'seminar',
    icon: Users,
    name: 'Seminar Rooms',
    thaiName: 'ห้องอบรมสัมมนาแบบบรรยาย',
    coverImage: classroomImg,
    images: [classroomImg, ...seminarImages],
    description: 'ห้องอบรมสัมมนาแบบบรรยาย มีอุปกรณ์พื้นฐานประจำห้อง ดังนี้ คอมพิวเตอร์โน้ตบุ๊คสำหรับวิทยากร จำนวน 1 เครื่อง / โต๊ะและเก้าอี้ตามความจุห้อง / โปรเจคเตอร์และจอรับภาพ / ชุดอุปกรณ์เครื่องเสียงและไมโครโฟนแบบมีสาย จำนวน 1 ชุด / ไมโครโฟนไร้สาย 1 ตัว* / อินเทอร์เน็ต พร้อมบัญชีผู้ใช้้อินเทอร์เน็ตสำหรับเครื่องวิทยากร จำนวน 2 บัญชี',
    requirement: 'ไม่มีคอมพิวเตอร์สำหรับผู้เข้าอบรม และไม่อนุญาตให้ผู้เข้าอบรมนำคอมพิวเตอร์ส่วนตัวมา เนื่องจากมีห้องคอมพิวเตอร์ให้บริการ',
  },
  {
    id: 'computer',
    icon: Monitor,
    name: 'Computer Rooms',
    thaiName: 'ห้องอบรมคอมพิวเตอร์',
    coverImage: computerRoomNewImg,
    images: [computerRoomNewImg, ...computerImages],
    description: 'ห้องอบรมคอมพิวเตอร์ มีอุปกรณ์พื้นฐานประจำห้อง ดังนี้ คอมพิวเตอร์โน้ตบุ๊คสำหรับวิทยากร จำนวน 1 เครื่อง และคอมพิวเตอร์สำหรับผู้เข้าอบรมตามจำนวนความจุห้อง / โต๊ะและเก้าอี้ตามความจุห้อง / โปรเจคเตอร์และจอรับภาพ / ชุดอุปกรณ์เครื่องเสียงและไมโครโฟนแบบมีสาย จำนวน 1 ชุด / ไมโครโฟนไร้สาย 1 ตัว* / อินเทอร์เน็ต พร้อมบัญชีผู้ใช้อินเทอร์เน็ตสำหรับเครื่องวิทยากร และผู้เข้าอบรม ตามจำนวนความจุห้อง',
    requirement: 'ขอความร่วมมือ ไม่อนุญาตให้นำอาหารและเครื่องดื่มเข้าภายในห้องอบรม เพื่อป้องกันความเสียหายที่อาจเกิดขึ้นกับเครื่องคอมพิวเตอร์ ทั้งนี้ จัดให้มีจุดวางอาหารและเครื่องดื่มบริเวณหน้าห้อง',
  },
  {
    id: 'teleconference',
    icon: Video,
    name: 'Tele-Conference Rooms',
    thaiName: 'ห้องการเรียนการสอนทางไกล',
    coverImage: teleconferenceRoomImg,
    images: [teleconferenceRoomImg, ...teleconferenceImages.slice(0, 2)],
    description: 'ห้องการเรียนการสอนทางไกล มีอุปกรณ์พื้นฐานประจำห้อง ดังนี้ คอมพิวเตอร์โน้ตบุ๊คสำหรับอาจารย์ผู้สอน จำนวน 1 เครื่อง / โต๊ะและเก้าอี้ตามความจุห้อง / ชุดอุปกรณ์ทางไกลผ่านระบบเครือข่าย พร้อมไมโครโฟน จำนวน 1 ชุด / อินเทอร์เน็ตแบบมีสาย',
    requirement: 'ห้องการเรียนการสอนทางไกล ให้บริการเฉพาะจัดการเรียนการสอนทางไกลผ่านระบบเครือข่ายของหน่วยงานภายในมก. เท่านั้น',
  }
];

export function TypeOfRoomsPage({ isDarkMode }: TypeOfRoomsPageProps) {
  const [selectedType, setSelectedType] = useState<typeof roomTypesData[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    if (selectedType) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedType.images.length);
    }
  };

  const handlePrevImage = () => {
    if (selectedType) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedType.images.length) % selectedType.images.length);
    }
  };

  const openModal = (roomType: typeof roomTypesData[0]) => {
    setSelectedType(roomType);
    setCurrentImageIndex(0);
    setTimeout(() => setIsModalOpen(true), 10);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedType(null), 300);
  };

  return (
    <div className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Types of Meeting Rooms
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            พบกับห้องประชุมหลากหลายรูปแบบที่ตอบโจทย์ทุกความต้องการของคุณ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roomTypesData.map((room) => (
            <div 
              key={room.id}
              onClick={() => openModal(room)}
              className={`rounded-2xl overflow-hidden shadow-lg transition-transform hover:-translate-y-2 cursor-pointer border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={room.coverImage} 
                  alt={room.thaiName} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <room.icon className="w-5 h-5" />
                    <span className="font-semibold">{room.name}</span>
                  </div>
                  <h3 className="text-xl font-bold">{room.thaiName}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className={`line-clamp-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {room.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm font-semibold text-blue-600">
                  <span>ดูรายละเอียด</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Popup */}
      {selectedType && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
            isModalOpen ? 'bg-black/70 backdrop-blur-md opacity-100' : 'bg-black/0 backdrop-blur-none opacity-0'
          }`} 
          onClick={closeModal}
        >
          <div 
            className={`relative w-full max-w-3xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 transform ${
              isModalOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
            } ${isDarkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-900'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Carousel */}
            <div className="relative w-full h-64 sm:h-80 bg-gray-900 group">
              <img 
                src={selectedType.images[currentImageIndex]} 
                alt={`${selectedType.thaiName} view ${currentImageIndex + 1}`} 
                className="w-full h-full object-cover"
              />
              
              {selectedType.images.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md">
                    {selectedType.images.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  <selectedType.icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedType.thaiName}</h2>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selectedType.name}</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">รายละเอียดและอุปกรณ์พื้นฐาน</h3>
                  <p className={`leading-relaxed text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedType.description}
                  </p>
                </div>
                
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-red-900/10 border-red-900/30' : 'bg-red-50 border-red-100'}`}>
                  <h3 className={`text-sm font-bold mb-1 flex items-center gap-2 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                    <span>⚠️ ข้อกำหนด</span>
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                    {selectedType.requirement}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}