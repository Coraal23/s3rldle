"use client"

import { useRef, useState } from "react"

export default function ArchiveSongCard({ song, index }) {
  const audioRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(false)

  const handlePlay = async () => {
    if (isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
      return
    }

    if (previewUrl) {
      audioRef.current?.play()
      setIsPlaying(true)
      return
    }

    setLoading(true)
    const query = encodeURIComponent(`${song.artist} ${song.title}`)
    const res = await fetch(
      `https://itunes.apple.com/search?term=${query}&entity=song&limit=1`
    )
    const data = await res.json()
    setLoading(false)

    if (!data.results?.length) return

    const track = data.results[0]
    setPreviewUrl(track.previewUrl)

    setTimeout(() => {
      audioRef.current?.play()
      setIsPlaying(true)
    }, 100)
  }

  const handleEnded = () => {
    setIsPlaying(false)
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-white/30 transition-colors duration-200">

      <span className="text-white/30 text-sm w-6 text-right shrink-0">
        {index + 1}
      </span>

   
      {previewUrl && (
        <audio
          ref={audioRef}
          src={previewUrl}
          onEnded={handleEnded}
        />
      )}

   
      <button
        onClick={handlePlay}
        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-200 shrink-0"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : isPlaying ? "⏸" : "▶"}
      </button>


      <div className="flex flex-col min-w-0">
        <span className="text-white font-medium truncate">{song.title}</span>
        <span className="text-white/50 text-sm truncate">{song.artist}</span>
      </div>
    </div>
  )
}