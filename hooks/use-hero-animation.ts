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
    if (isAnimationComplete) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=12000", // Extended for Phase 7 (white page transition)
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
            y: -240,
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
          "<",
        )

        // Phase 3: Text Lock in Place & Cards Start Appearing
        .to(
          ".text-content-wrapper",
          {
            y: -240,
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

      // Phase 3: Card Animation Setup
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

      // Phase 4: V-Shape Formation
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

        // Reveal "النسخة" title
        .set(".phase-5-wrapper", { y: -240 }, "<")
        .to(".phase-5-wrapper", {
          opacity: 1,
          duration: 0.5,
          ease: "power2.inOut"
        }, "<+=0.2")

      // 5.2: Move V-Shape Container to 2×2 Center Position
      if (responsiveValues.containerConstraints) {
        const {
          x, y, width: absoluteWidth, height: absoluteHeight,
          transformOrigin,
          borderRadius, border, boxShadow, overflow
        } = responsiveValues.containerConstraints

        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        // Helper to parse dimensions (px, vw, vh, %)
        const parseDim = (val: string | number | undefined, ref: number): number => {
          if (val === undefined) return 0
          if (typeof val === 'number') return val
          if (typeof val === 'string') {
            const trimmed = val.trim()
            if (trimmed.includes('vw')) return (parseFloat(trimmed) / 100) * viewportWidth
            if (trimmed.includes('vh')) return (parseFloat(trimmed) / 100) * viewportHeight
            if (trimmed.includes('px')) return parseFloat(trimmed)
            if (trimmed.includes('%')) return (parseFloat(trimmed) / 100) * ref
          }
          return parseFloat(String(val)) || 0
        }

        // حساب أبعاد المركز 2×2
        const targetWidth = parseDim(absoluteWidth, viewportWidth)
        const targetHeight = parseDim(absoluteHeight, viewportHeight)
        const targetX = parseDim(x, viewportWidth)
        const targetY = parseDim(y, viewportHeight)

        console.log("📐 AUDIT: Phase 5.2 Target Calculations:", {
          config: { x, y, width: absoluteWidth, height: absoluteHeight },
          calculated: { targetX, targetY, targetWidth, targetHeight },
          viewport: { viewportWidth, viewportHeight }
        })

        tl.to(".v-shape-container", {
          width: targetWidth,
          height: targetHeight,
          x: targetX,
          y: targetY,
          scale: 1,
          transformOrigin: transformOrigin || "top left",
          borderRadius: borderRadius || "12px",
          border: border || "none",
          boxShadow: boxShadow || "none",
          overflow: overflow || "hidden",
          duration: 4,
          ease: "power3.inOut",
          onComplete: () => {
            const el = document.querySelector(".v-shape-container")
            if (el) {
              const rect = el.getBoundingClientRect()
              const diff = {
                xDiff: Math.abs(rect.left - targetX),
                yDiff: Math.abs(rect.top - targetY),
                wDiff: Math.abs(rect.width - targetWidth),
                hDiff: Math.abs(rect.height - targetHeight)
              }
              const isAligned = diff.xDiff < 1 && diff.yDiff < 1 && diff.wDiff < 1 && diff.hDiff < 1
              console.log("📍 AUDIT: Phase 5.2 Container:", {
                actual: { x: rect.left, y: rect.top, w: rect.width, h: rect.height },
                target: { targetX, targetY, targetWidth, targetHeight },
                diff,
                status: isAligned ? "✅ ALIGNED" : "⚠️ MISALIGNED"
              })
            }
          }
        })
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
            rotation: cardConfig.rotation + (Math.random() * 10 - 5)
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
          `+=${i === 0 ? 0.2 : 0.5}`
        )
      })

      // =================================================================================================
      // PHASE 6: Text Content Swap (The Illusion of Swap)
      // =================================================================================================
      // Only swap text content - keep containers, positions, and styling unchanged
      // This creates the illusion of a swap without any layout shifts or complex manipulations

      // Fade out both elements simultaneously
      tl.to([".text-content-wrapper", ".phase-5-wrapper"], {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
      }, "+=1")

        // Swap only the text content while invisible
        .call(() => {
          const mainTitle = document.querySelector(".text-content-wrapper h1")
          const subTitle = document.querySelector(".phase-5-wrapper p")

          if (mainTitle && subTitle) {
            // Simple text swap - no class/position changes needed
            const tempText = mainTitle.textContent || ""
            mainTitle.textContent = subTitle.textContent || ""
            subTitle.textContent = tempText

            console.log("✅ PHASE 6: Text swapped successfully", {
              h1: mainTitle.textContent,
              p: subTitle.textContent
            })
          }
        })

        // Fade in both elements simultaneously with new text
        .to([".text-content-wrapper", ".phase-5-wrapper"], {
          opacity: 1,
          duration: 0.5,
          ease: "power2.inOut"
        })

      // =================================================================================================
      // PHASE 7: الانتقال للشبكة 4×4
      // =================================================================================================
      // التصميم:
      // [0] [1] [2] [3]    ← الصف العلوي (4 كروت)
      // [4]  [2×2]   [6]   ← الوسط يسار + المركز 2×2 + الوسط يمين
      // [5]  [2×2]   [7]   ← الوسط يسار + المركز 2×2 + الوسط يمين
      // [8] [9] [10] [11]  ← الصف السفلي (4 كروت)
      // المجموع: 12 كارت محيطة + مركز 2×2
      // =================================================================================================

      tl.addLabel("phase7Start", "+=0.5")

      // 7.0: الإعداد - تحويل phase-5-group للـ fixed positioning
      tl.call(() => {
        const phase5Group = document.querySelector(".phase-5-group") as HTMLElement
        if (phase5Group) {
          phase5Group.style.position = "fixed"
          phase5Group.style.top = "50%"
          phase5Group.style.left = "50%"
          phase5Group.style.width = "100vw"
          phase5Group.style.height = "100vh"
          phase5Group.style.zIndex = "200"
          console.log("🔧 PHASE 7.0: phase-5-group repositioned as FIXED at center")
        }
      }, [], "phase7Start")

      // إعادة تعيين الـ transforms
      tl.set(".phase-5-group", {
        x: 0,
        y: 0,
        xPercent: -50,
        yPercent: -50,
        scale: 1,
      }, "phase7Start")

      // 7.1: تقليص 75% من المنتصف (ليصبح المركز 2×2 مناسباً للشبكة)
      tl.to(".phase-5-group", {
        scale: 0.75,
        duration: 1.5,
        ease: "power2.inOut",
        onStart: () => console.log("🚀 PHASE 7.1: Shrinking to 75%"),
        onComplete: () => {
          const el = document.querySelector(".phase-5-group")
          if (el) {
            const rect = el.getBoundingClientRect()
            console.log("📍 AUDIT: After Shrink:", {
              x: rect.left, y: rect.top, w: rect.width, h: rect.height,
              centerX: rect.left + rect.width / 2,
              centerY: rect.top + rect.height / 2
            })
          }
        }
      }, "phase7Start+=0.1")

      // 7.2: تحريك للموقع النهائي (المركز 2×2 من الشبكة)
      // حيث المركز يبدأ من 25.5% ويمتد 49%
      tl.to(".phase-5-group", {
        xPercent: -50,  // يبقى في المنتصف أفقياً
        yPercent: -50,  // يبقى في المنتصف عمودياً
        duration: 1.5,
        ease: "power2.inOut",
        onStart: () => console.log("🚀 PHASE 7.2: Positioning for 4×4 Grid"),
        onComplete: () => {
          const el = document.querySelector(".phase-5-group")
          if (el) {
            const rect = el.getBoundingClientRect()
            console.log("📍 AUDIT: After Position:", {
              x: rect.left, y: rect.top, w: rect.width, h: rect.height
            })
          }
        }
      }, "phase7Start+=1.6")

      // 7.2b: جعل خلفية phase-5-group شفافة
      tl.to(".phase-5-group", {
        backgroundColor: "transparent",
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => console.log("🎨 PHASE 7.2b: phase-5-group background is now transparent")
      }, "phase7Start+=2.5")

      // 7.3: الصفحة البيضاء تصعد من أسفل
      tl.to(".grid-page-section", {
        transform: "translateY(0)",
        duration: 2,
        ease: "power2.inOut",
        onStart: () => console.log("🚀 PHASE 7.3: White grid page rising"),
      }, "phase7Start+=3.5")

      // 7.4: إظهار الـ 12 كارت المحيطة
      if (responsiveValues.surroundingCards) {
        // ترتيب الظهور: العلوي → اليسار → اليمين → السفلي
        const animationOrder = [
          // الصف العلوي (0-3) - من اليمين لليسار
          { index: 3, delay: 0 },
          { index: 2, delay: 0.08 },
          { index: 1, delay: 0.16 },
          { index: 0, delay: 0.24 },
          // العمود الأيسر (4-5)
          { index: 4, delay: 0.32 },
          { index: 5, delay: 0.40 },
          // العمود الأيمن (6-7)
          { index: 6, delay: 0.32 },
          { index: 7, delay: 0.40 },
          // الصف السفلي (8-11) - من اليمين لليسار
          { index: 11, delay: 0.48 },
          { index: 10, delay: 0.56 },
          { index: 9, delay: 0.64 },
          { index: 8, delay: 0.72 },
        ]

        animationOrder.forEach(({ index, delay }) => {
          const card = responsiveValues.surroundingCards[index]
          if (!card) return

          tl.fromTo(
            `.grid-card-${index}`,
            {
              opacity: 0,
              x: card.initialX * 2,
              y: card.initialY * 2,
              scale: 0.7,
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: "back.out(1.2)",
              onComplete: () => {
                const el = document.querySelector(`.grid-card-${index}`)
                if (el) {
                  const rect = el.getBoundingClientRect()
                  const expectedTop = (parseFloat(card.top) / 100) * window.innerHeight
                  const expectedLeft = (parseFloat(card.left) / 100) * window.innerWidth
                  const isAligned = Math.abs(rect.top - expectedTop) < 5 && Math.abs(rect.left - expectedLeft) < 5
                  console.log(`📍 AUDIT: Grid Card ${index}:`, {
                    actual: { x: rect.left, y: rect.top, w: rect.width, h: rect.height },
                    expected: { x: expectedLeft, y: expectedTop },
                    status: isAligned ? "✅ ALIGNED" : "⚠️ CHECK"
                  })
                }
              }
            },
            `phase7Start+=${5.5 + delay}`
          )
        })
      }

      // =================================================================================================
      // PHASE 8: التجميد النهائي - الشبكة مكتملة
      // =================================================================================================
      tl.to({}, {
        duration: 2,
        onStart: () => {
          console.log("🛑 PHASE 8: Grid Complete - 12 Surrounding Cards + 2×2 Center")
          // طباعة تقرير نهائي
          const gridCards = document.querySelectorAll('[class*="grid-card-"]')
          const centerEl = document.querySelector(".v-shape-container")
          console.log("📊 FINAL AUDIT:", {
            totalGridCards: gridCards.length,
            centerPresent: !!centerEl,
            expectedTotal: 12
          })
        }
      })
    })

    return () => {
      ctx.revert()
      ScrollTrigger.getById("hero-scroll")?.kill()
    }
  }, [responsiveValues, isAnimationComplete])

  return { responsiveValues }
}
