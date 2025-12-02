# Development Guidelines

## Code Quality Standards

### File Structure and Organization
- **"use client" Directive**: All interactive components requiring hooks, state, or browser APIs must declare "use client" at the top of the file (5/5 files)
- **Import Order**: Group imports logically - React/Next.js first, then third-party libraries, then local imports with @ alias (5/5 files)
- **Single Responsibility**: Each file focuses on one primary concern (components, hooks, utilities, configuration)

### Naming Conventions
- **Components**: PascalCase with descriptive names (HeroAnimation, VideoTextMask, StackingImageCard)
- **Hooks**: Prefix with "use" in camelCase (useHeroAnimation)
- **Files**: kebab-case for component files matching component name (hero-animation.tsx, video-text-mask.tsx)
- **CSS Classes**: kebab-case with semantic naming (video-mask-wrapper, text-content-wrapper, phase-3-img)
- **Configuration Objects**: camelCase for properties (responsiveValues, containerRef, triggerRef)

### TypeScript Standards
- **Strict Mode Enabled**: All code follows strict TypeScript rules
- **Explicit Interfaces**: Define interfaces for all props and return types
  ```typescript
  interface VideoTextMaskProps {
    videoSrc: string
    text: string
    className?: string
  }
  ```
- **Type Safety**: Use proper types for refs (RefObject<HTMLDivElement | null>), avoid any except in error handling
- **Optional Parameters**: Mark optional props with ? (className?: string)

### Code Formatting
- **Indentation**: 2 spaces consistently across all files
- **Line Length**: Keep lines readable, break long chains into multiple lines
- **Semicolons**: Inconsistent usage - some files use them, others don't (standardize based on project preference)
- **Quotes**: Double quotes for strings, template literals for dynamic content
- **Trailing Commas**: Used in multi-line arrays and objects

## Semantic Patterns Overview

### React Patterns

#### 1. Custom Hooks for Complex Logic (5/5 files demonstrate)
Separate business logic from presentation by extracting stateful logic into custom hooks:

```typescript
// Hook handles all animation logic
export const useHeroAnimation = (
  containerRef: RefObject<HTMLDivElement | null>,
  triggerRef: RefObject<HTMLDivElement | null>
): UseHeroAnimationReturn => {
  const [responsiveValues, setResponsiveValues] = useState<ResponsiveConfig | null>(null)
  
  useEffect(() => {
    // Responsive logic
  }, [])
  
  useLayoutEffect(() => {
    // GSAP animation logic
  }, [responsiveValues])
  
  return { responsiveValues }
}

// Component only handles rendering
export const HeroAnimation = () => {
  const { responsiveValues } = useHeroAnimation(containerRef, triggerRef)
  return <div>...</div>
}
```

#### 2. Ref Management Pattern (4/5 files)
Use useRef for DOM manipulation and animation targets:

```typescript
const containerRef = useRef<HTMLDivElement>(null)
const triggerRef = useRef<HTMLDivElement>(null)

// Pass refs to hooks for animation control
const { responsiveValues } = useHeroAnimation(containerRef, triggerRef)

// Attach refs to DOM elements
<div ref={containerRef}>
  <div ref={triggerRef}>
```

#### 3. forwardRef for Reusable Components (1/5 files)
Use forwardRef when parent components need direct DOM access:

```typescript
export const VideoTextMask = forwardRef<HTMLDivElement, VideoTextMaskProps>(
  ({ videoSrc, text, className = "" }, ref) => {
    return <div ref={ref}>...</div>
  }
)

VideoTextMask.displayName = "VideoTextMask"
```

#### 4. Early Return Pattern for Loading States (2/5 files)
Prevent layout shifts and errors with early returns:

```typescript
if (!responsiveValues) return <div className="min-h-screen bg-black" />
if (!containerRef.current || !triggerRef.current) return
```

### GSAP Animation Patterns

#### 1. Context-Based Animation Cleanup (1/1 animation files)
Always use gsap.context for proper cleanup:

