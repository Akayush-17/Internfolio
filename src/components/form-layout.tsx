import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import useFormStore from "@/store/useFormStore";
import BasicInfo from "./form-steps/basic-info";
import TechStack from "./form-steps/tech-stack";
import Learning from "./form-steps/learning";
import Projects from "./form-steps/projects";
import Review from "./form-steps/review";
import StepController from "./step-controller";

const FormLayout: React.FC = () => {
  const { currentStep, isComplete, goToStep, totalSteps } = useFormStore();

  // If form is complete, show a success message
  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl p-10 bg-white rounded-2xl shadow-2xl"
        >
          <div className="flex justify-center mb-8">
            <div className="p-5 bg-green-100 rounded-full shadow-inner animate-pulse">
              <svg
                className="w-16 h-16 text-green-600"
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
            </div>
          </div>
          <h1 className="mb-6 text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-600">
            Thank You!
          </h1>
          <p className="text-xl text-center text-gray-700 mb-8">
            Your developer profile has been submitted successfully.
          </p>
          <div className="flex justify-center mt-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => useFormStore.getState().resetForm()}
              className="px-8 py-3 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Start Over</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const formSteps = [
    {
      id: 1,
      label: "Your details",
      description: "Please provide your name and email",
      icon: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: 2,
      label: "Tech Stack",
      description: "Select your programming languages and tools",
      icon: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: 3,
      label: "Your Projects",
      description: "Showcase your development projects",
      icon: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      ),
    },
    {
      id: 4,
      label: "Learning & Growth",
      description: "What you're learning and interested in",
      icon: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
      ),
    },
    {
      id: 5,
      label: "Review",
      description: "Review and submit your profile",
      icon: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  // Map current form steps to our new vertical sidebar structure
  const getCurrentFormContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfo />;
      case 2:
        return <TechStack />;
      case 3:
        return <Projects />;
      case 4:
        return <Learning />;
      case 5:
        return <Review />;
      default:
        return <BasicInfo />;
    }
  };

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    // Fixed height container with no overflow
    <div className="flex h-screen bg-gray-50 w-full overflow-hidden">
      {/* Sidebar Navigation - fixed width, height 100% of viewport, with vertical scroll only */}
      <div className="w-80 h-full bg-gradient-to-br from-white to-blue-50 border-r border-gray-200 p-8 shadow-xl overflow-y-auto overflow-x-hidden flex-shrink-0">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Developer Profile
          </h2>
          <p className="text-sm text-gray-500">Complete your profile details</p>

          {/* Progress bar with animation */}
          <div className="mt-6 mb-8">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              ></motion.div>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-right">
              <motion.span
                key={currentStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {Math.round(progressPercentage)}% Complete
              </motion.span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {formSteps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            const isLast = index === formSteps.length - 1;

            return (
              <div key={step.id} className="relative">
                <motion.div
                  className={`flex cursor-pointer ${
                    step.id <= currentStep
                      ? ""
                      : "opacity-60 pointer-events-none"
                  }`}
                  animate={{
                    x: isActive ? 8 : 0,
                    opacity: isActive ? 1 : 0.8,
                    scale: isActive ? 1.05 : 1,
                  }}
                  whileHover={
                    step.id <= currentStep ? { x: 4, opacity: 1 } : {}
                  }
                  transition={{ duration: 0.3 }}
                  onClick={() => step.id <= currentStep && goToStep(step.id)}
                >
                  <div className="mr-4 flex-shrink-0 mt-1 z-10">
                    <motion.div
                      className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                        isCompleted
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-500 text-white"
                          : isActive
                          ? "border-blue-500 text-blue-600"
                          : "border-gray-300 bg-white"
                      }`}
                      animate={{
                        boxShadow: isActive
                          ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                          : isCompleted
                          ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                          : "none",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {isCompleted ? (
                        <motion.svg
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </motion.svg>
                      ) : (
                        step.icon || (
                          <span className="text-sm font-medium">{step.id}</span>
                        )
                      )}
                    </motion.div>
                  </div>
                  <div>
                    <motion.p
                      className={`text-base font-semibold mb-1 ${
                        isActive ? "text-blue-600" : "text-gray-900"
                      }`}
                      animate={{
                        color: isActive
                          ? "rgb(37, 99, 235)"
                          : "rgb(17, 24, 39)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.label}
                    </motion.p>
                    <p className="text-sm text-gray-500 pr-4">
                      {step.description}
                    </p>
                  </div>
                </motion.div>

                {!isLast && (
                  <motion.div
                    className="absolute left-5 top-12 bottom-0 w-0.5 h-12 -ml-0.5"
                    initial={{ backgroundColor: "rgb(229, 231, 235)" }}
                    animate={{
                      backgroundColor: isCompleted
                        ? "rgb(37, 99, 235)"
                        : "rgb(229, 231, 235)",
                    }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content - fixed height with controlled overflow */}
      <div className="flex-1 h-full flex flex-col relative overflow-hidden">
        {/* Fixed controller at top */}

        {/* Content container - takes remaining height with controlled overflow */}
        <div className="flex-1 p-6 overflow-hidden flex justify-center">
          <motion.div
            className="w-full max-w-4xl bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden"
            layout
            transition={{ layout: { duration: 0.3, ease: "easeOut" } }}
          >
            {/* Form header - always visible */}
            <div className="p-8 border-b border-gray-200">
              <motion.div className="flex items-center" layout="position">
                <motion.div
                  className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl mr-5 shadow-sm"
                  layout
                  key={`icon-${currentStep}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {formSteps.find((step) => step.id === currentStep)?.icon}
                </motion.div>
                <motion.h1
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600"
                  layout
                  key={`title-${currentStep}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {formSteps.find((step) => step.id === currentStep)?.label ||
                    "Your details"}
                </motion.h1>
              </motion.div>
            </div>

            {/* Form content - scrollable area */}
            <div className="flex-1 overflow-y-auto p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {getCurrentFormContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
        <div className="p-6 absolute w-full justify-between items-end">
          <StepController />
        </div>
      </div>
    </div>
  );
};

export default FormLayout;
