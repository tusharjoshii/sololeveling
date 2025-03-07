"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import { useAuth } from "../contexts/AuthContext"
import RankBadge from "../components/RankBadge"
import gsap from "gsap"

const Dashboard = () => {
  const { currentUser } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLevelUpModal, setShowLevelUpModal] = useState(false)
  const [levelUpData, setLevelUpData] = useState(null)

  const statsRef = useRef(null)
  const progressBarRef = useRef(null)
  const containerRef = useRef(null)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            setUserData(userDoc.data())

            // Simulate level up for demonstration (remove in production)
            if (Math.random() > 0.7 && !sessionStorage.getItem("levelUpShown")) {
              setTimeout(() => {
                setLevelUpData({
                  oldLevel: userDoc.data().level,
                  newLevel: userDoc.data().level + 1,
                  oldRank: userDoc.data().rank,
                  newRank: userDoc.data().rank === "E" ? "D" : userDoc.data().rank,
                  rankUp: userDoc.data().rank === "E",
                })
                setShowLevelUpModal(true)
                sessionStorage.setItem("levelUpShown", "true")
              }, 2000)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()

    // Stats animation
    if (statsRef.current) {
      gsap.from(statsRef.current.children, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.5,
      })
    }

    // Progress bar animation
    if (progressBarRef.current) {
      gsap.from(progressBarRef.current, {
        scaleX: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.8,
        transformOrigin: "left",
      })
    }

    return () => {
      // Cleanup animations
      particles.forEach((p) => {
        p.timeline.kill()
      })
      setParticles([])
    }
  }, [currentUser])

  // Separate effect for particle animation
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const newParticles = []
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

      newParticles.push({ element: particle, timeline: tl })
    }

    setParticles(newParticles)

    return () => {
      newParticles.forEach((p) => {
        p.timeline.kill()
        if (p.element.parentNode) {
          p.element.parentNode.removeChild(p.element)
        }
      })
    }
  }, []) // Empty dependency array since we only want to create particles once

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-blue-400">Loading your hunter data...</p>
        </div>
      </div>
    )
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
            Welcome back,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              {userData?.username || currentUser.displayName || "Hunter"}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400"
          >
            Your fitness journey awaits. Continue your quest to become stronger.
          </motion.p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hunter Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mr-4 border-2 border-blue-500/50">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL || "/placeholder.svg"}
                        alt={userData?.username || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-blue-400">
                        {userData?.username ? userData.username.charAt(0).toUpperCase() : "H"}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{userData?.username || "Hunter"}</h2>
                    <div className="flex items-center mt-1">
                      <RankBadge rank={userData?.rank || "E"} showLabel={true} />
                      <span className="ml-4 text-gray-400">Level {userData?.level || 1}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to="/profile"
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors duration-300"
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/workouts"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors duration-300"
                  >
                    Start Workout
                  </Link>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Experience</span>
                  <span className="text-sm text-blue-400">
                    {userData?.experience || 0} / {(userData?.level || 1) * 100}
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    ref={progressBarRef}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{
                      width: `${Math.min(100, ((userData?.experience || 0) / ((userData?.level || 1) * 100)) * 100)}%`,
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>

              <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{userData?.completedWorkouts || 0}</div>
                  <div className="text-sm text-gray-400">Workouts</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{userData?.streak || 0}</div>
                  <div className="text-sm text-gray-400">Day Streak</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-400">Challenges</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-400">Achievements</div>
                </div>
              </div>
            </motion.div>

            {/* Daily Quest Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Daily Quests</h2>
                <span className="text-sm text-gray-400">Resets in 12:34:56</span>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center mr-3">
                        <svg
                          className="w-5 h-5 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Complete a Workout</h3>
                        <p className="text-sm text-gray-400">Gain 50 XP</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors duration-300">
                      Start
                    </button>
                  </div>
                  <div className="h-1.5 bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "0%" }}></div>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center mr-3">
                        <svg
                          className="w-5 h-5 text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Invite a Friend</h3>
                        <p className="text-sm text-gray-400">Gain 30 XP</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors duration-300">
                      Invite
                    </button>
                  </div>
                  <div className="h-1.5 bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: "0%" }}></div>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center mr-3">
                        <svg
                          className="w-5 h-5 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Log Your Nutrition</h3>
                        <p className="text-sm text-gray-400">Gain 20 XP</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition-colors duration-300">
                      Log
                    </button>
                  </div>
                  <div className="h-1.5 bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "0%" }}></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl"
            >
              <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center mr-3 mt-1">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium text-white">Completed Workout</h3>
                      <span className="ml-2 text-xs text-gray-400">2 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">You completed "Upper Body Strength" and gained 45 XP</p>
                  </div>
                </div>

                <div className="border-t border-gray-700 my-4"></div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center mr-3 mt-1">
                    <svg
                      className="w-5 h-5 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium text-white">Streak Milestone</h3>
                      <span className="ml-2 text-xs text-gray-400">1 day ago</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">You reached a 3-day streak! Keep it up!</p>
                  </div>
                </div>

                <div className="border-t border-gray-700 my-4"></div>

                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center mr-3 mt-1">
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium text-white">Quest Completed</h3>
                      <span className="ml-2 text-xs text-gray-400">2 days ago</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      You completed the "First Steps" quest and earned 100 XP
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            {/* Next Workout Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl"
            >
              <h2 className="text-xl font-bold text-white mb-6">Next Workout</h2>

              <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white">Lower Body Power</h3>
                  <span className="text-xs font-medium px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                    30 min
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Focus on building leg strength and power with this intense workout.
                </p>
                <div className="flex space-x-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors duration-300">
                    Start
                  </button>
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors duration-300">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <Link
                to="/workouts"
                className="block text-center text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                View all workouts
              </Link>
            </motion.div>

            {/* Challenges Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl"
            >
              <h2 className="text-xl font-bold text-white mb-6">Active Challenges</h2>

              <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">7-Day Consistency</h3>
                  <span className="text-xs font-medium px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                    3/7 days
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3">Complete a workout every day for 7 days.</p>
                <div className="h-1.5 bg-gray-600 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "42%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0 days</span>
                  <span>7 days</span>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">Strength Master</h3>
                  <span className="text-xs font-medium px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                    1/5 workouts
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3">Complete 5 strength workouts this week.</p>
                <div className="h-1.5 bg-gray-600 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "20%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0 workouts</span>
                  <span>5 workouts</span>
                </div>
              </div>

              <Link
                to="/challenges"
                className="block text-center text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300 mt-4"
              >
                View all challenges
              </Link>
            </motion.div>

            {/* Leaderboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl"
            >
              <h2 className="text-xl font-bold text-white mb-6">Leaderboard</h2>

              <div className="space-y-3">
                <div className="flex items-center p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3 text-sm font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium text-white">ShadowMonarch</span>
                      <RankBadge rank="B" size="sm" className="ml-2" />
                    </div>
                    <div className="text-xs text-gray-400">Level 24 • 12,450 XP</div>
                  </div>
                </div>

                <div className="flex items-center p-2 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3 text-sm font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium text-white">IronHeart</span>
                      <RankBadge rank="C" size="sm" className="ml-2" />
                    </div>
                    <div className="text-xs text-gray-400">Level 18 • 9,230 XP</div>
                  </div>
                </div>

                <div className="flex items-center p-2 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3 text-sm font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium text-white">PhoenixRise</span>
                      <RankBadge rank="C" size="sm" className="ml-2" />
                    </div>
                    <div className="text-xs text-gray-400">Level 17 • 8,750 XP</div>
                  </div>
                </div>

                <div className="flex items-center p-2 rounded-lg bg-gray-700/50">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3 text-sm font-bold">
                    42
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium text-white">{userData?.username || "You"}</span>
                      <RankBadge rank={userData?.rank || "E"} size="sm" className="ml-2" />
                    </div>
                    <div className="text-xs text-gray-400">
                      Level {userData?.level || 1} • {userData?.experience || 0} XP
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/leaderboard"
                className="block text-center text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300 mt-4"
              >
                View full leaderboard
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Level Up Modal */}
      <AnimatePresence>
        {showLevelUpModal && levelUpData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setShowLevelUpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative bg-gray-800/90 backdrop-blur-xl rounded-xl border border-blue-500/30 shadow-2xl max-w-md w-full p-6 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Particle effects */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-blue-500"
                    initial={{
                      x: "50%",
                      y: "50%",
                      opacity: 0,
                    }}
                    animate={{
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              <div className="text-center mb-6 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-blue-600/30 flex items-center justify-center mx-auto mb-4"
                >
                  <svg
                    className="w-10 h-10 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
                >
                  LEVEL UP!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="text-gray-300 mt-2"
                >
                  You've grown stronger, hunter!
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="bg-gray-700/50 rounded-xl p-4 mb-6 relative z-10"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-sm text-gray-400">Previous Level</div>
                    <div className="text-2xl font-bold text-white">{levelUpData.oldLevel}</div>
                  </div>
                  <div className="text-2xl text-blue-400">→</div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">New Level</div>
                    <div className="text-2xl font-bold text-blue-400">{levelUpData.newLevel}</div>
                  </div>
                </div>

                {levelUpData.rankUp && (
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-400">Previous Rank</div>
                      <div className="flex items-center">
                        <RankBadge rank={levelUpData.oldRank} />
                        <span className="ml-2 text-white font-bold">Rank {levelUpData.oldRank}</span>
                      </div>
                    </div>
                    <div className="text-2xl text-purple-400">→</div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">New Rank</div>
                      <div className="flex items-center justify-end">
                        <span className="mr-2 text-purple-400 font-bold">Rank {levelUpData.newRank}</span>
                        <RankBadge rank={levelUpData.newRank} />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1 }}
                className="text-center relative z-10"
              >
                <button
                  onClick={() => setShowLevelUpModal(false)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-medium shadow-lg shadow-blue-600/30 transition-all duration-300"
                >
                  Continue
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Dashboard

