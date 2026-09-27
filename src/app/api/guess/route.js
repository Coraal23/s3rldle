import { getDailySong } from "@/lib/getDailySong"
import songs from "@/lib/songs"

export async function POST(request) {
  const { title, index, attemptNumber, maxAttempts } = await request.json()

  const song = index !== undefined ? songs[index] : getDailySong()

  const normalize = (str) =>
    str.toLowerCase().trim().replace(/[^a-z0-9]/g, "")

  const isCorrect = normalize(title) === normalize(song.title)
  const isLastAttempt = attemptNumber + 1 >= maxAttempts

  return Response.json({
    isCorrect,
    correctTitle: (!isCorrect && isLastAttempt) ? song.title : null,
  })
}