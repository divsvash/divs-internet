"use client";
import { useReducer, useState, type KeyboardEvent, type ReactNode } from "react";
import { BookOpenText, Cat, Disc3, FolderKanban, Globe2, Monitor, Recycle, SquareTerminal } from "lucide-react";
import { DesktopIcon } from "./DesktopIcon";
import { Taskbar } from "./Taskbar";
import { WindowFrame } from "@/components/windows/WindowFrame";
import { MyComputerApp } from "@/components/apps/MyComputerApp";
import { TerminalApp } from "@/components/apps/TerminalApp";
import { activeWindowId, windowReducer } from "@/state/window-reducer";
import type { AppId, WindowState } from "@/types/desktop";

const iconMap: Record<AppId, ReactNode> = { terminal: <SquareTerminal size={18} />, "my-computer": <Monitor size={18} />, projects: <FolderKanban size={18} />, writing: <BookOpenText size={18} />, radio: <Disc3 size={18} />, internet: <Globe2 size={18} />, "recycle-bin": <Recycle size={18} />, forge: <Cat size={18} /> };
const desktopApps: Array<{ id: AppId; label: string; icon: ReactNode; ready: boolean }> = [
  { id: "my-computer", label: "My Computer", icon: <Monitor size={34} />, ready: true },
  { id: "projects", label: "My Projects", icon: <FolderKanban size={34} />, ready: false },
  { id: "writing", label: "My Writing", icon: <BookOpenText size={34} />, ready: false },
  { id: "radio", label: "divs.radio", icon: <Disc3 size={34} />, ready: false },
  { id: "internet", label: "The Internet", icon: <Globe2 size={34} />, ready: false },
  { id: "recycle-bin", label: "Recycle Bin", icon: <Recycle size={34} />, ready: false },
  { id: "forge", label: "FORGE.EXE", icon: <Cat size={34} />, ready: false },
];
const initialWindows: WindowState[] = [
  { id: "terminal", title: "MS-DOS Prompt — C:\\DIVS", icon: iconMap.terminal, isOpen: true, isMinimized: false, isMaximized: false, zIndex: 12, position: { x: 250, y: 62 }, size: { width: 720, height: 470 } },
  { id: "my-computer", title: "My Computer", icon: iconMap["my-computer"], isOpen: false, isMinimized: false, isMaximized: false, zIndex: 11, position: { x: 330, y: 95 }, size: { width: 700, height: 510 } },
  ...desktopApps.filter((app) => app.id !== "my-computer").map((app, index) => ({ id: app.id, title: app.label, icon: iconMap[app.id], isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, position: { x: 280 + index * 18, y: 85 + index * 14 }, size: { width: 560, height: 410 } })),
];

export function DesktopShell() {
  const [windows, dispatch] = useReducer(windowReducer, initialWindows);
  const [selected, setSelected] = useState<AppId | null>(null);
  const activeId = activeWindowId(windows);
  const open = (id: AppId) => dispatch({ type: "OPEN", id });
  function desktopKeyDown(event: KeyboardEvent<HTMLElement>) {
    const index = desktopApps.findIndex((app) => app.id === selected);
    if (event.key === "Enter" && selected && desktopApps.find((app) => app.id === selected)?.ready) open(selected);
    if (["ArrowDown", "ArrowRight"].includes(event.key)) { event.preventDefault(); setSelected(desktopApps[(index + 1 + desktopApps.length) % desktopApps.length].id); }
    if (["ArrowUp", "ArrowLeft"].includes(event.key)) { event.preventDefault(); setSelected(desktopApps[(index - 1 + desktopApps.length) % desktopApps.length].id); }
  }
  return <main className="desktop" tabIndex={-1} onKeyDown={desktopKeyDown} onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
    <div className="desktop-icons">{desktopApps.map((app) => <DesktopIcon key={app.id} {...app} selected={selected === app.id} disabled={!app.ready} onSelect={setSelected} onOpen={app.ready ? open : () => undefined} />)}</div>
    {windows.map((window) => <WindowFrame key={window.id} window={window} active={activeId === window.id} onFocus={() => dispatch({ type: "FOCUS", id: window.id })} onClose={() => dispatch({ type: "CLOSE", id: window.id })} onMinimize={() => dispatch({ type: "MINIMIZE", id: window.id })} onMaximize={() => dispatch({ type: "TOGGLE_MAXIMIZE", id: window.id })} onMove={(position) => dispatch({ type: "MOVE", id: window.id, position })}>{window.id === "terminal" ? <TerminalApp onOpen={open} /> : window.id === "my-computer" ? <MyComputerApp onOpen={open} /> : <div className="queued-app"><strong>{window.title}</strong><p>This component is next in the build queue.</p></div>}</WindowFrame>)}
    <Taskbar windows={windows} activeId={activeId} onTaskClick={(window) => dispatch({ type: window.isMinimized || activeId !== window.id ? "FOCUS" : "MINIMIZE", id: window.id })} />
  </main>;
}
