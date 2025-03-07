"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"

const ExperienceBar = ({ currentExp = 0, maxExp = 100, level = 1, rank = "E", animate = false, className = "" }) => {
  const [displayExp, setDisplayExp] = useState(currentExp)
  const progressBarRef = useRef(null)
  const percentComplete = Math.min(100, (displayExp / maxExp) * 100)

  useEffect(() => {
    if (animate && progressBarRef.current) {
      // Animate the experience counter
      gsap.fromTo(
        { value: 0 },
        {
          value: currentExp,
          duration: 2,
          ease: "power2.out",
          onUpdate: function () {
            setDisplayExp(Math.round(this.targets()[0].value))
          },
        },
      )

      // Animate the progress bar
      gsap.fromTo(
        progressBarRef.current,
        { scaleX: 0 },
        { scaleX: percentComplete / 100, duration: 2, ease: "power2.out" },
      )
    } else {
      setDisplayExp(currentExp)
    }
  }, [currentExp, maxExp, animate, percentComplete])

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-400">Level {level}</span>
          <span className="mx-2 text-gray-600">•</span>
          <span className="text-sm font-medium text-gray-400">Rank {rank}</span>
        </div>
        <span className="text-sm font-medium text-blue-400">
          {displayExp} / {maxExp} XP
        </span>
      </div>

      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full origin-left"
          style={{
            width: "100%",
            transform: `scaleX(${animate ? 0 : percentComplete / 100})`,
          }}
        />
      </div>
    </div>
  )
}

export default ExperienceBar

