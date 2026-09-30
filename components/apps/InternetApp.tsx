"use client";

import { useEffect, useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Globe2, Home, RefreshCw, Search, Star } from "lucide-react";
import { internetBookmarks, internetProfiles, profileEntries, type BrowserPageId, type ProfileId } from "@/lib/internet/profiles";

type BrowserLocation = { kind: "page"; id: BrowserPageId } | { kind: "external"; url: string };
type ProviderState = { loading: boolean; data: unknown; error: string | null };

const homeLocation: BrowserLocation = { kind: "page", id: "home" };

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
}

function addressOf(location: BrowserLocation) {
  return location.kind === "external" ? location.url : location.id === "home" ? "https://divs.internet/home" : internetProfiles[location.id].url;
}

function resolveAddress(raw: string): BrowserLocation {
  const cleaned = normalize(raw);
  if (cleaned === "divs.internet" || cleaned === "divs.internet/home") return homeLocation;
  const match = profileEntries().find(([, profile]) => {
    const profileAddress = normalize(profile.url);
    return cleaned === profileAddress || cleaned === normalize(profile.url.replace("/u/", "/"));
  });
  if (match) return { kind: "page", id: match[0] };
  const external = /^https?:\/\//i.test(raw.trim()) ? raw.trim() : `https://${raw.trim()}`;
  return { kind: "external", url: external };
}

