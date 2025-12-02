
export interface ResponsiveConfig {
  cardWidth: number
  cardHeight: number
  fontSize: number
  subtitleSize: number
  vShapePositions: Array<{ top: string; left: string; rotation: number }>
  containerConstraints: {
    // Constraint-Based Mode
    left?: number;
    right?: number;
    bottom?: number;

    // Absolute Mode
    x?: number;
    y?: number;
    width?: number;

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
    const isMobile = width < 768
    const isTablet = width < 1024

    return {
      cardWidth: isMobile ? 160 : isTablet ? 200 : 240,
      cardHeight: isMobile ? 200 : isTablet ? 250 : 300,
      fontSize: isMobile ? 48 : isTablet ? 72 : 96,
      subtitleSize: isMobile ? 18 : isTablet ? 24 : 30,

      // Phase 4: V-Shape Positions
      vShapePositions: [
        { top: "33%", left: isMobile ? "65%" : isTablet ? "70%" : "70%", rotation: 20 },
        { top: "52%", left: isMobile ? "25%" : isTablet ? "75%" : "65%", rotation: 15 },
        { top: "72%", left: isMobile ? "35%" : isTablet ? "60%" : "60%", rotation: 8 },
        { top: "82%", left: "50%", rotation: 0 },
        { top: "72%", left: isMobile ? "65%" : isTablet ? "40%" : "40%", rotation: -8 },
        { top: "52%", left: isMobile ? "75%" : isTablet ? "40%" : "35%", rotation: -15 },
        { top: "33%", left: isMobile ? "35%" : isTablet ? "30%" : "30%", rotation: -20 },
      ],

      // V-Shape Container (Absolute Positioning)
      containerConstraints: {
        x: 93,
        y: 335,
        width: 1135,
        height: 58,
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
      ]
    }
  }
}

export const heroConfig = HeroConfiguration.getInstance()
