"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import RankBadge from "../components/RankBadge"

const leaderboardCategories = [
  { id: "overall", name: "Overall" },
  { id: "weekly", name: "This Week" },
  { id: "monthly", name: "This Month" },
  { id: "friends", name: "Friends" },
]

const mockLeaderboardData = [
  { id: 1, username: "ShadowMonarch", level: 50, xp: 254600, rank: "S" },
  { id: 2, username: "IronHeart", level: 48, xp: 241200, rank: "S" },
  { id: 3, username: "PhoenixRise", level: 47, xp: 238900, rank: "A" },
  { id: 4, username: "DragonSlayer", level: 46, xp: 234500, rank: "A" },
  { id: 5, username: "NightWatcher", level: 45, xp: 229800, rank: "A" },
  { id: 6, username: "StormBringer", level: 44, xp: 225100, rank: "B" },
  { id: 7, username: "SilentAssassin", level: 43, xp: 220400, rank: "B" },
  { id: 8, username: "FrostMage", level: 42, xp: 215700, rank: "B" },
  { id: 9, username: "BladeRunner", level: 41, xp: 211000, rank: "C" },
  { id: 10, username: "SunWarrior", level: 40, xp: 206300, rank: "C" },
]

const Leaderboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("overall")
  const [leaderboardData, setLeaderboardData] = useState(mockLeaderboardData)
  const containerRef = useRef(null)

  useEffect(() => {
    // In a real app, you would fetch the leaderboard data based on the selected category
    // For now, we'll just use the mock data

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
        backgroundColor:
          i % 5 === 0
            ? "#3b82f6"
            : i % 5 === 1
              ? "#1e40af"
              : i % 5 === 2
                ? "#60a5fa"
                : i % 5 === 3
                  ? "#7c3aed"
                  : "#4f46e5",
      })

      const tl = gsap.timeline({ repeat: -1, delay: Math.random() * 5 })

      tl.to(particle, {
        opacity: Math.random() * 0.6 + 0.1,
        duration: Math.random() * 2 + 1,
      })
        .to(
          particle,
          {
            y: y - Math.random() * 100 - 50,
            x: x + Math.random() * 100 - 50,
            duration: Math.random() * 10 + 10,
            ease: "none",
          },
          "-=2",
        )
        .to(
          particle,
          {
            opacity: 0,
            duration: Math.random() * 2 + 1,
          },
          "-=3",
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
  }, [selectedCategory])

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gray-900 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/images/solo-leveling-bg.jpg')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/90 to-gray-900"></div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Leaderboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400"
          >
            See how you stack up against other hunters.
          </motion.p>
        </div>

        {/* Category filter */}
        <div className="mb-8">
          <div className="flex overflow-x-auto pb-2 hide-scrollbar">
            {leaderboardCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap mr-2 transition-colors duration-300 ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Hunter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">XP</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((player, index) => (
                <motion.tr
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={index % 2 === 0 ? "bg-gray-800/30" : "bg-gray-800/10"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-gray-300 mr-2">{index + 1}</span>
                      <RankBadge rank={player.rank} size="sm" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={`https://api.dicebear.com/6.x/avatars/svg?seed=${player.username}`}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{player.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">Level {player.level}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{player.xp.toLocaleString()} XP</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard

