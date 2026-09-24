"use client";

import type { KeyboardEvent, ReactNode } from "react";
import type { AppId } from "@/types/desktop";

type DesktopIconProps = {
  id: AppId;
  label: string;
  icon: ReactNode;
  selected: boolean;
  disabled?: boolean;
  onSelect: (id: AppId) => void;
  onOpen: (id: AppId) => void;
};

export function DesktopIcon({
  id,
  label,
  icon,
  selected,
  disabled = false,
  onSelect,
  onOpen,
}: DesktopIconProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter") onOpen(id);
  }

  return (
    <button
      className={`desktop-icon ${selected ? "selected" : ""} ${disabled ? "coming-soon" : ""}`}
      data-icon-id={id}
      aria-label={`${label}${disabled ? ", coming soon" : ""}`}
      aria-pressed={selected}
      onClick={() => onSelect(id)}
      onDoubleClick={() => onOpen(id)}
      onKeyDown={handleKeyDown}
    >
      <span className="desktop-icon-art" aria-hidden="true">{icon}</span>
      <span className="desktop-icon-label">{label}</span>
    </button>
  );
}