export function InternetApp() {
  const [history, setHistory] = useState<BrowserLocation[]>([homeLocation]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [addressDraft, setAddressDraft] = useState(addressOf(homeLocation));
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [status, setStatus] = useState("Done");
  const current = history[historyIndex];

  function visit(location: BrowserLocation) {
    const next = [...history.slice(0, historyIndex + 1), location];
    setHistory(next);
    setHistoryIndex(next.length - 1);
    setAddressDraft(addressOf(location));
    setFavoritesOpen(false);
    setStatus(location.kind === "page" && ["github", "leetcode", "letterboxd"].includes(location.id) ? `Connecting to ${new URL(addressOf(location)).host}...` : "Done");
  }

  function moveHistory(nextIndex: number) {
    const location = history[nextIndex];
    setHistoryIndex(nextIndex);
    setAddressDraft(addressOf(location));
    setFavoritesOpen(false);
    setStatus(location.kind === "page" && ["github", "leetcode", "letterboxd"].includes(location.id) ? `Connecting to ${new URL(addressOf(location)).host}...` : "Done");
  }

  function navigate(event: FormEvent) {
    event.preventDefault();
    if (addressDraft.trim()) visit(resolveAddress(addressDraft));
  }

  function refresh() {
    setStatus("Receiving data...");
    setRefreshKey((key) => key + 1);
  }

  const currentHost = current.kind === "external" ? safeHost(current.url) : current.id === "home" ? "divs.internet" : internetProfiles[current.id].host;

  return <div className="internet-app">
    <nav className="window-menu browser-menu">
      <span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>G</u>o</span>
      <button onClick={() => setFavoritesOpen((open) => !open)} aria-expanded={favoritesOpen}>F<u>a</u>vorites</button>
      <span><u>H</u>elp</span>
    </nav>
    <div className="browser-toolbar">
      <button className="browser-tool" disabled={historyIndex === 0} onClick={() => moveHistory(historyIndex - 1)} aria-label="Back"><ArrowLeft size={20} /><span>Back</span></button>
      <button className="browser-tool" disabled={historyIndex === history.length - 1} onClick={() => moveHistory(historyIndex + 1)} aria-label="Forward"><ArrowRight size={20} /><span>Forward</span></button>
      <button className="browser-tool" onClick={refresh} aria-label="Refresh"><RefreshCw size={20} /><span>Refresh</span></button>
      <button className="browser-tool" onClick={() => visit(homeLocation)} aria-label="Home"><Home size={20} /><span>Home</span></button>
      <button className="browser-tool" onClick={() => document.getElementById("internet-address")?.focus()} aria-label="Search"><Search size={20} /><span>Address</span></button>
      <button className="browser-tool" onClick={() => setFavoritesOpen((open) => !open)} aria-label="Favorites"><Star size={20} /><span>Favorites</span></button>
    </div>
    <form className="browser-address" onSubmit={navigate}><label htmlFor="internet-address">Address</label><Globe2 size={16} /><input id="internet-address" value={addressDraft} onChange={(event) => setAddressDraft(event.target.value)} aria-label="Web address" /><button className="win95-button" type="submit">Go</button></form>
    <div className="browser-workspace">
      {favoritesOpen && <FavoritesPane onVisit={visit} onClose={() => setFavoritesOpen(false)} />}
      <div className="internet-page">{current.kind === "external" ? <ExternalInterstitial url={current.url} /> : current.id === "home" ? <HomePage onVisit={visit} /> : <ProviderPage id={current.id} refreshKey={refreshKey} setStatus={setStatus} onRefresh={refresh} />}</div>
    </div>
    <footer className="window-status"><span>{status}</span><span>{currentHost}</span></footer>
  </div>;
}

function FavoritesPane({ onVisit, onClose }: { onVisit: (location: BrowserLocation) => void; onClose: () => void }) {
  return <aside className="favorites-pane"><div className="favorites-title"><strong>Favorites</strong><button onClick={onClose}>×</button></div><section><b>Divs</b>{profileEntries().map(([id, profile]) => <button key={id} onClick={() => onVisit({ kind: "page", id })}>☆ {profile.label}</button>)}</section><section><b>Bookmarks</b>{internetBookmarks.map((bookmark) => <button key={bookmark.url} onClick={() => onVisit(resolveAddress(bookmark.url))}>☆ {bookmark.label}</button>)}</section></aside>;
}

function HomePage({ onVisit }: { onVisit: (location: BrowserLocation) => void }) {
  return <div className="oldweb-home"><header><Globe2 size={27} /><div><h1>divs.internet</h1><p>personal start page — last reorganized after too many tabs</p></div></header>
    <section><h2>Divs on the internet</h2><table><thead><tr><th>Destination</th><th>Address</th><th>Data</th></tr></thead><tbody>{profileEntries().map(([id, profile]) => <tr key={id}><td><button onClick={() => onVisit({ kind: "page", id })}>{profile.label}</button></td><td>{profile.url.replace("https://", "")}</td><td>{profile.source}</td></tr>)}</tbody></table></section>
    <section><h2>Favorites / Bookmarks</h2><ul>{internetBookmarks.map((bookmark) => <li key={bookmark.url}><button onClick={() => onVisit(resolveAddress(bookmark.url))}>{bookmark.label}</button> — {bookmark.note}</li>)}</ul></section>
    <p className="oldweb-note">Some pages are live. Some are local. Broken providers are allowed to be broken honestly.</p>
  </div>;
}

function ProviderPage({ id, refreshKey, setStatus, onRefresh }: { id: ProfileId; refreshKey: number; setStatus: Dispatch<SetStateAction<string>>; onRefresh: () => void }) {
  const profile = internetProfiles[id];
  if (id === "x" || id === "linkedin" || id === "storygraph") return <LocalProfilePage id={id} />;
  return <LiveProviderPage key={`${id}-${refreshKey}`} id={id} profile={profile} refreshKey={refreshKey} setStatus={setStatus} onRefresh={onRefresh} />;
}

function LiveProviderPage({ id, profile, refreshKey, setStatus, onRefresh }: { id: "github" | "leetcode" | "letterboxd"; profile: (typeof internetProfiles)[ProfileId]; refreshKey: number; setStatus: Dispatch<SetStateAction<string>>; onRefresh: () => void }) {
  const [state, setState] = useState<ProviderState>({ loading: true, data: null, error: null });
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/internet/${id}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json() as { error?: string } & Record<string, unknown>;
        if (!response.ok) throw new Error(payload.error || `${profile.label} returned an error.`);
        return payload;
      })
      .then((data) => { setState({ loading: false, data, error: null }); setStatus("Done"); })
      .catch((error) => { if (error.name !== "AbortError") { setState({ loading: false, data: null, error: error.message }); setStatus("Provider unavailable"); } });
    return () => controller.abort();
  }, [id, profile.host, profile.label, refreshKey, setStatus]);

  if (state.loading) return <BrowserLoading host={profile.host} />;
  if (state.error) return <ProviderError id={id} error={state.error} onRefresh={onRefresh} />;
  if (id === "github") return <GitHubPage data={state.data as GitHubData} />;
  if (id === "leetcode") return <LeetCodePage data={state.data as LeetCodeData} />;
  return <LetterboxdPage data={state.data as LetterboxdData} />;
}

function ProfileHeader({ id }: { id: ProfileId }) {
  const profile = internetProfiles[id];
  return <header className="provider-header"><div><span>{profile.source}</span><h1>{profile.label}</h1><p>{profile.handle}</p></div><a className="win95-button" href={profile.url} target="_blank" rel="noreferrer">Open on the real internet <ExternalLink size={13} /></a></header>;
}

function LocalProfilePage({ id }: { id: "x" | "linkedin" | "storygraph" }) {
  const profile = internetProfiles[id];
  const unavailable = id === "x" ? "live feed unavailable through this extremely legitimate 1998 browser." : id === "linkedin" ? "live activity is unavailable without bothering LinkedIn's locked front door." : "StoryGraph does not expose a reliable public activity feed for this profile.";
  return <div className="provider-page"><ProfileHeader id={id} /><section className="provider-section"><h2>Locally configured profile information</h2><dl><dt>Address</dt><dd><a href={profile.url} target="_blank" rel="noreferrer">{profile.url}</a></dd><dt>Known as</dt><dd>{profile.handle}</dd><dt>About</dt><dd>{profile.localNote}</dd></dl></section><div className="provider-notice"><strong>LOCAL</strong><p>{unavailable}</p><p>No posts are being invented to fill this space.</p></div></div>;
}

