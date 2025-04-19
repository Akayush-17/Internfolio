import React from "react";
import { FormData } from "@/types";
import BasicInfo from "./basic-info";
import PortfolioStats from "./stats";
import Projects from "./projects";
import LearningGrowth from "./learning-growth";
import Link from "next/link";
import PDFExportButton from "../internship-report/button";

interface PublicPortfolioViewProps {
  data: FormData;
}

export default function PublicPortfolioView({
  data,
}: PublicPortfolioViewProps) {
  return (
    <div className="w-full min-h-screen font-inter">
      <nav className="flex justify-between items-center px-4 py-4 md:px-8 md:py-6">
        <div className="md:text-3xl text-[25px] font-medium">
          Intern<span className="font-bold">folio</span>
        </div>
        <div className="flex space-x-1.5 md:space-x-3">
          <PDFExportButton data={data} />
          <Link
            href="/"
            className="flex items-center gap-1 md:gap-2 bg-white text-black md:px-6 px-4 py-1 md:py-3 rounded-full border border-gray-200 font-medium transition-all duration-200 hover:bg-gray-50 no-underline"
          >
            Get your
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </nav>
      
      <BasicInfo basicInfo={data.basicInfo} />
      <PortfolioStats techStack={data.techStack} />
      <Projects projects={data.projects} />
      <LearningGrowth learning={data.learning} />
    </div>
  );
}