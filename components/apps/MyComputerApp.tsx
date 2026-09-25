"use client";

import {
  BookOpenText,
  FolderKanban,
  Globe2,
  HardDrive,
  Lightbulb,
  Monitor,
  Radio,
} from "lucide-react";
import type { AppId } from "@/types/desktop";

type MyComputerAppProps = { onOpen: (id: AppId) => void };

const locations: Array<{
  id: AppId;
  label: string;
  detail: string;
  icon: typeof Monitor;
  ready: boolean;
}> = [
  { id: "projects", label: "Projects (C:)", detail: "Cortex, Forge, Helios, Converge", icon: HardDrive, ready: true },
  { id: "writing", label: "Writing (D:)", detail: "Essays, field notes, unfinished thoughts", icon: BookOpenText, ready: true },
  { id: "radio", label: "Media (E:)", detail: "Music, books, movies, LeetCode damage", icon: Radio, ready: true },
  { id: "internet", label: "The Internet", detail: "GitHub, X, Medium and elsewhere", icon: Globe2, ready: true },
  { id: "forge", label: "Forge", detail: "Resident robot cat and future maintainer", icon: FolderKanban, ready: false },
];

export function MyComputerApp({ onOpen }: MyComputerAppProps) {
  return (
    <div className="explorer-app">
      <nav className="window-menu" aria-label="My Computer menu"><span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>H</u>elp</span></nav>
      <div className="explorer-toolbar"><button>← Back</button><button>Up</button><button>Properties</button></div>
      <div className="address-row"><span>Address</span><div>C:\DIVS</div></div>
      <div className="computer-content">
        <aside className="computer-sidebar">
          <Monitor size={42} strokeWidth={1.7} />
          <strong>My Computer</strong>
          <p>Everything that lives inside divs.internet.</p>
          <div className="system-status"><span>System</span><b>online</b><span>Resident</span><b>Forge :3</b></div>
        </aside>
        <div className="drive-grid">
          {locations.map(({ id, label, detail, icon: Icon, ready }) => (
            <button key={id} className="drive-item" onDoubleClick={() => ready && onOpen(id)}>
              <Icon size={38} strokeWidth={1.6} aria-hidden="true" />
              <span><strong>{label}</strong><small>{detail}</small>{!ready && <em>component queued</em>}</span>
            </button>
          ))}
          <button className="drive-item text-file">
            <Lightbulb size={36} strokeWidth={1.6} aria-hidden="true" />
            <span><strong>NOW.TXT</strong><small>Building this computer one component at a time.</small></span>
          </button>
        </div>
      </div>
      <footer className="window-status"><span>6 object(s)</span><span>My Computer</span></footer>
    </div>
  );
}
