"use client"
import React, { useRef, useEffect, useState } from "react";
import useFormStore from "@/store/useFormStore";
import { FormData } from "@/types";
import { formatDate, calculateDuration } from "@/utils/dateUtils";
import html2pdf from "html2pdf.js";

interface PDFGeneratorProps {
  onClose?: () => void;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ onClose }) => {
  const { formData } = useFormStore();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const generatePDF = async () => {
    if (!reportRef.current || !isMounted) return;

    const element = reportRef.current;
    const opt = {
      margin: [20, 20],
      filename: `${formData.basicInfo.fullName} - Internship Report.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    try {
      html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  if (!isMounted) {
    return null; 
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold">Internship Report Preview</h2>
          <div className="flex gap-3">
            <button
              onClick={generatePDF}
              className="md:px-4 md:py-2 py-1 bg-blue-200 text-blue-900 rounded-xl hover:bg-blue-300 transition-colors flex items-center gap-2"
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download PDF
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>

        <div className="p-4 md:p-8 bg-gray-100">
          <div
            ref={reportRef}
            className="bg-white p-6 md:p-10 shadow-md mx-auto print:shadow-none"
          >
            <InternshipReport data={formData} />
          </div>
        </div>
      </div>
    </div>
  );
};

const InternshipReport: React.FC<{ data: FormData }> = ({ data }) => {
  const { basicInfo, techStack, learning, projects } = data;

  return (
    <div
      className="font-serif text-black max-w-[210mm]"
      style={{ fontFamily: "Georgia, Times New Roman, serif" }}
    >
      <div className="text-center mb-10 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold mb-2">INTERNSHIP REPORT</h1>
        <h2 className="text-xl mb-4 text-gray-700">
          {basicInfo.teamDepartment} Team
        </h2>
        <div className="flex justify-center items-center gap-2 mb-6">
          <span className="inline-block h-1 w-10 bg-gray-300"></span>
          <p className="text-lg text-gray-600">
            {basicInfo.startDate && basicInfo.endDate
              ? `${formatDate(basicInfo.startDate)} - ${formatDate(
                  basicInfo.endDate
                )}`
              : "Duration not specified"}
            {basicInfo.startDate && basicInfo.endDate && (
              <span className="text-sm ml-2">
                ({calculateDuration(basicInfo.startDate, basicInfo.endDate)})
              </span>
            )}
          </p>
          <span className="inline-block h-1 w-10 bg-gray-300"></span>
        </div>
        <p className="text-lg font-bold">{basicInfo.fullName}</p>
        <p className="text-md mb-1">{basicInfo.internshipRole}</p>
        <p className="text-sm text-gray-600">{basicInfo.email}</p>
      </div>

      {/* Table of Contents */}
      <div className="mb-10 pb-4 border-b border-gray-200 page-break-after-avoid">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Table of Contents
        </h2>
        <ol className="list-decimal ml-8 space-y-1 text-gray-700">
          <li className="mb-1">Introduction</li>
          <li className="mb-1">Team Information</li>
          <li className="mb-1">Technical Environment</li>
          <li className="mb-1">Projects and Contributions</li>
          <li className="mb-1">Learning and Growth</li>
          <li className="mb-1">Conclusion</li>
        </ol>
      </div>

      {/* Introduction */}
      <section className="mb-10 page-break-after-avoid">
        <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200 text-gray-800">
          1. Introduction
        </h2>
        <p className="mb-4 leading-relaxed">
          This report summarizes my internship experience as{" "}
          <span className="font-semibold">{basicInfo.internshipRole}</span>{" "}
          at <span className="font-semibold">{basicInfo.teamDepartment}</span>{""}Team.
        </p>
        <p className="leading-relaxed">{basicInfo.summary}</p>
      </section>

      {/* Team Information */}
      <section className="mb-10 page-break-after-avoid">
        <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200 text-gray-800">
          2. Team Information
        </h2>
        <p className="mb-3 leading-relaxed">
          <span className="font-semibold">Manager:</span>{" "}
          {basicInfo.managerName}
        </p>
        {basicInfo.teammates && basicInfo.teammates.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 font-semibold">Team Members:</p>
            <ul className="list-disc ml-8 space-y-1">
              {basicInfo.teammates.map((teammate, index) => (
                <li key={index} className="leading-relaxed">
                  {teammate.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Technical Environment */}
      <section className="mb-10 page-break-after-avoid">
        <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200 text-gray-800">
          3. Technical Environment
        </h2>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 text-gray-700">
            Programming Languages
          </h3>
          <div className="bg-gray-50 p-3 border border-gray-200 rounded">
            {techStack.languages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {techStack.languages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-gray-200 px-2 py-1 rounded text-sm"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">None specified</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 text-gray-700">
            Frameworks & Libraries
          </h3>
          <div className="bg-gray-50 p-3 border border-gray-200 rounded">
            {techStack.frameworks.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {techStack.frameworks.map((framework, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-gray-200 px-2 py-1 rounded text-sm"
                  >
                    {framework}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">None specified</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 text-gray-700">
            Tools & Software
          </h3>
          <div className="bg-gray-50 p-3 border border-gray-200 rounded">
            {techStack.tools.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {techStack.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-gray-200 px-2 py-1 rounded text-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">None specified</p>
            )}
          </div>
        </div>

        {techStack.other && (
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2 text-gray-700">
              Other Technical Details
            </h3>
            <p className="bg-gray-50 p-3 border border-gray-200 rounded leading-relaxed">
              {techStack.other}
            </p>
          </div>
        )}
      </section>

      {/* Projects and Contributions */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200 text-gray-800 page-break-after-avoid">
          4. Projects and Contributions
        </h2>

        {projects.length > 0 ? (
          projects.map((project, index) => (
            <div
              key={index}
              className="mb-8 pb-8 border-b border-gray-100 page-break-inside-avoid"
            >
              <h3 className="text-lg font-bold mb-3 text-gray-700">
                {project.title}
              </h3>

              <div className="mb-4">
                <p className="font-semibold mb-1">Description:</p>
                <p className="leading-relaxed bg-gray-50 p-3 border border-gray-200 rounded">
                  {project.description}
                </p>
              </div>

              <div className="mb-4">
                <p className="font-semibold mb-1">Technologies Used:</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {project.pullRequests && project.pullRequests.length > 0 && (
                <div className="mb-4">
                  <p className="font-semibold mb-1">Key Pull Requests:</p>
                  <ul className="list-disc ml-6 space-y-2">
                    {project.pullRequests.map((pr, prIndex) => (
                      <li key={prIndex} className="leading-relaxed">
                        <span className="font-medium">{pr.title}</span> -{" "}
                        {pr.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.outcome && (
                <div className="mb-4">
                  <p className="font-semibold mb-1">Outcomes and Impact:</p>
                  <p className="leading-relaxed bg-gray-50 p-3 border border-gray-200 rounded">
                    {project.outcome}
                  </p>
                </div>
              )}

              {project.challenges && project.challenges.length > 0 && (
                <div className="mb-4">
                  <p className="font-semibold mb-1">
                    Challenges and Solutions:
                  </p>
                  <div className="space-y-3">
                    {project.challenges.map((challenge, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 p-3 border border-gray-200 rounded"
                      >
                        <p className="leading-relaxed">{challenge.obstacle}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No projects specified.</p>
        )}
      </section>

      {/* Learning and Growth */}
      <section className="mb-10 page-break-after-avoid">
        <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200 text-gray-800">
          5. Learning and Growth
        </h2>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 text-gray-700">
            Skills and Technologies Acquired
          </h3>
          {learning.currentlyLearning.length > 0 ? (
            <ul className="list-disc ml-8 space-y-2">
              {learning.currentlyLearning.map((item, index) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">None specified</p>
          )}
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2 text-gray-700">
            Future Learning Interests
          </h3>
          {learning.interestedIn.length > 0 ? (
            <ul className="list-disc ml-8 space-y-2">
              {learning.interestedIn.map((item, index) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">None specified</p>
          )}
        </div>
      </section>

      {/* Conclusion */}
      <section className="mb-10 page-break-after-avoid">
        <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200 text-gray-800">
          6. Conclusion
        </h2>
        <p className="leading-relaxed">
          This internship as{" "}
          <span className="font-semibold">{basicInfo.internshipRole}</span> at
          <span className="font-semibold"> {basicInfo.teamDepartment}</span> has
          provided valuable professional experience and contributed
          significantly to my career development. I worked on {projects.length}{" "}
          project{projects.length !== 1 ? "s" : ""}, developed skills in
          {techStack.languages.length > 0
            ? " " + techStack.languages.join(", ")
            : ""}
          , and gained practical knowledge of software development in a
          professional environment.
        </p>
      </section>

      {/* Footer */}
      <div className="text-center text-sm mt-16 pt-4 border-t border-gray-200 text-gray-600">
        <p>{basicInfo.fullName} - Internship Report</p>
        <p className="mt-1">
          {basicInfo.startDate && basicInfo.endDate
            ? `${formatDate(basicInfo.startDate)} - ${formatDate(
                basicInfo.endDate
              )}`
            : "No dates specified"}
        </p>
      </div>
    </div>
  );
};

export default PDFGenerator;
