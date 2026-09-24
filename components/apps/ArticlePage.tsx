import Link from "next/link";

export function ArticlePage({ title, meta, children }: { title: string; meta: string; children: React.ReactNode }) {
  return <main className="article-desktop"><article className="article-window"><header className="article-titlebar">▤ Notepad — {title}</header><nav className="article-menu">File&nbsp;&nbsp; Edit&nbsp;&nbsp; Search&nbsp;&nbsp; Help</nav><div className="article-paper"><Link href="/">C:\DIVS\WRITING</Link><h1>{title}</h1><div className="article-meta">{meta}</div>{children}<Link className="article-back" href="/">← return to divs.internet</Link></div></article></main>;
}
