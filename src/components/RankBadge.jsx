"use client"

import { motion } from "framer-motion"

const RankBadge = ({ rank, size = "md", className = "", showLabel = false }) => {
  const rankColors = {
    S: { bg: "bg-gradient-to-br from-yellow-400 to-yellow-600", text: "text-yellow-400", border: "border-yellow-500" },
    A: { bg: "bg-gradient-to-br from-purple-400 to-purple-600", text: "text-purple-400", border: "border-purple-500" },
    B: { bg: "bg-gradient-to-br from-blue-400 to-blue-600", text: "text-blue-400", border: "border-blue-500" },
    C: { bg: "bg-gradient-to-br from-green-400 to-green-600", text: "text-green-400", border: "border-green-500" },
    D: { bg: "bg-gradient-to-br from-orange-400 to-orange-600", text: "text-orange-400", border: "border-orange-500" },
    E: { bg: "bg-gradient-to-br from-red-400 to-red-600", text: "text-red-400", border: "border-red-500" },
  }

  const sizeClasses = {
    sm: "w-5 h-5 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-2xl",
  }

  const rankColor = rankColors[rank] || rankColors.E
  const sizeClass = sizeClasses[size] || sizeClasses.md

  return (
    <div className={`flex items-center ${showLabel ? "space-x-2" : ""}`}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`${sizeClass} ${rankColor.bg} rounded-full flex items-center justify-center font-bold text-white shadow-lg ${rankColor.border} border-2 ${className}`}
      >
        {rank}
      </motion.div>

      {showLabel && <span className={`font-medium ${rankColor.text}`}>Rank {rank}</span>}
    </div>
  )
}

export default RankBadge

