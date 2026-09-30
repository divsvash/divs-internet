import { NextResponse } from "next/server";

const query = `
  query publicProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile { ranking }
      submitStatsGlobal {
        acSubmissionNum { difficulty count }
      }
    }
    recentAcSubmissionList(username: $username, limit: 8) {
      title
      titleSlug
      timestamp
      lang
    }
  }
`;

type LeetCodePayload = {
  errors?: Array<{ message: string }>;
  data?: {
    matchedUser?: { username: string; profile?: { ranking?: number }; submitStatsGlobal?: { acSubmissionNum?: Array<{ difficulty: string; count: number }> } };
    recentAcSubmissionList?: Array<{ title: string; titleSlug: string; timestamp: string; lang: string }>;
  };
};

export async function GET() {
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", Referer: "https://leetcode.com/u/divssvash/", "User-Agent": "divs-internet" },
      body: JSON.stringify({ query, variables: { username: "divssvash" } }),
      next: { revalidate: 900 },
    });
    if (!response.ok) throw new Error(`LeetCode returned ${response.status}`);
    const payload = await response.json() as LeetCodePayload;
    if (payload.errors?.length || !payload.data?.matchedUser) throw new Error("LeetCode did not return a public profile.");
    const user = payload.data.matchedUser;
    const counts = Object.fromEntries((user.submitStatsGlobal?.acSubmissionNum ?? []).map((item: { difficulty: string; count: number }) => [item.difficulty, item.count]));
    return NextResponse.json({
      source: "LIVE",
      fetchedAt: new Date().toISOString(),
      username: user.username,
      ranking: user.profile?.ranking ?? null,
      solved: { total: counts.All ?? 0, easy: counts.Easy ?? 0, medium: counts.Medium ?? 0, hard: counts.Hard ?? 0 },
      recent: (payload.data.recentAcSubmissionList ?? []).map((item) => ({
        title: item.title,
        language: item.lang,
        submittedAt: new Date(Number(item.timestamp) * 1000).toISOString(),
        url: `https://leetcode.com/problems/${item.titleSlug}/`,
      })),
    }, { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" } });
  } catch (error) {
    return NextResponse.json({ source: "UNAVAILABLE", error: error instanceof Error ? error.message : "LeetCode could not be reached." }, { status: 502 });
  }
}
