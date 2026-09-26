import { useState, useEffect } from "react"

export function useGameState(storageKey) {
  const [guesses, setGuesses] = useState([])
  const [attempt, setAttempt] = useState(0)
  const [won, setWon] = useState(false)
  const [lost, setLost] = useState(false)
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
      }
    } catch (e) {}
    setLoaded(true)
  }, [storageKey])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(storageKey, JSON.stringify({ guesses, attempt, won, lost }))
    } catch (e) {}
  }, [guesses, attempt, won, lost, loaded, storageKey])

  return {
    guesses, setGuesses,
    attempt, setAttempt,
    won, setWon,
    lost, setLost,
    loaded,
  }
}