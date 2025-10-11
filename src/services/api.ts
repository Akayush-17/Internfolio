import { supabase } from "@/store/auth";

class ApiService {
  private async getAuthHeaders(): Promise<{ "Authorization": string; "Content-Type": string } | null> {
    const { data: { session } } = await supabase.auth.getSession();
    const githubToken = session?.provider_token;
    
    if (!githubToken) {
      return null;
    }

    return {
      "Authorization": `Bearer ${githubToken}`,
      "Content-Type": "application/json",
    };
  }

  async getRepositories() {
    try {
      const headers = await this.getAuthHeaders();
      if (!headers) {
        return {
          success: false,
          error: "GitHub token not found. Please sign in with GitHub."
        };
      }
      const response = await fetch("/api/github/repositories", {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch repositories: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching repositories:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch repositories"
      };
    }
  }

  async getLanguages(repositories: Array<{ owner: string; name: string }>) {
    try {
      const headers = await this.getAuthHeaders();
      if (!headers) {
        return {
          success: false,
          error: "GitHub token not found. Please sign in with GitHub."
        };
      }
      const response = await fetch("/api/github/languages", {
        method: "POST",
        headers,
        body: JSON.stringify({ repositories }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch languages: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching languages:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch languages"
      };
    }
  }

  async getFrameworks() {
    try {
      const headers = await this.getAuthHeaders();
      if (!headers) {
        return {
          success: false,
          error: "GitHub token not found. Please sign in with GitHub."
        };
      }
      const response = await fetch("/api/github/frameworks", {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch frameworks: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching frameworks:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch frameworks"
      };
    }
  }

  async getTools() {
    try {
      const headers = await this.getAuthHeaders();
      if (!headers) {
        return {
          success: false,
          error: "GitHub token not found. Please sign in with GitHub."
        };
      }
      const response = await fetch("/api/github/tools", {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tools: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching tools:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch tools"
      };
    }
  }

  async getRepositoryDetails(owner: string, repo: string) {
    try {
      const headers = await this.getAuthHeaders();
      if (!headers) {
        return {
          success: false,
          error: "GitHub token not found. Please sign in with GitHub."
        };
      }
      const response = await fetch(`/api/github/repository/${owner}/${repo}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch repository details: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching repository details:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch repository details"
      };
    }
  }

  async getContributions(repositories?: Array<{ owner: string; name: string }>, startDate?: string, endDate?: string, username?: string) {
    try {
      const headers = await this.getAuthHeaders();
      if (!headers) {
        return {
          success: false,
          error: "GitHub token not found. Please sign in with GitHub."
        };
      }
      const response = await fetch("/api/github/contributions", {
        method: "POST",
        headers,
        body: JSON.stringify({ 
          repositories: repositories || [],
          startDate,
          endDate,
          username
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Failed to fetch contributions: ${response.status}`;
        return {
          success: false,
          error: errorMessage
        };
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching contributions:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch contributions. Please check your network connection."
      };
    }
  }

  async getAllLanguagesForRepositories(repositories: Array<{ owner: string; name: string }>) {
    try {
      const languagePromises = repositories.map(async (repo: { owner: string; name: string }) => {
        try {
          const result = await this.getLanguages([{ owner: repo.owner, name: repo.name }]);
          return result.success ? result.data?.languages || {} : {};
        } catch {
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

      return allLanguages;
    } catch (error) {
      console.error("Error fetching all languages:", error);
      return {};
    }
  }

  async getCurrentGitHubUser() {
    try {
      const headers = await this.getAuthHeaders();
      if (!headers) {
        return {
          success: false,
          error: "GitHub token not found. Please sign in with GitHub."
        };
      }
      const response = await fetch("https://api.github.com/user", {
        headers: {
          ...headers,
          "Accept": "application/vnd.github.v3+json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch GitHub user: ${response.status}`);
      }

      const userData = await response.json();
      return {
        success: true,
        data: {
          login: userData.login,
          name: userData.name,
          email: userData.email,
          avatar_url: userData.avatar_url,
        }
      };
    } catch (error) {
      console.error("Error fetching GitHub user:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch GitHub user"
      };
    }
  }
}

export const apiService = new ApiService();