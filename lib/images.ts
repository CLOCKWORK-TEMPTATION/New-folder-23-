interface SceneImage {
  url: string
  label: string
  alt: string
}

const sceneImages: SceneImage[] = [
  {
    url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    label: "actorai-arabic",
    alt: "مشهد سينمائي - ممثل",
  },
  {
    url: "https://images.unsplash.com/photo-1518866586318-bbe74635b749?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxhYnN0cmFjdCUyMGxheWVyc3xlbnwwfHx8fDE3NjExMDUxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    label: "analysis",
    alt: "تحليل البيانات",
  },
  {
    url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    label: "arabic-creative-writing",
    alt: "استوديو كتابة إبداعية",
  },
  {
    url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    label: "prompt-engineering",
    alt: "استوديو تصميم الأوامر",
  },
  {
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    label: "brainstorm",
    alt: "جلسة عصف ذهني",
  },
  {
    url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    label: "breakdown",
    alt: "تحليل المشهد",
  },
  {
    url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    label: "cinematography",
    alt: "استوديو التصوير السينمائي",
  },
  {
    url: "https://images.unsplash.com/photo-1547057740-4b18aac8eed2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxtYWduaWZ5aW5nJTIwZ2xhc3N8ZW58MHx8fHwxNzYxMDg4ODI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    label: "development",
    alt: "مرحلة التطوير",
  },
  {
    url: "https://images.unsplash.com/photo-1574267432644-f610a0f8e6b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    label: "directors-studio",
    alt: "استوديو المخرج",
  },
  {
    url: "/images/1e5becf441ad8ea50f63e8.webp",
    label: "editor",
    alt: "برنامج المونتاج",
  },
  {
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    label: "metrics-dashboard",
    alt: "لوحة التحليلات",
  },
]

export const getSceneImage = (index: number): SceneImage | undefined => {
  return sceneImages[index]
}

export const getAllSceneImages = (): SceneImage[] => {
  return sceneImages
}

export const getImageUrl = (index: number): string => {
  return sceneImages[index]?.url || ""
}

export default sceneImages
