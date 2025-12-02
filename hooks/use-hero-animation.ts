import { useState, useEffect, useLayoutEffect, RefObject } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { heroConfig, ResponsiveConfig } from "@/lib/hero-config"

gsap.registerPlugin(ScrollTrigger)

interface UseHeroAnimationReturn {
  responsiveValues: ResponsiveConfig | null
}

export const useHeroAnimation = (
  containerRef: RefObject<HTMLDivElement | null>,
  triggerRef: RefObject<HTMLDivElement | null>
): UseHeroAnimationReturn => {
  const [responsiveValues, setResponsiveValues] = useState<ResponsiveConfig | null>(null)
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)

  // 1. Logic: التعامل مع تغيير حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      const values = heroConfig.getResponsiveValues(window.innerWidth)
      setResponsiveValues(values)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // 2. Logic: التعامل مع التحريك (GSAP)
  useLayoutEffect(() => {
    if (!responsiveValues || !containerRef.current || !triggerRef.current) return
    if (isAnimationComplete) return // منع إعادة الحساب بعد انتهاء الأنيميشن

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=8000",
          scrub: 2.5,
          pin: true,
          anticipatePin: 1,
          id: "hero-scroll",
        },
      })

      // Phase 1: Reveal Video
      tl.to(".video-mask-wrapper", {
        scale: 5,
        y: -600,
        opacity: 0,
        duration: 3,
        ease: "power2.inOut",
        pointerEvents: "none",
      })

        // Phase 2: Show Fixed Header
        .fromTo(".fixed-header", { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=2")
        .fromTo(
          ".text-content-wrapper",
          { opacity: 0, y: 300, scale: 0.9 },
          {
            opacity: 1,
            y: -230,
            scale: 1,
            duration: 2,
            ease: "power2.out",
            zIndex: 30,
          },
          "-=1.5",
        )
        .fromTo(
          ".dedication-wrapper",
          { opacity: 0, y: 300, scale: 0.9 },
          {
            opacity: 1,
            y: -240,
            scale: 1,
            duration: 2,
            ease: "power2.out",
            zIndex: 30,
          },
          "<", // Start at the same time as the previous animation
        )

        // Phase 3: Text Lock in Place & Cards Start Appearing
        .to(
          ".text-content-wrapper",
          {
            y: -230,
            duration: 1,
            ease: "none",
          },
          0.5,
        )
        .to(
          ".dedication-wrapper",
          {
            y: -240,
            duration: 1,
            ease: "none",
          },
          "<",
        )

      // Phase 3: Card Animation Setup - Cards enter from bottom continuously
      const phase3Images = gsap.utils.toArray(".phase-3-img") as HTMLElement[]
      phase3Images.forEach((img, i) => {
        const staggerDelay = i * 0.15
        const randomX = (i % 2 === 0 ? -1 : 1) * (Math.random() * 30 + 10)
        const randomAngle = (Math.random() - 0.5) * 20

        tl.fromTo(
          img,
          { y: "120vh", rotation: randomAngle, opacity: 0, xPercent: randomX },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          1.2 + staggerDelay,
        )
      })

      // Phase 4: V-Shape Formation with smooth transition
      tl.to(
        ".phase-3-img",
        {
          top: (i) => {
            if (i < 7) return responsiveValues.vShapePositions[i]?.top || "50%"
            return "100vh"
          },
          left: (i) => {
            if (i < 7) return responsiveValues.vShapePositions[i]?.left || "50%"
            return "50%"
          },
          xPercent: -50,
          yPercent: -50,
          rotation: (i) => (i < 7 ? responsiveValues.vShapePositions[i]?.rotation || 0 : 0),
          scale: 0.85,
          opacity: (i) => (i < 7 ? 1 : 0),
          duration: 1.5,
          ease: "power3.inOut",
        },
        2,
      )

      // Phase 5: Stacking Cards Animation

      // 5.1: Hide Dedication Text First
      tl.to(".dedication-layer", {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
      }, "+=0.5")

        // Reveal "النسخة" title, ensuring it starts at the same Y position as dedication
        .set(".phase-5-wrapper", { y: -240 }, "<")
        .to(".phase-5-wrapper", {
          opacity: 1,
          duration: 0.5,
          ease: "power2.inOut"
        }, "<+=0.2")

      // 5.2: Move V-Shape Container to Bottom Left & Scale Down
      // ENGINEERING FIX: Pure Scale-Based Animation
      // WHY: To preserve the internal composition (relationship between text and cards), we must NOT change the container's Width/Height.
      // HOW: We keep the container at 100% size and use `scale` to shrink it to the target dimensions.
      if (responsiveValues.containerConstraints) {
        const container = document.querySelector(".v-shape-container") as HTMLElement
        if (container) {
          console.log("DEBUG: containerConstraints", responsiveValues.containerConstraints);
          const {
            left, right, bottom,
            x, y, width: absoluteWidth, height: absoluteHeight,
            transformOrigin,
            borderRadius, border, boxShadow, overflow
          } = responsiveValues.containerConstraints

          // Calculate target position in viewport coordinates
          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight

          let targetScale = 1
          let targetX = 0
          let targetY = 0

          // Logic Branch: Absolute vs Constraint-Based
          if (x !== undefined && y !== undefined && absoluteWidth !== undefined) {
            // 1. Absolute Positioning (User Request)
            // Calculate Scale based on Width ratio to preserve aspect ratio
            targetScale = absoluteWidth / viewportWidth

            // Position: We use "top left" origin for precise positioning
            targetX = x
            targetY = y
          } else if (left !== undefined && right !== undefined && bottom !== undefined) {
            // 2. Constraint-Based Positioning (Responsive)
            const targetWidth = viewportWidth - left - right
            targetScale = targetWidth / viewportWidth
            targetX = left

            // Calculate Y based on Bottom constraint
            let heightPx = 0
            if (typeof absoluteHeight === 'string' && absoluteHeight.includes("vh")) {
              heightPx = (parseFloat(absoluteHeight) / 100) * viewportHeight
            } else if (typeof absoluteHeight === 'string' && absoluteHeight.includes("px")) {
              heightPx = parseFloat(absoluteHeight)
            } else if (typeof absoluteHeight === 'number') {
              heightPx = absoluteHeight
            } else {
              heightPx = (85 / 100) * viewportHeight
            }
            targetY = viewportHeight - bottom - heightPx
          }

          tl.to(".v-shape-container", {
            scale: targetScale,
            x: targetX,
            y: targetY,
            // IMPORTANT: Do NOT animate width/height. Keep them at 100% to preserve layout.
            transformOrigin: "top left", // Force top-left for easier coordinate mapping

            // Visual Refinements (From Config) with Scale Compensation
            // ENGINEERING FIX: Divide radius by scale to maintain visual consistency
            borderRadius: borderRadius ? `${parseFloat(borderRadius) / targetScale}px` : "0px",
            border: border || "none",
            boxShadow: boxShadow || "none",
            overflow: overflow || "visible",

            duration: 4, // Slower for verification
            ease: "power3.inOut",

            // AUDIT SCRIPT: Log final coordinates of all 4 corners
            onComplete: () => {
              const rect = container.getBoundingClientRect()
              const computedStyle = window.getComputedStyle(container)

              const corners = {
                topLeft: { x: rect.left, y: rect.top },
                topRight: { x: rect.right, y: rect.top },
                bottomRight: { x: rect.right, y: rect.bottom },
                bottomLeft: { x: rect.left, y: rect.bottom }
              }

              console.group("🔍 AUDIT: V-Shape Container - Final State")
              console.log("📍 Coordinates (Top-Left):", `(${corners.topLeft.x.toFixed(2)}, ${corners.topLeft.y.toFixed(2)})`)
              console.log("📏 Dimensions:", {
                width: rect.width.toFixed(2),
                height: rect.height.toFixed(2),
                scale: targetScale.toFixed(4)
              })

              console.group("🎨 Computed Styles")
              console.log("Border Radius:", computedStyle.borderRadius)
              console.log("Border:", computedStyle.border)
              console.log("Box Shadow:", computedStyle.boxShadow)
              console.log("Transform:", computedStyle.transform)
              console.groupEnd()

              console.groupEnd()

              // تثبيت الموضع بعد انتهاء الأنيميشن
              setIsAnimationComplete(true)
            }
          })
        }
      }

      // 5.3: Stacking Cards - Reveal one by one
      const stackingCards = responsiveValues.stackingCards || []
      stackingCards.forEach((cardConfig, i) => {
        if (!cardConfig) return

        tl.fromTo(
          `.stacking-card-${i}`,
          {
            y: "120vh",
            opacity: 0,
            scale: 0.8,
            rotation: cardConfig.rotation + (Math.random() * 10 - 5) // Random start rotation
          },
          {
            y: 0,
            top: cardConfig.top,
            left: cardConfig.left,
            width: cardConfig.width,
            height: cardConfig.height,
            opacity: 1,
            scale: cardConfig.scale,
            rotation: cardConfig.rotation,
            duration: 1.5,
            ease: "power2.out"
          },
          `+=${i === 0 ? 0.2 : 0.5}` // Stagger delay: first one comes quickly, others follow
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [responsiveValues])

  return { responsiveValues }
}
