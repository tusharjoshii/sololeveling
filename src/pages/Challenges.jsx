"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"

const challengeCategories = [
  { id: "all", name: "All Challenges" },
  { id: "daily", name: "Daily" },
  { id: "weekly", name: "Weekly" },
  { id: "monthly", name: "Monthly" },
  { id: "special", name: "Special Events" },
]

const challenges = [
  {
    id: "c1",
    title: "7-Day Streak",
    category: "weekly",
    description: "Complete a workout every day for 7 days",
    progress: 3,
    total: 7,
    reward: { xp: 500, item: "Rare Potion" },
    difficulty: "Medium",
    daysLeft: 4,
  },
  {
    id: "c2",
    title: "Strength Master",
    category: "monthly",
    description: "Complete 20 strength workouts this month",
    progress: 8,
    total: 20,
    reward: { xp: 1000, item: "Epic Gear" },
    difficulty: "Hard",
    daysLeft: 18,
  },
  {
    id: "c3",
    title: "Daily Warrior",
    category: "daily",
    description: "Complete today's recommended workout",
    progress: 0,
    total: 1,
    reward: { xp: 100 },
    difficulty: "Easy",
    daysLeft: 1,
  },
  {
    id: "c4",
    title: "Cardio King",
    category: "weekly",
    description: "Run a total of 20km this week",
    progress: 12,
    total: 20,
    reward: { xp: 300, item: "Stamina Boost" },
    difficulty: "Medium",
    daysLeft: 3,
  },
  {
    id: "c5",
    title: "Flexibility Master",
    category: "monthly",
    description: "Complete 15 yoga or stretching sessions",
    progress: 6,
    total: 15,
    reward: { xp: 800, item: "Rare Skill Scroll" },
    difficulty: "Medium",
    daysLeft: 22,
  },
  {
    id: "c6",
    title: "Solo Leveling Event",
    category: "special",
    description: "Defeat the demon king in a special workout routine",
    progress: 0,
    total: 1,
    reward: { xp: 2000, item: "Legendary Weapon" },
    difficulty: "Very Hard",
    daysLeft: 7,
  },
]

const Challenges = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredChallenges, setFilteredChallenges] = useState(challenges)
  const containerRef = useRef(null)

  useEffect(() => {
    // Filter challenges based on category
    const filtered =
      selectedCategory === "all"
        ? challenges
        : challenges.filter((challenge) => challenge.category === selectedCategory)
    setFilteredChallenges(filtered)

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

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Challenges
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400"
          >
            Push your limits and earn rewards by completing these challenges.
          </motion.p>
        </div>

        {/* Category filter */}
        <div className="mb-8">
          <div className="flex overflow-x-auto pb-2 hide-scrollbar">
            {challengeCategories.map((category) => (
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

        {/* Challenges grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-xl overflow-hidden hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{challenge.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{challenge.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-blue-400">{challenge.difficulty}</span>
                  <span className="text-sm font-medium text-amber-400">{challenge.daysLeft} days left</span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>
                      {challenge.progress} / {challenge.total}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Reward</div>
                    <div className="flex items-center">
                      <span className="text-yellow-400 font-medium mr-2">+{challenge.reward.xp} XP</span>
                      {challenge.reward.item && (
                        <span className="text-purple-400 font-medium">{challenge.reward.item}</span>
                      )}
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors duration-300">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Challenges

