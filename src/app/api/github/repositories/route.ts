import { NextRequest, NextResponse } from "next/server";
import { githubService } from "@/lib/github";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const githubToken = authHeader?.replace('Bearer ', '');

    if (!githubToken) {
      return NextResponse.json(
        { error: "GitHub token required in Authorization header" },
        { status: 401 }
      );
    }

    (githubService as any).accessToken = githubToken;

    const repositories = await githubService.getUserRepositories();
    
    const filteredRepos = repositories.filter((repo: any) => 
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
