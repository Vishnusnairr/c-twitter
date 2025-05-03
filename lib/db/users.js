import clientPromise from "@/lib/mongodb";

export async function getUserByEmail(email) {
  try {
    const client = await clientPromise;
    const db = client?.db("twitterclone");
    return await db.collection("users").findOne({ email });
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw new Error("Error getting user by email");
  }
}

export async function createUser({ name, email, image }) {
  try {
    const client = await clientPromise;
    const db = client.db("twitterclone");
    return await db.collection("users").insertOne({
      name,
      email,
      image,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Error creating user");
  }
}
