import { NextResponse } from "next/server";

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "divs-internet",
  "X-GitHub-Api-Version": "2022-11-28",
};

type GitHubProfile = { login: string; name: string | null; bio: string | null; location: string | null; public_repos: number; followers: number; following: number; html_url: string };
type GitHubRepository = { name: string; description: string | null; language: string | null; stargazers_count: number; forks_count: number; updated_at: string; html_url: string; archived: boolean };

export async function GET() {
  try {
    const [profileResponse, repositoriesResponse] = await Promise.all([
      fetch("https://api.github.com/users/divsvash", { headers, next: { revalidate: 900 } }),
      fetch("https://api.github.com/users/divsvash/repos?sort=updated&direction=desc&per_page=10&type=owner", { headers, next: { revalidate: 900 } }),
    ]);
    if (!profileResponse.ok || !repositoriesResponse.ok) {
      throw new Error(`GitHub returned ${profileResponse.status}/${repositoriesResponse.status}`);
    }
    const profile = await profileResponse.json() as GitHubProfile;
    const repositories = await repositoriesResponse.json() as GitHubRepository[];
    return NextResponse.json({
      source: "LIVE",
      fetchedAt: new Date().toISOString(),
      profile: {
        login: profile.login,
        name: profile.name,
        bio: profile.bio,
        location: profile.location,
        publicRepos: profile.public_repos,
        followers: profile.followers,
        following: profile.following,
        url: profile.html_url,
      },
      repositories: repositories.map((repo) => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updatedAt: repo.updated_at,
        url: repo.html_url,
        archived: repo.archived,
      })),
    }, { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" } });
  } catch (error) {
    return NextResponse.json({ source: "UNAVAILABLE", error: error instanceof Error ? error.message : "GitHub could not be reached." }, { status: 502 });
  }
}
