"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface Requests {
  name: string;
  email: string;
  subject: string;
  message: string;
  updatedAt: Date;
}

export default function Requests() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<Requests[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const deleteRequest = async () => {
    try {
      const response = await fetch("/api/contact/message", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session?.user.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete request");
      }

      toast.success("Request deleted successfully");
      router.replace("/#contact");
    } catch (error) {
      toast.error((error as Error)?.message || "Failed to delete request");
    }
  };

  const fetchRequests = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      setLoading(true);
      const response = await fetch(
        `/api/contact/message?email=${encodeURIComponent(session.user.email)}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await response.json();
      setRequests(data.requests || data);
    } catch (error) {
      toast.error((error as Error)?.message || "Error loading requests");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  if (!session?.user) {
    return (
      <div className="container mx-auto p-4 mt-24">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">required access</h1>
          <p className="text-muted-foreground mb-6">
            You must be logged in to view your requests.
          </p>
          <Button className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
            <a href="/auth/signin">Sign in</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-24">
      <div className="mb-8 p-4">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Requests
        </h1>
        <p className="text-muted-foreground p-4">
          Manage all contact requests from your portfolio
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : requests.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No requests yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              When people contact you through your portfolio, their messages
              will appear here.
            </p>
            <Button className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
              <Link href="/">Go to Portfolio</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map((request, index) => {
            return (
              <Card
                key={`${request.email}-${index}`}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {request.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {request.name}
                          </CardTitle>
                          <a
                            href={`mailto:${request.email}`}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {request.email}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(request.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Subject:
                      </p>
                      <p className="text-sm bg-gray-50 p-3 rounded-md">
                        {request.subject}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Message:
                      </p>
                      <p className="text-sm bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
                        {request.message}
                      </p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        onClick={() => {
                          setIsOpen(true);
                        }}
                      >
                        Remove request
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove request</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to remove this request?</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="default"
                  size="lg"
                  className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => {
                    deleteRequest();
                    setIsOpen(false);
                  }}
                >
                  Yes
                </Button>
                <Button
                  variant="default"
                  size="lg"
                  className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  No
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
