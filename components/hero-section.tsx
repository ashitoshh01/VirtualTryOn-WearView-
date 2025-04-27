"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTheme } from "next-themes"
import * as THREE from "three"

// Shooting star component
const ShootingStar = ({ delay = 0 }) => {
  return (
    <motion.div
      className="absolute h-px bg-white"
      style={{
        width: Math.random() * 150 + 50,
        rotate: Math.random() * 360,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: 0,
      }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        x: [0, Math.random() * 200 - 100],
        y: [0, Math.random() * 200 - 100],
      }}
      transition={{
        duration: Math.random() * 2 + 1,
        delay: delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: Math.random() * 10 + 5,
      }}
    />
  )
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize and animate the 3D scene
  useEffect(() => {
    if (!canvasRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    })

    // Set renderer size
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        const height = containerRef.current.clientHeight
        renderer.setSize(width, height)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
      }
    }
    updateSize()

    // Create floating 3D objects
    const objects: THREE.Mesh[] = []
    const colors = isDarkMode
      ? [0x6d28d9, 0x8b5cf6, 0xa78bfa, 0x3b82f6, 0x60a5fa]
      : [0x8b5cf6, 0xa78bfa, 0xc4b5fd, 0x60a5fa, 0x93c5fd]

    // Create clothing-like 3D objects
    const createFloatingObject = (type: "tshirt" | "hoodie" | "sphere", position: THREE.Vector3) => {
      let geometry: THREE.BufferGeometry

      if (type === "tshirt") {
        // Simplified T-shirt shape
        geometry = new THREE.BoxGeometry(1, 1.2, 0.2)
      } else if (type === "hoodie") {
        // Simplified hoodie shape
        geometry = new THREE.BoxGeometry(1.2, 1.4, 0.3)
      } else {
        // Sphere for other items
        geometry = new THREE.SphereGeometry(0.5, 16, 16)
      }

      const material = new THREE.MeshPhongMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true,
        opacity: 0.7,
        shininess: 100,
      })

      const object = new THREE.Mesh(geometry, material)
      object.position.copy(position)
      object.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

      // Add random movement properties
      Object.assign(object, {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01,
        },
        floatSpeed: 0.005 + Math.random() * 0.01,
        floatDistance: 0.5 + Math.random() * 0.5,
        initialY: position.y,
        floatOffset: Math.random() * Math.PI * 2,
      })

      scene.add(object)
      objects.push(object)
      return object
    }

    // Create multiple floating objects
    for (let i = 0; i < 15; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10 - 5,
      )

      const type = Math.random() > 0.6 ? "tshirt" : Math.random() > 0.5 ? "hoodie" : "sphere"

      createFloatingObject(type, position)
    }

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0x8b5cf6, 1, 50)
    pointLight.position.set(0, 5, 0)
    scene.add(pointLight)

    // Position camera
    camera.position.z = 10

    // Animation loop
    let time = 0
    const animate = () => {
      requestAnimationFrame(animate)

      time += 0.01

      // Animate each object
      objects.forEach((obj) => {
        // Apply rotation
        obj.rotation.x += obj.rotationSpeed.x
        obj.rotation.y += obj.rotationSpeed.y
        obj.rotation.z += obj.rotationSpeed.z

        // Apply floating motion
        obj.position.y = obj.initialY + Math.sin(time + obj.floatOffset) * obj.floatDistance
      })

      // Slowly rotate the entire scene for added dynamism
      scene.rotation.y = Math.sin(time * 0.1) * 0.1

      renderer.render(scene, camera)
    }

    // Handle window resize
    window.addEventListener("resize", updateSize)

    // Start animation
    animate()
    setIsLoaded(true)

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateSize)
      renderer.dispose()
      objects.forEach((obj) => {
        obj.geometry.dispose()
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose())
        } else {
          obj.material.dispose()
        }
      })
    }
  }, [isDarkMode])

  // Generate shooting stars
  const shootingStars = Array.from({ length: 20 }).map((_, i) => <ShootingStar key={i} delay={i * 0.5} />)

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 w-full overflow-hidden">
      {/* 3D Background */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full">
        <canvas ref={canvasRef} className="w-full h-full" />
        <div
          className={`absolute inset-0 ${isDarkMode ? "bg-gradient-to-b from-purple-900/30 to-black/80" : "bg-gradient-to-b from-purple-100/50 to-white/80"}`}
        ></div>

        {/* Shooting stars layer */}
        <div className="absolute inset-0 overflow-hidden">{isDarkMode && shootingStars}</div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Try Before You Buy, Virtually
          </h1>
          <p className={`text-xl mb-8 ${isDarkMode ? "text-white/90" : "text-gray-700"}`}>
            Experience clothes in a whole new dimension with WearView's revolutionary virtual try-on technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              <Link href="/#shop">Try It Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className={
                isDarkMode
                  ? "bg-black text-white border-white hover:bg-black/90 hover:text-white"
                  : "bg-white text-black border-white hover:bg-white/90 hover:text-black"
              }
            >
              <Link href="/#about">Learn More</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
      >
        <div
          className={`w-8 h-12 rounded-full border-2 ${isDarkMode ? "border-white" : "border-gray-800"} flex items-start justify-center p-2`}
        >
          <motion.div
            className={`w-1 h-3 rounded-full ${isDarkMode ? "bg-white" : "bg-gray-800"}`}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>
      </motion.div>
    </section>
  )
}
