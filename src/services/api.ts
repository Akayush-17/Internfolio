import { supabase } from "@/store/auth";

class ApiService {
  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    const githubToken = session?.provider_token;
    
    if (!githubToken) {
      throw new Error("GitHub token not found. Please sign in with GitHub.");
    }

    return {
      "Authorization": `Bearer ${githubToken}`,
      "Content-Type": "application/json",
    };
  }

  async getRepositories() {
    try {
      const headers = await this.getAuthHeaders();
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

  async getLanguages(repositories: any) {
    try {
      const headers = await this.getAuthHeaders();
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

  async getContributions() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch("/api/github/contributions", {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch contributions: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching contributions:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch contributions"
      };
    }
  }

  async getAllLanguagesForRepositories(repositories: any[]) {
    try {
      const languagePromises = repositories.map(async (repo: any) => {
        try {
          const result = await this.getLanguages([{ owner: repo.owner, name: repo.name }]);
          return result.success ? result.data?.languages || {} : {};
        } catch (error) {
          return {};
        }
      });

      const languageResults = await Promise.all(languagePromises);
      const allLanguages: any = {};
      
      languageResults.forEach(languages => {
        Object.entries(languages).forEach(([language, bytes]) => {
          allLanguages[language] = (allLanguages[language] || 0) + (bytes);
        });
      });

      return allLanguages;
    } catch (error) {
      console.error("Error fetching all languages:", error);
      return {};
    }
  }
}

export const apiService = new ApiService();