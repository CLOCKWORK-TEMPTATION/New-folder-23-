"use client"

import { useRef } from "react"
import { VideoTextMask } from "./video-text-mask"
import { useHeroAnimation } from "@/hooks/use-hero-animation"
import Image from "next/image"
import { StackingImageCard } from "./stacking-image-card"

import images from "@/images"

export const HeroAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  // Separation of Concerns: استدعاء المنطق من الـ Hook
  const { responsiveValues } = useHeroAnimation(containerRef, triggerRef)

  // Robustness: تجنب الـ Layout Shift
  if (!responsiveValues) return <div className="min-h-screen bg-black" />

  return (
    <div ref={containerRef} className="bg-black min-h-screen text-white" dir="rtl">
      <div
        ref={triggerRef}
        className="h-screen w-full relative overflow-visible flex flex-col items-center justify-center"
      >
        {/* Layer 1: The Mask Animation */}
        <div className="video-mask-wrapper absolute inset-0 z-50 bg-white">
          <VideoTextMask
            videoSrc="https://cdn.pixabay.com/video/2025/11/09/314880.mp4"
            text="النسخة"
            className="w-full h-full"
          />
        </div>

        {/* Fixed Header - Independent from V-Shape Container */}
        <div className="fixed-header fixed top-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-sm border-b border-white/10 z-[500] opacity-0 flex items-center justify-center">
          <span className="font-bold text-sm md:text-base lg:text-xl tracking-widest text-white/80">النسخة</span>
        </div>

        {/* Layer 3: Dedication Layer - Independent to fade out first */}
        <div className="dedication-layer absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
          <div className="dedication-wrapper flex flex-col items-center justify-center w-auto -ml-30 pt-32 md:pt-48">
            <p className="text-dedication text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-dedication-color mt-1 md:mt-0.5 text-center">
              اهداء ليسري نصر الله
            </p>
          </div>
        </div>

        {/* Global Scene Container for Phase 6 Zoom Out */}
        <div className="global-scene-container absolute inset-0 w-full h-full">

          {/* Phase 5 Group: Container + Stacking Cards + خلفية سوداء */}
          <div className="phase-5-group absolute inset-0 w-full h-full bg-black">

            {/* V-Shape Container (Moved here) */}
            <div className="v-shape-container absolute top-0 left-0 w-full h-full z-40 m-0 p-0">
              <div className="main-content-wrapper relative flex flex-col items-center justify-center text-center w-full h-full">
                <div className="text-content-wrapper flex flex-col items-center justify-center w-auto z-30 -ml-0.5">
                  <h1 className="text-main text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter leading-tight text-center">
                    بس اصلي
                  </h1>
                </div>
                <div className="phase-5-layer absolute inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none">
                  <div className="phase-5-wrapper opacity-0 flex flex-col items-center justify-center w-auto -ml-30 pt-32 md:pt-48">
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-white/80 text-center">
                      النسخة
                    </p>
                  </div>
                </div>
              </div>
              {[...Array(7)].map((_, i) => (
                <div
                  key={`p3-${i}`}
                  className="phase-3-img absolute rounded-lg shadow-2xl overflow-hidden border border-white/20"
                  style={{
                    width: `${responsiveValues.cardWidth}px`,
                    height: `${responsiveValues.cardHeight}px`,
                    left: `${40 + (i - 3) * 8}%`,
                    top: "100%",
                    transform: "translateX(-50%)",
                    zIndex: 30 - Math.abs(i - 3),
                  }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={images[i] || "/placeholder.svg"}
                      alt={`Scene ${i}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority={true}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Stacking Cards Layer */}
            <div className="stacking-cards-layer absolute inset-0 z-20 pointer-events-none">
              {[0, 1, 2, 3, 4].map((index) => (
                <StackingImageCard
                  key={`stack-${index}`}
                  src={images[index] || "/placeholder.svg"}
                  alt={`Stacking Card ${index + 1}`}
                  index={index}
                  className={`stacking-card-${index} opacity-0`}
                />
              ))}
            </div>
          </div>

          {/* Phase 6 Extension - 12 كارت محيطة بالمركز */}
          <div className="phase-6-extension absolute inset-0 w-full h-full pointer-events-none">
            {responsiveValues.surroundingCards?.map((card, index) => (
              <div
                key={`surround-wrapper-${index}`}
                className={`surrounding-card-wrapper-${index} absolute overflow-hidden rounded-lg`}
                style={{
                  top: card.top,
                  left: card.left,
                  width: card.width,
                  height: card.height,
                  zIndex: 10 + index
                }}
              >
                <StackingImageCard
                  src={images[(index + 5) % images.length] || "/placeholder.svg"}
                  alt={`Surrounding Card ${index + 1}`}
                  index={index + 10}
                  className={`surrounding-card-${index} opacity-0 w-full h-full rounded-lg`}
                  width="100%"
                  height="100%"
                />
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ===== GRID PAGE - الصفحة البيضاء (تصعد من أسفل) ===== */}
      {/* z-[50] أقل من phase-5-group التي ستصبح fixed بـ z-[200] */}
      <div
        className="grid-page-section fixed left-0 right-0 top-0 w-full h-full bg-white z-[50]"
        style={{ transform: "translateY(100vh)" }}
      >
        {/* شبكة 4×4 - 12 كارت محيطة + مركز 2×2 */}
        <div className="grid-cards-container absolute inset-0 w-full h-full z-0">
          {responsiveValues.surroundingCards?.map((card, index) => (
            <div
              key={`grid-card-wrapper-${index}`}
              className={`grid-card-wrapper-${index} absolute overflow-hidden rounded-lg`}
              style={{
                top: card.top,
                left: card.left,
                width: card.width,
                height: card.height,
                zIndex: 10 + index,
                boxSizing: "border-box",
              }}
            >
              <StackingImageCard
                src={images[(index + 5) % images.length] || "/placeholder.svg"}
                alt={`Grid Card ${index + 1}`}
                index={index + 10}
                className={`grid-card-${index} opacity-0 w-full h-full rounded-lg`}
                width="100%"
                height="100%"
              />
            </div>
          ))}
          
          {/* المركز 2×2 - محجوز للـ phase-5-group */}
          <div 
            className="center-placeholder absolute pointer-events-none"
            style={{
              top: "25.5%",
              left: "25.5%",
              width: "49%",
              height: "49%",
              zIndex: 5,
              // للتصحيح البصري فقط - يمكن إزالته لاحقاً
              // border: "2px dashed rgba(0,0,0,0.2)",
            }}
          />
        </div>
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-bounce text-white/50">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}
