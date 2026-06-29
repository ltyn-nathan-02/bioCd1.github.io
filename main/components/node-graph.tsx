"use client"

import { useCallback, useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"


type Node = {
  id: string
  label: string
  href: string
  x: number
  y: number
}

const initialNodes: Node[] = [
  { id: "home", label: "HOME", href: "/", x: 400, y: 350 },
  { id: "about", label: "ABOUT", href: "/about", x: 400, y: 100 },
  { id: "life-path", label: "LIFE PATH", href: "/life-path", x: 650, y: 500 },
  { id: "interests", label: "INTERESTS\n& GOALS", href: "/interests", x: 150, y: 500 },
]

type Edge = { from: string; to: string }

const edges: Edge[] = [
  { from: "home", to: "about" },
  { from: "home", to: "life-path" },
  { from: "home", to: "interests" },
]

export default function NodeGraph() {
  const router = useRouter()
  const svgRef = useRef<SVGSVGElement>(null)
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [dragging, setDragging] = useState<string | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const onPointerDown = useCallback((e: React.PointerEvent, id: string) => {
    const node = nodes.find((n) => n.id === id)
    if (!node) return
    setDragging(id)
    const svg = svgRef.current!
    const rect = svg.getBoundingClientRect()
    setOffset({ x: e.clientX - rect.left - node.x, y: e.clientY - rect.top - node.y })
    svg.setPointerCapture(e.pointerId)
  }, [nodes])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return
    const svg = svgRef.current!
    const rect = svg.getBoundingClientRect()
    setNodes((prev) =>
      prev.map((n) =>
        n.id === dragging
          ? { ...n, x: Math.max(0, e.clientX - rect.left - offset.x), y: Math.max(0, e.clientY - rect.top - offset.y) }
          : n,
      ),
    )
  }, [dragging, offset])

  const onPointerUp = useCallback(() => {
    setDragging(null)
  }, [])

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  const padding = 50
  const width = 800
  const height = 650

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full max-w-3xl h-auto"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{ touchAction: "none" }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {edges.map((edge) => {
        const from = nodes.find((n) => n.id === edge.from)!
        const to = nodes.find((n) => n.id === edge.to)!
        return (
          <line
            key={`${edge.from}-${edge.to}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1.5}
          />
        )
      })}

      {nodes.map((node) => (
        <g key={node.id} className="cursor-grab active:cursor-grabbing" onPointerDown={(e) => onPointerDown(e, node.id)}>
          <circle cx={node.x} cy={node.y} r={36} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} filter="url(#glow)" />
          <text
            x={node.x}
            y={node.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.8)"
            fontSize={node.id === "home" ? 11 : 9}
            fontFamily="monospace"
            pointerEvents="none"
          >
            {node.label.split("\n").map((line, i) => (
              <tspan key={i} x={node.x} dy={i === 0 ? -6 : 12}>
                {line}
              </tspan>
            ))}
          </text>
          <circle
            cx={node.x}
            cy={node.y + 50}
            r={12}
            fill="rgba(255,255,255,0.1)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={1}
            className="cursor-pointer"
            onClick={() => router.push(node.href)}
          />
          <text
            x={node.x}
            y={node.y + 50}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.6)"
            fontSize={10}
            fontFamily="monospace"
            pointerEvents="none"
          >
            &gt;
          </text>
        </g>
      ))}
    </svg>
  )
}
