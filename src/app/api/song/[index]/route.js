import songs from "@/lib/songs"

export async function GET(request, { params }) {
  const { index: indexParam } = await params
  const index = parseInt(indexParam)

  if (isNaN(index) || index < 0 || index >= songs.length) {
    return Response.json({ error: "Canción no encontrada" }, { status: 404 })
  }

  const song = songs[index]

  const url = song.trackId
    ? `https://itunes.apple.com/lookup?id=${song.trackId}`
    : `https://itunes.apple.com/search?term=${encodeURIComponent(`${song.artist} ${song.title}`)}&entity=song&limit=1`

  const response = await fetch(url)
  const data = await response.json()

  if (!data.results?.length) {
    return Response.json({ error: "No encontrada en iTunes" }, { status: 404 })
  }

  const track = data.results[0]

  return Response.json({
    previewUrl: track.previewUrl,
    artwork: track.artworkUrl100.replace("100x100", "400x400"),
    trackId: track.trackId,
    spotifyId: song.spotifyId || null,
  })
}