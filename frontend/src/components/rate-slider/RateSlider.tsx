import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import { Clock, Calendar, Package } from "lucide-react";

interface RateType {
  type: string;
  hourly: number | null;
  halfDay: number;
  fullDay: number;
  features: string[];
}

export default function RateSlider({
  rates,
  isDarkMode,
}: {
  rates: RateType[];
  isDarkMode: boolean;
}) {
  return (
    <div className="relative w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
        // slidesPerView={3}
        // spaceBetween={40}
        initialSlide={1}
        // centeredSlides
        loop={rates.length > 3}
        // autoplay={{
        //   delay: 2500,
        //   disableOnInteraction: false,
        // }}
        pagination={{ clickable: true }}
        effect="coverflow"
        coverflowEffect={{
          rotate: 18,
          stretch: 0,
          depth: 200,
          modifier: 1.5,
          slideShadows: false,
        }}
        className="py-12"
        breakpoints={{
          0: {
            // 👈 มือถือ
            slidesPerView: 1,
            spaceBetween: 20,
            centeredSlides: true,
          },
          640: {
            // 👈 มือถือจอใหญ่
            slidesPerView: 1.3,
            spaceBetween: 20,
          },
          768: {
            // 👈 Tablet
            slidesPerView: 2,
            spaceBetween: 25,
            centeredSlides: true,
          },
          1024: {
            // 👈 Desktop
            slidesPerView: 3,
            spaceBetween: 40,
            centeredSlides: true,
          },
        }}
      >
        {rates.map((room, index) => (
          <SwiperSlide key={index}>
            <div
              className={`rounded-2xl p-8 border-2 shadow-xl transition-all duration-300
              hover:shadow-2xl hover:border-[#0056b3] scale-90 swiper-slide-active:scale-110 
              ${
                isDarkMode
                  ? "bg-gray-900 border-gray-700"
                  : "bg-white border-gray-300"
              }
              `}
            >
              {/* Title */}
              <h3
                className={`text-2xl mb-8 pb-4 border-b-2 ${
                  isDarkMode
                    ? "text-white border-gray-700"
                    : "text-gray-900 border-gray-200"
                }`}
              >
                {room.type}
              </h3>

              {/* Prices */}
              <div className="space-y-5 mb-8">
                {/* Hourly */}
                {room.hourly && (
                  <div
                    className={`p-5 rounded-xl border-2 shadow-md ${
                      isDarkMode
                        ? "bg-gray-800 border-[#0056b3]/30"
                        : "bg-gradient-to-br from-blue-50 to-white border-blue-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-5 h-5" style={{ color: "#0056b3" }} />
                      <span
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Hourly Rate
                      </span>
                    </div>
                    <p
                      className={`text-3xl ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {room.hourly}
                      <span className="text-base text-gray-500"> THB/hr</span>
                    </p>
                  </div>
                )}

                {/* Half Day */}
                <div
                  className={`p-5 rounded-xl border ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar
                      className="w-5 h-5"
                      style={{ color: "#0056b3" }}
                    />
                    <span
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Half Day (4hrs)
                    </span>
                  </div>
                  <p
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {room.halfDay} THB
                  </p>
                </div>

                {/* Full Day */}
                <div
                  className={`p-5 rounded-xl border ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="w-5 h-5" style={{ color: "#0056b3" }} />
                    <span
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Full Day (8hrs)
                    </span>
                  </div>
                  <p
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {room.fullDay} THB
                  </p>
                </div>
              </div>

              {/* Features */}
              <div
                className={`pt-6 border-t-2 ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <p
                  className={`mb-4 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Includes:
                </p>
                <ul className="space-y-3">
                  {room.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start gap-3 text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: "#00c853" }}
                      ></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
