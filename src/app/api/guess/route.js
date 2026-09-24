import { getDailySong } from "@/lib/getDailySong"

export async function POST(request) {
  const { title } = await request.json()
  const song = getDailySong()

  const normalize = (str) =>
    str.toLowerCase().trim().replace(/[^a-z0-9]/g, "")

  const isCorrect = normalize(title) === normalize(song.title)

  return Response.json({ isCorrect })
}