import clientPromise from "@/lib/mongodb";

import { connectToDB } from "@/lib/mongodb";

import { ObjectId } from "mongodb";

export async function createTweet({ content, email }) {
  const db = await connectToDB();
  const users = db.collection("users");
  const tweets = db.collection("tweets");

  const user = await users.findOne({ email });
  if (!user) throw new Error("User not found");

  const tweet = {
    content,
    user: {
      name: user.name,
      email: user.email,
      image: user.image || "/default.png",
    },
    createdAt: new Date(),
    likes: 0,
    comments: 0,
    retweets: 0,
  };

  const result = await tweets.insertOne(tweet);
  return { ...tweet, _id: result.insertedId };
}

export async function getAllTweets() {
  const db = await connectToDB();
  const tweets = await db
    .collection("tweets")
    .find({})
    .sort({ createdAt: -1 }) // latest first
    .toArray();

  return tweets.map((tweet) => ({
    _id: tweet._id.toString(),
    content: tweet.content,
    createdAt: tweet.createdAt,
    likes: tweet.likes || 0,
    comments: tweet.comments || 0,
    retweets: tweet.retweets || 0,
    user: tweet.user,
  }));
}

export async function likeTweet(tweetId) {
  const db = await connectToDB();
  const tweets = db.collection("tweets");

  const result = await tweets.updateOne(
    { _id: new ObjectId(tweetId) },
    { $inc: { likes: 1 } }
  );

  return result.modifiedCount > 0;
}
