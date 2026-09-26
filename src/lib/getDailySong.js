import songs from "./songs"

export function getDayIndex() {
  const startDate = new Date("2026-09-27")
  const today = new Date()
  const diffTime = today.setHours(0,0,0,0) - startDate.setHours(0,0,0,0)
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

export function getDailySong() {
  const index = getDayIndex()

  if (index < 0) return songs[0]

  return songs[index % songs.length]
}