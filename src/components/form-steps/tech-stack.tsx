import React, { useState, useCallback } from "react";
import useFormStore from "@/store/useFormStore";
import { TechStack } from "@/types";
import useAuthStore from "@/store/auth";
import { showToast } from "@/components/ui/toast";
import { useGitHubStore } from "@/store/githubStore";
import { apiService } from "@/services/api";

const TechStackComp: React.FC = () => {
  const { formData, updateTechStack } = useFormStore();
  const { techStack } = formData;
  const { user } = useAuthStore();
  const { 
    data: githubData, 
    setRepositories, 
    setLanguages, 
    setFrameworks,
    setTools,
    setLoading, 
    setError, 
    isDataStale 
  } = useGitHubStore();

  const [languageInput, setLanguageInput] = useState("");
  const [frameworkInput, setFrameworkInput] = useState("");
  const [toolInput, setToolInput] = useState("");
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(false);
  const [isLoadingFrameworks, setIsLoadingFrameworks] = useState(false);
  const [isLoadingTools, setIsLoadingTools] = useState(false);
  const [isLoadingAdditionalInfo, setIsLoadingAdditionalInfo] = useState(false);

  const handleAddTag = useCallback((field: keyof typeof techStack, value: string) => {
    if (!value.trim()) return;

    const normalizedValue = value.trim();
    const currentValues = techStack[field] as string[];
    if (!currentValues.includes(normalizedValue)) {
      updateTechStack({
        [field]: [...currentValues, normalizedValue],
      } as Partial<TechStack>);
    }
  }, [techStack, updateTechStack]);

  const handleRemoveTag = useCallback((field: keyof typeof techStack, value: string) => {
    const currentValues = techStack[field] as string[];
    updateTechStack({
      [field]: currentValues.filter((item) => item !== value),
    } as Partial<TechStack>);
  }, [techStack, updateTechStack]);

  const handleKeyPress = useCallback((
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
  }, [handleAddTag]);

  const handleFieldChange = useCallback((
    field: keyof typeof techStack,
    value: string | number
  ) => {
    updateTechStack({ [field]: value } as Partial<TechStack>);
  }, [updateTechStack]);

  const fetchGitHubData = useCallback(async () => {
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

      const currentFrameworks = techStack.frameworks;
      const newFrameworks = githubData.frameworks.filter(framework => !currentFrameworks.includes(framework));
      
      if (newFrameworks.length > 0) {
        updateTechStack({
          frameworks: [...currentFrameworks, ...newFrameworks]
        } as Partial<TechStack>);
      }

      const currentTools = techStack.tools;
      const newTools = githubData.tools.filter(tool => !currentTools.includes(tool));
      
      if (newTools.length > 0) {
        updateTechStack({
          tools: [...currentTools, ...newTools]
        } as Partial<TechStack>);
      }

      updateTechStack({
        contributions: githubData.repositories.length
      } as Partial<TechStack>);

      showToast(`Loaded ${newLanguages.length} languages, ${newFrameworks.length} frameworks, and ${newTools.length} tools from ${githubData.repositories.length} repositories!`, 'success');
      return;
    }

    setIsLoadingGitHub(true);
    setLoading(true);
    setError(null);

    try {
      const repositoriesResult = await apiService.getRepositories();
      
      if (!repositoriesResult.success) {
        showToast(repositoriesResult.error || "Failed to fetch repositories", 'error');
        setError(repositoriesResult.error || "Failed to fetch repositories");
        return;
      }

      if (repositoriesResult.data && repositoriesResult.data.length > 0) {
        const repositories = repositoriesResult.data;
        setRepositories(repositories);

        const allLanguages = await apiService.getAllLanguagesForRepositories(repositories);
        setLanguages(allLanguages);

        const frameworksResult = await apiService.getFrameworks();
        if (frameworksResult.success && frameworksResult.data) {
          setFrameworks(frameworksResult.data.frameworks);
        }

        const toolsResult = await apiService.getTools();
        if (toolsResult.success && toolsResult.data) {
          setTools(toolsResult.data.tools);
        }

        const sortedLanguages = Object.entries(allLanguages)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 10)
          .map(([language]) => language);

        const currentLanguages = techStack.languages;
        const newLanguages = sortedLanguages.filter(lang => !currentLanguages.includes(lang));
        
        if (newLanguages.length > 0) {
          updateTechStack({
            languages: [...currentLanguages, ...newLanguages]
          } as Partial<TechStack>);
        }

        const currentFrameworks = techStack.frameworks;
        const frameworks = githubData.frameworks && githubData.frameworks.length > 0 ? githubData.frameworks : [];
        const newFrameworks = frameworks.filter(framework => !currentFrameworks.includes(framework));
        
        if (newFrameworks.length > 0) {
          updateTechStack({
            frameworks: [...currentFrameworks, ...newFrameworks]
          } as Partial<TechStack>);
        }

        const currentTools = techStack.tools;
        const tools = githubData.tools && githubData.tools.length > 0 ? githubData.tools : [];
        const newTools = tools.filter(tool => !currentTools.includes(tool));
        
        if (newTools.length > 0) {
          updateTechStack({
            tools: [...currentTools, ...newTools]
          } as Partial<TechStack>);
        }

        updateTechStack({
          contributions: repositories.length
        } as Partial<TechStack>);

        showToast(`Fetched ${newLanguages.length} languages, ${newFrameworks.length} frameworks, and ${newTools.length} tools from ${repositories.length} repositories!`, 'success');
      }
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
      showToast("Failed to fetch GitHub data. Please try again.", 'error');
      setError("Failed to fetch GitHub data");
    } finally {
      setIsLoadingGitHub(false);
      setLoading(false);
    }
  }, [user, isDataStale, githubData, techStack, updateTechStack, setRepositories, setLanguages, setFrameworks, setTools, setLoading, setError]);

  const fetchFrameworksData = useCallback(async () => {
    if (!user) {
      showToast("Please sign in to fetch GitHub data.", 'error');
      return;
    }

    if (!isDataStale() && githubData.frameworks && githubData.frameworks.length > 0) {
      const currentFrameworks = techStack.frameworks;
      const newFrameworks = githubData.frameworks.filter((framework: string) => !currentFrameworks.includes(framework));
      
      if (newFrameworks.length > 0) {
        updateTechStack({
          frameworks: [...currentFrameworks, ...newFrameworks]
        } as Partial<TechStack>);
      }

      showToast(`Loaded ${newFrameworks.length} frameworks from GitHub!`, 'success');
      return;
    }

    setIsLoadingFrameworks(true);
    setLoading(true);
    setError(null);

    try {
      const frameworksResult = await apiService.getFrameworks();
      
      if (!frameworksResult.success) {
        showToast(frameworksResult.error || "Failed to fetch frameworks", 'error');
        setError(frameworksResult.error || "Failed to fetch frameworks");
        return;
      }

      if (frameworksResult.data) {
        const frameworks = frameworksResult.data.frameworks;
        setFrameworks(frameworks);

        const currentFrameworks = techStack.frameworks;
        const newFrameworks = frameworks.filter((framework: string) => !currentFrameworks.includes(framework));
        
        if (newFrameworks.length > 0) {
          updateTechStack({
            frameworks: [...currentFrameworks, ...newFrameworks]
          } as Partial<TechStack>);
        }

        showToast(`Fetched ${newFrameworks.length} frameworks from GitHub!`, 'success');
      }
    } catch (error) {
      console.error("Error fetching frameworks:", error);
      showToast("Failed to fetch frameworks. Please try again.", 'error');
      setError("Failed to fetch frameworks");
    } finally {
      setIsLoadingFrameworks(false);
      setLoading(false);
    }
  }, [user, isDataStale, githubData, techStack, updateTechStack, setFrameworks, setLoading, setError]);

  const fetchToolsData = useCallback(async () => {
    if (!user) {
      showToast("Please sign in to fetch GitHub data.", 'error');
      return;
    }

    if (!isDataStale() && githubData.tools && githubData.tools.length > 0) {
      const currentTools = techStack.tools;
      const newTools = githubData.tools.filter((tool: string) => !currentTools.includes(tool));
      
      if (newTools.length > 0) {
        updateTechStack({
          tools: [...currentTools, ...newTools]
        } as Partial<TechStack>);
      }

      showToast(`Loaded ${newTools.length} tools from GitHub!`, 'success');
      return;
    }

    setIsLoadingTools(true);
    setLoading(true);
    setError(null);

    try {
      const toolsResult = await apiService.getTools();
      
      if (!toolsResult.success) {
        showToast(toolsResult.error || "Failed to fetch tools", 'error');
        setError(toolsResult.error || "Failed to fetch tools");
        return;
      }

      if (toolsResult.data) {
        const tools = toolsResult.data.tools;
        setTools(tools);

        const currentTools = techStack.tools;
        const newTools = tools.filter((tool: string) => !currentTools.includes(tool));
        
        if (newTools.length > 0) {
          updateTechStack({
            tools: [...currentTools, ...newTools]
          } as Partial<TechStack>);
        }

        showToast(`Fetched ${newTools.length} tools from GitHub!`, 'success');
      }
    } catch (error) {
      console.error("Error fetching tools:", error);
      showToast("Failed to fetch tools. Please try again.", 'error');
      setError("Failed to fetch tools");
    } finally {
      setIsLoadingTools(false);
      setLoading(false);
    }
  }, [user, isDataStale, githubData, techStack, updateTechStack, setTools, setLoading, setError]);

  const fetchAdditionalInfoData = useCallback(async () => {
    if (!user) {
      showToast("Please sign in to fetch GitHub data.", 'error');
      return;
    }

    if (!githubData.repositories || githubData.repositories.length === 0) {
      showToast("Please fetch repositories first by clicking 'Fetch from GitHub' in Programming Languages section.", 'info');
      return;
    }

    setIsLoadingAdditionalInfo(true);
    setLoading(true);
    setError(null);

    try {
      const githubUserResult = await apiService.getCurrentGitHubUser();
      
      if (!githubUserResult.success || !githubUserResult.data?.login) {
        showToast("Failed to fetch GitHub username", 'error');
        setError("Failed to fetch GitHub username");
        return;
      }

      const username = githubUserResult.data.login;

      const repositories = githubData.repositories.map(repo => ({
        owner: repo.full_name.split('/')[0],
        name: repo.name
      }));

      const startDate = formData.basicInfo?.startDate;
      const endDate = formData.basicInfo?.endDate;

      const contributionsResult = await apiService.getContributions(
        repositories,
        startDate,
        endDate,
        username
      );
      
      if (!contributionsResult.success) {
        showToast(contributionsResult.error || "Failed to fetch contributions data", 'error');
        setError(contributionsResult.error || "Failed to fetch contributions data");
        return;
      }

      if (contributionsResult.data && contributionsResult.data.totals) {
        const { totalCommits, totalLinesOfCode } = contributionsResult.data.totals;

        updateTechStack({
          commits: totalCommits.toString(),
          linesOfCode: totalLinesOfCode
        } as Partial<TechStack>);

        showToast(`Fetched ${totalCommits} commits and ${totalLinesOfCode} lines of code from GitHub!`, 'success');
      }
    } catch (error) {
      console.error("Error fetching additional info:", error);
      showToast("Failed to fetch additional information. Please try again.", 'error');
      setError("Failed to fetch additional information");
    } finally {
      setIsLoadingAdditionalInfo(false);
      setLoading(false);
    }
  }, [user, githubData, formData, updateTechStack, setLoading, setError]);

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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium">Frameworks & Libraries</h3>
            <button
              onClick={fetchFrameworksData}
              disabled={isLoadingFrameworks || githubData.isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {(isLoadingFrameworks || githubData.isLoading) ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Fetching...
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
            <button
              onClick={fetchToolsData}
              disabled={isLoadingTools}
              className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-md transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                {isLoadingTools ? "Loading..." : "Fetch from GitHub"}
              </span>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium">Additional Information</h3>
            <button
              onClick={fetchAdditionalInfoData}
              disabled={isLoadingAdditionalInfo || githubData.isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {(isLoadingAdditionalInfo || githubData.isLoading) ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Fetching...
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
