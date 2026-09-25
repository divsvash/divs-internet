"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Code2, Globe2, Newspaper, RefreshCw, Search, Send } from "lucide-react";

const links = [
  { label: "GitHub", handle: "github.com/divsvash", href: "https://github.com/divsvash", icon: Code2 },
  { label: "X / Twitter", handle: "x.com/divsvash", href: "https://x.com/divsvash", icon: Send },
  { label: "Medium", handle: "divs4real.medium.com", href: "https://divs4real.medium.com", icon: Newspaper },
  { label: "LinkedIn", handle: "Divyanshi Vashistha", href: "https://www.linkedin.com/in/divyanshi-vashistha-4a0266274", icon: BriefcaseBusiness },
];

const posts = [
  {
    title: "The Line Between AI and Your Brain",
    date: "09.09.2026",
    excerpt: "On outsourcing thought, vibe coding, and keeping your own taste.",
    href: "/the-line-between-ai-and-your-brain",
  },
  {
    title: "My Personal Beef With a ThinkPad",
    date: "10.09.2026",
    excerpt: "A Windows funeral, an E420, and a very personal Linux installation.",
    href: "/my-personal-beef-with-a-thinkpad",
  },
];

export function InternetApp() {
  const [address, setAddress] = useState("https://divs.internet/home");

  function navigate(event: FormEvent) {
    event.preventDefault();
    const value = address.trim();
    if (!value || value === "https://divs.internet/home") return;
    const target = value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;
    window.open(target, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="internet-app">
      <nav className="window-menu"><span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>G</u>o</span><span>F<u>a</u>vorites</span><span><u>H</u>elp</span></nav>
      <div className="browser-toolbar">
        <button className="browser-tool" disabled aria-label="Back"><ArrowLeft size={20} /><span>Back</span></button>
        <button className="browser-tool" disabled aria-label="Forward"><ArrowRight size={20} /><span>Forward</span></button>
        <button className="browser-tool" onClick={() => setAddress("https://divs.internet/home")} aria-label="Refresh"><RefreshCw size={20} /><span>Refresh</span></button>
        <button className="browser-tool" onClick={() => document.getElementById("internet-search")?.focus()} aria-label="Search"><Search size={20} /><span>Search</span></button>
      </div>
      <form className="browser-address" onSubmit={navigate}>
        <label htmlFor="internet-search">Address</label>
        <Globe2 size={16} />
        <input id="internet-search" value={address} onChange={(event) => setAddress(event.target.value)} aria-label="Web address" />
        <button className="win95-button" type="submit">Go</button>
      </form>
      <div className="internet-page">
        <header className="internet-masthead">
          <div className="internet-logo"><Globe2 size={33} /><span>divs.internet</span></div>
          <span>Divs&apos; personal corner of the internet</span>
        </header>
        <div className="internet-body">
          <section className="internet-section">
            <h2>Recently Posted</h2>
            <div className="recent-posts">
              {posts.map((post) => (
                <a className="recent-post" href={post.href} key={post.href}>
                  <span className="post-date">{post.date}</span>
                  <strong>{post.title}</strong>
                  <p>{post.excerpt}</p>
                  <span className="read-link">Read post →</span>
                </a>
              ))}
            </div>
          </section>
          <section className="internet-section">
            <h2>Elsewhere on the Internet</h2>
            <div className="internet-links">
              {links.map(({ label, handle, href, icon: Icon }) => (
                <a href={href} target="_blank" rel="noreferrer" key={href}>
                  <Icon size={24} />
                  <span><strong>{label}</strong><small>{handle}</small></span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
      <footer className="window-status"><span>Done</span><span>Internet zone</span></footer>
    </div>
  );
}
