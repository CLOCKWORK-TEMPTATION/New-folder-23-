"use client"

import { forwardRef } from "react"

interface VideoTextMaskProps {
  videoSrc: string
  text: string
  className?: string
}

export const VideoTextMask = forwardRef<HTMLDivElement, VideoTextMaskProps>(
  ({ videoSrc, text, className = "" }, ref) => {
    return (
      <div className={`relative ${className}`}>
        {/* Wrapper for video and mask - ref for animation */}
        <div ref={ref} className="absolute inset-0 w-full h-full">
          {/* Video in background - z-index: 1 */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 w-full h-full min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
            style={{ zIndex: 1 }}
            src={videoSrc}
          />

          {/* White layer with Black text - z-index: 2 */}
          <div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white"
            style={{
              zIndex: 2,
              mixBlendMode: "screen",
            }}
          >
            <h1
              className="text-center m-0 p-0 leading-none"
              style={{
                fontSize: "clamp(8rem, 28vw, 40rem)",
                fontWeight: 900,
                color: "black",
                fontFamily:
                  "'Cairo', 'Noto Kufi Arabic', 'system-ui', '-apple-system', 'Segoe UI', 'Arial Black', sans-serif",
                letterSpacing: "-0.08em",
                fontStretch: "ultra-expanded",
              }}
            >
              {text}
            </h1>
          </div>
        </div>

        {/* Backup black background */}
        <div className="absolute inset-0 -z-10 bg-black" />
      </div>
    )
  },
)

VideoTextMask.displayName = "VideoTextMask"
