"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import RankBadge from "./RankBadge"

const LevelUpNotification = ({
  show = false,
  oldLevel = 1,
  newLevel = 2,
  oldRank = "E",
  newRank = "E",
  rankUp = false,
  onClose = () => {},
}) => {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    setIsVisible(show)

    if (show) {
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", damping: 15 }}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full"
        >
          <div className="bg-gray-800/90 backdrop-blur-lg rounded-xl border border-blue-500/30 shadow-2xl p-4 mx-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-600/20 rounded-full p-2 mr-3">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">Level Up!</h3>
                <div className="flex justify-between items-center mt-1">
                  <div>
                    <div className="text-sm text-gray-400">Level</div>
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-white">{oldLevel}</span>
                      <svg
                        className="w-4 h-4 mx-1 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                      <span className="text-lg font-bold text-blue-400">{newLevel}</span>
                    </div>
                  </div>

                  {rankUp && (
                    <div>
                      <div className="text-sm text-gray-400">Rank</div>
                      <div className="flex items-center">
                        <RankBadge rank={oldRank} size="sm" />
                        <svg
                          className="w-4 h-4 mx-1 text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                        <RankBadge rank={newRank} size="sm" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setIsVisible(false)
                  onClose()
                }}
                className="flex-shrink-0 ml-2 text-gray-400 hover:text-white"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LevelUpNotification

