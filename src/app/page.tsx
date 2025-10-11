"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RocketIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/mixpanel";
import useAuthStore from "@/store/auth";

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth, authProvider } = useAuthStore();

  const [showAuthModal, setShowAuthModal] = useState(false);

  const isOAuthAuthenticated = isAuthenticated && (authProvider === 'google' || authProvider === 'github');

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && isOAuthAuthenticated) {
      router.push("/form");
    }
  }, [isLoading, isOAuthAuthenticated, router]);

  const handleStartReport = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  if (isLoading || isOAuthAuthenticated) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center justify-center px-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-center mb-4"
      >
        Create Your Internship Report Effortlessly
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-lg md:text-xl text-center text-slate-300 max-w-xl mb-8"
      >
        A polished, professional way to showcase your SDE internship journey —
        projects, contributions, and more.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="relative"
      >
        <Button
          size="lg"
          className="text-lg px-6 py-4 border border-white cursor-pointer group hover:bg-white hover:text-slate-900 btn-hover-effect"
          onClick={() => {
            trackEvent("start_report_clicked", {
              category: "Portfolio Button",
              label: "start_report_clicked",
            });
            handleStartReport();
          }}
        >
          <RocketIcon className="mr-2 h-5 w-5 transition-all duration-300 group-hover:animate-rocket" />
          <span className="group-hover:text-slate-900 transition-all duration-300">
            <span className="block group-hover:hidden transition-opacity duration-300">
              Start My Report
            </span>
            <span className="hidden group-hover:block transition-opacity duration-300">
              Let&apos;s Go!{" "}
            </span>
          </span>
        </Button>
      </motion.div>

      <motion.img
        src="/laptops.png"
        alt="Report preview"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="mt-10 h-64 w-64 "
      />

      <motion.img
        src="/headphone.png"
        alt="Headphones"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 0.8, x: 0 }}
        transition={{
          delay: 0.8,
          duration: 0.7,
          type: "spring",
          stiffness: 100,
        }}
        className="absolute left-4 md:left-16 top-1/3 w-24 md:w-32 lg:w-40 md:block hidden"
      />

      <motion.img
        src="/bag.png"
        alt="Bag"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 0.8, x: 0 }}
        transition={{
          delay: 1.0,
          duration: 0.7,
          type: "spring",
          stiffness: 100,
        }}
        className="absolute right-4 md:right-16 top-2/3 w-24 md:w-32 lg:w-40 md:block hidden"
      />

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Authentication Required
            </h2>
            <p className="mb-6 text-gray-600">
              Please sign in with your Google or GitHub account to submit your
              internship form.
            </p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  useAuthStore.getState().signInWithGoogle();
                  handleCloseModal();
                }}
                className="flex items-center justify-center bg-white text-black border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>
              <button
                onClick={() => {
                  useAuthStore.getState().signInWithGithub();
                  handleCloseModal();
                }}
                className="flex items-center justify-center bg-gray-900 text-white rounded-md py-2 px-4 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
                  />
                </svg>
                Sign in with GitHub
              </button>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
