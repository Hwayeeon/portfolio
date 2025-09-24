"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface NewsletterState {
  email: string;
  status: "idle" | "loading" | "success" | "error";
  message: string;
}

export function NewsletterForm() {
  const [state, setState] = useState<NewsletterState>({
    email: "",
    status: "idle",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.email || !state.email.includes("@")) {
      setState((prev) => ({
        ...prev,
        status: "error",
        message: "Please enter a valid email address",
      }));
      return;
    }

    setState((prev) => ({ ...prev, status: "loading" }));

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: state.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setState((prev) => ({
          ...prev,
          status: "success",
          message: "Successfully subscribed! Welcome to the newsletter.",
          email: "",
        }));
      } else {
        setState((prev) => ({
          ...prev,
          status: "error",
          message: data.message || "Something went wrong. Please try again.",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: "error",
        message: "Network error. Please check your connection and try again.",
      }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      email: e.target.value,
      status: "idle",
      message: "",
    }));
  };

  return (
    <div className="border-border bg-card rounded-lg border p-6">
      <div className="mb-4 text-center">
        <Mail className="text-primary mx-auto mb-2 h-8 w-8" />
        <h3 className="mb-2 text-lg font-semibold">Stay Updated</h3>
        <p className="text-muted-foreground text-sm">
          Get notified when I publish new posts about web development, programming tips, and tech
          insights.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={state.email}
            onChange={handleEmailChange}
            placeholder="Enter your email address"
            className="border-border focus:ring-primary bg-background w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
            disabled={state.status === "loading"}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={state.status === "loading" || !state.email}
          className="w-full"
        >
          {state.status === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Subscribe to Newsletter
        </Button>

        {state.message && (
          <div
            className={`flex items-center gap-2 rounded-md p-3 text-sm ${
              state.status === "success"
                ? "border border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400"
                : "border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {state.status === "success" ? (
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
            )}
            {state.message}
          </div>
        )}
      </form>

      <div className="text-muted-foreground mt-4 text-center text-xs">
        <p>No spam, ever. Unsubscribe at any time.</p>
      </div>
    </div>
  );
}

export default NewsletterForm;
