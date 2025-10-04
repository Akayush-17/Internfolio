import { NextRequest, NextResponse } from "next/server";

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

    const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
      headers: {
        "Authorization": `Bearer ${githubToken}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Internfolio-App",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { 
          error: "GitHub API error",
          details: `${response.status} ${response.statusText}: ${errorText}`
        },
        { status: response.status }
      );
    }

    const repositories = await response.json();
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
