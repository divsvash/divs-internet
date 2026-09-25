"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Code2, ExternalLink, Film, Globe2, Home, Newspaper, RefreshCw, Search, Send } from "lucide-react";

type PageId = "home" | "github" | "x" | "medium" | "linkedin" | "letterboxd";

const profiles = {
  github: { label: "GitHub", handle: "@divsvash", url: "https://github.com/divsvash", icon: Code2, summary: "Code, experiments, systems, and an unreasonable number of repositories.", stats: ["Public repos", "Projects", "Commits"] },
  x: { label: "X / Twitter", handle: "@divsvash", url: "https://x.com/divsvash", icon: Send, summary: "Building in public, occasional technical rabbit holes, and whatever is happening on the timeline.", stats: ["Tech", "Build logs", "Unfiltered thoughts"] },
  medium: { label: "Medium", handle: "@divs4real", url: "https://divs4real.medium.com", icon: Newspaper, summary: "Essays about AI, computers, creativity, and machines that refuse to cooperate.", stats: ["Essays", "Field notes", "Opinions"] },
  linkedin: { label: "LinkedIn", handle: "Divyanshi Vashistha", url: "https://www.linkedin.com/in/divyanshi-vashistha-4a0266274", icon: BriefcaseBusiness, summary: "Engineering work, research, projects, and the professional version of the chaos.", stats: ["Experience", "Projects", "Updates"] },
  letterboxd: { label: "Letterboxd", handle: "@divsdiary", url: "https://letterboxd.com/divsdiary", icon: Film, summary: "Film diary, ratings, reviews, and evidence that movie opinions can become a contact sport.", stats: ["1,565 films", "8 lists", "Recent reviews"] },
} satisfies Record<Exclude<PageId, "home">, { label: string; handle: string; url: string; icon: typeof Code2; summary: string; stats: string[] }>;

const activity = [
  { platform: "GitHub", page: "github" as const, date: "SEP 25", title: "Built the Internet Explorer window for divs.internet", text: "The portfolio desktop now has a browser that behaves like a browser.", href: "https://github.com/divsvash/divs-internet" },
  { platform: "X", page: "x" as const, date: "SEP 22", title: "remote alarm app, but make it mildly threatening", text: "Asked whether one phone could trigger an alarm on another phone until the sender stops it.", href: "https://x.com/divsvash" },
  { platform: "LinkedIn", page: "linkedin" as const, date: "SEP 04", title: "Founding Ambassador at Textpip", text: "A small update that may have involved yapping into a new role.", href: "https://www.linkedin.com/posts/divyanshi-vashistha-4a0266274_bit-of-an-update-but-i-may-have-yapped-my-activity-7499436142577254400-K-uV" },
  { platform: "Medium", page: "medium" as const, date: "SEP 10", title: "My Personal Beef With a ThinkPad", text: "A Windows funeral, an E420, and a very personal Linux installation.", href: "/my-personal-beef-with-a-thinkpad" },
  { platform: "Medium", page: "medium" as const, date: "SEP 09", title: "The Line Between AI and Your Brain", text: "On outsourcing thought, vibe coding, and keeping your own taste.", href: "/the-line-between-ai-and-your-brain" },
  { platform: "Letterboxd", page: "letterboxd" as const, date: "AUG 29", title: "Watched Scream 7", text: "Logged and rated ★★ on the film diary.", href: "https://letterboxd.com/divsdiary" },
];

