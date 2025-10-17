'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { RocketIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/mixpanel';
import useAuthStore from '@/store/auth';
import Image from 'next/image';
import { google, github, laptop, headphone, bag } from '@/assets/assets';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth, authProvider } = useAuthStore();

  const [showAuthModal, setShowAuthModal] = useState(false);

  const isOAuthAuthenticated =
    isAuthenticated && (authProvider === 'google' || authProvider === 'github');

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && isOAuthAuthenticated) {
      router.push('/form');
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
        A polished, professional way to showcase your SDE internship journey — projects,
        contributions, and more.
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
            trackEvent('start_report_clicked', {
              category: 'Portfolio Button',
              label: 'start_report_clicked'
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
              Let&apos;s Go!{' '}
            </span>
          </span>
        </Button>
      </motion.div>

      <motion.img
        src={laptop.src}
        alt="Report preview"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="mt-10 h-64 w-64 "
      />

      <motion.img
        src={headphone.src}
        alt="Headphones"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 0.8, x: 0 }}
        transition={{
          delay: 0.8,
          duration: 0.7,
          type: 'spring',
          stiffness: 100
        }}
        className="absolute left-4 md:left-16 top-1/3 w-24 md:w-32 lg:w-40 md:block hidden"
      />

      <motion.img
        src={bag.src}
        alt="Bag"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 0.8, x: 0 }}
        transition={{
          delay: 1.0,
          duration: 0.7,
          type: 'spring',
          stiffness: 100
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
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Authentication Required</h2>
            <p className="mb-6 text-gray-600">
              Please sign in with your Google or GitHub account to submit your internship form.
            </p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  useAuthStore.getState().signInWithGoogle();
                  handleCloseModal();
                }}
                className="flex items-center justify-center bg-white text-black border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Image src={google} alt="" className="w-5 h-5 mr-2" />
                Sign in with Google
              </button>
              <button
                onClick={() => {
                  useAuthStore.getState().signInWithGithub();
                  handleCloseModal();
                }}
                className="flex items-center justify-center bg-gray-900 text-white rounded-md py-2 px-4 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <Image src={github} alt="" className="w-5 h-5 mr-2" />
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
