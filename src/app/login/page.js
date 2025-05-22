"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <div className="bg-gray-900 shadow-lg rounded-2xl p-6 w-full max-w-sm text-center border border-gray-800">
        <p className="text-sm text-gray-400 mb-4">
          ⚠️ This login is for{" "}
          <span className="font-semibold">development purposes only</span>. No
          real data is collected.
        </p>

        {session ? (
          <>
            <p className="text-xl font-semibold mb-4">
              Welcome, {session.user.name}
            </p>
            <div className="flex justify-center mb-4">
              <Image
                src={session.user.image}
                alt="User Image"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
            <button
              onClick={() => signOut()}
              className="w-full py-2 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <p className="text-lg mb-6 text-gray-300">You are not signed in</p>
            <button
              className="w-full flex items-center justify-center gap-3 py-2 px-4 rounded-lg bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 hover:shadow-md transition"
              onClick={() => signIn("google")}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 533.5 544.3"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.2H272v95.1h146.9c-6.4 34.3-25.5 63.4-54.5 82.9v68.4h88.1c51.6-47.5 80-117.5 80-196.2z"
                  fill="#4285f4"
                />
                <path
                  d="M272 544.3c72.9 0 134-24.1 178.6-65.5l-88.1-68.4c-24.5 16.4-55.8 25.8-90.5 25.8-69.6 0-128.5-47-149.6-110.2H30.6v69.6C74.9 482.9 167.9 544.3 272 544.3z"
                  fill="#34a853"
                />
                <path
                  d="M122.4 326c-10.2-30.3-10.2-62.8 0-93.1V163.3H30.6c-41.3 82.6-41.3 180.5 0 263.1l91.8-70.4z"
                  fill="#fbbc04"
                />
                <path
                  d="M272 107.7c39.6-.6 77.8 14.2 107.2 41.5l80-80C407.3 24.3 341.3-.2 272 0 167.9 0 74.9 61.4 30.6 163.3l91.8 69.6c21.1-63.2 80-110.2 149.6-110.2z"
                  fill="#ea4335"
                />
              </svg>
              Sign in with Google
            </button>
          </>
        )}
      </div>
    </div>
  );
}
