import { supabase } from "@/store/auth";
import { 
  GitHubRepository, 
  GitHubPullRequest, 
  GitHubCommit, 
  GitHubLanguage, 
  GitHubContributor 
} from "@/types";

// GitHub API service
export class GitHubService {
  private baseUrl = "https://api.github.com";
  private accessToken: string | null = null;

  constructor() {
    this.initializeToken();
  }

  private async initializeToken() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.provider_token) {
        this.accessToken = session.provider_token;
      }
    } catch (error) {
      console.error("Failed to get GitHub token:", error);
    }
  }

  private async getHeaders() {
    if (!this.accessToken) {
      await this.initializeToken();
    }
    
    return {
      "Authorization": `Bearer ${this.accessToken}`,
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "Internfolio-App",
    };
  }

  async getUserRepositories(): Promise<GitHubRepository[]> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/user/repos?sort=updated&per_page=100`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getRepositoryLanguages(owner: string, repo: string): Promise<GitHubLanguage> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/languages`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getRepositoryPullRequests(owner: string, repo: string): Promise<GitHubPullRequest[]> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/pulls?state=all&per_page=100`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getRepositoryCommits(owner: string, repo: string, since?: string): Promise<GitHubCommit[]> {
    const headers = await this.getHeaders();
    let url = `${this.baseUrl}/repos/${owner}/${repo}/commits?per_page=100`;
    
    if (since) {
      url += `&since=${since}`;
    }

    const response = await fetch(url, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getRepositoryContributors(owner: string, repo: string): Promise<GitHubContributor[]> {
    const headers = await this.getHeaders();
    const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/stats/contributors`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getUserContributions(username: string, from?: string, to?: string) {
    const headers = await this.getHeaders();
    let url = `${this.baseUrl}/users/${username}/events/public?per_page=100`;
    
    if (from) {
      url += `&since=${from}`;
    }

    const response = await fetch(url, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

export const githubService = new GitHubService();
