import { NextRequest, NextResponse } from 'next/server';
import { githubService } from '@/lib/github';
import { supabase } from '@/store/auth';

export async function POST(request: NextRequest) {
  try {
    let githubToken = null;

    const authHeader = request.headers.get('authorization');

    if (authHeader) {
      githubToken = authHeader.replace('Bearer ', '');
    } else {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      githubToken = session?.provider_token;
    }

    if (!githubToken) {
      return NextResponse.json(
        {
          error:
            'GitHub token required. Please sign in with GitHub or provide token in Authorization header'
        },
        { status: 401 }
      );
    }

    const { repositories } = await request.json();

    if (!repositories || !Array.isArray(repositories)) {
      return NextResponse.json({ error: 'Repositories array is required' }, { status: 400 });
    }

    githubService.setAccessToken(githubToken);

    const languagePromises = repositories.map(async (repo: { owner: string; name: string }) => {
      try {
        const languages = await githubService.getRepositoryLanguages(repo.owner, repo.name);
        return {
          repository: repo.name,
          languages
        };
      } catch (error) {
        console.error(`Error fetching languages for ${repo.name}:`, error);
        return {
          repository: repo.name,
          languages: {}
        };
      }
    });

    const languageResults = await Promise.all(languagePromises);

    const aggregatedLanguages: { [key: string]: number } = {};

    languageResults.forEach((result) => {
      Object.entries(result.languages).forEach(([language, bytes]) => {
        aggregatedLanguages[language] = (aggregatedLanguages[language] || 0) + (bytes as number);
      });
    });

    const sortedLanguages = Object.entries(aggregatedLanguages)
      .sort(([, a], [, b]) => b - a)
      .map(([language, bytes]) => ({ language, bytes }));

    return NextResponse.json({
      success: true,
      data: {
        languages: aggregatedLanguages,
        sortedLanguages,
        repositories: languageResults
      }
    });
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch languages',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
