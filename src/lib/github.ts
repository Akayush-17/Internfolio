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

    const repositories = await response.json();
    
    try {
      const userId = await this.getCurrentUserId();
      if (userId) {
        const repositoryData = repositories.map((repo: GitHubRepository) => ({
          user_id: userId,
          github_repo_id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description,
          html_url: repo.html_url,
          created_at: repo.created_at,
          updated_at: repo.updated_at,
          pushed_at: repo.pushed_at,
          language: repo.language,
          topics: repo.topics,
          is_private: repo.private,
          is_fork: repo.fork,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          last_synced_at: new Date().toISOString()
        }));

        await supabase
          .from('github_repositories')
          .upsert(repositoryData, { 
            onConflict: 'user_id,github_repo_id',
            ignoreDuplicates: false 
          });
      }
    } catch (error) {
      console.error('Error saving repositories to database:', error);
    }

    return repositories;
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

    const languages = await response.json();
    
    try {
      const userId = await this.getCurrentUserId();
      if (userId) {
        const repoData = await supabase
          .from('github_repositories')
          .select('id')
          .eq('user_id', userId)
          .eq('github_repo_id', (await this.getRepository(owner, repo)).id)
          .single();

        if (repoData.data) {
          const languageData = Object.entries(languages).map(([language, bytes]) => ({
            user_id: userId,
            repository_id: repoData.data.id,
            language,
            bytes_count: bytes,
            last_synced_at: new Date().toISOString()
          }));

          await supabase
            .from('github_repository_languages')
            .upsert(languageData, { 
              onConflict: 'repository_id,language',
              ignoreDuplicates: false 
            });
        }
      }
    } catch (error) {
      console.error('Error saving repository languages to database:', error);
    }

    return languages;
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

    const commits = await response.json();
    
    try {
      const userId = await this.getCurrentUserId();
      if (userId) {
        const repoData = await supabase
          .from('github_repositories')
          .select('id')
          .eq('user_id', userId)
          .eq('github_repo_id', (await this.getRepository(owner, repo)).id)
          .single();

        if (repoData.data) {
          const commitData = commits.map((commit: GitHubCommit) => ({
            user_id: userId,
            repository_id: repoData.data.id,
            commit_sha: commit.sha,
            message: commit.commit.message,
            author_name: commit.commit.author.name,
            author_username: commit.author.login,
            commit_date: commit.commit.author.date,
            html_url: commit.html_url,
            last_synced_at: new Date().toISOString()
          }));

          await supabase
            .from('github_commits')
            .upsert(commitData, { 
              onConflict: 'repository_id,commit_sha',
              ignoreDuplicates: false 
            });
        }
      }
    } catch (error) {
      console.error('Error saving commits to database:', error);
    }

    return commits;
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

    const contributions = await response.json();
    
    try {
      const userId = await this.getCurrentUserId();
      if (userId) {
        const contributionData = contributions.map((contribution: any) => ({
          user_id: userId,
          username,
          event_type: contribution.type,
          repository_name: contribution.repo?.name || null,
          created_at: contribution.created_at,
          event_data: contribution,
          last_synced_at: new Date().toISOString()
        }));

        await supabase
          .from('github_contributions')
          .upsert(contributionData, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          });
      }
    } catch (error) {
      console.error('Error saving contributions to database:', error);
    }

    return contributions;
  }

  private async getCurrentUserId(): Promise<string | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user?.id || null;
    } catch (error) {
      return null;
    }
  }
}

export const githubService = new GitHubService();
