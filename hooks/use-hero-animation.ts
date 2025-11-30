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

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=5000",
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
    }, containerRef)

    return () => ctx.revert()
  }, [responsiveValues])

  return { responsiveValues }
}
