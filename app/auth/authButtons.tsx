"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function AuthButtons() {
  const handleGoToHome = () => {
    redirect("/");
  };

  return (
    <div className="flex flex-col gap-4">
      <form action={signOut}>
        <Button
          variant="outline"
          type="submit"
          className="text-sm cursor-pointer"
          onClick={() => {
            toast.success("Sign out successful");
          }}
        >
          Sign out
        </Button>
      </form>
      <Button
        variant="default"
        onClick={handleGoToHome}
        className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
      >
        Go to menu
      </Button>
    </div>
  );
}
