import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Cairo } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "900"],
  variable: "--font-cairo",
})

export const metadata: Metadata = {
  title: "بس اصلي - اهداء ليسري نصر الله",
  description: "Interactive tribute featuring cinematic scroll animations.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "بس اصلي - اهداء ليسري نصر الله",
    description: "Interactive tribute featuring cinematic scroll animations.",
    type: "website",
    images: ["/placeholder.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "بس اصلي - اهداء ليسري نصر الله",
    description: "Interactive tribute featuring cinematic scroll animations.",
    images: ["/placeholder.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={_cairo.variable}>
      <body className={`font-cairo antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
