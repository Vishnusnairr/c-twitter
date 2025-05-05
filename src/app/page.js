"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [tweetContent, setTweetContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [commentingTweetId, setCommentingTweetId] = useState(null);
  const [commentText, setCommentText] = useState("");

  const postTweet = async () => {
    if (!tweetContent.trim()) return;
    setSubmitting(true);

    const res = await fetch("/api/tweets", {
      method: "POST",
      body: JSON.stringify({ content: tweetContent }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setSubmitting(false);

    if (res.ok) {
      setTweetContent("");
      fetchTweets();
    } else {
      const { error } = await res.json();
      alert("Failed to post tweet: " + error);
    }
  };

  const handleLike = async (tweetId) => {
    try {
      const res = await fetch(`/api/tweets/${tweetId}/like`, {
        method: "POST",
      });
      if (res.ok) {
        fetchTweets();
      }
    } catch (err) {
      console.error("Failed to like tweet:", err);
    }
  };

  const handleComment = async (tweetId) => {
    if (!commentText.trim()) return;

    try {
      const res = await fetch(`/api/tweets/${tweetId}/comment`, {
        method: "POST",
        body: JSON.stringify({ text: commentText }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setCommentText("");
        setCommentingTweetId(null);
        fetchTweets(); // refresh after comment
      } else {
        const { error } = await res.json();
        alert("Failed to post comment: " + error);
      }
    } catch (err) {
      console.error("Failed to comment:", err);
    }
  };

  const fetchTweets = async () => {
    try {
      const res = await fetch("/api/tweets");
      const data = await res.json();
      setTweets(data);
    } catch (err) {
      console.error("Failed to fetch tweets:", err);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => setUserData(data))
        .catch((err) => console.error("Failed to fetch user data:", err));

      fetchTweets();
    }
  }, [status]);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) {
    router.push("/login");
    return null;
  }
  console.log(tweets, "", commentingTweetId);
  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-md p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Home</h1>

        <div className="flex items-start space-x-3">
          {session?.user.image && (
            <Image
              src={session.user.image}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <textarea
            className="flex-1 bg-transparent border border-gray-700 p-2 rounded-lg text-white focus:outline-none resize-none"
            rows={3}
            placeholder="What's happening?"
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={postTweet}
            disabled={submitting}
            className="bg-blue-500 px-4 py-1 rounded-full text-white font-semibold hover:bg-blue-600 transition disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Tweet"}
          </button>
        </div>

        {tweets.map((tweet) => (
          <div
            key={tweet._id}
            className="border border-gray-700 rounded-lg p-4 space-y-2"
          >
            <div className="flex items-start space-x-3">
              <Image
                src={tweet.user?.image || "/default.png"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold">
                  {tweet.user?.name || "Anonymous"}{" "}
                  <span className="text-gray-500 text-sm">
                    @{tweet.user?.email?.split("@")[0]} ·{" "}
                    {formatDistanceToNow(new Date(tweet.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </p>
                <p className="text-white">{tweet.content}</p>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between text-gray-500 text-sm mt-2 px-2">
                <span
                  onClick={() =>
                    setCommentingTweetId(
                      commentingTweetId === tweet._id ? null : tweet._id
                    )
                  }
                  className="cursor-pointer hover:text-blue-400 transition"
                >
                  💬 {tweet.comments?.length || 0}
                </span>
                <span>🔁 {tweet.retweets}</span>
                <span
                  onClick={() => handleLike(tweet._id)}
                  className="cursor-pointer hover:text-red-500 transition"
                >
                  ❤️ {tweet.likes}
                </span>
                <span>🔗</span>
              </div>

              {commentingTweetId === tweet._id && (
                <div className="flex items-center space-x-2 px-2">
                  <input
                    type="text"
                    className="flex-1 bg-transparent border border-gray-600 text-white p-1 px-2 rounded-full focus:outline-none"
                    placeholder="Tweet your reply"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button
                    onClick={() => handleComment(tweet._id)}
                    className="text-sm bg-blue-500 px-3 py-1 rounded-full text-white hover:bg-blue-600 transition"
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-center mt-4">
          <button
            onClick={() => signOut()}
            className="bg-gray-200 text-black px-6 py-2 rounded-full hover:bg-gray-300 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
