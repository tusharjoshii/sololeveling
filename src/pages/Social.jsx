"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import RankBadge from "../components/RankBadge"

const mockFriends = [
  { id: 1, username: "DragonSlayer", level: 35, rank: "B", status: "online" },
  { id: 2, username: "ShadowNinja", level: 42, rank: "A", status: "offline" },
  { id: 3, username: "MoonWalker", level: 28, rank: "C", status: "in-game" },
  { id: 4, username: "StarGazer", level: 39, rank: "B", status: "online" },
  { id: 5, username: "ThunderBolt", level: 45, rank: "A", status: "in-game" },
]

const mockGuilds = [
  { id: 1, name: "Shadow Hunters", members: 25, rank: 3 },
  { id: 2, name: "Dragon's Claw", members: 18, rank: 7 },
  { id: 3, name: "Mystic Order", members: 30, rank: 1 },
]

const Social = () => {
  const [friends, setFriends] = useState(mockFriends)
  const [guilds, setGuilds] = useState(mockGuilds)
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
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gray-900 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/images/solo-leveling-bg.jpg')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/90 to-gray-900"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Social Hub
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400"
          >
            Connect with fellow hunters and join powerful guilds.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Friends List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-xl overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Friends</h2>
              <div className="space-y-4">
                {friends.map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-between bg-gray-700/50 rounded-lg p-4"
                  >
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full mr-4"
                        src={`https://api.dicebear.com/6.x/avatars/svg?seed=${friend.username}`}
                        alt={friend.username}
                      />
                      <div>
                        <div className="text-white font-medium">{friend.username}</div>
                        <div className="text-sm text-gray-400">Level {friend.level}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <RankBadge rank={friend.rank} size="sm" className="mr-2" />
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          friend.status === "online"
                            ? "bg-green-500/20 text-green-400"
                            : friend.status === "offline"
                              ? "bg-gray-500/20 text-gray-400"
                              : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {friend.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Guilds */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-xl overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Guilds</h2>
              <div className="space-y-4">
                {guilds.map((guild, index) => (
                  <motion.div
                    key={guild.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gray-700/50 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium text-white">{guild.name}</h3>
                      <span className="text-sm text-gray-400">Rank #{guild.rank}</span>
                    </div>
                    <div className="text-sm text-gray-400">{guild.members} members</div>
                    <button className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors duration-300">
                      View Guild
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Social

