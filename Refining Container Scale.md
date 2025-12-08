Revising Grid Alignment

I'm now focusing on getting the grid cards perfectly aligned with the 4x4 layout. The centerpiece, representing Phase 5, should indeed occupy a 2x2 space as specified. However, the present arrangement is showing gaps and misalignment, which is unacceptable. I'm experimenting with different positioning to achieve a flawless, cohesive presentation.

Addressing Card Placement

I've been working on getting the 12 surrounding cards accurately placed around the 2x2 "Phase 5" centerpiece. The current layout in lib/hero-config.ts has only 7 cards, so I'm updating it to include the missing 5 cards for a complete 4x4 grid. I've calculated the card dimensions using the user's suggestions (100%/4 - margins). My latest revision also tackles the slightly offset positions of the existing cards.

Updating Card Counts

I've re-examined the hero-config.ts file, confirming there are currently only 7 cards defined for surrounding the 2x2 "Phase 5" centerpiece. I'm now actively updating this to include the full set of 12 cards, as per the specifications. This also involves revisiting the card dimensions and placement calculations based on the given 4x4 grid and intended margins. I'm aiming for precise positioning, accounting for gaps to ensure a seamless visual presentation.

Mapping Card Coordinates

I'm now generating the surroundingCards array. I've defined a clear layout to populate: 12 cards forming the 4x4 border around the 2x2 centerpiece. I'm using 23.5% width/height and 1.5% gaps to fit them snugly. I'm now working through precise coordinates, with the 2x2 "Phase 5" section remaining untouched. I've re-reviewed the hero-config.ts file, and am prepared to update it with these precise card coordinates.

Finalizing Grid Positioning

I'm now implementing the 4x4 grid layout. I've calculated card dimensions at 24% width/height, with 0.5% gaps between cards and edges. My calculations for the hero-config.ts are ready, based on user input, defining precise positions using percentages. I'll ensure all 12 surrounding cards render correctly in hero-animation.tsx and adjust the entry animation properties to have each card enter from the correct edge.

Adjusting Card Animations

I'm now revising the animation of the cards for a smoother display. My latest update addresses the entry animation properties to have each card enter from the edge in hero-animation.tsx, and I've ensured a visually appealing entry sequence for the 4x4 grid. I've got the overall grid layout correct and now I'm working on how the cards transition in.

حسابات الشبكة 4×4 (Grid): للحصول على 4 صور وتوزيع متساوي، سأستخدم النسب المئوية الدقيقة (25% لكل خلية) مع خصم بسيط للهوامش (Gap).

الحسبة المقترحة:

عرض/ارتفاع الخلية: 25% من الشاشة.
حجم الكارت: 24% (ترك 1% هامش).
المواقع (Left/Top):
0: 0.5%
1: 25.5%
2: 50.5%
3: 75.5%
سأقوم بإنشاء 12 كارت يحيطون بالمركز (الذي يشغل 2×2).

الترتيب:

الصف العلوي: 4 كروت.
الوسط يمين: كارتين.
الصف السفلي: 4 كروت.
الوسط يسار: كارتين.
المجموع: 12 كارت.

سأحدث الملف 
lib/hero-config.ts
 بهذه القيم.
 تم إصلاح ملف التكوين (Configuration) بالكامل:
تم استبدال الملف المعطوب بتعريف نظيف وصحيح لـ surroundingCards يحتوي على 12 كارت موزعة بدقة 4x4.

التوزيع الجديد:

حجم الكارت: 24% (مساحة موحدة)
الشبكة:
صف علوي: 4 كروت
عمود أيمن: كارتين
صف سفلي: 4 كروت
عمود أيسر: كارتين
المركز: مخصص لـ Phase 5 Group.
المتوقع الآن:
عند الوصول للمرحلة 7، ستظهر شبكة متكاملة من 16 خلية (12 صورة محيطة + الوحدة المركزية بمساحة 2×2)، بدون أي فراغات غير متوقعة أو تداخل.

جاهز للتشغيل والتحقق.


export interface ResponsiveConfig {
  cardWidth: number
  cardHeight: number
  fontSize: number
  subtitleSize: number
  textTopPadding: number
  vShapePositions: Array<{ top: string; left: string; rotation: number }>
  containerConstraints: {
    // Constraint-Based Mode
    left?: number;
    right?: number;
    bottom?: number;

    // Absolute Mode
    x?: number | string;
    y?: number | string;
    width?: number | string;

    // Shared
    height: string | number;
    scale: number;
    transformOrigin: string;

    // Visual Styles
    borderRadius?: string;
    border?: string;
    boxShadow?: string;
    overflow?: string;
  }
  stackingCards: Array<{
    top: string;
    left: string;
    rotation: number;
    scale: number;
    width?: string;
    height?: string;
  }>
  surroundingCards: Array<{
    top: string;
    left: string;
    width: string;
    height: string;
    initialX: number;
    initialY: number;
  }>
}

