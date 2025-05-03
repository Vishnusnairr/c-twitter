// app/api/user/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getUserByEmail } from "@/lib/db/users";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const user = await getUserByEmail(session.user.email);
  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
