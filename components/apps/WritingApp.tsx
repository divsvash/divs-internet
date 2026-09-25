"use client";

import { useState } from "react";
import { FileText, NotebookPen } from "lucide-react";

const articles = [
  { id: "ai-brain", file: "AI-AND-YOUR-BRAIN.TXT", title: "The Line Between AI and Your Brain", date: "09.09.2026", read: "5 min", excerpt: "On outsourcing thought, vibe coding, and keeping your own taste.", href: "/the-line-between-ai-and-your-brain" },
  { id: "thinkpad", file: "THINKPAD-BEEF.TXT", title: "My Personal Beef With a ThinkPad", date: "10.09.2026", read: "4 min", excerpt: "A Windows funeral, an E420, and a very personal Linux installation.", href: "/my-personal-beef-with-a-thinkpad" },
];

export function WritingApp() {
  const [selected, setSelected] = useState(articles[0].id);
  const article = articles.find((item) => item.id === selected) ?? articles[0];
  return <div className="writing-app">
    <nav className="window-menu"><span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>H</u>elp</span></nav>
    <div className="explorer-toolbar"><button>← Back</button><button>Up</button><a className="win95-button" href={article.href}>Open</a></div>
    <div className="address-row"><span>Address</span><div>C:\DIVS\WRITING</div></div>
    <div className="content-explorer">
      <div className="content-list" role="listbox" aria-label="Published writing">
        <div className="content-list-head"><span>Name</span><span>Date</span></div>
        {articles.map((item) => <button key={item.id} className={selected === item.id ? "selected" : ""} onClick={() => setSelected(item.id)} onDoubleClick={() => { window.location.href = item.href; }} role="option" aria-selected={selected === item.id}><FileText size={24} /><span><strong>{item.file}</strong><small>{item.title}</small></span><time>{item.date}</time></button>)}
      </div>
      <aside className="content-preview writing-preview"><NotebookPen size={38} /><span className="content-kicker">Published essay</span><h2>{article.title}</h2><p>{article.excerpt}</p><dl><dt>Published</dt><dd>{article.date}</dd><dt>Reading time</dt><dd>{article.read}</dd></dl><a className="win95-button" href={article.href}>Read full article</a></aside>
    </div>
    <footer className="window-status"><span>{articles.length} object(s)</span><span>1 selected</span></footer>
  </div>;
}
