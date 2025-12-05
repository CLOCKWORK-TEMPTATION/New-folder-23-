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

      // 5.2: Move V-Shape Container to Bottom Left & Scale Down
      if (responsiveValues.containerConstraints) {
        const container = document.querySelector(".v-shape-container") as HTMLElement
        if (container) {
          const {
            left, right, bottom,
            x, y, width: absoluteWidth, height: absoluteHeight,
            transformOrigin,
            borderRadius, border, boxShadow, overflow
          } = responsiveValues.containerConstraints

          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight

          let targetScale = 1
          let targetX = 0
          let targetY = 0

          if (x !== undefined && y !== undefined && absoluteWidth !== undefined) {
            targetScale = absoluteWidth / viewportWidth
            targetX = x
            targetY = y
          } else if (left !== undefined && right !== undefined && bottom !== undefined) {
            const targetWidth = viewportWidth - left - right
            targetScale = targetWidth / viewportWidth
            targetX = left

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
            transformOrigin: "top left",
            borderRadius: borderRadius ? `${parseFloat(borderRadius) / targetScale}px` : "0px",
            border: border || "none",
            boxShadow: boxShadow || "none",
            overflow: overflow || "visible",
            duration: 4,
            ease: "power3.inOut",
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
      // PHASE 7: Freeze → Shrink 75% (Center) → Move to Top-Right → White Page → 7 Images
      // =================================================================================================
      // الخطوات:
      // 7.1: تجميد + تقليص 75% → تبقى في المنتصف
      // 7.2: تحريك الوحدة المجمدة من المنتصف إلى أعلى-يمين → الفراغ 25% في يسار + أسفل
      // 7.3: الصفحة البيضاء تصعد (خلف الصور والـ V-Shape)
      // 7.4: الصور الـ 7 تظهر
      // =================================================================================================

      tl.addLabel("phase7Start", "+=0.5")

      // 7.0: إزالة overflow-hidden من triggerRef + تحويل phase-5-group لـ fixed
      // هذا يحل مشكلة الحجب بدون نقل DOM
      tl.call(() => {
        // إزالة overflow-hidden من triggerRef
        if (triggerRef.current) {
          triggerRef.current.style.overflow = "visible"
          console.log("🔓 PHASE 7.0a: Removed overflow-hidden from triggerRef")
        }

        // تحويل phase-5-group لـ fixed
        const phase5Group = document.querySelector(".phase-5-group") as HTMLElement
        if (phase5Group) {
          phase5Group.style.position = "fixed"
          phase5Group.style.top = "0"
          phase5Group.style.left = "0"
          phase5Group.style.width = "100vw"
          phase5Group.style.height = "100vh"
          phase5Group.style.zIndex = "200"

          const rect = phase5Group.getBoundingClientRect()
          console.log("🔓 PHASE 7.0b: phase-5-group is now FIXED", {
            x: rect.left, y: rect.top, w: rect.width, h: rect.height
          })
        }
      }, [], "phase7Start")

      // إزالة الـ transforms السابقة من phase-5-group قبل التقليص
      tl.set(".phase-5-group", {
        clearProps: "scale,x,y,rotation,transform"
      }, "phase7Start")

      // 7.1: تجميد + تقليص 75% → تبقى في المنتصف (transformOrigin: center)
      tl.to(".phase-5-group", {
        scale: 0.75,
        transformOrigin: "center center",  // التقليص من المنتصف → تبقى في المنتصف
        duration: 1.5,
        ease: "power2.inOut",
        onStart: () => console.log("🚀 PHASE 7.1: Freezing + Shrinking to 75% (Center)"),
        onComplete: () => {
          const el = document.querySelector(".phase-5-group")
          if (el) {
            const rect = el.getBoundingClientRect()
            console.log("📍 AUDIT: After Shrink (Center):", {
              x: rect.left, y: rect.top, w: rect.width, h: rect.height
            })
          }
        }
      }, "phase7Start+=0.1")

      // 7.2: تحريك الوحدة المجمدة من المنتصف إلى أعلى-يمين
      // الفراغ 25% سيكون في يسار + أسفل
      tl.to(".phase-5-group", {
        x: "12.5%",   // تتحرك لليمين بـ 12.5% (نصف الـ 25%)
        y: "-8%",     // تتحرك لأعلى بـ 8% (تحت الـ Header مباشرة)
        duration: 1.5,
        ease: "power2.inOut",
        onStart: () => console.log("🚀 PHASE 7.2: Moving from Center to Top-Right"),
        onComplete: () => {
          const el = document.querySelector(".phase-5-group")
          if (el) {
            const rect = el.getBoundingClientRect()
            console.log("📍 AUDIT: After Move to Top-Right:", {
              x: rect.left, y: rect.top, w: rect.width, h: rect.height
            })
          }
        }
      }, "phase7Start+=1.6")

      // 7.2b: جعل خلفية phase-5-group شفافة (لكن v-shape-container تبقى سوداء)
      tl.to(".phase-5-group", {
        backgroundColor: "transparent",
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => console.log("🎨 PHASE 7.2b: phase-5-group background is now transparent")
      }, "phase7Start+=3")

      // 7.3: الصفحة البيضاء تصعد من أسفل (خلف الصور والـ V-Shape)
      // z-index: 50 (أقل من phase-5-group التي لها z-200)
      tl.to(".grid-page-section", {
        top: "0",  // تصعد من 100vh إلى 0
        duration: 2,
        ease: "power2.inOut",
        onStart: () => console.log("🚀 PHASE 7.3: White page rising (behind container)"),
      }, "phase7Start+=3.5")

      // 7.4: إظهار الـ 7 صور الجديدة على الصفحة البيضاء
      if (responsiveValues.surroundingCards) {
        responsiveValues.surroundingCards.forEach((card, i) => {
          tl.fromTo(
            `.grid-card-${i}`,
            {
              opacity: 0,
              x: card.initialX * 1.5,
              y: card.initialY * 1.5,
              scale: 0.8,
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: "power2.out",
              onComplete: () => {
                const el = document.querySelector(`.grid-card-${i}`)
                if (el) {
                  const rect = el.getBoundingClientRect()
                  console.log(`📍 AUDIT: Grid Card ${i}:`, {
                    x: rect.left, y: rect.top, w: rect.width, h: rect.height
                  })
                }
              }
            },
            `phase7Start+=${5.5 + (i * 0.1)}`
          )
        })
      }

      // =================================================================================================
      // PHASE 8: Hold / Freeze - Final Layout
      // =================================================================================================
      tl.to({}, {
        duration: 2,
        onStart: () => console.log("🛑 PHASE 8: Grid Complete - 12 Images + V-Shape")
      })
    })

    return () => {
      ctx.revert()
      ScrollTrigger.getById("hero-scroll")?.kill()
    }
  }, [responsiveValues, isAnimationComplete])

  return { responsiveValues }
}
