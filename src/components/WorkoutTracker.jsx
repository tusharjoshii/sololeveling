"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import gsap from "gsap"
import { doc, updateDoc, increment } from "firebase/firestore"
import { db } from "../firebase/config"
import { useAuth } from "../contexts/AuthContext"

const WorkoutTracker = ({ workout, onComplete }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [exerciseState, setExerciseState] = useState("ready") // ready, active, rest, complete
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  const timerRef = useRef(null)
  const containerRef = useRef(null)
  const progressBarRef = useRef(null)

  const currentExercise = workout?.exercises[currentExerciseIndex]
  const { currentUser } = useAuth()

  // Calculate total workout time
  const totalWorkoutTime = workout?.exercises.reduce((total, exercise) => {
    if (exercise.duration) {
      // Convert duration string to seconds
      const durationMatch = exercise.duration.match(/(\d+)\s*(\w+)/)
      if (durationMatch) {
        const value = Number.parseInt(durationMatch[1])
        const unit = durationMatch[2].toLowerCase()

        if (unit.includes("sec")) return total + value
        if (unit.includes("min")) return total + value * 60
      }
      return total + 60 // Default to 60 seconds if parsing fails
    }

    // For exercises with sets/reps, estimate time
    if (exercise.sets) {
      const restTime = exercise.rest ? Number.parseInt(exercise.rest) : 60
      return total + exercise.sets * 45 + (exercise.sets - 1) * restTime
    }

    return total + 60 // Default fallback
  }, 0)

  // Initialize the first exercise
  useEffect(() => {
    if (currentExercise) {
      if (currentExercise.duration) {
        // Parse duration string (e.g., "45 sec", "2 min")
        const durationMatch = currentExercise.duration.match(/(\d+)\s*(\w+)/)
        if (durationMatch) {
          const value = Number.parseInt(durationMatch[1])
          const unit = durationMatch[2].toLowerCase()

          if (unit.includes("sec")) setTimeLeft(value)
          else if (unit.includes("min")) setTimeLeft(value * 60)
          else setTimeLeft(60) // Default fallback
        } else {
          setTimeLeft(60) // Default fallback
        }
      } else {
        // For exercises with sets/reps, we don't use a timer
        setTimeLeft(0)
      }
    }

    // Particle effect
    const container = containerRef.current
    if (container) {
      const particles = []
      const particleCount = 20

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div")
        particle.className = "absolute w-1 h-1 rounded-full bg-blue-500 opacity-0"
        container.appendChild(particle)

        const size = Math.random() * 3
        const x = Math.random() * container.offsetWidth
        const y = Math.random() * container.offsetHeight

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
    }
  }, [currentExercise, workout])

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)

            // If we're in active state, move to rest state
            if (exerciseState === "active") {
              const nextRestTime = currentExercise.rest ? Number.parseInt(currentExercise.rest) : 60
              setTimeLeft(nextRestTime)
              setExerciseState("rest")
              return 0
            }

            // If we're in rest state, move to next exercise or complete
            if (exerciseState === "rest") {
              if (currentExerciseIndex < workout.exercises.length - 1) {
                setCurrentExerciseIndex((prev) => prev + 1)
                setExerciseState("ready")
              } else {
                setExerciseState("complete")
                setShowCompleteModal(true)
              }
              return 0
            }

            return 0
          }
          return prev - 1
        })

        setTotalTimeElapsed((prev) => prev + 1)
      }, 1000)
    } else if (!isTimerRunning && timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isTimerRunning, timeLeft, exerciseState, currentExerciseIndex, workout, currentExercise])

  // Progress bar animation
  useEffect(() => {
    if (progressBarRef.current && totalWorkoutTime > 0) {
      const progress = (totalTimeElapsed / totalWorkoutTime) * 100
      gsap.to(progressBarRef.current, {
        width: `${Math.min(100, progress)}%`,
        duration: 0.5,
        ease: "power2.out",
      })
    }
  }, [totalTimeElapsed, totalWorkoutTime])

  const startExercise = () => {
    setExerciseState("active")
    setIsTimerRunning(true)
  }

  const pauseTimer = () => {
    setIsTimerRunning(false)
  }

  const resumeTimer = () => {
    setIsTimerRunning(true)
  }

  const skipExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1)
      setExerciseState("ready")
      setIsTimerRunning(false)
    } else {
      setExerciseState("complete")
      setShowCompleteModal(true)
    }
  }

  const skipRest = () => {
    if (exerciseState === "rest") {
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1)
        setExerciseState("ready")
        setIsTimerRunning(false)
      } else {
        setExerciseState("complete")
        setShowCompleteModal(true)
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const completeWorkout = async () => {
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid)
      try {
        await updateDoc(userDocRef, {
          completedWorkouts: increment(1),
          experience: increment(workout.experience),
          lastWorkout: new Date(),
        })
        // You could also update the streak here if it's the next day
        onComplete()
      } catch (error) {
        console.error("Error updating user data:", error)
        // Handle error (show a message to the user)
      }
    }
  }

  const handleCompleteWorkout = () => {
    setShowCompleteModal(false)
    completeWorkout()
  }

  if (!workout) return null

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gray-900 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/images/solo-leveling-bg.jpg')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/90 to-gray-900"></div>

      <div className="relative max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white mb-2"
          >
            {workout.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center text-gray-400"
          >
            <span className="mr-4">
              Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
            </span>
            <span>+{workout.experience} XP</span>
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.min(100, Math.round((totalTimeElapsed / totalWorkoutTime) * 100))}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            ></div>
          </div>
        </div>

        {/* Current exercise */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExerciseIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-xl overflow-hidden mb-8"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{currentExercise.name}</h2>
                  <div className="flex flex-wrap gap-2">
                    {currentExercise.sets && (
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                        {currentExercise.sets} sets
                      </span>
                    )}
                    {currentExercise.reps && (
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                        {currentExercise.reps} reps
                      </span>
                    )}
                    {currentExercise.duration && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                        {currentExercise.duration}
                      </span>
                    )}
                    {currentExercise.rest && (
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
                        {currentExercise.rest} rest
                      </span>
                    )}
                  </div>
                </div>

                {exerciseState === "active" && timeLeft > 0 && (
                  <div className="text-4xl font-bold text-white tabular-nums">{formatTime(timeLeft)}</div>
                )}

                {exerciseState === "rest" && (
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-400 mb-1">Rest</span>
                    <div className="text-4xl font-bold text-white tabular-nums">{formatTime(timeLeft)}</div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {exerciseState === "ready" && (
                  <button
                    onClick={startExercise}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 rounded-lg font-medium shadow-lg shadow-blue-600/30 transition-all duration-300"
                  >
                    Start Exercise
                  </button>
                )}

                {exerciseState === "active" && (
                  <>
                    {isTimerRunning ? (
                      <button
                        onClick={pauseTimer}
                        className="flex-1 px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg font-medium shadow-lg shadow-amber-600/30 transition-all duration-300"
                      >
                        Pause
                      </button>
                    ) : (
                      <button
                        onClick={resumeTimer}
                        className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-medium shadow-lg shadow-green-600/30 transition-all duration-300"
                      >
                        Resume
                      </button>
                    )}

                    <button
                      onClick={skipExercise}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors duration-300"
                    >
                      Skip
                    </button>
                  </>
                )}

                {exerciseState === "rest" && (
                  <button
                    onClick={skipRest}
                    className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium shadow-lg shadow-purple-600/30 transition-all duration-300"
                  >
                    Skip Rest
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Next up */}
        {currentExerciseIndex < workout.exercises.length - 1 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-xl overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Next Up</h3>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">{workout.exercises[currentExerciseIndex + 1].name}</h4>
                <div className="flex flex-wrap gap-2 text-sm">
                  {workout.exercises[currentExerciseIndex + 1].sets && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md">
                      {workout.exercises[currentExerciseIndex + 1].sets} sets
                    </span>
                  )}
                  {workout.exercises[currentExerciseIndex + 1].reps && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-md">
                      {workout.exercises[currentExerciseIndex + 1].reps} reps
                    </span>
                  )}
                  {workout.exercises[currentExerciseIndex + 1].duration && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-md">
                      {workout.exercises[currentExerciseIndex + 1].duration}
                    </span>
                  )}
                  {workout.exercises[currentExerciseIndex + 1].rest && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-md">
                      {workout.exercises[currentExerciseIndex + 1].rest} rest
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Workout Complete Modal */}
      <AnimatePresence>
        {showCompleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative bg-gray-800/90 backdrop-blur-xl rounded-xl border border-blue-500/30 shadow-2xl max-w-md w-full p-6 overflow-hidden"
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
                >
                  WORKOUT COMPLETE!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="text-gray-300 mt-2"
                >
                  You've successfully completed the workout!
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="bg-gray-700/50 rounded-xl p-4 mb-6 relative z-10"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Duration</div>
                    <div className="text-2xl font-bold text-white">{formatTime(totalTimeElapsed)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Experience</div>
                    <div className="text-2xl font-bold text-blue-400">+{workout.experience} XP</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1 }}
                className="text-center relative z-10"
              >
                <button
                  onClick={handleCompleteWorkout}
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

export default WorkoutTracker

