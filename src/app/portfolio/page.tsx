"use client";

import React, { useEffect } from "react";
import PortfolioLayout from "@/components/portfolio";
import useAuthStore from "@/store/auth";
import { useRouter } from "next/navigation";

export default function PortfolioPage() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <main>
      <PortfolioLayout />
    </main>
  );
}
