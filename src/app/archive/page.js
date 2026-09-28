"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Archive() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [states, setStates] = useState({})
  const router = useRouter()

  useEffect(() => {
    fetch("/api/archive")
      .then((res) => res.json())
      .then((data) => {
        setSongs(data.songs)

        // Leer el estado guardado de cada canción
        const saved = {}
        data.songs.forEach((song) => {
          try {
            const item = localStorage.getItem(`s3rldle_archive_${song.index}`)
            if (item) saved[song.index] = JSON.parse(item)
          } catch (e) { }
        })
        setStates(saved)
        setLoading(false)
      })
  }, [])

  return (
    <main className="w-full max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/" className="text-white/50 hover:text-white transition-colors text-sm">
          ← Volver
        </Link>
        <h1 className="text-white text-2xl font-bold">Días anteriores</h1>
      </div>

      {loading && <p className="text-white/40 text-sm">Cargando...</p>}
      {!loading && songs.length === 0 && (
        <p className="text-white/40 text-sm">Aún no hay días anteriores. ¡Vuelve mañana!</p>
      )}

      <div className="flex flex-col gap-2">
        {songs.map((song) => {
          const state = states[song.index]
          const completed = state?.won || state?.lost
          const won = state?.won

          return (
            <button
              key={song.index}
              onClick={() => router.push(`/archive/${song.index}`)}
              className="flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-200 text-left w-full"
            >
              <span className="text-white/30 text-sm w-12 shrink-0">
                Día {song.day}
              </span>

              <div className="flex flex-col gap-1 flex-1">
                {completed ? (
                  <>
                    <span className="text-white font-medium">{song.title}</span>
                    <span className="text-white/40 text-sm">{song.artist}</span>
                  </>
                ) : (
                  <>
                    <div className="h-3 w-32 bg-white/10 rounded-full" />
                    <div className="h-2 w-20 bg-white/5 rounded-full" />
                  </>
                )}
              </div>

              {/* Badge de estado */}
              {completed ? (
                <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${won
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}>
                  {won ? "✓ Acertado" : "✗ Fallado"}
                </span>
              ) : (
                <span className="text-white/30 text-sm shrink-0">▶ Jugar</span>
              )}
            </button>
          )
        })}
      </div>
    </main>
  )
}