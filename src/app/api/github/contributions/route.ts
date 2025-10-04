import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const githubToken = authHeader?.replace('Bearer ', '');

    if (!githubToken) {
      return NextResponse.json(
        { error: "GitHub token required in Authorization header" },
        { status: 401 }
      );
    }

    const { repositories, startDate, endDate } = await request.json();

    if (!repositories || !Array.isArray(repositories)) {
      return NextResponse.json(
        { error: "Repositories array is required" },
        { status: 400 }
      );
    }

    const headers = {
      "Authorization": `Bearer ${githubToken}`,
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "Internfolio-App",
    };

    const contributionPromises = repositories.map(async (repo: { owner: string; name: string }) => {
      try {
        let commitsUrl = `https://api.github.com/repos/${repo.owner}/${repo.name}/commits?per_page=100`;
        if (startDate) {
          commitsUrl += `&since=${startDate}`;
        }

        const [commits, pullRequests, contributors] = await Promise.all([
          fetch(commitsUrl, { headers }).then(r => r.json()),
          fetch(`https://api.github.com/repos/${repo.owner}/${repo.name}/pulls?state=all&per_page=100`, { headers }).then(r => r.json()),
          fetch(`https://api.github.com/repos/${repo.owner}/${repo.name}/stats/contributors`, { headers }).then(r => r.json())
        ]);

        const totalLinesOfCode = contributors.reduce((total: number, contributor: any) => {
          return total + contributor.weeks.reduce((weekTotal: number, week: any) => {
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
        error: "Failed to fetch contributions",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
