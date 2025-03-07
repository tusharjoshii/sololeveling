"use client"

import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const Landing = () => {
  const containerRef = useRef(null)
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const ctaRef = useRef(null)

  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  useEffect(() => {
    // Hero animation
    const heroTitle = heroRef.current.querySelector("h1")
    const heroSubtitle = heroRef.current.querySelector("p")
    const heroButtons = heroRef.current.querySelectorAll("a")

    // Create spans for each character in the title for animation
    const titleText = heroTitle.textContent
    heroTitle.innerHTML = ""
    titleText.split("").forEach((char) => {
      const span = document.createElement("span")
      span.textContent = char === " " ? "\u00A0" : char
      span.style.display = "inline-block"
      heroTitle.appendChild(span)
    })

    const titleChars = heroTitle.querySelectorAll("span")

    // Create spans for each line in the subtitle
    const subtitleLines = heroSubtitle.innerHTML.split(". ")
    heroSubtitle.innerHTML = ""
    subtitleLines.forEach((line, index) => {
      const span = document.createElement("span")
      span.innerHTML = line + (index < subtitleLines.length - 1 ? ". " : "")
      span.style.display = "block"
      heroSubtitle.appendChild(span)
    })

    const subtitleSpans = heroSubtitle.querySelectorAll("span")

    const tl = gsap.timeline()

    tl.from(titleChars, {
      opacity: 0,
      y: 50,
      rotationX: -90,
      stagger: 0.02,
      duration: 0.8,
      ease: "back.out(1.7)",
    })
      .from(
        subtitleSpans,
        {
          opacity: 0,
          y: 20,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.4",
      )
      .from(
        heroButtons,
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.6",
      )

    // Features animation
    const features = featuresRef.current.querySelectorAll(".feature")

    features.forEach((feature, index) => {
      gsap.from(feature, {
        scrollTrigger: {
          trigger: feature,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power3.out",
      })
    })

    // CTA animation
    gsap.from(ctaRef.current, {
      scrollTrigger: {
        trigger: ctaRef.current,
        start: "top 70%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    })

    // Particle effect
    const container = containerRef.current
    const particles = []
    const particleCount = 100

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
            y: y - Math.random() * 200 - 100,
            x: x + Math.random() * 100 - 50,
            duration: Math.random() * 20 + 20,
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
          "-=5",
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

      // No need for SplitText cleanup
    }
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/images/solo-leveling-bg.jpg')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 via-gray-900/70 to-gray-900"></div>

      {/* Hero section */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">
            LEVEL UP YOUR FITNESS JOURNEY
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Inspired by Solo Leveling, our fitness app transforms your workouts into an epic quest. Track progress,
            complete challenges, and rise through the ranks to become the ultimate hunter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 rounded-lg font-medium shadow-lg shadow-blue-600/30 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Start Your Journey
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg font-medium shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.section>

      {/* Features section */}
      <section ref={featuresRef} className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              BECOME THE STRONGEST HUNTER
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our app combines gamification with proven fitness techniques to keep you motivated and engaged.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group">
              <div className="w-14 h-14 rounded-lg bg-blue-600/20 flex items-center justify-center mb-6 group-hover:bg-blue-600/30 transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                Level Up System
              </h3>
              <p className="text-gray-400">
                Gain experience points with every workout. Level up and unlock new abilities and challenges as you
                progress.
              </p>
            </div>

            <div className="feature bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
              <div className="w-14 h-14 rounded-lg bg-purple-600/20 flex items-center justify-center mb-6 group-hover:bg-purple-600/30 transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
                Rank System
              </h3>
              <p className="text-gray-400">
                Rise through the ranks from E to S, just like in Solo Leveling. Each rank brings new challenges and
                rewards.
              </p>
            </div>

            <div className="feature bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 group">
              <div className="w-14 h-14 rounded-lg bg-indigo-600/20 flex items-center justify-center mb-6 group-hover:bg-indigo-600/30 transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-indigo-400"
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
              <h3 className="text-xl font-bold mb-2 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300">
                Guild System
              </h3>
              <p className="text-gray-400">
                Join or create guilds with friends. Compete in guild challenges and climb the global leaderboards
                together.
              </p>
            </div>

            <div className="feature bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 group">
              <div className="w-14 h-14 rounded-lg bg-cyan-600/20 flex items-center justify-center mb-6 group-hover:bg-cyan-600/30 transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
                Daily Quests
              </h3>
              <p className="text-gray-400">
                Complete daily quests to earn rewards and maintain your streak. The longer your streak, the greater the
                rewards.
              </p>
            </div>

            <div className="feature bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 group">
              <div className="w-14 h-14 rounded-lg bg-red-600/20 flex items-center justify-center mb-6 group-hover:bg-red-600/30 transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-red-400 group-hover:text-red-300 transition-colors duration-300">
                Dungeon Raids
              </h3>
              <p className="text-gray-400">
                Take on challenging workout "dungeons" with increasing difficulty. Defeat the boss to earn rare rewards.
              </p>
            </div>

            <div className="feature bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 group">
              <div className="w-14 h-14 rounded-lg bg-amber-600/20 flex items-center justify-center mb-6 group-hover:bg-amber-600/30 transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-amber-400 group-hover:text-amber-300 transition-colors duration-300">
                Customizable Workouts
              </h3>
              <p className="text-gray-400">
                Create and customize your workout routines. Adapt them to your level and goals as you progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section ref={ctaRef} className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900/40 to-indigo-900/40 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-blue-500/20 shadow-xl shadow-blue-500/5">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              READY TO ARISE?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of hunters who are transforming their fitness journey into an epic adventure.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 rounded-lg font-medium shadow-lg shadow-blue-600/30 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-center"
            >
              Start Your Journey
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg font-medium shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing

