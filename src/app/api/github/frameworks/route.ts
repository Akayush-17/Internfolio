import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/store/auth";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    let githubToken: string | null = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      githubToken = authHeader.substring(7);
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      githubToken = session?.provider_token || null;
    }

    if (!githubToken) {
      return NextResponse.json(
        { success: false, error: "GitHub token not found" },
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
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const repositories = await response.json();
    
    const frameworksAndLibraries = new Set<string>();
    
    repositories.forEach((repo: { name?: string; description?: string; topics?: string[] }) => {
      if (repo.topics && Array.isArray(repo.topics)) {
        repo.topics.forEach((topic: string) => {
          if (topic && topic.trim()) {
            frameworksAndLibraries.add(topic);
          }
        });
      }

      const repoName = repo.name || '';
      const repoDescription = repo.description || '';
      const combinedText = `${repoName} ${repoDescription}`.toLowerCase();

      const patterns = [
        /\b(\w+\.js)\b/g,
        /\b(\w+\.ts)\b/g,
        /\b(\w+\.py)\b/g,
        /\b(\w+\.php)\b/g,
        /\b(\w+\.rb)\b/g,
        /\b(\w+\.go)\b/g,
        /\b(\w+\.rs)\b/g,
        /\b(\w+\.java)\b/g,
        /\b(\w+\.kt)\b/g,
        /\b(\w+\.swift)\b/g,
        /\b(\w+\.dart)\b/g,
        /\b(react|vue|angular|svelte|ember|backbone|knockout)\b/g,
        /\b(next|nuxt|gatsby|remix|sveltekit|astro|solid)\b/g,
        /\b(express|fastify|koa|hapi|restify|polka)\b/g,
        /\b(django|flask|fastapi|tornado|bottle|pyramid)\b/g,
        /\b(spring|quarkus|micronaut|vertx|play|akka)\b/g,
        /\b(laravel|symfony|cakephp|codeigniter|yii|phalcon)\b/g,
        /\b(rails|sinatra|hanami|grape|padrino)\b/g,
        /\b(asp\.net|blazor|mvc|webapi|signalr)\b/g,
        /\b(gin|echo|fiber|iris|revel|beego)\b/g,
        /\b(actix|rocket|warp|axum|tide)\b/g,
        /\b(tailwind|bootstrap|bulma|foundation|semantic|material|chakra|antd|mantine)\b/g,
        /\b(styled-components|emotion|stitches|vanilla-extract|linaria)\b/g,
        /\b(framer-motion|lottie|gsap|three|d3|chart\.js|recharts)\b/g,
        /\b(redux|mobx|zustand|recoil|jotai|valtio|effector)\b/g,
        /\b(apollo|relay|urql|graphql-request|graphql-tools)\b/g,
        /\b(jest|vitest|mocha|chai|sinon|enzyme|testing-library)\b/g,
        /\b(cypress|playwright|puppeteer|selenium|webdriver)\b/g,
        /\b(karma|jasmine|ava|tape|qunit)\b/g,
        /\b(webpack|vite|rollup|parcel|esbuild|swc|babel)\b/g,
        /\b(gulp|grunt|browserify|fusebox|snowpack)\b/g,
        /\b(prisma|sequelize|typeorm|mongoose|knex|bookshelf)\b/g,
        /\b(hibernate|mybatis|jpa|doctrine|eloquent)\b/g,
        /\b(sqlalchemy|peewee|tortoise|databases)\b/g,
        /\b(typescript|flow|coffeescript|dart|elm|clojurescript)\b/g,
        /\b(axios|fetch|superagent|request|got|node-fetch)\b/g,
        /\b(lodash|underscore|ramda|immutable|moment|dayjs)\b/g,
        /\b(socket\.io|ws|sockjs|engine\.io|primus)\b/g,
        /\b(passport|jwt|oauth|auth0|firebase-auth)\b/g,
        /\b(redis|memcached|elasticsearch|mongodb|postgresql|mysql)\b/g,
        /\b(docker|kubernetes|terraform|ansible|jenkins|github-actions)\b/g,
        /\b(eslint|prettier|husky|lint-staged|commitlint)\b/g,
        /\b(storybook|docusaurus|gatsby|nextra|vitepress)\b/g
      ];

      patterns.forEach(pattern => {
        const matches = combinedText.match(pattern);
        if (matches) {
          matches.forEach(match => {
            const cleanMatch = match.replace(/[^\w\s.-]/g, '').trim();
            if (cleanMatch && cleanMatch.length > 2) {
              frameworksAndLibraries.add(cleanMatch);
            }
          });
        }
      });
    });

    const frameworksList = Array.from(frameworksAndLibraries).sort();

    return NextResponse.json({
      success: true,
      data: {
        frameworks: frameworksList,
        count: frameworksList.length
      }
    });

  } catch (error) {
    console.error("Error fetching frameworks:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch frameworks" },
      { status: 500 }
    );
  }
}
