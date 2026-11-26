import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./slider.css";

export interface RoomType {
  name: string;
  thaiName?: string;
  image: string;
  images?: string[];
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  capacity: string;
  description: string;
  equipmentList?: string[];
  features: string[];
  idealFor: string;
  requirement?: string;
}

interface RoomSliderProps {
  roomTypes: RoomType[];
  isDarkMode: boolean;
  onCardClick?: (room: RoomType) => void;
}

const RoomSlider: React.FC<RoomSliderProps> = ({ roomTypes, isDarkMode, onCardClick }) => {
  return (
    <div className=" pt-20 relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1.2}
        initialSlide={1}
        // centeredSlides
        spaceBetween={30}
        breakpoints={{
          390: {
            slidesPerView: 1,
            spaceBetween: 16,
            centeredSlides: true,
          },
          430: {
            slidesPerView: 1.2,
            spaceBetween: 18,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
            centeredSlides: true,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 32,
            centeredSlides: true,
          },
        }}
        loop={roomTypes.length > 3}
        // autoplay={{
        //   delay: 2500,
        //   disableOnInteraction: false,
        // }}

        pagination={{ clickable: true }}
        className="pb-16 slider-3d "
        onClick={(swiper) => {
          // If clicked outside slides, clickedIndex is undefined
          if (typeof swiper.clickedIndex !== 'number') return;
          
          if (swiper.clickedIndex !== swiper.activeIndex) {
            // Slide to the clicked slide
            swiper.slideTo(swiper.clickedIndex);
          } else {
            // Active slide was clicked, open popup
            onCardClick?.(roomTypes[swiper.clickedIndex]);
          }
        }}
      >
        {roomTypes.map((room, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`card-3d rounded-2xl overflow-hidden shadow-xl border transition-all duration-500 cursor-pointer ${
                  isActive ? "hover:-translate-y-2" : ""
                } ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
              {/* Image */}
              <div className="h-64 relative">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-8">
                <h3
                  className={`text-2xl font-semibold mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {room.name}
                </h3>

                <p
                  className={`leading-relaxed ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {room.description}
                </p>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RoomSlider;
