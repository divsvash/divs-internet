"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import type { AppId } from "@/types/desktop";

type Line = { command?: string; output: string };

export function TerminalApp({ onOpen }: { onOpen: (id: AppId) => void }) {
  const [lines, setLines] = useState<Line[]>([{ output: "C:\\DIVS>\n\nhi.\n\nyou found my computer.\n\ntype help if you're lost." }]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [cwd, setCwd] = useState<string[]>([]);
  const scroller = useRef<HTMLDivElement>(null);
  const prompt = `C:\\DIVS${cwd.length ? `\\${cwd.join("\\").toUpperCase()}` : ""}>`;

  function run(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const [command, ...args] = trimmed.toLowerCase().split(/\s+/);
    const updatedHistory = [...history, trimmed];
    setHistory(updatedHistory); setHistoryIndex(updatedHistory.length);
    if (command === "clear" || command === "cls") { setLines([]); return; }
    let output = "";
    if (command === "help") output = "people\n  about       who the hell is divs\n  now         what i'm doing lately\n\nthings\n  projects    things i've built\n  writing     things i've written\n  lab         unfinished / questionable things\n\nbrain\n  books       things i recommend\n  movies      things i recommend\n  music       divs.radio\n  rabbit      current rabbit holes\n\ninternet\n  x\n  github\n  linkedin\n  letterboxd\n  storygraph\n  leetcode\n\nother\n  forge\n  bookmarks\n  random\n  guestbook";
    else if (command === "about") output = "divs is divyanshi.\n\nshe builds systems, writes when a thought won't leave her alone, and keeps turning rabbit holes into projects.\n\ncurrently studying computer science; permanently suspicious of black boxes.";
    else if (command === "now") output = "lately:\n\n  building local-first agents and context systems\n  thinking about evidence, memory, and model behaviour\n  writing more\n  trying to become frighteningly good at engineering\n\nthis changes often. probably before this page does.";
    else if (command === "dir" || command === "ls") output = cwd.length ? "..\nREADME.TXT\nCOMPONENT.QUEUED" : "MY-COMPUTER   <APP>\nPROJECTS      <DIR>\nWRITING       <DIR>\nMEDIA         <DIR>\nFORGE.EXE";
    else if (command === "pwd") output = prompt.slice(0, -1);
    else if (command === "cd") { if (!args[0] || args[0] === "\\") setCwd([]); else if (args[0] === "..") setCwd((current) => current.slice(0, -1)); else if (["projects", "writing", "media"].includes(args[0])) setCwd([args[0]]); else output = "The system cannot find the path specified."; if (!output) output = "Directory changed."; }
    else if (command === "open" && ["my-computer", "computer"].includes(args[0])) { onOpen("my-computer"); output = "Opening My Computer..."; }
    else if (["my-computer", "computer"].includes(command)) { onOpen("my-computer"); output = "Opening My Computer..."; }
    else if (command === "open" && ["recycle-bin", "recycle", "trash"].includes(args[0])) { onOpen("recycle-bin"); output = "Opening Recycle Bin..."; }
    else if (["recycle-bin", "recycle", "trash"].includes(command)) { onOpen("recycle-bin"); output = "Opening Recycle Bin..."; }
    else if (command === "open" && ["internet", "browser", "web"].includes(args[0])) { onOpen("internet"); output = "Connecting to divs.internet..."; }
    else if (["internet", "browser", "web"].includes(command)) { onOpen("internet"); output = "Connecting to divs.internet..."; }
    else if (command === "open" && ["radio", "music", "cd-player"].includes(args[0])) { onOpen("radio"); output = "Opening divs.radio..."; }
    else if (["radio", "music", "cd-player"].includes(command)) { onOpen("radio"); output = "Opening divs.radio..."; }
    else if (command === "open" && ["projects", "work"].includes(args[0])) { onOpen("projects"); output = "Opening C:\\DIVS\\PROJECTS..."; }
    else if (["projects", "work"].includes(command)) { onOpen("projects"); output = "Opening C:\\DIVS\\PROJECTS..."; }
    else if (command === "open" && ["writing", "blog", "articles"].includes(args[0])) { onOpen("writing"); output = "Opening C:\\DIVS\\WRITING..."; }
    else if (["writing", "blog", "articles"].includes(command)) { onOpen("writing"); output = "Opening C:\\DIVS\\WRITING..."; }
    else if (command === "lab") output = "C:\\DIVS\\LAB\n\nunfinished things live here. prototypes, abandoned interfaces, suspicious scripts, and ideas that became larger than the weekend they were assigned to.\n\nthere isn't a safe public index yet.";
    else if (command === "books") output = "the bookshelf is still being catalogued.\n\nfor now: systems books, strange fiction, essays with too many underlines, and anything that changes how i look at a machine.";
    else if (command === "movies") output = "the film shelf is not mounted yet.\n\nletterboxd has the evidence. type letterboxd.";
    else if (command === "rabbit") output = "current rabbit holes:\n\n  local-first software\n  agent evaluation and evidence\n  context that survives tool-switching\n  distributed systems\n  old interfaces that trusted the user to explore";
    else if (["x", "github", "linkedin", "letterboxd"].includes(command)) { onOpen("internet"); output = `Opening ${command} inside The Internet...`; }
    else if (command === "storygraph") output = "the reading history hasn't been wired into this machine yet.\n\ncome back when the bookshelf stops being a pile.";
    else if (command === "leetcode") output = "leetcode connection pending.\n\nthere are solved problems. there is also damage.";
    else if (command === "forge") output = "FORGE.EXE is asleep.\n\nlocal coding agent. runs on ollama. uses tools, keeps evidence, and is learning not to believe its own success messages.\n\nping forge if you want to bother it.";
    else if (command === "bookmarks") output = "bookmarks are currently an archaeological site.\n\ninteresting papers, tiny tools, beautiful personal websites, and seventeen tabs about one problem.";
    else if (command === "random") output = ["make a bad version. learn why it's bad. make the next one.", "somewhere on this computer is a file named FINAL_final_v2.", "the machine is old. the opinions are current.", "you should probably type rabbit."].at(updatedHistory.length % 4) ?? "hi again.";
    else if (command === "guestbook") output = "the guestbook isn't connected yet.\n\nfor now, consider your presence mysteriously logged.";
    else if (command === "history") output = updatedHistory.map((item, index) => `${String(index + 1).padStart(2, "0")}  ${item}`).join("\n");
    else if (command === "whoami") output = "divs — engineer, writer, professional rabbit-hole resident.";
    else if (command === "ver") output = "divs.internet 95 [Version 1.2.2026]\nReact desktop subsystem: operational.";
    else if (command === "neofetch") output = "divs@internet\n─────────────\nOS        divs.internet 95\nShell     divs.exe\nProjects  too many\nResident  Forge :3";
    else if (command === "fortune") output = "the best way to understand a system is to build a terrible version of it.";
    else if (command === "sudo") output = "Forge: divs already owns this machine. You do not.";
    else if (command === "ping" && args[0] === "forge") output = "reply from FORGE.EXE: bytes=3 mood=:3";
    else output = `Bad command or file name: ${command}`;
    setLines((current) => [...current, { command: trimmed, output }]);
    requestAnimationFrame(() => { if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; });
  }

  function submit(event: FormEvent) { event.preventDefault(); run(value); setValue(""); }
  function keyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp") { event.preventDefault(); const next = Math.max(0, historyIndex - 1); setHistoryIndex(next); setValue(history[next] ?? ""); }
    if (event.key === "ArrowDown") { event.preventDefault(); const next = Math.min(history.length, historyIndex + 1); setHistoryIndex(next); setValue(history[next] ?? ""); }
    if (event.key === "Tab") { event.preventDefault(); const match = ["help", "about", "now", "projects", "writing", "lab", "books", "movies", "music", "rabbit", "x", "github", "linkedin", "letterboxd", "storygraph", "leetcode", "forge", "bookmarks", "random", "guestbook", "dir", "cd", "pwd", "open", "clear", "history", "whoami", "ver", "neofetch", "fortune", "sudo", "ping"].find((item) => item.startsWith(value.toLowerCase())); if (match) setValue(match); }
  }

  return <div className="terminal-app"><nav className="window-menu"><span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>H</u>elp</span></nav><div className="terminal-screen" ref={scroller} onClick={() => document.getElementById("terminal-input")?.focus()}>{lines.map((line, index) => <div className="terminal-line" key={index}>{line.command && <span>{prompt} {line.command}{"\n\n"}</span>}{line.output}</div>)}<form onSubmit={submit} className="terminal-form"><label htmlFor="terminal-input">{prompt}</label><input id="terminal-input" value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={keyDown} autoComplete="off" autoFocus /></form></div><footer className="window-status"><span>Ready</span><span>NUM</span></footer></div>;
}
