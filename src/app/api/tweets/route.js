import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

import { createTweet, getAllTweets } from "@/lib/db/tweets";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { content } = await req.json();
  if (!content || content.trim() === "") {
    return new Response("Content is required", { status: 400 });
  }

  try {
    const result = await createTweet({ content, email: session.user.email });
    return new Response(JSON.stringify(result), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const tweets = await getAllTweets();
    return new Response(JSON.stringify(tweets), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