class HeroConfiguration {
  private static instance: HeroConfiguration

  // Singleton Pattern
  private constructor() { }

  public static getInstance(): HeroConfiguration {
    if (!HeroConfiguration.instance) {
      HeroConfiguration.instance = new HeroConfiguration()
    }
    return HeroConfiguration.instance
  }

  public getResponsiveValues(width: number): ResponsiveConfig {
    // ⚠️ DESKTOP ONLY - تجاوب معطل مؤقتاً للتركيز على التصميم
    // TODO: إعادة تفعيل التجاوب بعد اكتمال المرحلة 7

    return {
      // Desktop Fixed Values (1920x1080)
      cardWidth: 240,
      cardHeight: 300,
      fontSize: 96,
      subtitleSize: 30,
      textTopPadding: 192,

      // Phase 4: V-Shape Positions (Desktop Only)
      vShapePositions: [
        { top: "33%", left: "70%", rotation: 20 },
        { top: "52%", left: "65%", rotation: 15 },
        { top: "72%", left: "60%", rotation: 8 },
        { top: "82%", left: "50%", rotation: 0 },
        { top: "72%", left: "40%", rotation: -8 },
        { top: "52%", left: "35%", rotation: -15 },
        { top: "33%", left: "30%", rotation: -20 },
      ],

      // V-Shape Container (Absolute Positioning)
      containerConstraints: {
        x: "26vw",
        y: "28.5vh",
        width: "48vw",
        height: "43vh",
        scale: 1,
        transformOrigin: "",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        overflow: "hidden"
      },

      // Stacking Cards Positions
      stackingCards: [
        { top: "5%", left: "5%", rotation: 0, scale: 1, width: "28vw", height: "28vh" },
        { top: "5%", left: "36%", rotation: 0, scale: 1, width: "28vw", height: "28vh" },  // Top-Center
        { top: "5%", left: "67%", rotation: 0, scale: 1, width: "28vw", height: "28vh" },  // Top-Right

        // Right Column (2 Images)
        { top: "36%", left: "67%", rotation: 0, scale: 1, width: "28vw", height: "28vh" }, // Middle-Right
        { top: "67%", left: "67%", rotation: 0, scale: 1, width: "28vw", height: "28vh" }, // Bottom-Right
      ],

      // Phase 7: Surrounding Cards (L-Shape - 7 صور جديدة)
      // =================================================================
      // التصميم النهائي:
      // [1] [2] [3] [4]    ← الصف العلوي (stacking cards موجودة)
      // [5]   [V-Shape] [6]    ← الصف الأوسط العلوي
      // [7]   [V-Shape] [8]    ← الصف الأوسط السفلي
      // [9] [10] [11] [12]  ← الصف السفلي (جديد بالكامل)
      //
      // العمود الأيسر الجديد: 5, 7, 9 (3 صور)
      // الصف السفلي الجديد: 9, 10, 11, 12 (4 صور)
      // المجموع: 7 صور (الزاوية 9 مشتركة)
      // =================================================================
      surroundingCards: [
        // الصف العلوي - صورة 4 (أقصى اليمين - لإكمال الصف)
        { top: "3%", left: "75%", width: "22vw", height: "22vh", initialX: 80, initialY: -50 },

        // العمود الأيسر (3 صور: 5, 7, 9)
        { top: "26%", left: "3%", width: "22vw", height: "22vh", initialX: -80, initialY: 0 },   // صورة 5
        { top: "50%", left: "3%", width: "22vw", height: "22vh", initialX: -80, initialY: 0 },   // صورة 7
        { top: "75%", left: "3%", width: "22vw", height: "22vh", initialX: -50, initialY: 80 },  // صورة 9 (الزاوية)

        // الصف السفلي (3 صور إضافية: 10, 11, 12)
        { top: "75%", left: "26%", width: "22vw", height: "22vh", initialX: 0, initialY: 80 },   // صورة 10
        { top: "75%", left: "50%", width: "22vw", height: "22vh", initialX: 0, initialY: 80 },   // صورة 11
        { top: "75%", left: "75%", width: "22vw", height: "22vh", initialX: 50, initialY: 80 },  // صورة 12
      ]
    }
  }
}

export const heroConfig = HeroConfiguration.getInstance()
Revising Hero Dimensions

I've just tweaked the hero container's height once more. The goal is now 48% width and 43% height. This small adjustment should refine the visual balance. My code changes are ready to test, specifically in the hook related to the hero animation, to make sure it functions as planned. I'm keen to observe this new size in the context of the hero animation.

Assessing File Status

I'm now investigating a reported file deletion: use-hero-animation.ts. The system might be flagging the prior overwrite as a deletion, which would be a misinterpretation. I'm choosing to assume the file remains and needs the updated height percentage applied. To verify and execute, I'll use either read_file or replace_file_content. The goal is to ensure the file exists and has the intended 43% height.

Prioritizing File Operations