function BrowserLoading({ host }: { host: string }) {
  return <div className="browser-message"><Globe2 size={34} /><strong>Connecting to {host}...</strong><span>Receiving data...</span></div>;
}

function ProviderError({ id, error, onRefresh }: { id: "github" | "leetcode" | "letterboxd"; error: string; onRefresh: () => void }) {
  return <div className="provider-page"><ProfileHeader id={id} /><div className="provider-error"><strong>Internet Explorer cannot retrieve live activity.</strong><p>{error}</p><button className="win95-button" onClick={onRefresh}>Retry</button></div></div>;
}

function ExternalInterstitial({ url }: { url: string }) {
  return <div className="external-interstitial"><Globe2 size={42} /><h2>This page lives on the real internet.</h2><p>{url}</p><p>Opening arbitrary pages inside this browser would be unreliable and impolite.</p><a className="win95-button" href={url} target="_blank" rel="noreferrer">Open page <ExternalLink size={13} /></a></div>;
}

type GitHubData = { source: "LIVE"; fetchedAt: string; profile: { login: string; name: string | null; bio: string | null; location: string | null; publicRepos: number; followers: number; following: number; url: string }; repositories: Array<{ name: string; description: string | null; language: string | null; stars: number; forks: number; updatedAt: string; url: string; archived: boolean }> };
function GitHubPage({ data }: { data: GitHubData }) {
  return <div className="provider-page"><ProfileHeader id="github" /><section className="provider-section"><h2>Public identity</h2><dl><dt>Name</dt><dd>{data.profile.name ?? data.profile.login}</dd><dt>Bio</dt><dd>{data.profile.bio ?? "No public bio."}</dd><dt>Location</dt><dd>{data.profile.location ?? "Not listed"}</dd><dt>Repositories</dt><dd>{data.profile.publicRepos}</dd><dt>Followers</dt><dd>{data.profile.followers}</dd></dl></section><section className="provider-section"><h2>Recently updated repositories</h2><table className="provider-table"><thead><tr><th>Repository</th><th>Language</th><th>Stars</th><th>Updated</th></tr></thead><tbody>{data.repositories.map((repo) => <tr key={repo.url}><td><a href={repo.url} target="_blank" rel="noreferrer">{repo.name}</a>{repo.description && <small>{repo.description}</small>}</td><td>{repo.language ?? "—"}</td><td>{repo.stars}</td><td>{formatDate(repo.updatedAt)}</td></tr>)}</tbody></table></section><SourceStamp at={data.fetchedAt} /></div>;
}

type LeetCodeData = { source: "LIVE"; fetchedAt: string; username: string; ranking: number | null; solved: { total: number; easy: number; medium: number; hard: number }; recent: Array<{ title: string; language: string; submittedAt: string; url: string }> };
function LeetCodePage({ data }: { data: LeetCodeData }) {
  return <div className="provider-page"><ProfileHeader id="leetcode" /><section className="provider-section"><h2>Accepted solutions</h2><table className="stats-table"><tbody><tr><th>Total</th><td>{data.solved.total}</td><th>Ranking</th><td>{data.ranking?.toLocaleString() ?? "Unavailable"}</td></tr><tr><th>Easy</th><td>{data.solved.easy}</td><th>Medium</th><td>{data.solved.medium}</td></tr><tr><th>Hard</th><td>{data.solved.hard}</td><th>User</th><td>{data.username}</td></tr></tbody></table></section><section className="provider-section"><h2>Recent accepted submissions</h2>{data.recent.length ? <ul className="provider-list">{data.recent.map((item, index) => <li key={`${item.url}-${index}`}><a href={item.url} target="_blank" rel="noreferrer">{item.title}</a><span>{item.language} · {formatDate(item.submittedAt)}</span></li>)}</ul> : <p>No public recent submissions were returned.</p>}</section><SourceStamp at={data.fetchedAt} /></div>;
}

type LetterboxdData = { source: "LIVE"; fetchedAt: string; items: Array<{ title: string; rating: string; watchedDate: string; publishedAt: string; link: string }> };
function LetterboxdPage({ data }: { data: LetterboxdData }) {
  return <div className="provider-page"><ProfileHeader id="letterboxd" /><section className="provider-section"><h2>Recent diary entries</h2><table className="provider-table"><thead><tr><th>Film</th><th>Rating</th><th>Watched</th></tr></thead><tbody>{data.items.map((item, index) => <tr key={`${item.link}-${index}`}><td><a href={item.link} target="_blank" rel="noreferrer">{item.title}</a></td><td>{item.rating ? `${item.rating} / 5` : "—"}</td><td>{item.watchedDate || formatDate(item.publishedAt)}</td></tr>)}</tbody></table></section><SourceStamp at={data.fetchedAt} /></div>;
}

function SourceStamp({ at }: { at: string }) {
  return <p className="source-stamp"><strong>LIVE</strong> received {new Date(at).toLocaleString()}</p>;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function safeHost(value: string) {
  try { return new URL(value).host; } catch { return "real internet"; }
}
