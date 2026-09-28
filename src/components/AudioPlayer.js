"use client"

import { useEffect, useRef, useState } from "react"

const LIMITS = [0.1, 0.8, 1.5, 3, 6, 10]

export default function AudioPlayer({ attempt, apiUrl = "/api/song-of-the-day", gameOver = false }) {
    const audioRef = useRef(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)

    const TOTAL = 10

    const limit = gameOver ? TOTAL : LIMITS[Math.min(attempt, LIMITS.length - 1)]

    const [volume, setVolume] = useState(0.01)

    const handleVolume = (e) => {
        const val = parseFloat(e.target.value)
        setVolume(val)
        if (audioRef.current) audioRef.current.volume = val
    }


    useEffect(() => {
        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => setPreviewUrl(data.previewUrl))
    }, [apiUrl])


    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return
        audio.pause()
        audio.currentTime = 0
        setIsPlaying(false)
        setCurrentTime(0)
    }, [attempt])


    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime)
        }

        audio.addEventListener("timeupdate", handleTimeUpdate)
        return () => audio.removeEventListener("timeupdate", handleTimeUpdate)
    }, [previewUrl])

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return
        if (currentTime >= limit) {
            audio.pause()
            audio.currentTime = 0
            setIsPlaying(false)
            setCurrentTime(0)
        }
    }, [currentTime, limit])

    const togglePlay = () => {
        const audio = audioRef.current
        if (!audio) return

        if (isPlaying) {
            audio.pause()
            setIsPlaying(false)
        } else {
            audio.currentTime = 0
            audio.play()
            setIsPlaying(true)
        }
    }

    const [spotifyId, setSpotifyId] = useState(null)

    useEffect(() => {
        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => {
                setPreviewUrl(data.previewUrl)
                setSpotifyId(data.spotifyId)
            })
    }, [apiUrl])
    return (
        <div className="flex flex-col items-center gap-8 md:gap-16 p-4 md:p-6 w-full">

            {previewUrl && (
                <audio ref={audioRef} src={previewUrl} preload="auto" />
            )}

            <div className="hidden md:flex gap-2 mt-2">
                {LIMITS.map((sec, i) => (
                    <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-300 ${i < attempt
                                ? "w-32 bg-red-400"
                                : i === attempt
                                    ? "w-64 bg-white"
                                    : "w-32 bg-white/20"
                            }`}
                    />
                ))}
            </div>

            <button
                onClick={togglePlay}
                disabled={!previewUrl}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white text-black flex items-center justify-center text-2xl md:text-3xl hover:scale-105 transition-transform disabled:opacity-30"
            >
                {isPlaying ? "⏸" : "▶"}
            </button>

            <div className="w-full max-w-xs md:max-w-4xl px-2 md:px-0">
                <div className="relative w-full bg-white/10 rounded-full h-2">
                    <div
                        className="bg-white h-2 rounded-full transition-all duration-100"
                        style={{ width: `${(currentTime / TOTAL) * 100}%` }}
                    />
                    {LIMITS.slice(0, -1).map((sec, i) => (
                        <div
                            key={i}
                            className="absolute top-0 h-2 w-[2px] bg-black/40"
                            style={{ left: `${(sec / TOTAL) * 100}%` }}
                        />
                    ))}
                </div>
                <div className="relative w-full mt-1">
                    {LIMITS.map((sec, i) => (
                        <span
                            key={i}
                            className={`absolute text-[9px] md:text-[10px] -translate-x-1/2 transition-colors duration-300 ${i < attempt
                                    ? "text-red-400"
                                    : i === attempt
                                        ? "text-white"
                                        : "text-white/20"
                                }`}
                            style={{ left: `${(sec / TOTAL) * 100}%` }}
                        >
                            {sec}s
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-2 w-full max-w-xs md:max-w-md px-2 md:px-0">
                <span className="text-white/50 text-sm">🔈</span>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolume}
                    className="w-full accent-white cursor-pointer"
                />
                <span className="text-white/50 text-sm">🔊</span>
            </div>

            {gameOver && spotifyId && (
                <div className="w-full max-w-xs md:max-w-md">
                    <iframe
                        style={{ borderRadius: "12px" }}
                        src={`https://open.spotify.com/embed/track/${spotifyId}?utm_source=generator`}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                    />
                </div>
            )}
        </div>
    )
}