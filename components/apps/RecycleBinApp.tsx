"use client";

import { useState } from "react";
import { FileArchive, FileImage, FileText, Recycle, RotateCcw, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DeletedItem = {
  id: string;
  name: string;
  origin: string;
  deleted: string;
  icon: typeof FileText;
};

const initialItems: DeletedItem[] = [
  { id: "portfolio", name: "generic_portfolio_v4.zip", origin: "C:\\DIVS\\Desktop", deleted: "Today, 2:14 PM", icon: FileArchive },
  { id: "gradient", name: "gradient_blob_final.png", origin: "C:\\DIVS\\Assets", deleted: "Yesterday, 11:48 PM", icon: FileImage },
  { id: "passionate", name: "passionate_developer.txt", origin: "C:\\DIVS\\Documents", deleted: "Sep 17, 2026", icon: FileText },
];

export function RecycleBinApp() {
  const [items, setItems] = useState(initialItems);
  const [selected, setSelected] = useState<string | null>(null);

  function restoreSelected() {
    if (!selected) return;
    setItems((current) => current.filter((item) => item.id !== selected));
    setSelected(null);
  }

  function emptyBin() {
    setItems([]);
    setSelected(null);
  }

  return (
    <div className="recycle-app">
      <nav className="window-menu"><span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>H</u>elp</span></nav>
      <div className="recycle-toolbar">
        <button className="win95-button" disabled={!selected} onClick={restoreSelected}><RotateCcw size={16} /> Restore</button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="win95-button" disabled={!items.length}><Trash2 size={16} /> Empty Recycle Bin</button>
          </AlertDialogTrigger>
          <AlertDialogContent className="win95-dialog" size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete these files?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently delete {items.length} object{items.length === 1 ? "" : "s"}. Windows cannot undo this.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="win95-button">Cancel</AlertDialogCancel>
              <AlertDialogAction className="win95-button" onClick={emptyBin}>Yes</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="address-row"><span>Address</span><div>C:\\RECYCLED</div></div>
      <div className="recycle-content" onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
        {items.length ? (
          <div className="recycle-grid">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`recycle-file ${selected === item.id ? "selected" : ""}`}
                  onClick={() => setSelected(item.id)}
                  onDoubleClick={restoreSelected}
                  aria-pressed={selected === item.id}
                  title={`From ${item.origin}\nDeleted ${item.deleted}`}
                >
                  <Icon size={35} strokeWidth={1.5} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="recycle-empty"><Recycle size={48} strokeWidth={1.2} /><strong>Recycle Bin is empty.</strong><span>Good. The generic portfolio cannot hurt us anymore.</span></div>
        )}
      </div>
      <footer className="window-status"><span>{items.length} object{items.length === 1 ? "" : "s"}</span><span>{selected ? "1 selected" : "Ready"}</span></footer>
    </div>
  );
}
