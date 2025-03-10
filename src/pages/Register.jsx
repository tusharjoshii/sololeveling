"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"
import { auth, db } from "../firebase/config"
import { useAuth } from "../contexts/AuthContext"
import { motion } from "framer-motion"
import gsap from "gsap"
import CustomInput from "../components/CustomInput"

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard")
    }

    // GSAP Animation
    const tl = gsap.timeline()

    tl.fromTo(titleRef.current, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }).fromTo(
      formRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out" },
      "-=0.5",
    )

    // Particle effect
    const container = containerRef.current
    const particles = []
    const particleCount = 50

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "absolute w-1 h-1 rounded-full bg-purple-500 opacity-0"
      container.appendChild(particle)

      const size = Math.random() * 3
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight

      gsap.set(particle, {
        x,
        y,
        width: size,
        height: size,
        backgroundColor: i % 3 === 0 ? "#8b5cf6" : i % 3 === 1 ? "#6d28d9" : "#a78bfa",
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
  }, [currentUser, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)

      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)

      // Update profile
      await updateProfile(userCredential.user, {
        displayName: formData.username,
      })

      // Create user document
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: formData.username,
        email: formData.email,
        createdAt: new Date(),
        level: 1,
        experience: 0,
        rank: "E",
        completedWorkouts: 0,
        streak: 0,
        lastWorkout: null,
      })

      navigate("/dashboard")
    } catch (error) {
      setError("Failed to create an account. " + error.message)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/images/solo-leveling-bg.jpg')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-gray-900/90"></div>

      <div className="relative z-10 w-full max-w-md px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-purple-500/20 p-8"
        >
          <div ref={titleRef} className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-400 mb-2 tracking-tight">AWAKEN</h1>
            <p className="text-gray-400">Create your hunter account</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <CustomInput
              label="Username"
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
            />
            <CustomInput
              label="Email"
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
            <CustomInput
              label="Password"
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
            <CustomInput
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />

            <div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg shadow-purple-600/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Register"
                )}
              </motion.button>
            </div>

            <div className="text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                Sign In
              </Link>
            </div>
          </form>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}

export default Register

