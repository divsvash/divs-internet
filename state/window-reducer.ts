import type { AppId, WindowAction, WindowState } from "@/types/desktop";

function nextZ(windows: WindowState[]) {
  return Math.max(10, ...windows.map((window) => window.zIndex)) + 1;
}

export function windowReducer(
  windows: WindowState[],
  action: WindowAction,
): WindowState[] {
  const zIndex = nextZ(windows);
  return windows.map((window) => {
    if (window.id !== action.id) return window;
    switch (action.type) {
      case "OPEN":
        return { ...window, isOpen: true, isMinimized: false, zIndex };
      case "CLOSE":
        return { ...window, isOpen: false, isMinimized: false };
      case "FOCUS":
        return { ...window, isMinimized: false, zIndex };
      case "MINIMIZE":
        return { ...window, isMinimized: true };
      case "TOGGLE_MAXIMIZE":
        return { ...window, isMaximized: !window.isMaximized, zIndex };
      case "MOVE":
        return { ...window, position: action.position };
    }
  });
}

export function activeWindowId(windows: WindowState[]): AppId | null {
  const visible = windows.filter((window) => window.isOpen && !window.isMinimized);
  if (!visible.length) return null;
  return visible.reduce((front, window) =>
    window.zIndex > front.zIndex ? window : front,
  ).id;
}
