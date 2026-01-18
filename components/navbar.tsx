import { getUser } from "@/lib/auth-session";
import NavbarClient from "./navbar-client";

export default async function Navbar() {
  const user = await getUser();
  return <NavbarClient user={user || null} />;
}
