"use client"

import Image from "next/image"
import Link from "next/link"
import AudioPlayer from "@/components/AudioPlayer"
import GuessInput from "@/components/GuessInput"
import { useGameState } from "@/lib/useGameState"
import { useState } from "react"

export default function Home() {
  const today = new Date().toISOString().split("T")[0] // "2026-09-27"
  const {
    guesses, setGuesses,
    attempt, setAttempt,
    won, setWon,
    lost, setLost,
    loaded,
  } = useGameState(`s3rldle_daily_${today}`)

  const MAX_ATTEMPTS = 6

  const handleGuess = async (song) => {
    const res = await fetch("/api/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: song.title,
        attemptNumber: attempt,
        maxAttempts: MAX_ATTEMPTS,
      }),
    })
    const { isCorrect, correctTitle } = await res.json()

    const newGuesses = [...guesses, { title: song.title, correct: isCorrect }]
    setGuesses(newGuesses)

    if (isCorrect) {
      setWon(true)
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setLost(true)
      if (correctTitle) setCorrectSong(correctTitle) // 👈 guardamos el título
    } else {
      setAttempt((a) => a + 1)
    }
  }

  const [correctSong, setCorrectSong] = useState(null)

  const handleSkip = () => {
    const newGuesses = [...guesses, { title: "Saltado", correct: false, skipped: true }]
    setGuesses(newGuesses)

    if (newGuesses.length >= MAX_ATTEMPTS) {
      setLost(true)
    } else {
      setAttempt((a) => a + 1)
    }
  }

  if (!loaded) return null

  return (
    <main className="w-full">
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

      <div className="max-w-[80%] mx-auto mt-10 flex flex-col items-center gap-8">
        <AudioPlayer attempt={attempt} />

        {guesses.length > 0 && (
          <div className="w-full max-w-2xl flex flex-col gap-2">
            {guesses.map((g, i) => (
              <div
                key={i}
                className={`px-4 py-2 rounded-xl border text-sm font-medium ${g.correct
                  ? "border-green-500/50 bg-green-500/10 text-green-400"
                  : g.skipped
                    ? "border-white/20 bg-white/5 text-white/40"
                    : "border-red-500/50 bg-red-500/10 text-red-400"
                  }`}
              >
                {g.correct ? "✓" : g.skipped ? "→" : "✗"} {g.title}
              </div>
            ))}
            {Array.from({ length: MAX_ATTEMPTS - guesses.length }).map((_, i) => (
              <div key={i} className="px-4 py-2 rounded-xl border border-white/10 bg-white/5" />
            ))}
          </div>
        )}

        {!won && !lost ? (
          <GuessInput onGuess={handleGuess} onSkip={handleSkip} disabled={false} />
        ) : (
          <div className="text-center">
            {won && <p className="text-green-400 text-xl font-bold">¡Correcto!</p>}
            {lost && (
              <div className="text-center flex flex-col gap-2">
                <p className="text-red-400 text-xl font-bold">¡Se acabaron los intentos!</p>
                {correctSong && (
                  <p className="text-white/60 text-sm">
                    La canción era <span className="text-white font-semibold">{correctSong}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}