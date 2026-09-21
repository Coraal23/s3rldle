import songs from "./songs"

export function getDailySong() {
  const startDate = new Date("2025-01-01")
  const today = new Date()
  
  const diffTime = today.setHours(0,0,0,0) - startDate.setHours(0,0,0,0)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  const index = diffDays % songs.length

  return songs[index]
}