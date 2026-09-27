import { useState, useEffect } from "react"

export function useGameState(storageKey) {
  const [guesses, setGuesses] = useState([])
  const [attempt, setAttempt] = useState(0)
  const [won, setWon] = useState(false)
  const [lost, setLost] = useState(false)
  const [correctSong, setCorrectSong] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const state = JSON.parse(saved)
        setGuesses(state.guesses || [])
        setAttempt(state.attempt || 0)
        setWon(state.won || false)
        setLost(state.lost || false)
        setCorrectSong(state.correctSong || null)
      }
    } catch (e) {}
    setLoaded(true)
  }, [storageKey])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        guesses, attempt, won, lost, correctSong
      }))
    } catch (e) {}
  }, [guesses, attempt, won, lost, correctSong, loaded, storageKey])

  return {
    guesses, setGuesses,
    attempt, setAttempt,
    won, setWon,
    lost, setLost,
    correctSong, setCorrectSong,
    loaded,
  }
}