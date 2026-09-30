"use client";

import { useState } from "react";
import { FileText, Folder, Monitor } from "lucide-react";
import type { AppId } from "@/types/desktop";

type InternalFolder = "working-on" | "lab" | "rabbit-holes" | "archive";
type TextFile = "now" | "about" | "contact";
type ExplorerEntry = {
  id: string;
  name: string;
  kind: "folder" | "file";
  detail: string;
  app?: AppId;
  folder?: InternalFolder;
  file?: TextFile;
};

const rootEntries: ExplorerEntry[] = [
  { id: "projects", name: "PROJECTS", kind: "folder", detail: "things that escaped the lab", app: "projects" },
  { id: "working-on", name: "WORKING-ON", kind: "folder", detail: "currently making a mess in here", folder: "working-on" },
  { id: "writing", name: "WRITING", kind: "folder", detail: "essays, notes, and arguments with machines", app: "writing" },
  { id: "lab", name: "LAB", kind: "folder", detail: "unfinished / questionable things", folder: "lab" },
  { id: "rabbit-holes", name: "RABBIT-HOLES", kind: "folder", detail: "things that ate an afternoon", folder: "rabbit-holes" },
  { id: "archive", name: "ARCHIVE", kind: "folder", detail: "dormant, abandoned, or merely resting", folder: "archive" },
  { id: "now", name: "NOW.TXT", kind: "file", detail: "last changed recently enough", file: "now" },
  { id: "about", name: "ABOUT.TXT", kind: "file", detail: "not a résumé", file: "about" },
  { id: "contact", name: "CONTACT.TXT", kind: "file", detail: "places i can be found", file: "contact" },
];

const folderEntries: Record<InternalFolder, ExplorerEntry[]> = {
  "working-on": [
    { id: "forge", name: "FORGE", kind: "folder", detail: "teaching a tiny local coding agent when it is actually done" },
    { id: "cortex", name: "CORTEX", kind: "folder", detail: "trying to stop context from dying every time i switch AI tools" },
    { id: "divs-internet", name: "divs.internet", kind: "folder", detail: "you are currently inside this problem" },
    { id: "gate", name: "GATE-2027", kind: "folder", detail: "unfortunately, computer science has exams" },
  ],
  lab: [
    { id: "doom", name: "terminal-doom", kind: "folder", detail: "bad idea. excellent folder name." },
    { id: "agents", name: "tiny-agents", kind: "folder", detail: "small models with dangerous levels of confidence" },
    { id: "ui", name: "weird-ui-tests", kind: "folder", detail: "interfaces that probably annoyed somebody" },
    { id: "bad", name: "probably-a-bad-idea", kind: "folder", detail: "no further questions" },
  ],
  "rabbit-holes": [
    { id: "evals", name: "agent-evals.txt", kind: "file", detail: "what happened versus what the model says happened" },
    { id: "connectomes", name: "connectomes.txt", kind: "file", detail: "brains, graphs, and a fruit fly that knows too much" },
    { id: "old-web", name: "old-internet.txt", kind: "file", detail: "personal websites before every page became a funnel" },
    { id: "distributed", name: "distributed-systems.txt", kind: "file", detail: "everything fails, just not at the same time" },
    { id: "quantum", name: "quantum-algorithms.txt", kind: "file", detail: "still trying to make the maths behave" },
  ],
  archive: [
    { id: "campus", name: "campus-map-v1", kind: "folder", detail: "a campus contained more floors than expected" },
    { id: "planner", name: "old-gate-planner", kind: "folder", detail: "the schedule survived. my sleep did not." },
    { id: "ideas", name: "ideas-i-will-definitely-finish.txt", kind: "file", detail: "confidence: historically unsupported" },
    { id: "readme", name: "README-OLD.TXT", kind: "file", detail: "if this was clear it would not be archived" },
  ],
};

