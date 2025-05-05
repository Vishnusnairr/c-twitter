import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { commentTweet } from "@/lib/db/tweets";

export async function POST(req, { params }) {
  console.log(params, "params");
  const { id } = await params;
  console.log("Tweet ID:", id);

  const session = await getServerSession(authOptions);
  if (!session) {
    console.log("No session found");
    return new Response("Unauthorized", { status: 401 });
  }

  if (!id) {
    console.log("Missing Tweet ID");
    return new Response("Missing Tweet ID", { status: 400 });
  }

  try {
    const body = await req.json();
    const { text } = body;

    if (!text?.trim()) {
      console.log("Empty comment text");
      return new Response("Empty comment", { status: 400 });
    }

    console.log("Comment text:", text);

    const success = await commentTweet(id, {
      userId: session.user.id,
      text,
    });

    return new Response(JSON.stringify({ success }), { status: 200 });
  } catch (err) {
    console.log("Error occurred:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
