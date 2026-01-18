import { getUser } from "@/lib/auth-session";
import { AuthClient } from "./page-client";

export default async function Auth() {
  const user = await getUser();
  return <AuthClient user={user || null} />;
}
