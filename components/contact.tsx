import { getUser } from "@/lib/auth-session";
import ContactClient from "./contact-client";

export default async function Contact() {
  const user = await getUser();
  return <ContactClient user={user || null} />;
}
