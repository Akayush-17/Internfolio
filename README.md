Read contribution.md file for contribution related info

## Getting Started

### Database Setup

First, create the required Supabase tables by running the SQL script in your Supabase SQL editor:

```sql
CREATE TABLE IF NOT EXISTS github_repositories (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  github_repo_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  full_name VARCHAR(500) NOT NULL,
  description TEXT,
  html_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  pushed_at TIMESTAMP WITH TIME ZONE,
  language VARCHAR(100),
  topics TEXT[],
  is_private BOOLEAN DEFAULT FALSE,
  is_fork BOOLEAN DEFAULT FALSE,
  stargazers_count INTEGER DEFAULT 0,
  forks_count INTEGER DEFAULT 0,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, github_repo_id)
);

CREATE TABLE IF NOT EXISTS github_repository_languages (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  repository_id BIGINT REFERENCES github_repositories(id) ON DELETE CASCADE,
  language VARCHAR(100) NOT NULL,
  bytes_count BIGINT NOT NULL,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(repository_id, language)
);

CREATE TABLE IF NOT EXISTS github_commits (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  repository_id BIGINT REFERENCES github_repositories(id) ON DELETE CASCADE,
  commit_sha VARCHAR(40) NOT NULL,
  message TEXT,
  author_name VARCHAR(255),
  author_username VARCHAR(255),
  commit_date TIMESTAMP WITH TIME ZONE,
  html_url TEXT,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(repository_id, commit_sha)
);

CREATE TABLE IF NOT EXISTS github_contributions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(255) NOT NULL,
  event_type VARCHAR(100),
  repository_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE,
  event_data JSONB,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_github_repositories_user_id ON github_repositories(user_id);
CREATE INDEX IF NOT EXISTS idx_github_repository_languages_repository_id ON github_repository_languages(repository_id);
CREATE INDEX IF NOT EXISTS idx_github_commits_repository_id ON github_commits(repository_id);
CREATE INDEX IF NOT EXISTS idx_github_contributions_user_id ON github_contributions(user_id);
```

### Development Server

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
