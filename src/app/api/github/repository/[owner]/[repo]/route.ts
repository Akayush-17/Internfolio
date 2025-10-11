import { NextRequest, NextResponse } from "next/server";
import { githubService } from "@/lib/github";
import { supabase } from "@/store/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
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
        { error: "GitHub token required. Please sign in with GitHub or provide token in Authorization header" },
        { status: 401 }
      );
    }

    const { owner, repo } = await params;

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Owner and repository name are required" },
        { status: 400 }
      );
    }

    githubService.setAccessToken(githubToken);

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
