"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import type { AppId } from "@/types/desktop";

type Line = { command?: string; output: string };

export function TerminalApp({ onOpen }: { onOpen: (id: AppId) => void }) {
  const [lines, setLines] = useState<Line[]>([{ output: "Microsoft(R) Windows 95\nPersonal Internet [Version 1.2.2026]\n\nDIVS' PERSONAL CORNER OF THE INTERNET\ntype help or double-click My Computer." }]);
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
    if (command === "help") output = "SHELL     help · clear · dir · cd · pwd · open · history\nSYSTEM    whoami · ver · neofetch · fortune\nAPPS      my-computer · recycle-bin · terminal\nOTHER     sudo · ping forge";
    else if (command === "dir" || command === "ls") output = cwd.length ? "..\nREADME.TXT\nCOMPONENT.QUEUED" : "MY-COMPUTER   <APP>\nPROJECTS      <DIR>\nWRITING       <DIR>\nMEDIA         <DIR>\nFORGE.EXE";
    else if (command === "pwd") output = prompt.slice(0, -1);
    else if (command === "cd") { if (!args[0] || args[0] === "\\") setCwd([]); else if (args[0] === "..") setCwd((current) => current.slice(0, -1)); else if (["projects", "writing", "media"].includes(args[0])) setCwd([args[0]]); else output = "The system cannot find the path specified."; if (!output) output = "Directory changed."; }
    else if (command === "open" && ["my-computer", "computer"].includes(args[0])) { onOpen("my-computer"); output = "Opening My Computer..."; }
    else if (["my-computer", "computer"].includes(command)) { onOpen("my-computer"); output = "Opening My Computer..."; }
    else if (command === "open" && ["recycle-bin", "recycle", "trash"].includes(args[0])) { onOpen("recycle-bin"); output = "Opening Recycle Bin..."; }
    else if (["recycle-bin", "recycle", "trash"].includes(command)) { onOpen("recycle-bin"); output = "Opening Recycle Bin..."; }
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
    if (event.key === "Tab") { event.preventDefault(); const match = ["help", "dir", "cd", "pwd", "open", "clear", "history", "whoami", "ver", "neofetch", "fortune", "sudo", "ping"].find((item) => item.startsWith(value.toLowerCase())); if (match) setValue(match); }
  }

  return <div className="terminal-app"><nav className="window-menu"><span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>H</u>elp</span></nav><div className="terminal-screen" ref={scroller} onClick={() => document.getElementById("terminal-input")?.focus()}>{lines.map((line, index) => <div className="terminal-line" key={index}>{line.command && <span>{prompt} {line.command}{"\n\n"}</span>}{line.output}</div>)}<form onSubmit={submit} className="terminal-form"><label htmlFor="terminal-input">{prompt}</label><input id="terminal-input" value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={keyDown} autoComplete="off" autoFocus /></form></div><footer className="window-status"><span>Ready</span><span>NUM</span></footer></div>;
}
