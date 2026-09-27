"use client"

import { use } from "react"
import Link from "next/link"
import AudioPlayer from "@/components/AudioPlayer"
import GuessInput from "@/components/GuessInput"
import { useGameState } from "@/lib/useGameState"
import { useState } from "react"

export default function ArchiveSong({ params }) {
  const { index } = use(params)
  const songIndex = parseInt(index)

  const {
    guesses, setGuesses,
    attempt, setAttempt,
    won, setWon,
    lost, setLost,
    loaded,
  } = useGameState(`s3rldle_archive_${songIndex}`)

  const MAX_ATTEMPTS = 6

  if (!loaded) return null

  const handleGuess = async (song) => {
    const res = await fetch("/api/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: song.title,
        index: songIndex,
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
      if (correctTitle) setCorrectSong(correctTitle)
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

  return (
    <main className="w-full max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-10">
        <Link
          href="/archive"
          className="text-white/50 hover:text-white transition-colors text-sm"
        >
          ← Días anteriores
        </Link>
        <span className="text-white/30 text-sm">Día {songIndex + 1}</span>
      </div>

      <div className="flex flex-col items-center gap-8">
        <AudioPlayer
          attempt={attempt}
          apiUrl={`/api/song/${songIndex}`}
        />

        {guesses.length > 0 && (
          <div className="w-full flex flex-col gap-2">
            {guesses.map((g, i) => (
              <div
                key={i}
                className={`px-4 py-3 rounded-xl border text-sm font-medium ${g.correct
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
              <div key={i} className="px-4 py-3 rounded-xl border border-white/10 bg-white/5" />
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