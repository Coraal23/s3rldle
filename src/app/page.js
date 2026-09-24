"use client"

import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
import AudioPlayer from "@/components/AudioPlayer"
import GuessInput from "@/components/GuessInput"

export default function Home() {
  const [attempt, setAttempt] = useState(0)
  const [guesses, setGuesses] = useState([]) // historial de intentos
  const [won, setWon] = useState(false)
  const [lost, setLost] = useState(false)

  const MAX_ATTEMPTS = 6

  const handleGuess = async (song) => {
  const res = await fetch("/api/guess", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: song.title }),
  })
  const { isCorrect } = await res.json()

  const newGuesses = [...guesses, { title: song.title, correct: isCorrect }]
  setGuesses(newGuesses)

  if (isCorrect) {
    setWon(true)
  } else if (newGuesses.length >= MAX_ATTEMPTS) {
    setLost(true)
  } else {
    setAttempt((a) => a + 1)
  }
}

  return (
    <main className="w-full">
      {/* Header */}
      <div className="flex flex-1 justify-between shadow-md shadow-white">
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
            <span className="absolute inset-0 bg-white scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
            <span className="relative z-10 flex items-center gap-2 text-white text-xl cursor-pointer transition-colors duration-300 group-hover:text-black">
              <span className="flex items-end gap-[2px] h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="w-[3px] bg-current animate-[eq1_0.6s_ease-in-out_infinite]" />
                <span className="w-[3px] bg-current animate-[eq2_0.6s_ease-in-out_infinite]" />
                <span className="w-[3px] bg-current animate-[eq3_0.6s_ease-in-out_infinite]" />
              </span>
              Ver días anteriores
            </span>
          </Link>
        </div>
      </div>

      {/* Juego */}
      <div className="max-w-[80%] mx-auto mt-10 flex flex-col items-center gap-8">
        <AudioPlayer attempt={attempt} />

        {/* Historial de intentos */}
        {guesses.length > 0 && (
          <div className="w-full max-w-2xl flex flex-col gap-2">
            {guesses.map((g, i) => (
              <div
                key={i}
                className={`px-4 py-3 rounded-xl border text-sm font-medium ${
                  g.correct
                    ? "border-green-500/50 bg-green-500/10 text-green-400"
                    : "border-red-500/50 bg-red-500/10 text-red-400"
                }`}
              >
                {g.correct ? "✓" : "✗"} {g.title}
              </div>
            ))}

            {/* Espacios vacíos restantes */}
            {Array.from({ length: MAX_ATTEMPTS - guesses.length }).map((_, i) => (
              <div
                key={i}
                className="px-4 py-3 rounded-xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        )}

        {/* Input o mensaje de fin */}
        {!won && !lost ? (
          <GuessInput onGuess={handleGuess} disabled={false} />
        ) : (
          <div className="text-center">
            {won && <p className="text-green-400 text-xl font-bold">¡Correcto!</p>}
            {lost && <p className="text-red-400 text-xl font-bold">¡Se acabaron los intentos!</p>}
          </div>
        )}
      </div>
    </main>
  )
}