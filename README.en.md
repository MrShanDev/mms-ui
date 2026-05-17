# mms-ui (Admin UI)

English | [简体中文](README.md)

`mms-ui` is the **admin frontend** for MMS. It connects to the backend (`mms/mms-admin`) and also supports shipping **federated plugin UI packages** (Module Federation) that can be bundled into plugin JARs (see `mms-plugins/README.md`).

---

## Tech Stack

- Vue 3 + Vite + TypeScript
- Element Plus / Pinia / Vue Router
- Package manager: pnpm (recommended)

---

## Requirements

- Node.js 18+ (20 LTS recommended)
- pnpm 8+

---

## Quick Start

```bash
cd mms-ui
pnpm install
pnpm dev
```

Build & preview:

```bash
pnpm build
pnpm preview
```

---

## Module Federation (Plugin UI)

Example:

```bash
pnpm run fed:plugin-ui:build -- @mms-ui/plugin-syslog-ui
```

For the end-to-end convention (Nuxt/Vite build + Maven copy into `META-INF/mms/web`), see:

- `../mms-plugins/README.md`
- `.cursor/skills/mms-plugin/SKILL.md` (Chinese)

