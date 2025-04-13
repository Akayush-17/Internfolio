import React, { useState } from "react";
import { motion } from "framer-motion";
import useFormStore from "@/store/useFormStore";
import useAuthStore from "@/store/auth";

const StepController: React.FC = () => {
  const {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    isSubmitting,
    submitForm,
  } = useFormStore();
  const { isAuthenticated } = useAuthStore();

  const isLastStep = currentStep === totalSteps;
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleNext = () => {
    if (isLastStep) {
      if (isAuthenticated) {
        submitForm();
      } else {
        // Show authentication modal if not authenticated
        setShowAuthModal(true);
      }
    } else {
      nextStep();
    }
  };

  // Close the auth modal
  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  // Removed absolute positioning and the translate
  return (
    <>
      <motion.div
        className="flex justify-between items-center w-full mt-8"
        layout
        transition={{ duration: 0.3 }}
      >
        {currentStep > 1 ? (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{
              scale: 1.1,
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
            whileTap={{
              scale: 0.95,
              boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
            }}
            transition={{ duration: 0.2 }}
            onClick={prevStep}
            className="w-12 h-12 flex items-center justify-center text-gray-700 bg-white rounded-full hover:bg-gray-100 shadow-md disabled:opacity-50 disabled:pointer-events-none z-10"
            disabled={isSubmitting}
            aria-label="Previous step"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.button>
        ) : (
          <div className="w-12" />
        )}

        <motion.button
          key={`next-button-${isLastStep ? "submit" : "next"}`}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{
            scale: 1.1,
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          }}
          whileTap={{
            scale: 0.95,
            boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
          }}
          transition={{ duration: 0.2 }}
          onClick={handleNext}
          className={`w-12 h-12 flex items-center justify-center text-white rounded-full shadow-md disabled:opacity-50 disabled:pointer-events-none z-10 ${
            isLastStep
              ? "bg-gradient-to-r from-green-500 to-emerald-600"
              : "bg-gradient-to-r from-blue-500 to-indigo-600"
          }`}
          disabled={isSubmitting}
          aria-label={isLastStep ? "Submit form" : "Next step"}
        >
          {isSubmitting ? (
            <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : isLastStep ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </motion.button>
      </motion.div>

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
                className="flex items-center justify-center bg-white border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50 transition-colors"
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
                className="flex items-center justify-center bg-gray-900 text-white rounded-md py-2 px-4 hover:bg-gray-800 transition-colors"
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
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default StepController;
