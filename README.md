# divs.internet

Divs' personal corner of the internet, built as an interactive Windows-style desktop.

This repository now uses a component-based Next.js/TypeScript architecture rather than the original static prototype.

## Current slice

- Reducer-driven desktop window manager
- Selectable desktop icons with keyboard navigation
- Draggable, focusable, minimizable and maximizable windows
- Functional terminal application
- Complete **My Computer** desktop component
- Taskbar state synchronized with open applications
- Direct article routes

The remaining desktop applications are being built one component at a time.

## Development

```bash
pnpm install
pnpm dev
```

Production build:

```bash
pnpm build
```
