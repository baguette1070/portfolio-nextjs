// app/auth/page.tsx
"use client";
import AuthButtons from "@/app/auth/authButtons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface AuthClientProps {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
  } | null;
}

export function AuthClient({ user }: AuthClientProps) {
  const [openName, setOpenName] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [nameUser, setNameUser] = useState("");

  const updateEmail = async (newEmail: string) => {
    try {
      const response = await fetch("/api/auth/user/update/email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newEmail }),
      });
      if (!response.ok) {
        throw new Error("Error updating email");
      }
      toast.success("Email updated");
      setOpenEmail(false);
    } catch (error) {
      toast.error((error as Error).message || "Error updating email");
    }
  };

  const updateName = async (newName: string) => {
    try {
      const response = await fetch("/api/auth/user/update/name", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) {
        throw new Error("Error updating name");
      }
      toast.success("Name updated");
      setOpenName(false);
    } catch (error) {
      toast.error((error as Error).message || "Error updating name");
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4 pt-24 mt-24">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Required access</h1>
          <p className="text-muted-foreground mb-6">
            You must be logged in to view your account.
          </p>
          <Button asChild>
            <a href="/auth/signin">Sign in</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-32 ">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Your account</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Manage your account settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {user.image ? (
              <div className="relative w-full h-full">
                <Image
                  alt={user.name || "user"}
                  src={user.image}
                  fill
                  className="object-cover"
                  sizes="48px"
                  priority
                />
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-600">
                {user.name?.charAt(0) || user?.email?.charAt(0) || "?"}
              </span>
            )}
          </div>
          <div>
            <CardTitle className="text-lg">{user.name || "User"}</CardTitle>
            <CardDescription className="text-sm">
              {user.email || "email@example.com"}
            </CardDescription>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Account details</h3>
          {/* Email */}
          <div className="flex items-center justify-between text-sm">
            <p>
              <span className="text-gray-600">Email:</span>{" "}
              <span>{user.email}</span>
            </p>

            <Pencil
              onClick={() => setOpenEmail(true)}
              className="h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-700"
            />
          </div>
          {/* Name */}
          <div className="flex items-center justify-between text-sm">
            <p>
              <span className="text-gray-600">Name:</span>{" "}
              <span>{user.name}</span>
            </p>
            <Pencil
              onClick={() => setOpenName(true)}
              className="h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-700"
            />
          </div>
        </div>
        <AuthButtons />
      </CardContent>

      {/* Dialog pour modifier l'email */}
      <Dialog open={openEmail} onOpenChange={setOpenEmail}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update email</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className=""
                type="email"
                placeholder="Your new email"
              />
              <Button
                onClick={() => updateEmail(email)}
                className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Update
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Dialog pour modifier le nom */}
      <Dialog open={openName} onOpenChange={setOpenName}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update name</DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Input
                onChange={(e) => setNameUser(e.target.value)}
                value={nameUser}
                className=""
                type="text"
                placeholder="Your new name"
              />
              <Button
                onClick={() => updateName(nameUser)}
                className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Update
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
