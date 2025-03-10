"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db, storage } from "../firebase/config"
import { useAuth } from "../contexts/AuthContext"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import RankBadge from "../components/RankBadge"
import ExperienceBar from "../components/ExperienceBar"
import gsap from "gsap"

const Profile = () => {
  const { currentUser } = useAuth()
  const [userData, setUserData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUsername, setEditedUsername] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid)
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) {
          setUserData(userDoc.data())
          setEditedUsername(userDoc.data().username)
        }
      }
    }

    fetchUserData()

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
  }, [currentUser])

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSave = async () => {
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid)

      // Update username
      await updateDoc(userDocRef, {
        username: editedUsername,
      })

      // Update profile picture if a new file was selected
      if (selectedFile) {
        const fileRef = ref(storage, `profilePictures/${currentUser.uid}`)
        await uploadBytes(fileRef, selectedFile)
        const photoURL = await getDownloadURL(fileRef)
        await updateDoc(userDocRef, { photoURL })
      }

      // Fetch updated user data
      const updatedUserDoc = await getDoc(userDocRef)
      setUserData(updatedUserDoc.data())
      setIsEditing(false)
    }
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-blue-400">Loading profile data...</p>
        </div>
      </div>
    )
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
            <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
              <div className="relative mb-4 sm:mb-0 sm:mr-6">
                <img
                  src={userData.photoURL || `https://api.dicebear.com/6.x/avatars/svg?seed=${userData.username}`}
                  alt={userData.username}
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                />
                {isEditing && (
                  <label
                    htmlFor="profile-picture"
                    className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <input
                      type="file"
                      id="profile-picture"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>
              <div className="text-center sm:text-left">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUsername}
                    onChange={(e) => setEditedUsername(e.target.value)}
                    className="bg-gray-700 text-white text-2xl font-bold mb-2 px-2 py-1 rounded"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-white mb-2">{userData.username}</h1>
                )}
                <div className="flex items-center justify-center sm:justify-start mb-2">
                  <RankBadge rank={userData.rank} showLabel={true} />
                  <span className="ml-2 text-gray-400">Level {userData.level}</span>
                </div>
                <ExperienceBar
                  currentExp={userData.experience}
                  maxExp={(userData.level + 1) * 100}
                  level={userData.level}
                  rank={userData.rank}
                  animate={true}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-white mb-2">Stats</h2>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-400">Workouts Completed</span>
                    <span className="text-white">{userData.completedWorkouts}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Current Streak</span>
                    <span className="text-white">{userData.streak} days</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Total XP</span>
                    <span className="text-white">{userData.experience}</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-white mb-2">Achievements</h2>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-yellow-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white">First Workout</span>
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-yellow-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white">7-Day Streak</span>
                  </li>
                  {/* Add more achievements as needed */}
                </ul>
              </div>
            </div>

            {isEditing ? (
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm font-medium transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors duration-300"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors duration-300"
              >
                Edit Profile
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile

