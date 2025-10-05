import { NextRequest, NextResponse } from "next/server";
import { githubService } from "@/lib/github";

export async function GET(
  request: NextRequest,
  { params }: { params: { owner: string; repo: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const githubToken = authHeader?.replace('Bearer ', '');

    if (!githubToken) {
      return NextResponse.json(
        { error: "GitHub token required in Authorization header" },
        { status: 401 }
      );
    }

    const { owner, repo } = params;

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Owner and repository name are required" },
        { status: 400 }
      );
    }

    (githubService as unknown as { accessToken: string }).accessToken = githubToken;

    const [repository, languages, pullRequests, commits, contributors] = await Promise.all([
      githubService.getRepository(owner, repo),
      githubService.getRepositoryLanguages(owner, repo),
      githubService.getRepositoryPullRequests(owner, repo),
      githubService.getRepositoryCommits(owner, repo),
      githubService.getRepositoryContributors(owner, repo)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        repository,
        languages,
        pullRequests,
        commits,
        contributors,
        stats: {
          totalCommits: commits.length,
          totalPullRequests: pullRequests.length,
          totalContributors: contributors.length,
          languagesCount: Object.keys(languages).length
        }
      }
    });

  } catch (error) {
    console.error("Error fetching repository data:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch repository data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
