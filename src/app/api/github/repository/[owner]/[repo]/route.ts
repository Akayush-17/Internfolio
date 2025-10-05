import { NextRequest, NextResponse } from "next/server";

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

    const headers = {
      "Authorization": `Bearer ${githubToken}`,
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "Internfolio-App",
    };

    const [repository, languages, pullRequests, commits, contributors] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }).then(r => r.json()),
      fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers }).then(r => r.json()),
      fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=100`, { headers }).then(r => r.json()),
      fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`, { headers }).then(r => r.json()),
      fetch(`https://api.github.com/repos/${owner}/${repo}/stats/contributors`, { headers }).then(r => r.json())
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
