"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import ArchiveSongCard from "@/components/ArchiveSongCard"

export default function Archive() {
  const [songs, setSongs] = useState([])

  useEffect(() => {
    fetch("/api/archive")
      .then((res) => res.json())
      .then((data) => setSongs(data.songs))
  }, [])

  return (
    <main className="w-full max-w-2xl mx-auto px-4 py-12">

      <div className="flex items-center gap-4 mb-10">
        <Link
          href="/"
          className="text-white/50 hover:text-white transition-colors text-sm"
        >
          ← Volver
        </Link>
        <h1 className="text-white text-2xl font-bold">Todas las canciones</h1>
      </div>

   
      <div className="flex flex-col gap-2">
        {songs.map((song, i) => (
          <ArchiveSongCard key={i} song={song} index={i} />
        ))}
      </div>
    </main>
  )
}