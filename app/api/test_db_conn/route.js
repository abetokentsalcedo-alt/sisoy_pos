export async function GET() {
  return Response.json({ connected: true, error: null });
}