```typescript
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ scrollTrigger: {...} })
    // Animation code
  }, containerRef)
  
  return () => ctx.revert() // Cleanup on unmount
}, [responsiveValues])
```

#### 2. ScrollTrigger Configuration (1/1 animation files)
Standard ScrollTrigger setup pattern:

```typescript
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
```

#### 3. Timeline Sequencing with Labels (1/1 animation files)
Use relative positioning for coordinated animations:

```typescript
tl.to(".element1", { opacity: 1, duration: 0.8 }, "-=2")  // Start 2s before previous ends
  .to(".element2", { y: 0, duration: 2 }, "<")           // Start with previous
  .to(".element3", { scale: 1, duration: 1 }, "+=0.5")   // Start 0.5s after previous ends
```

#### 4. Dynamic Animation Values (1/1 animation files)
Use functions for per-element calculations:

```typescript
tl.to(".phase-3-img", {
  top: (i) => i < 7 ? responsiveValues.vShapePositions[i]?.top : "100vh",
  left: (i) => i < 7 ? responsiveValues.vShapePositions[i]?.left : "50%",
  rotation: (i) => i < 7 ? responsiveValues.vShapePositions[i]?.rotation : 0,
  duration: 1.5,
})
```

### Configuration-Driven Development (2/5 files)

#### Centralized Configuration Pattern
Extract magic numbers and responsive values into configuration files:

```typescript
// lib/hero-config.ts
export const heroConfig = {
  getResponsiveValues: (width: number): ResponsiveConfig => {
    if (width < 768) return mobileConfig
    if (width < 1024) return tabletConfig
    return desktopConfig
  }
}

// Usage in hook
const values = heroConfig.getResponsiveValues(window.innerWidth)
```

### Next.js Specific Patterns

#### 1. Image Optimization (2/5 files)
Always use Next.js Image component with proper configuration:

```typescript
<Image
  src={images[i] || "/placeholder.svg"}
  alt={`Scene ${i}`}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
  priority={true}
/>
```

#### 2. Metadata Configuration (1/5 files)
Export metadata object for SEO and social sharing:

```typescript
export const metadata: Metadata = {
  title: "بس اصلي - اهداء ليسري نصر الله",
  description: "Interactive tribute featuring cinematic scroll animations.",
  generator: "v0.app",
  icons: { icon: [...], apple: "/apple-icon.png" },
  openGraph: {...},
  twitter: {...},
}
```

#### 3. Font Loading (1/5 files)
Load Google Fonts with proper configuration:

```typescript
const _cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "900"],
  variable: "--font-cairo",
})

// Apply in HTML
<html className={_cairo.variable}>
  <body className="font-cairo">
```

### Styling Patterns

#### 1. Tailwind Utility Classes (5/5 files)
Primary styling method using Tailwind utilities:

```typescript
className="absolute inset-0 z-50 bg-white"
className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black"
className="flex flex-col items-center justify-center"
```

#### 2. Responsive Design (5/5 files)
Mobile-first approach with breakpoint prefixes:

```typescript
className="text-lg sm:text-xl md:text-2xl lg:text-3xl"
className="pt-32 md:pt-48"
```

#### 3. Inline Styles for Dynamic Values (3/5 files)
Use inline styles only for computed or animation-driven values:

```typescript
style={{
  width: `${responsiveValues.cardWidth}px`,
  height: `${responsiveValues.cardHeight}px`,
  zIndex: 30 - Math.abs(i - 3),
}}
```

#### 4. CSS Custom Properties (1/5 files)
Use CSS variables for theme-dependent values:

```typescript
style={{
  fontSize: "clamp(8rem, 28vw, 40rem)",
  mixBlendMode: "screen",
}}
```

### Internationalization Patterns (2/5 files)

#### RTL Support
Set direction at root level for Arabic content:

```typescript
<html lang="ar" dir="rtl">
<div dir="rtl">
```

