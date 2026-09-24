"use client";
import { useEffect, useState } from "react";
import type { AppId, WindowState } from "@/types/desktop";

export function Taskbar({ windows, activeId, onTaskClick }: { windows: WindowState[]; activeId: AppId | null; onTaskClick: (window: WindowState) => void }) {
  const [time, setTime] = useState("");
  useEffect(() => { const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })); tick(); const timer = setInterval(tick, 30000); return () => clearInterval(timer); }, []);
  return <footer className="taskbar"><button className="start-button"><span>◆</span><b>Start</b></button><div className="task-divider" /><div className="task-list">{windows.filter((window) => window.isOpen).map((window) => <button key={window.id} className={`task-button ${activeId === window.id && !window.isMinimized ? "pressed" : ""}`} onClick={() => onTaskClick(window)}><span>{window.icon}</span>{window.title}</button>)}</div><div className="system-tray"><span>⌁</span><time>{time}</time></div></footer>;
}
