import React, { useState } from "react";
import useFormStore from "@/store/useFormStore";
import { TechStack } from "@/types";

const TechStackComp: React.FC = () => {
  const { formData, updateTechStack } = useFormStore();
  const { techStack } = formData;

  // State for tag input fields
  const [languageInput, setLanguageInput] = useState("");
  const [frameworkInput, setFrameworkInput] = useState("");
  const [toolInput, setToolInput] = useState("");

  // Handle adding a new tag
  const handleAddTag = (field: keyof typeof techStack, value: string) => {
    if (!value.trim()) return;

    const normalizedValue = value.trim();
    const currentValues = techStack[field] as string[];
    if (!currentValues.includes(normalizedValue)) {
      updateTechStack({
        [field]: [...currentValues, normalizedValue],
      } as Partial<TechStack>);
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (field: keyof typeof techStack, value: string) => {
    const currentValues = techStack[field] as string[];
    updateTechStack({
      [field]: currentValues.filter((item) => item !== value),
    } as Partial<TechStack>);
  };

  // Handle key press in tag inputs
  const handleKeyPress = (
    e: React.KeyboardEvent,
    field: keyof typeof techStack,
    value: string,
    setInput: (value: string) => void
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(field, value);
      setInput("");
    }
  };

  // Handle other text area change
  const handleOtherChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateTechStack({ other: e.target.value });
  };

  return (
    <div>
      

      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-lg font-medium">Programming Languages</h3>
          <div className="mb-2">
            <div className="flex">
              <input
                type="text"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                onKeyDown={(e) =>
                  handleKeyPress(
                    e,
                    "languages",
                    languageInput,
                    setLanguageInput
                  )
                }
                placeholder="Type and press Enter to add (e.g., JavaScript, Python)"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                onClick={() => {
                  handleAddTag("languages", languageInput);
                  setLanguageInput("");
                }}
                className="ml-2 w-10 h-10 flex items-center justify-center text-white rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-md"
              >
                +
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Press Enter or comma to add
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {techStack.languages.map((lang) => (
                <div
                  key={lang}
                  className="bg-blue-100 px-3 py-1 rounded-full flex items-center"
                >
                  <span>{lang}</span>
                  <button
                    onClick={() => handleRemoveTag("languages", lang)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium">Frameworks & Libraries</h3>
          <div className="mb-2">
            <div className="flex">
              <input
                type="text"
                value={frameworkInput}
                onChange={(e) => setFrameworkInput(e.target.value)}
                onKeyDown={(e) =>
                  handleKeyPress(
                    e,
                    "frameworks",
                    frameworkInput,
                    setFrameworkInput
                  )
                }
                placeholder="Type and press Enter to add (e.g., React, Next.js)"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                onClick={() => {
                  handleAddTag("frameworks", frameworkInput);
                  setFrameworkInput("");
                }}
                className="ml-2 w-10 h-10 p-1 flex items-center justify-center text-white rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-md"
              >
                +
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Press Enter or comma to add
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {techStack.frameworks.map((framework) => (
                <div
                  key={framework}
                  className="bg-blue-100 px-3 py-1 rounded-full flex items-center"
                >
                  <span>{framework}</span>
                  <button
                    onClick={() => handleRemoveTag("frameworks", framework)}
                    className="ml-2 text-green-500 hover:text-green-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium">Tools & Platforms</h3>
          <div className="mb-2">
            <div className="flex">
              <input
                type="text"
                value={toolInput}
                onChange={(e) => setToolInput(e.target.value)}
                onKeyDown={(e) =>
                  handleKeyPress(e, "tools", toolInput, setToolInput)
                }
                placeholder="Type and press Enter to add (e.g., GitHub, Docker, AWS)"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                onClick={() => {
                  handleAddTag("tools", toolInput);
                  setToolInput("");
                }}
                className="ml-2 w-10 h-10 p-1 flex items-center justify-center text-white rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-md"
              >
                +
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Press Enter or comma to add
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {techStack.tools.map((tool) => (
                <div
                  key={tool}
                  className="bg-blue-100 px-3 py-1 rounded-full flex items-center"
                >
                  <span>{tool}</span>
                  <button
                    onClick={() => handleRemoveTag("tools", tool)}
                    className="ml-2 text-purple-500 hover:text-purple-700"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium">Other (Optional)</h3>
          <textarea
            value={techStack.other || ""}
            onChange={handleOtherChange}
            placeholder="Any other technologies or skills not covered above"
            className="w-full p-2 border border-gray-300 rounded h-24"
          />
        </div>
      </div>
    </div>
  );
};

export default TechStackComp;
