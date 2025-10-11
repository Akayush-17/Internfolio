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
    
    const toolsAndPlatforms = new Set<string>();
    
    repositories.forEach((repo: { name?: string; description?: string; topics?: string[] }) => {
      if (repo.topics && Array.isArray(repo.topics)) {
        repo.topics.forEach((topic: string) => {
          if (topic && topic.trim()) {
            toolsAndPlatforms.add(topic);
          }
        });
      }

      const repoName = repo.name || '';
      const repoDescription = repo.description || '';
      const combinedText = `${repoName} ${repoDescription}`.toLowerCase();

      const patterns = [
        /\b(github|gitlab|bitbucket|azure-devops)\b/g,
        /\b(docker|kubernetes|helm|rancher|openshift)\b/g,
        /\b(aws|azure|gcp|google-cloud|digitalocean|linode|vultr)\b/g,
        /\b(terraform|ansible|puppet|chef|vagrant)\b/g,
        /\b(jenkins|github-actions|gitlab-ci|circleci|travis|azure-pipelines)\b/g,
        /\b(nginx|apache|tomcat|iis|caddy)\b/g,
        /\b(redis|memcached|elasticsearch|kibana|logstash)\b/g,
        /\b(mongodb|postgresql|mysql|sqlite|mariadb|oracle)\b/g,
        /\b(firebase|supabase|planetscale|vercel|netlify|heroku)\b/g,
        /\b(slack|discord|teams|zoom|jira|confluence|notion)\b/g,
        /\b(figma|sketch|adobe|canva|invision|zeplin)\b/g,
        /\b(linux|ubuntu|centos|debian|fedora|arch)\b/g,
        /\b(macos|windows|ios|android|react-native|flutter)\b/g,
        /\b(cloudflare|fastly|akamai|aws-cloudfront|azure-cdn)\b/g,
        /\b(sentry|datadog|newrelic|grafana|prometheus)\b/g,
        /\b(stripe|paypal|square|razorpay|razorpay)\b/g,
        /\b(twilio|sendgrid|mailgun|ses|postmark)\b/g,
        /\b(algolia|elasticsearch|solr|meilisearch)\b/g,
        /\b(segment|mixpanel|amplitude|hotjar|google-analytics)\b/g,
        /\b(shopify|woocommerce|magento|prestashop)\b/g,
        /\b(wordpress|drupal|joomla|ghost|strapi)\b/g,
        /\b(swagger|postman|insomnia|graphql-playground)\b/g,
        /\b(sonarqube|codeclimate|coveralls|codacy)\b/g,
        /\b(eslint|prettier|husky|lint-staged|commitlint)\b/g,
        /\b(webpack|vite|rollup|parcel|esbuild|swc)\b/g,
        /\b(git|svn|mercurial|perforce)\b/g,
        /\b(vscode|vim|emacs|sublime|atom|webstorm)\b/g,
        /\b(photoshop|illustrator|premiere|after-effects)\b/g,
        /\b(blender|maya|3ds-max|cinema-4d)\b/g,
        /\b(arduino|raspberry-pi|esp32|microbit)\b/g,
        /\b(aws-s3|aws-lambda|aws-ec2|aws-rds|aws-elastic-beanstalk)\b/g,
        /\b(azure-functions|azure-app-service|azure-sql|azure-storage)\b/g,
        /\b(gcp-compute|gcp-cloud-functions|gcp-bigquery|gcp-firestore)\b/g,
        /\b(vercel|netlify|heroku|railway|render|fly-io)\b/g,
        /\b(cloudinary|imgix|tinypng|kraken-io)\b/g,
        /\b(unsplash|pexels|shutterstock|getty-images)\b/g,
        /\b(unsplash|pexels|shutterstock|getty-images)\b/g,
        /\b(unsplash|pexels|shutterstock|getty-images)\b/g
      ];

      patterns.forEach(pattern => {
        const matches = combinedText.match(pattern);
        if (matches) {
          matches.forEach(match => {
            const cleanMatch = match.replace(/[^\w\s.-]/g, '').trim();
            if (cleanMatch && cleanMatch.length > 2) {
              toolsAndPlatforms.add(cleanMatch);
            }
          });
        }
      });
    });

    const toolsList = Array.from(toolsAndPlatforms).sort();

    return NextResponse.json({
      success: true,
      data: {
        tools: toolsList,
        count: toolsList.length
      }
    });

  } catch (error) {
    console.error("Error fetching tools:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tools" },
      { status: 500 }
    );
  }
}
