"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import type { WindowState } from "@/types/desktop";

type WindowFrameProps = {
  window: WindowState;
  active: boolean;
  children: ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onMove: (position: WindowState["position"]) => void;
};

export function WindowFrame({
  window,
  active,
  children,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onMove,
}: WindowFrameProps) {
  const dragOffset = useRef<{ x: number; y: number } | null>(null);

  if (!window.isOpen || window.isMinimized) return null;

  function startDrag(event: PointerEvent<HTMLElement>) {
    if (window.isMaximized || (event.target as HTMLElement).closest("button")) return;
    dragOffset.current = {
      x: event.clientX - window.position.x,
      y: event.clientY - window.position.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function drag(event: PointerEvent<HTMLElement>) {
    if (!dragOffset.current) return;
    onMove({
      x: Math.max(0, event.clientX - dragOffset.current.x),
      y: Math.max(0, event.clientY - dragOffset.current.y),
    });
  }

  return (
    <section
      className={`window-frame ${active ? "active" : ""} ${window.isMaximized ? "maximized" : ""}`}
      style={window.isMaximized ? { zIndex: window.zIndex } : {
        zIndex: window.zIndex,
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
      }}
      onPointerDown={onFocus}
      aria-label={window.title}
    >
      <header
        className="titlebar"
        onPointerDown={startDrag}
        onPointerMove={drag}
        onPointerUp={() => { dragOffset.current = null; }}
        onDoubleClick={onMaximize}
      >
        <span className="titlebar-label"><span>{window.icon}</span>{window.title}</span>
        <span className="window-controls">
          <button onClick={onMinimize} aria-label={`Minimize ${window.title}`}>_</button>
          <button onClick={onMaximize} aria-label={`Maximize ${window.title}`}>□</button>
          <button onClick={onClose} aria-label={`Close ${window.title}`}>×</button>
        </span>
      </header>
      {children}
    </section>
  );
}
