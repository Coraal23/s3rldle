import songs from "@/lib/songs"
import { getDayIndex } from "@/lib/getDailySong"

export async function GET() {
  const currentIndex = getDayIndex()

  if (currentIndex <= 0) {
    return Response.json({ songs: [] })
  }

  const pastSongs = songs
    .slice(0, currentIndex)
    .map((_, i) => ({
      index: i,
      day: i + 1,
    }))

  return Response.json({ songs: pastSongs })
}