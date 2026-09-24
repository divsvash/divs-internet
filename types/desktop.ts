import type { ReactNode } from "react";

export type AppId =
  | "terminal"
  | "my-computer"
  | "projects"
  | "writing"
  | "radio"
  | "internet"
  | "recycle-bin"
  | "forge";

export type WindowState = {
  id: AppId;
  title: string;
  icon: ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
};

export type WindowAction =
  | { type: "OPEN"; id: AppId }
  | { type: "CLOSE"; id: AppId }
  | { type: "FOCUS"; id: AppId }
  | { type: "MINIMIZE"; id: AppId }
  | { type: "TOGGLE_MAXIMIZE"; id: AppId }
  | { type: "MOVE"; id: AppId; position: WindowState["position"] };
