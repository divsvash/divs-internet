export type ProfileId = "github" | "x" | "linkedin" | "letterboxd" | "storygraph" | "leetcode";
export type BrowserPageId = "home" | ProfileId;

export const internetProfiles: Record<ProfileId, {
  label: string;
  handle: string;
  url: string;
  host: string;
  source: "LIVE" | "LOCAL";
  localNote: string;
}> = {
  github: {
    label: "GitHub",
    handle: "@divsvash",
    url: "https://github.com/divsvash",
    host: "github.com",
    source: "LIVE",
    localNote: "Public repositories and profile data.",
  },
  x: {
    label: "X / Twitter",
    handle: "@divsvash",
    url: "https://x.com/divsvash",
    host: "x.com",
    source: "LOCAL",
    localNote: "Configured public profile. Live posts are not available here.",
  },
  linkedin: {
    label: "LinkedIn",
    handle: "Divyanshi Vashistha",
    url: "https://www.linkedin.com/in/divyanshi-vashistha-4a0266274/",
    host: "linkedin.com",
    source: "LOCAL",
    localNote: "Configured public professional profile.",
  },
  letterboxd: {
    label: "Letterboxd",
    handle: "@divsvash",
    url: "https://letterboxd.com/divsvash/",
    host: "letterboxd.com",
    source: "LIVE",
    localNote: "Movie diary and recent watches.",
  },
  storygraph: {
    label: "StoryGraph",
    handle: "@divssvash",
    url: "https://app.thestorygraph.com/profile/divssvash",
    host: "app.thestorygraph.com",
    source: "LOCAL",
    localNote: "Reading activity. Live access is not publicly available here yet.",
  },
  leetcode: {
    label: "LeetCode",
    handle: "@divssvash",
    url: "https://leetcode.com/u/divssvash/",
    host: "leetcode.com",
    source: "LIVE",
    localNote: "Public problem-solving statistics when LeetCode responds.",
  },
};

export const internetBookmarks = [
  { label: "divs.internet", url: "https://divs.internet/home", note: "start here" },
  { label: "Internet Archive", url: "https://archive.org", note: "the web remembers" },
  { label: "Hacker News", url: "https://news.ycombinator.com", note: "external internet" },
] as const;

export function profileEntries() {
  return Object.entries(internetProfiles) as [ProfileId, (typeof internetProfiles)[ProfileId]][];
}
