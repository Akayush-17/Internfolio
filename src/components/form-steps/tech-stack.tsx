import React, { useState } from "react";
import useFormStore from "@/store/useFormStore";
import { TechStack } from "@/types";
import useAuthStore from "@/store/auth";
import { supabase } from "@/store/auth";
import { showToast } from "@/components/ui/toast";
import { useGitHubStore } from "@/store/githubStore";

const TechStackComp: React.FC = () => {
  const { formData, updateTechStack } = useFormStore();
  const { techStack } = formData;
  const { user } = useAuthStore();
  const { 
    data: githubData, 
    setRepositories, 
    setLanguages, 
    setLoading, 
    setError, 
    isDataStale 
  } = useGitHubStore();

  const [languageInput, setLanguageInput] = useState("");
  const [frameworkInput, setFrameworkInput] = useState("");
  const [toolInput, setToolInput] = useState("");
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(false);

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

  const handleRemoveTag = (field: keyof typeof techStack, value: string) => {
    const currentValues = techStack[field] as string[];
    updateTechStack({
      [field]: currentValues.filter((item) => item !== value),
    } as Partial<TechStack>);
  };

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

  const handleFieldChange = (
    field: keyof typeof techStack,
    value: string | number
  ) => {
    updateTechStack({ [field]: value } as Partial<TechStack>);
  };

  const fetchGitHubData = async () => {
    if (!user) {
      showToast("Please sign in to fetch GitHub data.", 'error');
      return;
    }

    if (!isDataStale() && githubData.repositories.length > 0) {
      const sortedLanguages = Object.entries(githubData.languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([language]) => language);

      const currentLanguages = techStack.languages;
      const newLanguages = sortedLanguages.filter(lang => !currentLanguages.includes(lang));
      
      if (newLanguages.length > 0) {
        updateTechStack({
          languages: [...currentLanguages, ...newLanguages]
        } as Partial<TechStack>);
      }

      updateTechStack({
        contributions: githubData.repositories.length
      } as Partial<TechStack>);

      showToast(`Loaded ${newLanguages.length} new languages from ${githubData.repositories.length} cached repositories!`, 'success');
      return;
    }

    setIsLoadingGitHub(true);
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.provider_token) {
        showToast("GitHub token not found. Please sign in with GitHub (not Google) to use this feature.", 'error');
        setError("GitHub token not found");
        return;
      }

      const response = await fetch("/api/github/repositories", {
        headers: {
          "Authorization": `Bearer ${session.provider_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }

      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        const repositories = data.data;
        setRepositories(repositories);

        const languagePromises = repositories.map(async (repo: any) => {
          try {
            const langResponse = await fetch("/api/github/languages", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${session.provider_token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                repositories: [{ owner: repo.owner.login, name: repo.name }]
              }),
            });
            
            if (langResponse.ok) {
              const langData = await langResponse.json();
              return langData.data?.languages || {};
            }
            return {};
          } catch (error) {
            return {};
          }
        });

        const languageResults = await Promise.all(languagePromises);
        const allLanguages: { [key: string]: number } = {};
        
        languageResults.forEach(languages => {
          Object.entries(languages).forEach(([language, bytes]) => {
            allLanguages[language] = (allLanguages[language] || 0) + (bytes as number);
          });
        });

        setLanguages(allLanguages);

        const sortedLanguages = Object.entries(allLanguages)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([language]) => language);

        const currentLanguages = techStack.languages;
        const newLanguages = sortedLanguages.filter(lang => !currentLanguages.includes(lang));
        
        if (newLanguages.length > 0) {
          updateTechStack({
            languages: [...currentLanguages, ...newLanguages]
          } as Partial<TechStack>);
        }

        updateTechStack({
          contributions: repositories.length
        } as Partial<TechStack>);

        showToast(`Fetched ${newLanguages.length} new languages from ${repositories.length} repositories!`, 'success');
      }
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
      showToast("Failed to fetch GitHub data. Please try again.", 'error');
      setError("Failed to fetch GitHub data");
    } finally {
      setIsLoadingGitHub(false);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium">Programming Languages</h3>
            <button
              onClick={fetchGitHubData}
              disabled={isLoadingGitHub || githubData.isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {(isLoadingGitHub || githubData.isLoading) ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Fetching...
                </>
              ) : !isDataStale() && githubData.repositories.length > 0 ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Use Cached Data
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Fetch from GitHub
                </>
              )}
            </button>
          </div>
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
          <h3 className="mb-3 text-lg font-medium">Additional Information</h3>
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="commits"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Commits
                </label>
                <input
                  id="commits"
                  type="text"
                  value={techStack.commits || ""}
                  onChange={(e) => handleFieldChange("commits", e.target.value)}
                  placeholder="Commits"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="features"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Features
                </label>
                <input
                  id="features"
                  type="text"
                  value={techStack.features || ""}
                  onChange={(e) =>
                    handleFieldChange("features", e.target.value)
                  }
                  placeholder="Features"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="linesOfCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Lines of Code
                </label>
                <input
                  id="linesOfCode"
                  type="number"
                  value={techStack.linesOfCode || ""}
                  onChange={(e) =>
                    handleFieldChange("linesOfCode", Number(e.target.value))
                  }
                  placeholder="Lines of Code"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="contributions"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Total Repository 
                </label>
                <input
                  id="contributions"
                  type="number"
                  value={techStack.contributions || ""}
                  onChange={(e) =>
                    handleFieldChange("contributions", e.target.value)
                  }
                  placeholder="Contributions"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="other"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Other
                </label>
                <input
                  id="other"
                  type="text"
                  value={techStack.other || ""}
                  onChange={(e) => handleFieldChange("other", e.target.value)}
                  placeholder="Other"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStackComp;
