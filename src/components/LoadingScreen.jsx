"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"

const LoadingScreen = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    // Particle effect
    const container = containerRef.current
    const particles = []
    const particleCount = 30

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "absolute w-1 h-1 rounded-full bg-blue-500 opacity-0"
      container.appendChild(particle)

      const size = Math.random() * 3
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight

      gsap.set(particle, {
        x,
        y,
        width: size,
        height: size,
        backgroundColor: i % 3 === 0 ? "#3b82f6" : i % 3 === 1 ? "#1e40af" : "#60a5fa",
      })

      const tl = gsap.timeline({ repeat: -1, delay: Math.random() * 2 })

      tl.to(particle, {
        opacity: Math.random() * 0.6 + 0.1,
        duration: Math.random() * 1 + 0.5,
      })
        .to(
          particle,
          {
            y: y - Math.random() * 100 - 50,
            x: x + Math.random() * 100 - 50,
            duration: Math.random() * 5 + 5,
            ease: "none",
          },
          "-=1",
        )
        .to(
          particle,
          {
            opacity: 0,
            duration: Math.random() * 1 + 0.5,
          },
          "-=1.5",
        )

      particles.push({ element: particle, timeline: tl })
    }

    return () => {
      particles.forEach((p) => {
        p.timeline.kill()
        if (p.element.parentNode) {
          p.element.parentNode.removeChild(p.element)
        }
      })
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"
        />

        <div className="relative flex flex-col items-center">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="w-20 h-20 rounded-full border-4 border-blue-500 border-t-transparent mb-6"
          />

          <motion.h1
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          >
            ARISE
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4 w-40"
          />
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen

