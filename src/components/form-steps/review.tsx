import React, { useState, useEffect } from "react";
import useFormStore from "@/store/useFormStore";
import useAuthStore from "@/store/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const Review: React.FC = () => {
  const { formData, goToStep } = useFormStore();
  const { basicInfo, techStack, learning, projects } = formData;
  const { isAuthenticated, signInWithGoogle, signInWithGithub } =
    useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      // Show auth dialog
      setShowAuthModal(true);
      return;
    }

    setIsSubmitting(true);

    // Here you would submit the form data to your backend
    // For now, we'll just simulate a submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Redirect to portfolio page
    router.push("/portfolio");
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Review Your Information</h2>

      <div className="space-y-6">
        {/* Basic Info Section */}
        <div className="p-4 border border-gray-300 rounded-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <button
              onClick={() => goToStep(1)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">Name:</div>
            <div>{basicInfo.fullName || "Not provided"}</div>

            <div className="font-medium">Email:</div>
            <div>{basicInfo.email || "Not provided"}</div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="p-4 border border-gray-300 rounded-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Tech Stack</h3>
            <button
              onClick={() => goToStep(2)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          </div>

          <div className="mb-2">
            <div className="font-medium">Languages:</div>
            <div>
              {techStack.languages.length > 0
                ? techStack.languages.join(", ")
                : "None selected"}
            </div>
          </div>

          <div className="mb-2">
            <div className="font-medium">Frameworks & Libraries:</div>
            <div>
              {techStack.frameworks.length > 0
                ? techStack.frameworks.join(", ")
                : "None selected"}
            </div>
          </div>

          <div>
            <div className="font-medium">Tools & Platforms:</div>
            <div>
              {techStack.tools.length > 0
                ? techStack.tools.join(", ")
                : "None selected"}
            </div>
          </div>
        </div>

        {/* Learning Section */}
        <div className="p-4 border border-gray-300 rounded-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Learning & Growth</h3>
            <button
              onClick={() => goToStep(3)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          </div>

          <div className="mb-2">
            <div className="font-medium">Currently Learning:</div>
            <div>
              {learning.currentlyLearning.length > 0
                ? learning.currentlyLearning.join(", ")
                : "None selected"}
            </div>
          </div>

          <div>
            <div className="font-medium">Interested In Learning:</div>
            <div>
              {learning.interestedIn.length > 0
                ? learning.interestedIn.join(", ")
                : "None selected"}
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="p-4 border border-gray-300 rounded-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Projects</h3>
            <button
              onClick={() => goToStep(4)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          </div>

          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">{project.title}</h4>
                  <p className="text-sm text-gray-700">{project.description}</p>

                  {project.technologies.length > 0 && (
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Technologies: </span>
                      <span>{project.technologies.join(", ")}</span>
                    </div>
                  )}

                  {project.link && (
                    <div className="mt-1 text-sm">
                      <span className="font-medium">Link: </span>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {project.link}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No projects added</p>
          )}
        </div>
      </div>

      {!isAuthenticated ? (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800 mb-3">
            Please sign in to submit your report.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={signInWithGoogle}
              className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="h-4 w-4 mr-2"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              Sign in with Google
            </Button>
            <Button
              onClick={signInWithGithub}
              className="bg-gray-800 text-white hover:bg-gray-900"
            >
              <svg
                className="h-4 w-4 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Sign in with GitHub
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </div>
      )}

      {/* Custom Auth Modal */}
      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Sign in to continue"
      >
        <div className="flex flex-col gap-4 py-2">
          <p className="text-sm text-gray-600">
            Please sign in with one of the following providers to submit your
            portfolio:
          </p>
          <button
            onClick={() => {
              signInWithGoogle();
              setShowAuthModal(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="h-4 w-4"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
          <button
            onClick={() => {
              signInWithGithub();
              setShowAuthModal(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-800 text-white hover:bg-gray-900 rounded"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>Sign in with GitHub</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Review;
