"use client"

import Image from "next/image"
import { useState } from "react"
import AudioPlayer from "@/components/AudioPlayer"
import Link from "next/link"

export default function Home() {
  const [attempt, setAttempt] = useState(0)

  return (
    <main className="w-full">
      {/* Header */}
      <div className="flex flex-1 justify-between">
        <div className="flex flex-1 justify-between items-center max-w-[80%] mx-auto">
          <Image
            className="cursor-pointer"
            src="/s3rldlelogo.png"
            alt="s3rldle logo"
            width={220}
            height={80}
            priority
          />
          <Link
            href="/archive"
            className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.03]"
          >
            <button className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:border-white/0">
              <span className="absolute inset-0 bg-white scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
              <span className="relative z-10 flex items-center gap-2 text-white text-xl cursor-pointer transition-colors duration-300 group-hover:text-black">
                <span className="flex items-end gap-[2px] h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="w-[3px] bg-current animate-[eq1_0.6s_ease-in-out_infinite]" />
                  <span className="w-[3px] bg-current animate-[eq2_0.6s_ease-in-out_infinite]" />
                  <span className="w-[3px] bg-current animate-[eq3_0.6s_ease-in-out_infinite]" />
                </span>
                Ver días anteriores
              </span>
            </button>
          </Link>

        </div>
      </div>

      {/* Juego */}
      <div className="max-w-[80%] mx-auto mt-10">
        <AudioPlayer attempt={attempt} />

        {/* Temporal para probar — lo quitaremos cuando hagamos el input de guess */}
        <button
          onClick={() => setAttempt((a) => Math.min(a + 1, 5))}
          className="text-white border px-4 py-2 rounded mt-4"
        >
          Simular intento fallido
        </button>
      </div>
    </main>
  )
}