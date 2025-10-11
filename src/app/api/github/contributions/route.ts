import { NextRequest, NextResponse } from "next/server";
import { githubService } from "@/lib/github";
import { GitHubContributor } from "@/types";
import { supabase } from "@/store/auth";

export async function POST(request: NextRequest) {
  try {
    let githubToken = null;
    
    const authHeader = request.headers.get('authorization');
    
    if (authHeader) {
      githubToken = authHeader.replace('Bearer ', '');
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      githubToken = session?.provider_token;
    }

    if (!githubToken) {
      return NextResponse.json(
        { success: false, error: "GitHub token required. Please sign in with GitHub or provide token in Authorization header" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { repositories, startDate, endDate, username } = body;

    if (!repositories || !Array.isArray(repositories)) {
      return NextResponse.json(
        { success: false, error: "Repositories array is required" },
        { status: 400 }
      );
    }

    githubService.setAccessToken(githubToken);

    const contributionPromises = repositories.map(async (repo: { owner: string; name: string }) => {
      try {
        const [commits, pullRequests, contributors] = await Promise.all([
          githubService.getRepositoryCommits(repo.owner, repo.name, startDate),
          githubService.getRepositoryPullRequests(repo.owner, repo.name),
          githubService.getRepositoryContributors(repo.owner, repo.name)
        ]);

        const totalLinesOfCode = contributors.reduce((total: number, contributor: GitHubContributor) => {
          return total + contributor.weeks.reduce((weekTotal: number, week: { a: number; d: number }) => {
            return weekTotal + week.a + week.d;
          }, 0);
        }, 0);

        return {
          repository: repo.name,
          owner: repo.owner,
          commits: commits.length,
          pullRequests: pullRequests.length,
          contributors: contributors.length,
          totalLinesOfCode,
          commitsData: commits,
          pullRequestsData: pullRequests
        };
      } catch (error) {
        console.error(`Error fetching contributions for ${repo.name}:`, error);
        return {
          repository: repo.name,
          owner: repo.owner,
          commits: 0,
          pullRequests: 0,
          contributors: 0,
          totalLinesOfCode: 0,
          commitsData: [],
          pullRequestsData: []
        };
      }
    });

    const contributionResults = await Promise.all(contributionPromises);

    if (username) {
      try {
        await githubService.getUserContributions(username, startDate);
      } catch (error) {
        console.error(`Error fetching user contributions for ${username}:`, error);
      }
    }

    const totals = contributionResults.reduce((acc, result) => ({
      totalCommits: acc.totalCommits + result.commits,
      totalPullRequests: acc.totalPullRequests + result.pullRequests,
      totalContributors: acc.totalContributors + result.contributors,
      totalLinesOfCode: acc.totalLinesOfCode + result.totalLinesOfCode
    }), {
      totalCommits: 0,
      totalPullRequests: 0,
      totalContributors: 0,
      totalLinesOfCode: 0
    });

    return NextResponse.json({
      success: true,
      data: {
        repositories: contributionResults,
        totals,
        period: {
          startDate,
          endDate
        }
      }
    });

  } catch (error) {
    console.error("Error fetching contributions:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch contributions",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
