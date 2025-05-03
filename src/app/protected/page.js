import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p>Access denied</p>;
  }

  return <p>Welcome to the protected page, {session.user.name}!</p>;
}
