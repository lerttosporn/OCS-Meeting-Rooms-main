import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import slider1 from '../assets/slider/slider-1.png';
import slider2 from '../assets/slider/slider-2.jpg';
import slider3 from '../assets/slider/slider-3.jpg';
import slider4 from '../assets/slider/slider-4.jpg';
import slider5 from '../assets/slider/slider-5.jpg';

const images = [slider1, slider2, slider3, slider4, slider5];

export const ImageSlider: React.FC = () => {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 relative group">
      <style>{`
        .image-swiper .swiper-button-next,
        .image-swiper .swiper-button-prev {
          color: white;
          background-color: rgba(0, 0, 0, 0.5);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          transition: all 0.3s ease;
          opacity: 0;
        }
        .image-swiper:hover .swiper-button-next,
        .image-swiper:hover .swiper-button-prev {
          opacity: 1;
        }
        .image-swiper .swiper-button-next:hover,
        .image-swiper .swiper-button-prev:hover {
          background-color: rgba(0, 0, 0, 0.8);
        }
        .image-swiper .swiper-button-next::after,
        .image-swiper .swiper-button-prev::after {
          font-size: 20px;
          font-weight: bold;
        }
        .image-swiper .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background-color: white;
          opacity: 0.5;
        }
        .image-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background-color: #0056b3;
        }
      `}</style>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        className="image-swiper aspect-[2/1] w-full max-h-[350px] rounded-xl"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-full flex items-center justify-center bg-black/10">
              <img
                src={img}
                alt={`Room preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
