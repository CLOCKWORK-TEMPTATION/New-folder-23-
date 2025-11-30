"use client"

import { useRef } from "react"
import { VideoTextMask } from "./video-text-mask"
import { useHeroAnimation } from "@/hooks/use-hero-animation"
import Image from "next/image"

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
      {/* Fixed Header */}
      <div className="fixed-header fixed top-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-sm border-b border-white/10 z-[100] opacity-0 flex items-center justify-center">
        <span className="font-bold text-sm md:text-base lg:text-xl tracking-widest text-white/80">النسخة</span>
      </div>

      <div
        ref={triggerRef}
        className="h-screen w-full relative overflow-hidden flex flex-col items-center justify-center"
      >
        {/* Layer 1: The Mask Animation */}
        <div className="video-mask-wrapper absolute inset-0 z-50 bg-white">
          <VideoTextMask
            videoSrc="https://cdn.pixabay.com/video/2025/11/09/314880.mp4"
            text="النسخة"
            className="w-full h-full"
          />
        </div>

        {/* Layer 2: Main Text Content */}
        <div className="main-content-wrapper relative z-40 flex flex-col items-center justify-center text-center w-full h-full">
          <div className="text-content-wrapper flex flex-col items-center justify-center w-auto z-30 -ml-3">
            <h1 className="text-main text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter leading-tight text-center">
              بس اصلي
            </h1>
          </div>
          <div className="dedication-wrapper flex flex-col items-center justify-center w-auto z-30 -ml-30">
            <p className="text-dedication text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-dedication-color mt-1 md:mt-2 text-center">
              اهداء ليسري نصر الله
            </p>
          </div>
        </div>

        {/* Layer 3: Floating Cards */}
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
