import { getUser } from "@/lib/auth-session";
import { AuthClient } from "./page-client";

export default async function Auth(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getUser();
  const searchParams = await props.searchParams;
  const emailChanged = searchParams["email-changed"] === "true";
  return <AuthClient user={user || null} emailChanged={emailChanged} />;
}
