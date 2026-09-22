import { getDailySong } from "@/lib/getDailySong"

export async function GET() {
  const song = getDailySong()

  const url = song.trackId
    ? `https://itunes.apple.com/lookup?id=${song.trackId}`
    : `https://itunes.apple.com/search?term=${encodeURIComponent(`${song.artist} ${song.title}`)}&entity=song&limit=1`

  const response = await fetch(url)
  const data = await response.json()

  if (!data.results || data.results.length === 0) {
    return Response.json({ error: "Canción no encontrada" }, { status: 404 })
  }

  const track = data.results[0]

  return Response.json({
    previewUrl: track.previewUrl,
    artwork: track.artworkUrl100.replace("100x100", "400x400"),
    trackId: track.trackId,
  })
}