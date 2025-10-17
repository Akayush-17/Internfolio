import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useFormStore from '@/store/useFormStore';
import BasicInfo from './form-steps/basic-info';
import TechStack from './form-steps/tech-stack';
import Learning from './form-steps/learning';
import Projects from './form-steps/projects';
import Review from './form-steps/review';
import StepController from './step-controller';
import Image from 'next/image';
import { project, learning, review } from '@/assets/assets';
import {
  CheckIcon,
  UserIcon,
  CodeIcon,
  MenuIcon,
  CheckCircleIcon,
  ViewIcon,
  XIcon
} from 'lucide-react';

const FormLayout: React.FC = () => {
  const { currentStep, isComplete, goToStep, totalSteps } = useFormStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(false);

  // Check if we're on desktop when component mounts (client-side only)
  React.useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    // Initial check
    checkIfDesktop();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfDesktop);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfDesktop);
  }, []);

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
              <CheckIcon className="w-16 h-16 text-green-600" />
            </div>
          </div>
          <h1 className="mb-6 text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-600">
            Thank You!
          </h1>
          <p className="text-xl text-center text-gray-700 mb-8">
            Your Internship work has been submitted successfully.
          </p>
          <div className="flex justify-center mt-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                useFormStore.getState().resetForm();
                window.location.href = '/portfolio';
              }}
              className="px-8 py-3 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg flex items-center space-x-2"
            >
              <ViewIcon className="w-5 h-5" />
              <span>View Portfolio</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const formSteps = [
    {
      id: 1,
      label: 'Your details',
      description: 'Please provide your name and email',
      icon: <UserIcon className="w-5 h-5" />
    },
    {
      id: 2,
      label: 'Tech Stack',
      description: 'Select your programming languages and tools',
      icon: <CodeIcon className="w-5 h-5" />
    },
    {
      id: 3,
      label: 'Your Projects',
      description: 'Showcase your development projects',
      icon: <Image src={project} alt="" className="w-5 h-5" />
    },
    {
      id: 4,
      label: 'Learning & Growth',
      description: "What you're learning and interested in",
      icon: <Image src={learning} alt="" className="w-5 h-5" />
    },
    {
      id: 5,
      label: 'Review',
      description: 'Review and submit your profile',
      icon: <Image src={review} alt="" className="w-5 h-5" />
    }
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
      {/* Mobile sidebar toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-white shadow-lg text-gray-700 hover:bg-gray-100"
      >
        {sidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>

      {/* Sidebar Navigation - fixed width on desktop, slide in/out on mobile */}
      <motion.div
        className="fixed md:static md:w-80 h-full bg-gradient-to-br from-white to-blue-50 border-r border-gray-200 p-8 shadow-xl overflow-y-auto overflow-x-hidden flex-shrink-0 z-40"
        initial={{ x: -320 }}
        animate={{
          x: sidebarOpen || isDesktop ? 0 : -320
        }}
        transition={{ duration: 0.3 }}
        style={{ width: '320px' }}
      >
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Internships Details</h2>
          <p className="text-sm text-gray-500">Complete your profile details</p>

          {/* Progress bar with animation */}
          <div className="mt-6 mb-8">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
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
                    step.id <= currentStep ? '' : 'opacity-60 pointer-events-none'
                  }`}
                  animate={{
                    x: isActive ? 8 : 0,
                    opacity: isActive ? 1 : 0.8,
                    scale: isActive ? 1.05 : 1
                  }}
                  whileHover={step.id <= currentStep ? { x: 4, opacity: 1 } : {}}
                  transition={{ duration: 0.3 }}
                  onClick={() => step.id <= currentStep && goToStep(step.id)}
                >
                  <div className="mr-4 flex-shrink-0 mt-1 z-10">
                    <motion.div
                      className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                        isCompleted
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 border-blue-500 text-white'
                          : isActive
                            ? 'border-blue-500 text-blue-600'
                            : 'border-gray-300 bg-white'
                      }`}
                      animate={{
                        boxShadow: isActive
                          ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                          : isCompleted
                            ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            : 'none'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {isCompleted ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        step.icon || <span className="text-sm font-medium">{step.id}</span>
                      )}
                    </motion.div>
                  </div>
                  <div>
                    <motion.p
                      className={`text-base font-semibold mb-1 ${
                        isActive ? 'text-blue-600' : 'text-gray-900'
                      }`}
                      animate={{
                        color: isActive ? 'rgb(37, 99, 235)' : 'rgb(17, 24, 39)'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.label}
                    </motion.p>
                    <p className="text-sm text-gray-500 pr-4">{step.description}</p>
                  </div>
                </motion.div>

                {!isLast && (
                  <motion.div
                    className="absolute left-5 top-12 bottom-0 w-0.5 h-12 -ml-0.5"
                    initial={{ backgroundColor: 'rgb(229, 231, 235)' }}
                    animate={{
                      backgroundColor: isCompleted ? 'rgb(37, 99, 235)' : 'rgb(229, 231, 235)'
                    }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content - fixed height with controlled overflow */}
      <div className="flex-1 h-full flex flex-col relative overflow-hidden">
        {/* Content container - takes remaining height with controlled overflow */}
        <div className="flex-1 p-6 overflow-hidden flex justify-center">
          <motion.div
            className="w-full max-w-4xl bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden"
            layout
            transition={{ layout: { duration: 0.3, ease: 'easeOut' } }}
          >
            {/* Form header - always visible */}
            <div className="p-8 border-b border-gray-200">
              <motion.div className="flex flex-col md:flex-row md:items-center" layout="position">
                {/* Step indicator - visible on all screens but styled differently */}
                <div className="flex items-center mb-3 md:mb-0">
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
                  <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-md md:hidden">
                    Step {currentStep} of {totalSteps}
                  </span>
                </div>

                <motion.h1
                  className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600"
                  layout
                  key={`title-${currentStep}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {formSteps.find((step) => step.id === currentStep)?.label || 'Your details'}
                </motion.h1>
              </motion.div>
            </div>

            {/* Form content - scrollable area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
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
        <div className="p-1 md:p-6 absolute w-full justify-between items-end mt-10 md:mt-0">
          <StepController />
        </div>
      </div>
    </div>
  );
};

export default FormLayout;
