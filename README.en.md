<div align="center">
   <br/>
   <a href="https://mmsadmin.cn">
     <img width="150" src="https://mmsadmin.cn/logo.png" alt="MMS logo">
   </a>
   <h1>Modular Management System (MMS)</h1>
   <p><strong>mms-ui · Admin Frontend</strong></p>
   <p><a href="https://mmsadmin.cn/">📘 Online Docs · mmsadmin.cn</a> · <a href="https://gitee.com/MrShanDev/mms-ui">Gitee</a> · <a href="https://github.com/MrShanDev/mms-ui">GitHub</a></p>
   <br/>
</div>

English | [简体中文](README.md)

`mms-ui` is the **admin frontend** for MMS. It connects to the backend (`mms/mms-admin`) and also supports shipping **federated plugin UI packages** (Module Federation) that can be bundled into plugin JARs (see the `/mms-plugins/` section on [mmsadmin.cn](https://mmsadmin.cn)).

---

## Tech Stack

- Vue 3 + Vite + TypeScript
- Element Plus / Pinia / Vue Router
- Package manager: pnpm (recommended)

---

## Requirements

- Node.js 22 (used in this guide)
- pnpm 10 (install with `npm install -g pnpm@10`)

---

Node.js usually includes npm; pnpm must be installed separately. nvm manages Node.js versions. Maven is a separate Java build tool whose command is `mvn`.

**macOS / Linux / WSL: nvm, Node.js and pnpm**

Follow the [official nvm instructions](https://github.com/nvm-sh/nvm#installing-and-updating), then reopen your terminal. Skip nvm if you already have a suitable Node.js version and do not need version switching.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
```

In a new terminal:

```bash
command -v nvm
nvm install 22
nvm use 22
nvm alias default 22
node -v
npm -v
npm install -g pnpm@10
pnpm -v
```

Reinstall pnpm for the active Node.js version if it is missing after switching versions. Node.js 25+ does not bundle Corepack. On native Windows, use [nvm-windows](https://github.com/coreybutler/nvm-windows) or the official Node.js installer instead of the Shell script above.

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

For the end-to-end convention (Nuxt/Vite build + Maven copy into `META-INF/mms/web`), see the `/mms-plugins/` section on [mmsadmin.cn](https://mmsadmin.cn).

