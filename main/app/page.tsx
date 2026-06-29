import Starfield from "@/components/starfield"
import NodeGraph from "@/components/node-graph"

export default function Home() {
  return (
    <>
      <Starfield />
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <pre className="text-[#4ade80] text-center text-xs sm:text-sm md:text-base leading-tight mb-8 font-mono">
{`

`}
        </pre>
        <p className="text-zinc-500 text-sm mb-6 font-mono">— since 2026 —</p>
        <NodeGraph />
        <p className="mt-10 text-zinc-600 text-xs font-mono">Made by Nathan Liu</p>
      </main>
    </>
  )
}
