import React, { useState } from 'react';
import PDFGenerator from './index';

interface PDFExportButtonProps {
  className?: string;
}

const PDFExportButton: React.FC<PDFExportButtonProps> = ({ className }) => {
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  
  return (
    <>
      <button
        onClick={() => setShowPdfPreview(true)}
        className={`flex items-center md:gap-2 gap-1 bg-white text-black px-4 py-2 rounded-full border border-gray-200 font-medium transition-all duration-200 hover:bg-gray-50 ${className || ''}`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <span className='md:block hidden' >  View Report</span>
        <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:hidden block"
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
      
      </button>
      
      {showPdfPreview && (
        <PDFGenerator onClose={() => setShowPdfPreview(false)} />
      )}
    </>
  );
};

export default PDFExportButton;