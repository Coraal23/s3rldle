import songs from "@/lib/songs"
import { getDayIndex } from "@/lib/getDailySong"

export async function GET() {
  const currentIndex = getDayIndex()

  if (currentIndex <= 0) {
    return Response.json({ songs: [] })
  }

  const pastSongs = songs
    .slice(0, currentIndex)
    .map((song, i) => ({
      index: i,
      day: i + 1,
      title: song.title,  
      artist: song.artist,
    }))

  return Response.json({ songs: pastSongs })
}