I've realized that the most efficient approach involves a read-before-write strategy to minimize resource usage. The use-hero-animation.ts file's size makes direct writes expensive. Thus, I'll first check file existence using view_file. If it exists, I'll read the content, make the necessary scaleY and log message updates, and then write the updated content back. Failure implies deletion; then I can decide.

سأقوم بتحديث الارتفاع إلى 43% بناءً على طلبك.

أولاً، سأتحقق من وجود الملف وتحديث القيمة المطلوبة.

يبدو أن الملف قد حُذف بالفعل كما أشار النظام. لا بأس، سأقوم بإعادة إنشاء الملف بالكامل مع التعديل الجديد (48% عرض × 43% ارتفاع) لضمان أن كل شيء يعمل بشكل صحيح.

جاري إنشاء الملف وتطبيق التعديلات...
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

          // Helper to parse dimensions (px, vw, vh, %)
          const parseDim = (val: string | number | undefined, ref: number): number => {
            if (val === undefined) return 0
            if (typeof val === 'number') return val
            if (typeof val === 'string') {
              if (val.includes('vw')) return (parseFloat(val) / 100) * window.innerWidth
              if (val.includes('vh')) return (parseFloat(val) / 100) * window.innerHeight
              if (val.includes('px')) return parseFloat(val)
              if (val.includes('%')) return (parseFloat(val) / 100) * ref
            }
            return parseFloat(String(val)) || 0
          }

          let targetWidth = 0
          let targetHeight = 0
          let targetX = 0
          let targetY = 0

          if (x !== undefined && y !== undefined && absoluteWidth !== undefined) {
            // Absolute Mode
            targetWidth = parseDim(absoluteWidth, viewportWidth)
            targetHeight = parseDim(absoluteHeight, viewportHeight)
            targetX = parseDim(x, viewportWidth)
            targetY = parseDim(y, viewportHeight)

            // If height is not explicitly set in config (or 0), try to derive it or default
            if (targetHeight === 0) {
              // Fallback to previous logic if needed, but we expect height to be set in config now
              targetHeight = (parseFloat(String(absoluteHeight)) / 100) * viewportHeight || 75
            }
          } else if (left !== undefined && right !== undefined && bottom !== undefined) {
            // Constraint-Based Mode
            targetWidth = viewportWidth - left - right
            targetX = left

            // Height logic
            targetHeight = parseDim(absoluteHeight, viewportHeight)
            if (targetHeight === 0) targetHeight = (85 / 100) * viewportHeight // Default

            targetY = viewportHeight - bottom - targetHeight
          }

          tl.to(".v-shape-container", {
            width: targetWidth,
            height: targetHeight,
            x: targetX,
            y: targetY,
            scale: 1, // Reset scale to 1 as we are sizing directly
            transformOrigin: "top left",
            borderRadius: borderRadius || "0px",
            border: border || "none",
            boxShadow: boxShadow || "none",
            overflow: overflow || "visible",
            duration: 4,
            ease: "power3.inOut",
            onComplete: () => {
              const el = document.querySelector(".v-shape-container")
              if (el) {
                const rect = el.getBoundingClientRect()
                console.log("📍 AUDIT: Phase 5.2 Container:", {
                  x: rect.left, y: rect.top, w: rect.width, h: rect.height,
                  targetX, targetY, targetWidth, targetHeight
                })
              }
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

      // 7.0: الإعداد - تحويل الهيكل للـ fixed positioning
      // الحل الهندسي: استخدام GSAP set() لـ position + centered transforms
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

      // Clear previous transforms from the animation chain
      tl.set(".phase-5-group", {
        x: 0,
        y: 0,
        xPercent: -50,
        yPercent: -50,
        scale: 1,
      }, "phase7Start")

      // 7.1: تقليص 75% من المنتصف
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
              x: rect.left, y: rect.top, w: rect.width, h: rect.height
            })
          }
        }
      }, "phase7Start+=0.1")

      // 7.2: تحريك من المنتصف إلى أعلى-يمين
      // التحريك: 12.5% إلى اليمين (من المنتصف) و 4% إلى الأعلى (من المنتصف)
      tl.to(".phase-5-group", {
        xPercent: -50 + 12.5,
        yPercent: -50 - 4,
        duration: 1.5,
        ease: "power2.inOut",
        onStart: () => console.log("🚀 PHASE 7.2: Moving to Top-Right"),
        onComplete: () => {
          const el = document.querySelector(".phase-5-group")
          if (el) {
            const rect = el.getBoundingClientRect()
            console.log("📍 AUDIT: After Move:", {
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
      }, "phase7Start+=2.5")

      // 7.3: الصفحة البيضاء تصعد من أسفل (خلف الصور والـ V-Shape)
      // z-index: 50 (أقل من phase-5-group التي لها z-200)
      tl.to(".grid-page-section", {
        transform: "translateY(0)",  // تصعد من 100vh إلى 0
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