#### Arabic Typography
Use appropriate fonts and spacing for Arabic text:

```typescript
fontFamily: "'Cairo', 'Noto Kufi Arabic', 'system-ui', sans-serif"
letterSpacing: "-0.08em"
```

### Error Handling and Robustness

#### 1. Graceful Degradation (3/5 files)
Provide fallbacks for missing data:

```typescript
src={images[i] || "/placeholder.svg"}
return responsiveValues.vShapePositions[i]?.top || "50%"
```

#### 2. Null Checks (2/5 files)
Validate refs and state before operations:

```typescript
if (!responsiveValues || !containerRef.current || !triggerRef.current) return
```

#### 3. Error Logging (1/5 files - utility file)
Log errors for debugging without breaking execution:

```typescript
try {
  await execAsync(command)
  return true
} catch (error: any) {
  Logger.log('WARN', `Command failed: ${command}`)
  return false
}
```

### Performance Optimization

#### 1. useLayoutEffect for Animations (1/5 files)
Use useLayoutEffect for DOM measurements and animations to prevent flicker:

```typescript
useLayoutEffect(() => {
  // GSAP animations that need to run before paint
}, [responsiveValues])
```

#### 2. Dependency Arrays (2/5 files)
Minimize re-renders with proper dependency management:

```typescript
useEffect(() => {
  handleResize()
  window.addEventListener("resize", handleResize)
  return () => window.removeEventListener("resize", handleResize)
}, []) // Empty array - run once
```

#### 3. Image Priority Loading (2/5 files)
Mark critical images for priority loading:

```typescript
<Image priority={true} />
```

### Documentation Patterns

#### 1. Inline Comments for Complex Logic (2/5 files)
Document non-obvious decisions and phases:

```typescript
// Phase 1: Reveal Video
// Phase 2: Show Fixed Header
// Phase 3: Card Animation Setup
// ENGINEERING FIX: Pure Scale-Based Animation
// WHY: To preserve the internal composition
```

#### 2. Arabic Comments (2/5 files)
Use Arabic comments for Arabic-language projects:

```typescript
// 1. Logic: التعامل مع تغيير حجم الشاشة
// 2. Logic: التعامل مع التحريك (GSAP)
// Robustness: السماح بدومينات الصور المستخدمة
```

#### 3. Debug Logging (1/5 files)
Include console logging for complex calculations:

```typescript
console.group("🔍 AUDIT: V-Shape Container - Final State")
console.log("📍 Coordinates:", corners)
console.log("📏 Dimensions:", { width, height, scale })
console.groupEnd()
```

## Common Code Idioms

### Array Generation and Mapping
```typescript
[...Array(7)].map((_, i) => <Component key={`p3-${i}`} />)
[0, 1, 2, 3, 4].map((index) => <Component key={`stack-${index}`} />)
```

### Conditional Rendering
```typescript
{responsiveValues && <Component />}
{!loading ? <Content /> : <Loader />}
```

### Class Name Composition
```typescript
className={`relative ${className}`}
className="text-main text-4xl sm:text-5xl"
```

### Async/Await Pattern
```typescript
const execAsync = promisify(exec)
await execAsync(command)
```

## Project-Specific Conventions

### Animation Phases
Structure complex animations into numbered phases with clear comments:
- Phase 1: Initial reveal
- Phase 2: Header appearance
- Phase 3: Card entrance
- Phase 4: Formation transition
- Phase 5: Final stacking

### Layer Management
Use z-index systematically with semantic class names:
- z-[100]: Fixed header (top layer)
- z-50: Video mask
- z-40: V-shape container
- z-30: Dedication layer
- z-20: Stacking cards

### Responsive Configuration
Define breakpoints and values in centralized configuration:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Component Naming for Animation Targets
Use descriptive class names that indicate animation phase:
- `.video-mask-wrapper`
- `.text-content-wrapper`
- `.phase-3-img`
- `.stacking-card-${index}`
