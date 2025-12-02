"use client"

import Image from "next/image"

interface StackingImageCardProps {
  src: string
  alt: string
  index: number
  className?: string
  width?: string
  height?: string
}

export const StackingImageCard = ({ 
  src, 
  alt, 
  index, 
  className = "",
  width = "clamp(200px, 30vw, 400px)",
  height = "auto"
}: StackingImageCardProps) => {
  return (
    <div
      className={`stacking-card absolute rounded-xl shadow-2xl overflow-hidden border-2 border-white/20 ${className}`}
      style={{
        width: width,
        height: height,
        aspectRatio: height === "auto" ? "16/9" : "unset",
        zIndex: 50 + index,
        transformOrigin: "center center",
      }}
    >
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 hover:scale-105"
          priority={index < 2}
        />
        {/* Overlay gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
