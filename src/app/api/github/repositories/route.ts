import { NextRequest, NextResponse } from "next/server";
import { GitHubRepository } from "@/types";
import { githubService } from "@/lib/github";
import { supabase } from "@/store/auth";

export async function GET(request: NextRequest) {
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

    githubService.setAccessToken(githubToken);

    const repositories = await githubService.getUserRepositories();
    
    const filteredRepos = repositories.filter((repo: GitHubRepository) => 
      !repo.fork && !repo.private
    );

    return NextResponse.json({
      success: true,
      data: filteredRepos,
      count: filteredRepos.length
    });

  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch repositories",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
