import React from "react";
import useFormStore from "@/store/useFormStore";

const Learning: React.FC = () => {
  const { formData, updateLearning } = useFormStore();
  const { learning } = formData;

  // Helper function to handle array updates
  const handleArrayUpdate = (field: keyof typeof learning, value: string) => {
    const currentArray = (learning[field] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];

    updateLearning({ [field]: newArray } as any);
  };

  // Helper function to handle text input updates
  const handleTextUpdate = (field: keyof typeof learning, value: string) => {
    updateLearning({ [field]: value } as any);
  };

  // Learning options
  const learningOptions = [
    "Machine Learning",
    "Blockchain",
    "Web3",
    "Mobile Development",
    "Cloud Computing",
    "DevOps",
    "UI/UX Design",
    "Data Science",
    "Cybersecurity",
  ];

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Learning & Growth</h2>

      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-lg font-medium">
            What are you currently learning?
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {learningOptions.map((option) => (
              <div key={`learning-${option}`} className="flex items-center">
                <input
                  type="checkbox"
                  id={`learning-${option}`}
                  checked={learning.currentlyLearning.includes(option)}
                  onChange={() =>
                    handleArrayUpdate("currentlyLearning", option)
                  }
                  className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`learning-${option}`}>{option}</label>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <input
              type="text"
              placeholder="Other (please specify)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  handleArrayUpdate(
                    "currentlyLearning",
                    e.currentTarget.value.trim()
                  );
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium">
            What are you interested in learning next?
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {learningOptions.map((option) => (
              <div key={`interested-${option}`} className="flex items-center">
                <input
                  type="checkbox"
                  id={`interested-${option}`}
                  checked={learning.interestedIn.includes(option)}
                  onChange={() => handleArrayUpdate("interestedIn", option)}
                  className="w-4 h-4 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`interested-${option}`}>{option}</label>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <input
              type="text"
              placeholder="Other (please specify)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  handleArrayUpdate(
                    "interestedIn",
                    e.currentTarget.value.trim()
                  );
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium">Technical Learnings</h3>
          <p className="mb-2 text-sm text-gray-600">
            Describe new frameworks, tools, or patterns you&apos;ve learned
          </p>
          <textarea
            value={learning.technicalLearnings || ""}
            onChange={(e) =>
              handleTextUpdate("technicalLearnings", e.target.value)
            }
            placeholder="e.g., Learned React hooks for state management, Implemented CI/CD pipelines with GitHub Actions"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium">Soft Skills Learned</h3>
          <p className="mb-2 text-sm text-gray-600">
            Describe communication, teamwork, or other soft skills you&apos;ve
            developed
          </p>
          <textarea
            value={learning.softSkills || ""}
            onChange={(e) => handleTextUpdate("softSkills", e.target.value)}
            placeholder="e.g., Improved communication skills through daily standups, Developed time management skills by handling multiple tasks"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium">Cross-Team Collaboration</h3>
          <p className="mb-2 text-sm text-gray-600">
            Describe any collaboration with other teams or departments
          </p>
          <textarea
            value={learning.crossTeamCollaboration || ""}
            onChange={(e) =>
              handleTextUpdate("crossTeamCollaboration", e.target.value)
            }
            placeholder="e.g., Worked with the design team to implement UI components, Collaborated with QA to resolve testing issues"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default Learning;
