import React, { useState } from "react";
import Link from "next/link";
import BasicInfo from "./basic-info";
import PortfolioStats from "./stats";
import Projects from "./projects";
import useFormStore from "@/store/useFormStore";
import LearningGrowth from "./learning-growth";

const Portfolio = () => {
  const {
    formData,
    isPublished,
    publishedUrl,
    publishPortfolio,
    unpublishPortfolio,
  } = useFormStore();
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await publishPortfolio();
    } catch (error) {
      console.error("Failed to publish portfolio:", error);
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    setPublishing(true);
    try {
      await unpublishPortfolio();
    } catch (error) {
      console.error("Failed to unpublish portfolio:", error);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="w-full min-h-screen font-inter">
      <nav className="flex justify-between items-center px-4 py-4 md:px-8 md:py-6">
        <div className="text-3xl font-medium">
          Intern<span className="font-bold">folio</span>
        </div>
        <Link
          href="/contact"
          className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full border border-gray-200 font-medium transition-all duration-200 hover:bg-gray-50 no-underline"
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
      </nav>
      <BasicInfo basicInfo={formData.basicInfo} />
      <PortfolioStats techStack={formData.techStack} />
      <Projects projects={formData.projects} />
      <LearningGrowth learning={formData.learning} />
      <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h3 className="text-2xl font-semibold mb-4 text-center">
          Share Your Portfolio
        </h3>

        {isPublished ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full">
                <input
                  type="text"
                  value={publishedUrl || ""}
                  readOnly
                  className="w-full p-3 pr-24 bg-white rounded text-gray-600 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(publishedUrl || "")
                  }
                  className="absolute right-1 top-1 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded transition-colors duration-200 text-sm font-medium"
                >
                  Copy Link
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button
                onClick={handleUnpublish}
                disabled={publishing}
                className="bg-red-100 hover:bg-red-200 px-6 py-3 rounded-full transition-colors duration-200 flex items-center gap-2 font-medium disabled:opacity-70 cursor-pointer"
              >
                {publishing ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Unpublish Portfolio
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="bg-green-100 hover:bg-green-200 px-6 py-3 rounded-full transition-colors duration-200 flex items-center gap-2 font-medium disabled:opacity-70"
            >
              {publishing ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Publishing...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7l4-4m0 0l4 4m-4-4v18"
                    />
                  </svg>
                  Publish Portfolio
                </>
              )}
            </button>
          </div>
        )}

        <p className="mt-4 text-sm text-gray-400 text-center">
          {isPublished
            ? "Your portfolio is public. Anyone with the link can view it."
            : "Publish your portfolio to get a shareable link."}
        </p>
      </div>

      <div className="flex justify-center mb-16">
        <Link
          href="/form"
          className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 px-6 py-3 rounded-full transition-colors duration-200 font-medium no-underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 17l-5-5m0 0l5-5m-5 5h12"
            />
          </svg>
          Back to Edit Portfolio
        </Link>
      </div>
    </div>
  );
};

export default Portfolio;
