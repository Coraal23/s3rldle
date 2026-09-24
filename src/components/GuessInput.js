"use client"

import { useState } from "react"
import songs from "@/lib/songs"

export default function GuessInput({ onGuess, disabled }) {
  const [query, setQuery] = useState("")
  const [showList, setShowList] = useState(false)

  const filtered = query.length > 0
    ? songs.filter((s) =>
        s.title.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const handleSelect = (song) => {
    setQuery("")
    setShowList(false)
    onGuess(song)
  }

  const handleChange = (e) => {
    setQuery(e.target.value)
    setShowList(true)
  }

  return (
    <div className="relative w-full max-w-2xl">
      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => query.length > 0 && setShowList(true)}
        onBlur={() => setTimeout(() => setShowList(false), 150)}
        disabled={disabled}
        placeholder="Escribe el título de la canción..."
        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-white/60 transition-colors duration-200 disabled:opacity-30"
      />

      {/* Lista desplegable */}
      {showList && filtered.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 rounded-xl border border-white/20 bg-black/80 backdrop-blur-sm overflow-hidden">
          {filtered.map((song, i) => (
            <li
              key={i}
              onMouseDown={() => handleSelect(song)}
              className="px-4 py-3 text-white cursor-pointer hover:bg-white/10 transition-colors duration-150 border-b border-white/5 last:border-b-0"
            >
              <span className="font-medium">{song.title}</span>
              <span className="text-white/40 text-sm ml-2">{song.artist}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Sin resultados */}
      {showList && query.length > 0 && filtered.length === 0 && (
        <div className="absolute z-10 w-full mt-2 rounded-xl border border-white/20 bg-black/80 backdrop-blur-sm px-4 py-3 text-white/40 text-sm">
          No se encontró ninguna canción
        </div>
      )}
    </div>
  )
}