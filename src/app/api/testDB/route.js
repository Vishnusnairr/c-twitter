import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("twitterclone"); // Use your DB name here

    const collections = await db.listCollections().toArray();

    return new Response(
      JSON.stringify({
        message: "Connected successfully to MongoDB!",
        collections,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
