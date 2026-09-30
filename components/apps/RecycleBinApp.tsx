"use client";

import { useState } from "react";
import { FileArchive, FileText, Folder, Recycle, RotateCcw, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type DeletedItem = { id: string; name: string; origin: string; deleted: string; note: string; icon: typeof FileText };

const initialItems: DeletedItem[] = [
  { id: "resume", name: "FINAL_FINAL_RESUME.pdf", origin: "C:\\DIVS\\Documents", deleted: "Today, 2:14 PM", note: "Final status could not be verified.", icon: FileText },
  { id: "sleep", name: "sleep_schedule.txt", origin: "C:\\DIVS\\Personal", deleted: "Yesterday, 4:03 AM", note: "0 KB", icon: FileText },
  { id: "windows", name: "windows_enjoyer.exe", origin: "C:\\DIVS\\Desktop", deleted: "Sep 17, 2026", note: "This program is corrupted and cannot be run. Probably for the best.", icon: FileArchive },
  { id: "startup", name: "startup_idea_47.txt", origin: "C:\\DIVS\\Ideas", deleted: "During a hackathon", note: "Uber, but for borrowing somebody else's fully configured development environment for six minutes.", icon: FileText },
  { id: "todo", name: "todo_old.txt", origin: "C:\\DIVS\\Desktop", deleted: "Unknown", note: "1. finish old todo list\n2. make new todo list instead", icon: FileText },
  { id: "sanity", name: "sanity.dll", origin: "C:\\WINDOWS\\SYSTEM", deleted: "Long ago", note: "This file cannot be restored.", icon: FileArchive },
  { id: "motivation", name: "motivation.tmp", origin: "C:\\DIVS\\TEMP", deleted: "Probably during a hackathon", note: "Last modified: probably during a hackathon.", icon: FileText },
  { id: "untitled", name: "untitled-project-23", origin: "C:\\DIVS\\LAB", deleted: "Before it had a name", note: "The folder is empty except for README-final-new.md.", icon: Folder },
];

export function RecycleBinApp() {
  const [items, setItems] = useState(initialItems);
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState<DeletedItem | null>(null);
  function restoreSelected() { if (!selected) return; setItems((current) => current.filter((item) => item.id !== selected)); setSelected(null); }
  function emptyBin() { setItems([]); setSelected(null); setMessage(null); }

  return <div className="recycle-app">
    <nav className="window-menu"><span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>H</u>elp</span></nav>
    <div className="recycle-toolbar"><button className="win95-button" disabled={!selected} onClick={restoreSelected}><RotateCcw size={16} /> Restore</button><AlertDialog><AlertDialogTrigger asChild><button className="win95-button" disabled={!items.length}><Trash2 size={16} /> Empty Recycle Bin</button></AlertDialogTrigger><AlertDialogContent className="win95-dialog" size="sm"><AlertDialogHeader><AlertDialogTitle>Delete these files?</AlertDialogTitle><AlertDialogDescription>This will permanently delete {items.length} object{items.length === 1 ? "" : "s"}. Some of them may deserve it.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="win95-button">Cancel</AlertDialogCancel><AlertDialogAction className="win95-button" onClick={emptyBin}>Yes</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div>
    <div className="address-row"><span>Address</span><div>C:\RECYCLED</div></div>
    <div className="recycle-content" onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
      {items.length ? <div className="recycle-grid">{items.map((item) => { const Icon = item.icon; return <button key={item.id} className={`recycle-file ${selected === item.id ? "selected" : ""}`} onClick={() => setSelected(item.id)} onDoubleClick={() => setMessage(item)} aria-pressed={selected === item.id} title={`From ${item.origin}\nDeleted ${item.deleted}`}><Icon size={35} strokeWidth={1.5} /><span>{item.name}</span></button>; })}</div> : <div className="recycle-empty"><Recycle size={48} strokeWidth={1.2} /><strong>Recycle Bin is empty.</strong><span>Suspicious. Divs never deletes anything properly.</span></div>}
      {message && <div className="recycle-message" role="dialog" aria-label={message.name}><div className="recycle-message-title">{message.name}<button onClick={() => setMessage(null)}>×</button></div><div><span className="recycle-warning">!</span><p>{message.note}</p></div><button className="win95-button" onClick={() => setMessage(null)}>OK</button></div>}
    </div>
    <footer className="window-status"><span>{items.length} object{items.length === 1 ? "" : "s"}</span><span>{selected ? "1 selected" : "Ready"}</span></footer>
  </div>;
}
