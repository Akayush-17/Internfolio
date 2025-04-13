import React from "react";
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

  const handleNext = () => {
    if (isLastStep) {
      submitForm();
    } else {
      nextStep();
    }
  };

  // Removed absolute positioning and the translate
  return (
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
  );
};

export default StepController;