export function InternetApp() {
  const [history, setHistory] = useState<PageId[]>(["home"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const current = history[historyIndex];
  const currentProfile = current === "home" ? null : profiles[current];
  const [addressDraft, setAddressDraft] = useState("https://divs.internet/home");

  function visit(page: PageId) {
    const next = [...history.slice(0, historyIndex + 1), page];
    setHistory(next); setHistoryIndex(next.length - 1);
    setAddressDraft(page === "home" ? "https://divs.internet/home" : profiles[page].url);
  }
  function moveHistory(nextIndex: number) {
    const page = history[nextIndex]; setHistoryIndex(nextIndex);
    setAddressDraft(page === "home" ? "https://divs.internet/home" : profiles[page].url);
  }
  function navigate(event: FormEvent) {
    event.preventDefault();
    const value = addressDraft.trim().replace(/\/$/, "");
    const internal = (Object.entries(profiles) as [Exclude<PageId, "home">, (typeof profiles)[Exclude<PageId, "home">]][]).find(([, profile]) => profile.url.replace(/\/$/, "") === value || value.includes(profile.handle.replace("@", "")));
    if (value.includes("divs.internet/home")) visit("home");
    else if (internal) visit(internal[0]);
    else if (value) window.open(value.startsWith("http") ? value : `https://${value}`, "_blank", "noopener,noreferrer");
  }

  return <div className="internet-app">
    <nav className="window-menu"><span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>G</u>o</span><span>F<u>a</u>vorites</span><span><u>H</u>elp</span></nav>
    <div className="browser-toolbar">
      <button className="browser-tool" disabled={historyIndex === 0} onClick={() => moveHistory(historyIndex - 1)} aria-label="Back"><ArrowLeft size={20} /><span>Back</span></button>
      <button className="browser-tool" disabled={historyIndex === history.length - 1} onClick={() => moveHistory(historyIndex + 1)} aria-label="Forward"><ArrowRight size={20} /><span>Forward</span></button>
      <button className="browser-tool" onClick={() => visit(current)} aria-label="Refresh"><RefreshCw size={20} /><span>Refresh</span></button>
      <button className="browser-tool" onClick={() => visit("home")} aria-label="Home"><Home size={20} /><span>Home</span></button>
      <button className="browser-tool" onClick={() => document.getElementById("internet-search")?.focus()} aria-label="Search"><Search size={20} /><span>Search</span></button>
    </div>
    <form className="browser-address" onSubmit={navigate}><label htmlFor="internet-search">Address</label><Globe2 size={16} /><input id="internet-search" value={addressDraft} onChange={(event) => setAddressDraft(event.target.value)} aria-label="Web address" /><button className="win95-button" type="submit">Go</button></form>
    <div className="internet-page">{currentProfile ? <ProfilePage profile={currentProfile} onHome={() => visit("home")} /> : <HomePage onVisit={visit} />}</div>
    <footer className="window-status"><span>Done</span><span>{currentProfile?.label ?? "divs.internet"}</span></footer>
  </div>;
}

function HomePage({ onVisit }: { onVisit: (page: PageId) => void }) {
  return <><header className="internet-masthead"><div className="internet-logo"><Globe2 size={33} /><span>divs.internet</span></div><span>Divs&apos; personal corner of the internet</span></header><div className="internet-body">
    <section className="internet-section"><h2>Find me online</h2><div className="internet-links">{(Object.entries(profiles) as [Exclude<PageId, "home">, (typeof profiles)[Exclude<PageId, "home">]][]).map(([id, profile]) => { const Icon = profile.icon; return <button type="button" onClick={() => onVisit(id)} key={id}><Icon size={25} /><span><strong>{profile.label}</strong><small>{profile.handle}</small></span><ArrowRight size={16} /></button>; })}</div></section>
    <section className="internet-section"><h2>Recently Posted</h2><div className="activity-feed">{activity.map((item) => <article className="activity-item" key={`${item.platform}-${item.title}`}><button className="activity-source" onClick={() => onVisit(item.page)}><span>{item.platform}</span><small>{item.date}</small></button><div><strong>{item.title}</strong><p>{item.text}</p><a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">View post <ExternalLink size={13} /></a></div></article>)}</div></section>
  </div></>;
}

function ProfilePage({ profile, onHome }: { profile: (typeof profiles)[Exclude<PageId, "home">]; onHome: () => void }) {
  const Icon = profile.icon;
  const posts = activity.filter((item) => item.platform === profile.label || (profile.label === "X / Twitter" && item.platform === "X"));
  return <div className="browser-profile"><header className="profile-banner"><Icon size={44} /><div><span>{profile.label}</span><h2>{profile.handle}</h2></div></header><div className="profile-content"><p className="profile-summary">{profile.summary}</p><div className="profile-stats">{profile.stats.map((stat) => <span key={stat}>{stat}</span>)}</div><div className="profile-actions"><a className="win95-button" href={profile.url} target="_blank" rel="noreferrer">Open external profile <ExternalLink size={14} /></a><button className="win95-button" onClick={onHome}>Back to divs.internet</button></div><h3>Recent activity</h3>{posts.length ? <div className="profile-posts">{posts.map((post) => <a href={post.href} target={post.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" key={post.title}><small>{post.date}</small><strong>{post.title}</strong><span>{post.text}</span></a>)}</div> : <p>No cached posts here yet. The external profile has the full feed.</p>}</div></div>;
}
