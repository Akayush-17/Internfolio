'use client';
import React, { useRef, useEffect, useState } from 'react';
import { FormData } from '@/types';
import { formatDate, calculateDuration } from '@/utils/dateUtils';
import '../../app/globals.css';
import { trackEvent } from '@/lib/mixpanel';

interface PDFGeneratorProps {
  onClose?: () => void;
  data: FormData;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ onClose, data }) => {
  const formData = data;
  const reportRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const generatePDF = async () => {
    if (!reportRef.current || !isMounted) return;

    setIsGenerating(true);

    try {
      // Import libraries dynamically
      const [jsPDFModule, html2canvasModule] = await Promise.all([
        import('jspdf'),
        import('html2canvas-pro')
      ]);

      const jsPDF = jsPDFModule.default;
      const html2canvas = html2canvasModule.default;

      const element = reportRef.current;
      const fileName = `${formData.basicInfo.fullName} - Internship Report.pdf`;

      // Create a new jsPDF instance
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Create a temporary clone of the element to modify its styles
      const clonedElement = element.cloneNode(true) as HTMLElement;
      const tempContainer = document.createElement('div');
      tempContainer.appendChild(clonedElement);
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);

      // Find and replace any oklch colors in the cloned element with standard RGB
      const allElements = clonedElement.querySelectorAll('*');
      allElements.forEach((el) => {
        const computedStyle = window.getComputedStyle(el as Element);
        const backgroundColor = computedStyle.backgroundColor;
        const color = computedStyle.color;

        // Apply computed RGB colors directly
        (el as HTMLElement).style.backgroundColor = backgroundColor;
        (el as HTMLElement).style.color = color;

        // Also handle border colors
        (el as HTMLElement).style.borderColor = computedStyle.borderColor;
      });

      // Function to add pages using the modified element
      const addPageToPdf = async (element: HTMLElement) => {
        const canvas = await html2canvas(element, {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;
        let pageCount = 0;

        // Add first page
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
        pageCount++;

        // Add additional pages if needed
        while (heightLeft > 0) {
          position = -pdfHeight * pageCount;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
          pageCount++;
        }

        pdf.save(fileName);
      };

      await addPageToPdf(clonedElement);

      // Clean up
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again or use another approach.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black1 bg-opacity-601 flex justify-center items-center z-50 p-4">
      <div className="bg-white1 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex md:flex-row gap-2 md:gap-0 flex-col justify-between items-center bg-gray-501">
          <h2 className="text-xl font-semibold">Internship Report Preview</h2>
          <div className="flex gap-3">
            <button
              onClick={() => {
                trackEvent('generate_pdf_clicked', {
                  category: 'Portfolio Button',
                  label: 'generate_pdf_clicked'
                });
                generatePDF();
              }}
              disabled={isGenerating}
              className={`md:px-4 md:py-2 px-2 py-1 bg-blue-2001 text-blue-9001 rounded-xl hover:bg-blue-3001 transition-colors flex items-center gap-2 ${
                isGenerating ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-blue-9001"
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
            {onClose && (
              <button
                onClick={() => {
                  trackEvent('close_preview_clicked', {
                    category: 'Portfolio Button',
                    label: 'close_preview_clicked'
                  });
                  onClose();
                }}
                className="px-4 py-2 bg-gray-2001 rounded-xl hover:bg-gray-300 transition-colors"
                disabled={isGenerating}
              >
                Close
              </button>
            )}
          </div>
        </div>

        <div className="p-4 md:p-8 bg-gray-1001">
          <div
            ref={reportRef}
            className="bg-white1 p-6 md:p-10 shadow-md mx-auto print:shadow-none"
          >
            <InternshipReport data={formData} />
          </div>
        </div>
      </div>
    </div>
  );
};

// The InternshipReport component remains unchanged
const InternshipReport: React.FC<{ data: FormData }> = ({ data }) => {
  const { basicInfo, techStack, learning, projects } = data;

  return (
    <div
      className="font-serif text-black1 max-w-[210mm]"
      style={{ fontFamily: 'Georgia, Times New Roman, serif' }}
    >
      <div className="text-center mb-10 pb-6 border-b border-gray-2001">
        <h1 className="text-3xl font-bold mb-2">INTERNSHIP REPORT</h1>
        <h2 className="text-xl mb-4 text-gray-7001">{basicInfo.teamDepartment} Team</h2>
        <div className="flex justify-center items-center gap-2 mb-6">
          <span className="inline-block h-1 w-10 bg-gray-300"></span>
          <p className="text-lg text-gray-6001">
            {basicInfo.startDate && basicInfo.endDate
              ? `${formatDate(basicInfo.startDate)} - ${formatDate(basicInfo.endDate)}`
              : 'Duration not specified'}
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
      </div>

      {/* Table of Contents */}
      <div className="mb-10 pb-4 border-b border-gray-2001 page-break-after-avoid">
        <h2 className="text-xl font-bold mb-4 text-gray-8001">Table of Contents</h2>
        <ol className="list-decimal ml-8 space-y-1 text-gray-7001">
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
        <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-2001 text-gray-8001">
          1. Introduction
        </h2>
        <p className="mb-4 leading-relaxed">
          This report summarizes my internship experience as{' '}
          <span className="font-semibold">{basicInfo.internshipRole}</span> at{' '}
          <span className="font-semibold">{basicInfo.teamDepartment}</span>
          {''}Team.
        </p>
        <p className="leading-relaxed">{basicInfo.summary}</p>
      </section>

      {/* Team Information */}
      <section className="mb-10 page-break-after-avoid">
        <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-2001 text-gray-8001">
          2. Team Information
        </h2>
        <p className="mb-3 leading-relaxed">
          <span className="font-semibold">Manager:</span> {basicInfo.managerName}
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
        <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-2001 text-gray-8001">
          3. Technical Environment
        </h2>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 text-gray-7001">Programming Languages</h3>
          <div className="bg-gray-501 p-3 border border-gray-2001 rounded">
            {techStack.languages && techStack.languages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {techStack.languages.map((lang, idx) => (
                  <span key={idx} className="inline-block bg-gray-2001 px-2 py-1 rounded text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-50011">None specified</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 text-gray-7001">Frameworks & Libraries</h3>
          <div className="bg-gray-501 p-3 border border-gray-2001 rounded">
            {techStack.frameworks && techStack.frameworks.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {techStack.frameworks.map((framework, idx) => (
                  <span key={idx} className="inline-block bg-gray-2001 px-2 py-1 rounded text-sm">
                    {framework}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-50011">None specified</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 text-gray-7001">Tools & Software</h3>
          <div className="bg-gray-501 p-3 border border-gray-2001 rounded">
            {techStack.tools && techStack.tools.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {techStack.tools.map((tool, idx) => (
                  <span key={idx} className="inline-block bg-gray-2001 px-2 py-1 rounded text-sm">
                    {tool}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-50011">None specified</p>
            )}
          </div>
        </div>

        {techStack.other && (
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2 text-gray-7001">Other Technical Details</h3>
            <p className="bg-gray-501 p-3 border border-gray-2001 rounded leading-relaxed">
              {techStack.other}
            </p>
          </div>
        )}
      </section>

      {/* Projects and Contributions */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-2001 text-gray-8001 page-break-after-avoid">
          4. Projects and Contributions
        </h2>

        {projects && projects.length > 0 ? (
          projects.map((project, index) => (
            <div
              key={index}
              className="mb-8 pb-8 border-b border-gray-1001 page-break-inside-avoid"
            >
              <h3 className="text-lg font-bold mb-3 text-gray-7001">{project.title}</h3>

              <div className="mb-4">
                <p className="font-semibold mb-1">Description:</p>
                <p className="leading-relaxed bg-gray-501 p-3 border border-gray-2001 rounded">
                  {project.description}
                </p>
              </div>

              <div className="mb-4">
                <p className="font-semibold mb-1">Technologies Used:</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies &&
                    project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="bg-blue-501 text-blue-7001 px-2 py-1 rounded text-sm"
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
                        <span className="font-medium">{pr.title}</span> - {pr.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.outcome && (
                <div className="mb-4">
                  <p className="font-semibold mb-1">Outcomes and Impact:</p>
                  <p className="leading-relaxed bg-gray-501 p-3 border border-gray-2001 rounded">
                    {project.outcome}
                  </p>
                </div>
              )}

              {project.challenges && project.challenges.length > 0 && (
                <div className="mb-4">
                  <p className="font-semibold mb-1">Challenges and Solutions:</p>
                  <div className="space-y-3">
                    {project.challenges.map((challenge, idx) => (
                      <div key={idx} className="bg-gray-501 p-3 border border-gray-2001 rounded">
                        <p className="leading-relaxed">{challenge.obstacle}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-5001 italic">No projects specified.</p>
        )}
      </section>

      {/* Learning and Growth */}
      <section className="mb-10 page-break-after-avoid">
        <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-2001 text-gray-8001">
          5. Learning and Growth
        </h2>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 text-gray-7001">
            Skills and Technologies Acquired
          </h3>
          {learning.currentlyLearning && learning.currentlyLearning.length > 0 ? (
            <ul className="list-disc ml-8 space-y-2">
              {learning.currentlyLearning.map((item, index) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-5001 italic">None specified</p>
          )}
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2 text-gray-7001">Future Learning Interests</h3>
          {learning.interestedIn && learning.interestedIn.length > 0 ? (
            <ul className="list-disc ml-8 space-y-2">
              {learning.interestedIn.map((item, index) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-5001 italic">None specified</p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 text-gray-7001">Technical Learnings</h3>
          {learning.technicalLearningEntries && learning.technicalLearningEntries.length > 0 ? (
            <ul className="list-disc ml-8 space-y-4">
              {learning.technicalLearningEntries.map((entry, index) => (
                <li key={index} className="leading-relaxed">
                  <h4 className="font-semibold text-gray-8001">{entry.title}</h4>
                  <p className="text-gray-6001 mt-2">
                    <span className="font-bold">Context:</span> {entry.context}
                  </p>
                  <p className="text-gray-6001 mt-2">
                    <span className="font-bold">Learning:</span> {entry.learning}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-50011 italic">None specified</p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 text-gray-7001">Soft Skills Developed</h3>
          {learning.softSkills && learning.softSkills?.length > 0 ? (
            <ul className="list-disc ml-8 space-y-4">
              {learning.softSkills.map((entry, index) => (
                <li key={index} className="leading-relaxed">
                  <h4 className="font-semibold text-gray-8001">{entry.title}</h4>
                  <p className="text-gray-6001 mt-2">
                    <span className="font-bold">Context:</span> {entry.context}
                  </p>
                  <p className="text-gray-6001 mt-2">
                    <span className="font-bold">Learning:</span> {entry.learning}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-50011 italic">None specified</p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 text-gray-7001">Cross-Team Collaboration</h3>
          {learning.crossTeamCollaboration && learning.crossTeamCollaboration?.length > 0 ? (
            <ul className="list-disc ml-8 space-y-4">
              {learning.crossTeamCollaboration.map((entry, index) => (
                <li key={index} className="leading-relaxed">
                  <h4 className="font-semibold text-gray-8001">{entry.title}</h4>
                  <p className="text-gray-6001 mt-2">
                    <span className="font-bold">Context:</span> {entry.context}
                  </p>
                  <p className="text-gray-6001 mt-2">
                    <span className="font-bold">Learning:</span> {entry.learning}
                  </p>
                  {entry.teams && entry.teams.length > 0 && (
                    <p className="text-gray-6001 mt-2">
                      <span className="font-bold">Teams:</span> {entry.teams.join(', ')}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-50011 italic">None specified</p>
          )}
        </div>
      </section>

      {/* Conclusion */}
      <section className="mb-10 page-break-after-avoid">
        <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-2001 text-gray-8001">
          6. Conclusion
        </h2>
        <p className="leading-relaxed">
          This internship as <span className="font-semibold">{basicInfo.internshipRole}</span> at
          <span className="font-semibold"> {basicInfo.teamDepartment} Team</span> has provided
          valuable professional experience and contributed significantly to my career development. I
          worked on {projects?.length || 0} project
          {(projects?.length || 0) !== 1 ? 's' : ''}, developed skills in
          {techStack.languages && techStack.languages.length > 0
            ? ' ' + techStack.languages.join(', ')
            : ''}
          , and gained practical knowledge of software development in a professional environment.
        </p>
      </section>

      {/* Footer */}
      <div className="text-center text-sm mt-16 pt-4 border-t border-gray-2001 text-gray-6001">
        <p>{basicInfo.fullName} - Internship Report</p>
        <p className="mt-1">
          {basicInfo.startDate && basicInfo.endDate
            ? `${formatDate(basicInfo.startDate)} - ${formatDate(basicInfo.endDate)}`
            : 'No dates specified'}
        </p>
      </div>
    </div>
  );
};

export default PDFGenerator;
