// components/hero-animation.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { useHeroAnimation } from "@/hooks/use-hero-animation";
import { heroConfig, HeroItem } from "@/lib/hero-config";
import { cn } from "@/lib/utils";

// مكون فرعي لتقليل التعقيد (Best Practice: Component Splitting)
const HeroItemRenderer = ({ item }: { item: HeroItem }) => {
  return (
    <motion.div
      className="absolute bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-2xl"
      style={{
        width: item.width,
        height: item.height,
        left: item.x, // استخدام الرقم الثابت مباشرة
        top: item.y,  // استخدام الرقم الثابت مباشرة
        zIndex: item.depth * 10,
      }}
      initial={{ opacity: 0, y: 50, rotate: 0 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotate: item.rotation,
        transition: { 
          delay: 0.2, 
          duration: 0.8,
          type: "spring",
          stiffness: 100 
        }
      }}
      whileHover={{ scale: 1.05, zIndex: 50 }}
    >
      {/* Logic to render Image or Video based on type */}
      {item.type === "image" ? (
         // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={item.src} 
          alt="Hero visual" 
          className="w-full h-full object-cover" 
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-black/20">
           <span className="text-white font-mono text-sm">VIDEO PLAYHOLDER</span>
        </div>
      )}
    </motion.div>
  );
};

export const HeroAnimation = () => {
  const { isReady, containerStyles } = useHeroAnimation();

  // Guard Clause: عدم إظهار أي شيء حتى يتم حساب القياس لتجنب الـ Layout Shift
  if (!isReady) return <div className="h-screen w-full bg-background/95" />;

  return (
    <section className="relative w-full overflow-hidden bg-background flex flex-col items-center">
      
      {/* Container Wrapper: 
        هذا هو "المسرح" الذي يتمدد وينكمش بناءً على الشاشة.
        نستخدم height ديناميكي للحاوية الخارجية لضمان عدم وجود مساحات فارغة ضخمة أسفل الـ Scale 
      */}
      <div 
        className="relative origin-top-left"
        style={{
          width: "100%", 
          height: `calc(${containerStyles.height}px * ${containerStyles.transform.match(/scale\((.*?)\)/)?.[1] || 1})`
        }}
      >
        <div style={containerStyles} className="absolute top-0 left-0 bg-grid-white/[0.02]">
          
          {/* Main Title Render */}
          <motion.h1 
            className="absolute font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60"
            style={{
              left: heroConfig.mainTitle.x,
              top: heroConfig.mainTitle.y,
              fontSize: heroConfig.mainTitle.fontSize,
              lineHeight: 1.1,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {heroConfig.mainTitle.text}
          </motion.h1>

          {/* Render All Items Loop */}
          {heroConfig.items.map((item) => (
            <HeroItemRenderer key={item.id} item={item} />
          ))}

        </div>
      </div>
    </section>
  );
};
