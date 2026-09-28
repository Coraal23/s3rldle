"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"

export default function Confetti() {
  useEffect(() => {
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { x: 0.5, y: 0.6 },
      colors: ["#ffffff", "#a855f7", "#ec4899"],
      scalar: 0.8,
      gravity: 1.2,
      drift: 0,
      ticks: 80,
    })
  }, [])

  return null
}