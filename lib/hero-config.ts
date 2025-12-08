
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
        // الصف العلوي (Cards 0-3)
        { top: "0.5%", left: "0.5%", width: "24%", height: "24%", initialX: -50, initialY: -100 },
        { top: "0.5%", left: "25.5%", width: "24%", height: "24%", initialX: -20, initialY: -100 },
        { top: "0.5%", left: "50.5%", width: "24%", height: "24%", initialX: 20, initialY: -100 },
        { top: "0.5%", left: "75.5%", width: "24%", height: "24%", initialX: 50, initialY: -100 },

        // الوسط يسار (Cards 4-5) - المركز محجوز
        { top: "25.5%", left: "0.5%", width: "24%", height: "24%", initialX: -100, initialY: -20 },
        { top: "50.5%", left: "0.5%", width: "24%", height: "24%", initialX: -100, initialY: 20 },

        // الوسط يمين (Cards 6-7) - المركز محجوز
        { top: "25.5%", left: "75.5%", width: "24%", height: "24%", initialX: 100, initialY: -20 },
        { top: "50.5%", left: "75.5%", width: "24%", height: "24%", initialX: 100, initialY: 20 },

        // الصف السفلي (Cards 8-11)
        { top: "75.5%", left: "0.5%", width: "24%", height: "24%", initialX: -50, initialY: 100 },
        { top: "75.5%", left: "25.5%", width: "24%", height: "24%", initialX: -20, initialY: 100 },
        { top: "75.5%", left: "50.5%", width: "24%", height: "24%", initialX: 20, initialY: 100 },
        { top: "75.5%", left: "75.5%", width: "24%", height: "24%", initialX: 50, initialY: 100 },
      ]
    }
  }
}

export const heroConfig = HeroConfiguration.getInstance()
