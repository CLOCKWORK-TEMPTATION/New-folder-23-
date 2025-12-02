"use client";

import { useState, useEffect, useCallback } from "react";
import { DESIGN_Base } from "@/lib/hero-config";

// Interface for the hook return logic
interface HeroAnimationState {
  scale: number;
  isReady: boolean;
  containerStyles: {
    width: number;
    height: number;
    transform: string;
    transformOrigin: string;
  };
}

export const useHeroAnimation = (): HeroAnimationState => {
  // نبدأ بـ Scale 1 لتجنب مشاكل الـ Hydration
  const [scale, setScale] = useState<number>(1);
  const [isReady, setIsReady] = useState<boolean>(false);

  // دالة حساب الـ Scale بناءً على عرض الشاشة الحالي مقارنة بالتصميم الأصلي
  const calculateScale = useCallback(() => {
    // نتأكد من وجود window (Client-side checks)
    if (typeof window === "undefined") return;

    const currentWidth = window.innerWidth;
    
    // المعادلة الهندسية: العرض الحالي / عرض التصميم الأصلي
    // نضيف حد أدنى (0.4) وحد أقصى (1.2) لمنع التشوه الزائد
    const rawScale = currentWidth / DESIGN_Base.width;
    const clampedScale = Math.min(Math.max(rawScale, 0.4), 1.2);

    setScale(clampedScale);
    setIsReady(true);
  }, []);

  useEffect(() => {
    // الحساب الأولي
    calculateScale();

    // إضافة مستمع لتغيير حجم الشاشة (Debounced for performance could be added here)
    const handleResize = () => {
      window.requestAnimationFrame(calculateScale);
    };

    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateScale]);

  // إرجاع الـ Styles المحسوبة لتطبيقها مباشرة
  return {
    scale,
    isReady,
    containerStyles: {
      width: DESIGN_Base.width,
      height: DESIGN_Base.height,
      transform: `scale(${scale})`,
      transformOrigin: "top left", // نقطة الارتكاز مهمة جداً للحفاظ على التمركز
    },
  };
};
