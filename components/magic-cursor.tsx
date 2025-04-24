"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function MagicCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [clicked, setClicked] = useState(false)
  const [linkHovered, setLinkHovered] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [trail, setTrail] = useState<{ x: number; y: number; opacity: number }[]>([])

  useEffect(() => {
    // Esconder o cursor inicial até que o mouse se mova
    const addEventListeners = () => {
      document.addEventListener("mousemove", onMouseMove)
      document.addEventListener("mouseenter", onMouseEnter)
      document.addEventListener("mouseleave", onMouseLeave)
      document.addEventListener("mousedown", onMouseDown)
      document.addEventListener("mouseup", onMouseUp)
    }

    const removeEventListeners = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseenter", onMouseEnter)
      document.removeEventListener("mouseleave", onMouseLeave)
      document.removeEventListener("mousedown", onMouseDown)
      document.removeEventListener("mouseup", onMouseUp)
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setHidden(false)

      // Adicionar partículas ao trail
      setTrail((prev) => {
        const newTrail = [...prev]
        newTrail.push({
          x: e.clientX,
          y: e.clientY,
          opacity: 1,
        })

        // Limitar o número de partículas
        if (newTrail.length > 5) {
          newTrail.shift()
        }

        // Reduzir a opacidade das partículas existentes
        return newTrail.map((particle, i) => ({
          ...particle,
          opacity: 1 - i * 0.2,
        }))
      })
    }

    const onMouseLeave = () => {
      setHidden(true)
    }

    const onMouseEnter = () => {
      setHidden(false)
    }

    const onMouseDown = () => {
      setClicked(true)
    }

    const onMouseUp = () => {
      setClicked(false)
    }

    // Detectar quando o mouse está sobre links ou botões
    const handleLinkHoverEvents = () => {
      document
        .querySelectorAll("a, button, [role=button], input, textarea, select, details, [tabindex]:not([tabindex='-1'])")
        .forEach((el) => {
          el.addEventListener("mouseover", () => setLinkHovered(true))
          el.addEventListener("mouseout", () => setLinkHovered(false))
        })
    }

    addEventListeners()
    handleLinkHoverEvents()

    return () => {
      removeEventListeners()
    }
  }, [])

  // Atualizar o detector de links quando o DOM muda
  useEffect(() => {
    const observer = new MutationObserver(() => {
      document
        .querySelectorAll("a, button, [role=button], input, textarea, select, details, [tabindex]:not([tabindex='-1'])")
        .forEach((el) => {
          el.addEventListener("mouseover", () => setLinkHovered(true))
          el.addEventListener("mouseout", () => setLinkHovered(false))
        })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [])

  const cursorVariants = {
    default: {
      x: position.x - 1,
      y: position.y - 1,
      rotate: 45,
    },
    clicked: {
      x: position.x - 1,
      y: position.y - 1,
      scale: 0.9,
      rotate: 0,
    },
    hovered: {
      x: position.x - 1,
      y: position.y - 1,
      scale: 1.1,
      rotate: 20,
    },
  }

  const cursorState = clicked ? "clicked" : linkHovered ? "hovered" : "default"

  return (
    <>
      {/* Rastro mágico */}
      {trail.map((particle, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 pointer-events-none z-[9999]"
          animate={{
            opacity: particle.opacity * 0.6,
            scale: 1 - i * 0.1,
          }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
          style={{
            x: particle.x - 4,
            y: particle.y - 4,
          }}
        >
          <div
            className="h-2 w-2 rounded-full bg-amber-400/30"
            style={{
              filter: "blur(1px) drop-shadow(0 0 3px rgba(255, 215, 0, 0.8))",
            }}
          />
        </motion.div>
      ))}

      {/* Cursor de varinha estilizado com CSS */}
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-[10000] ${hidden ? "opacity-0" : "opacity-100"}`}
        variants={cursorVariants}
        animate={cursorState}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      >
        {/* Corpo da varinha - Estilo da varinha de Harry Potter */}
        <div className="relative">
          {/* Ponta da varinha (brilho mágico) */}
          <div
            className={`absolute -top-1 -left-1 h-3 w-3 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 ${
              clicked ? "animate-pulse" : ""
            }`}
            style={{
              filter: "blur(2px) drop-shadow(0 0 5px rgba(255, 215, 0, 0.8))",
              opacity: clicked ? 0.9 : 0.7,
            }}
          />

          {/* Ponta da varinha (núcleo) */}
          <div
            className="absolute top-0 left-0 h-1 w-1 rounded-full bg-white"
            style={{
              filter: "blur(1px) drop-shadow(0 0 2px rgba(255, 255, 255, 0.9))",
            }}
          />

          {/* Corpo principal da varinha - mais fino e com textura */}
          <div
            className="h-14 w-1.5 rounded-full bg-gradient-to-b from-amber-700 via-amber-900 to-amber-950"
            style={{
              transformOrigin: "top center",
              boxShadow: "0 0 3px rgba(0, 0, 0, 0.5)",
            }}
          />

          {/* Nós da madeira - característicos da varinha de Harry */}
          <div
            className="absolute top-2 -left-0.5 h-1 w-2.5 rounded-full bg-gradient-to-b from-amber-600 to-amber-800"
            style={{
              boxShadow: "0 0 2px rgba(0, 0, 0, 0.3)",
            }}
          />

          <div
            className="absolute top-4 -left-0.5 h-1 w-2.5 rounded-full bg-gradient-to-b from-amber-600 to-amber-800"
            style={{
              boxShadow: "0 0 2px rgba(0, 0, 0, 0.3)",
            }}
          />

          <div
            className="absolute top-7 -left-0.5 h-1 w-2.5 rounded-full bg-gradient-to-b from-amber-600 to-amber-800"
            style={{
              boxShadow: "0 0 2px rgba(0, 0, 0, 0.3)",
            }}
          />

          <div
            className="absolute top-10 -left-0.5 h-1 w-2.5 rounded-full bg-gradient-to-b from-amber-600 to-amber-800"
            style={{
              boxShadow: "0 0 2px rgba(0, 0, 0, 0.3)",
            }}
          />

          {/* Base da varinha */}
          <div
            className="absolute top-12 -left-1 h-2 w-3.5 rounded-full bg-gradient-to-b from-amber-800 to-amber-950"
            style={{
              boxShadow: "0 0 2px rgba(0, 0, 0, 0.3)",
            }}
          />
        </div>
      </motion.div>
    </>
  )
}
