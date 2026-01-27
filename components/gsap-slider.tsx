'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const SLIDES = [
  { id: 1, title: 'Slide 1', color: '#fef3c7' },
  { id: 2, title: 'Slide 2', color: '#dbeafe' },
  { id: 3, title: 'Slide 3', color: '#dcfce7' },
]

export const GsapSlider = () => {
  const swiperRef = useRef<SwiperType | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // useGSAPでスコープとcontextSafeを取得
  const { contextSafe } = useGSAP({ scope: containerRef })

  // contextSafeでラップすることで、アニメーションが適切にクリーンアップされる
  const animateSlide = contextSafe((swiper: SwiperType) => {
    const activeSlide = swiper.slides[swiper.activeIndex]
    const title = activeSlide?.querySelector('.slide-title')
    const description = activeSlide?.querySelector('.slide-description')
    const button = activeSlide?.querySelector('.slide-button')

    const tl = gsap.timeline()

    tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 })
      .fromTo(
        description,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4 },
        '-=0.2', // 前のアニメーションと0.2秒重なる
      )
      .fromTo(
        button,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.3 },
        '-=0.1',
      )
  })

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto">
      <Swiper
        speed={0} // Swiperのトランジションを無効化
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        onSlideChangeTransitionStart={animateSlide}
        onInit={animateSlide}
        className="rounded-lg overflow-hidden"
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="flex h-[400px] items-center justify-center"
              style={{
                backgroundColor: slide.color,
              }}
            >
              <h2 className="slide-title text-4xl font-bold">{slide.title}</h2>
              <p className="slide-description"></p>
              <button className="slide-button">button</button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
