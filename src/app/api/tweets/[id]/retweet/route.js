import { connectToDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req, context) {
  const { id } = context.params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing Tweet ID" }), {
      status: 400,
    });
  }

  try {
    const db = await connectToDB();

    const result = await db
      .collection("tweets")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $inc: { retweets: 1 } },
        { returnDocument: "after" }
      );

    if (!result.value) {
      return new Response(JSON.stringify({ error: "Tweet not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ retweets: result.value.retweets }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
