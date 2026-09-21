import songs from "@/lib/songs"

export async function GET() {
  return Response.json({ songs })
}