const textFiles: Record<TextFile, { title: string; body: string }> = {
  now: { title: "NOW.TXT", body: "right now:\n\nbuilding Forge and Cortex\nturning divs.internet into an actual computer\nlearning more about agent evaluation and distributed systems\npreparing for GATE 2027\nreading too many things at once\n\nlast updated: whenever this stopped being accurate" },
  about: { title: "ABOUT.TXT", body: "hi, i'm divyanshi. divs is easier.\n\ni build systems, agents, and interfaces for ideas i cannot leave alone. i write sometimes. i collect rabbit holes professionally.\n\nthis computer is a better introduction than a paragraph was ever going to be." },
  contact: { title: "CONTACT.TXT", body: "x           @divsvash\ngithub      github.com/divsvash\nlinkedin    divyanshi vashistha\nmedium      @divs4real\nletterboxd  @divsdiary\n\nemail is intentionally not lying around on the desktop." },
};

export function MyComputerApp({ onOpen }: { onOpen: (id: AppId) => void }) {
  const [folder, setFolder] = useState<InternalFolder | null>(null);
  const [file, setFile] = useState<TextFile | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const entries = folder ? folderEntries[folder] : rootEntries;
  const address = file ? `C:\\DIVS\\${textFiles[file].title}` : folder ? `C:\\DIVS\\${folder.toUpperCase()}` : "C:\\DIVS";

  function goRoot() { setFile(null); setFolder(null); setSelected(null); }
  function openEntry(entry: ExplorerEntry) {
    if (entry.app) onOpen(entry.app);
    else if (entry.folder) { setFolder(entry.folder); setFile(null); setSelected(null); }
    else if (entry.file) { setFile(entry.file); setSelected(null); }
  }

  return <div className="explorer-app">
    <nav className="window-menu" aria-label="My Computer menu"><span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>H</u>elp</span></nav>
    <div className="explorer-toolbar"><button onClick={goRoot} disabled={!folder && !file}>← Back</button><button onClick={goRoot} disabled={!folder && !file}>Up</button><button disabled={!selected} onClick={() => { const entry = entries.find((item) => item.id === selected); if (entry) openEntry(entry); }}>Open</button></div>
    <div className="address-row"><span>Address</span><div>{address}</div></div>
    <div className="computer-content filesystem-content">
      <aside className="computer-sidebar"><Monitor size={38} strokeWidth={1.7} /><strong>C:\DIVS</strong><p>Things I built, broke, wrote down, forgot about, or am still pretending are almost finished.</p><div className="system-status"><span>View</span><b>{file ? "text" : folder ?? "root"}</b><span>Resident</span><b>Forge :3</b></div></aside>
      {file ? <NotepadFile file={textFiles[file]} onClose={() => setFile(null)} /> : <div className="filesystem-list" role="listbox" aria-label={address}>
        <div className="filesystem-head"><span>Name</span><span>Type</span><span>Comment</span></div>
        {entries.map((entry) => <button key={entry.id} className={selected === entry.id ? "selected" : ""} onClick={() => setSelected(entry.id)} onDoubleClick={() => openEntry(entry)} role="option" aria-selected={selected === entry.id}>
          {entry.kind === "folder" ? <Folder size={24} fill="#f3d45d" color="#8a6a00" /> : <FileText size={22} color="#000080" />}
          <strong>{entry.name}{entry.kind === "folder" ? "/" : ""}</strong><span>{entry.kind === "folder" ? "File Folder" : "Text Document"}</span><small>{entry.detail}</small>
        </button>)}
      </div>}
    </div>
    <footer className="window-status"><span>{file ? "1 text document" : `${entries.length} object(s)`}</span><span>{selected ? "1 selected" : "Ready"}</span></footer>
  </div>;
}

function NotepadFile({ file, onClose }: { file: { title: string; body: string }; onClose: () => void }) {
  return <div className="notepad-file"><div className="notepad-menu"><span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>S</u>earch</span><span><u>H</u>elp</span><button onClick={onClose}>Close</button></div><pre>{file.body}</pre></div>;
}
