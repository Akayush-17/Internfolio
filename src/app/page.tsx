"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RocketIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

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
          onClick={() => router.push("/form")}
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
        className="absolute left-4 md:left-16 top-1/3 w-24 md:w-32 lg:w-40"
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
        className="absolute right-4 md:right-16 top-2/3 w-24 md:w-32 lg:w-40"
      />
    </div>
  );
}
