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

        {/* Fixed Header - Independent from V-Shape Container */}
        <div className="fixed-header fixed top-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-sm border-b border-white/10 z-[100] opacity-0 flex items-center justify-center">
          <span className="font-bold text-sm md:text-base lg:text-xl tracking-widest text-white/80">النسخة</span>
        </div>

        {/* Layer 2: V-Shape Container - Independent Container for Phase 5 */}
        <div className="v-shape-container absolute top-0 left-0 w-full h-full z-40 m-0 p-0">
          {/* Main Text Content */}
          <div className="main-content-wrapper relative flex flex-col items-center justify-center text-center w-full h-full">
            <div className="text-content-wrapper flex flex-col items-center justify-center w-auto z-30 -ml-1.5">
              <h1 className="text-main text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter leading-tight text-center">
                بس اصلي
              </h1>
            </div>

            {/* Phase 5 Title: Structure mirrors dedication-layer exactly for precise positioning */}
            {/* This is inside v-shape-container so it shrinks with it */}
            <div className="phase-5-layer absolute inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none">
              <div className="phase-5-wrapper opacity-0 flex flex-col items-center justify-center w-auto -ml-30 pt-32 md:pt-48">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-white/80 text-center">
                  النسخة
                </p>
              </div>
            </div>
          </div>

          {/* Floating Cards - V Shape */}
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

        {/* Layer 3: Dedication Layer - Independent to fade out first */}
        <div className="dedication-layer absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
          {/* Spacer to match the text position roughly if needed, or rely on GSAP y positioning */}
          <div className="dedication-wrapper flex flex-col items-center justify-center w-auto -ml-30 pt-32 md:pt-48">
            <p className="text-dedication text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-dedication-color mt-1 md:mt-2 text-center">
              اهداء ليسري نصر الله
            </p>
          </div>
        </div>

        {/* Layer 4: Stacking Cards - Phase 5 */}
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
