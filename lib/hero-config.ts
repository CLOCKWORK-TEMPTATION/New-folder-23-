
// lib/hero-config.ts
import { Move, User, Video, Zap, MousePointer2 } from "lucide-react";

// 1. تعريف ثوابت التصميم (Design Source of Truth)
// هذه الأرقام هي التي صممت عليها الـ Layout (مثلاً 1440px)
export const DESIGN_Base = {
  width: 1440,
  height: 900, // أو حسب ارتفاع التصميم الخاص بك
};

export const heroConfig = {
  // هذه القيم تعتمد على الـ Fixed Numbers كما طلبت تماماً
  // لن نغير أي رقم هنا، النظام سيعالجها تلقائياً
  mainTitle: {
    text: "AI-Powered\nCreative Studio",
    x: 100, // Fixed
    y: 150, // Fixed
    fontSize: 72,
  },
  
  // مثال على العناصر (Images/Cards) بأرقام ثابتة
  items: [
    {
      id: "card-1",
      type: "image",
      src: "/images/hero-1.jpg",
      x: 800, // Absolute Position
      y: 100, // Absolute Position
      width: 400,
      height: 300,
      rotation: 6,
      depth: 1,
    },
    {
      id: "card-2",
      type: "video",
      src: "/videos/demo.mp4",
      x: 200,
      y: 450,
      width: 350,
      height: 250,
      rotation: -5,
      depth: 2,
    },
    // ... باقي العناصر كما هي بملفك الأصلي
  ]
};

// Helper Type لضمان الـ Type Safety
export type HeroItem = typeof heroConfig.items[0];
