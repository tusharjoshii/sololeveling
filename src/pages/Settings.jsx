"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import { useAuth } from "../contexts/AuthContext"
import gsap from "gsap"

const Settings = () => {
  const { currentUser } = useAuth()
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    workoutReminders: true,
    friendActivity: true,
  })
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    activitySharing: true,
  })
  const [theme, setTheme] = useState("dark")
  const containerRef = useRef(null)

  useEffect(() => {
    // In a real app, you would fetch the user's settings from Firestore here
    // For now, we'll use the default values set in the state

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

  const handleNotificationChange = (setting) => {
    setNotifications((prev) => ({ ...prev, [setting]: !prev[setting] }))
  }

  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings((prev) => ({ ...prev, [setting]: value }))
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    // In a real app, you would apply the theme change here
  }

  const handleSave = async () => {
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid)
      await updateDoc(userDocRef, {
        settings: {
          notifications,
          privacySettings,
          theme,
        },
      })
      // Show a success message to the user
      alert("Settings saved successfully!")
    }
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gray-900 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/images/solo-leveling-bg.jpg')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/90 to-gray-900"></div>

      <div className="relative max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-xl overflow-hidden"
        >
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>

            {/* Notifications */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Notifications</h2>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={value}
                          onChange={() => handleNotificationChange(key)}
                        />
                        <div className={`block w-14 h-8 rounded-full ${value ? "bg-blue-600" : "bg-gray-600"}`}></div>
                        <div
                          className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${value ? "transform translate-x-6" : ""}`}
                        ></div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </section>

            {/* Privacy */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Privacy</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Profile Visibility</label>
                  <select
                    value={privacySettings.profileVisibility}
                    onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Activity Sharing</span>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={privacySettings.activitySharing}
                        onChange={() => handlePrivacyChange("activitySharing", !privacySettings.activitySharing)}
                      />
                      <div
                        className={`block w-14 h-8 rounded-full ${privacySettings.activitySharing ? "bg-blue-600" : "bg-gray-600"}`}
                      ></div>
                      <div
                        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${privacySettings.activitySharing ? "transform translate-x-6" : ""}`}
                      ></div>
                    </div>
                  </label>
                </div>
              </div>
            </section>

            {/* Theme */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Theme</h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleThemeChange("light")}
                  className={`px-4 py-2 rounded-lg ${theme === "light" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
                >
                  Light
                </button>
                <button
                  onClick={() => handleThemeChange("dark")}
                  className={`px-4 py-2 rounded-lg ${theme === "dark" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
                >
                  Dark
                </button>
              </div>
            </section>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-medium transition-colors duration-300"
            >
              Save Settings
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings

