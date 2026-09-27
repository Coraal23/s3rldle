import songs from "./songs"

export function getDayIndex() {
  const startDate = new Date("2026-05-27T00:00:00+02:00")

  const now = new Date()
  const madridDate = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Madrid" }))
  madridDate.setHours(0, 0, 0, 0)

  return Math.floor((madridDate - startDate) / (1000 * 60 * 60 * 24))
}

export function getDailySong() {
  const index = getDayIndex()

  if (index < 0) return songs[0]

  return songs[index % songs.length]
}