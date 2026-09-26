import { getDailySong } from "@/lib/getDailySong"
import songs from "@/lib/songs"

export async function POST(request) {
  const { title, index } = await request.json()

  // Si viene index es del archive, si no es la del día
  const song = index !== undefined ? songs[index] : getDailySong()

  const normalize = (str) =>
    str.toLowerCase().trim().replace(/[^a-z0-9]/g, "")

  const isCorrect = normalize(title) === normalize(song.title)

  return Response.json({ isCorrect })
}