import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { likeTweet } from "@/lib/db/tweets";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = params;
  if (!id) return new Response("Missing Tweet ID", { status: 400 });

  try {
    const success = await likeTweet(id);
    return new Response(JSON.stringify({ success }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
