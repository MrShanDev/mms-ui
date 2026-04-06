#!/usr/bin/env node
/**
 * 联邦插件前端：pnpm --filter <workspace 包名> <build|dev>
 * pnpm run fed:plugin-ui:build -- @mms-ui/plugin-xxx-ui
 * pnpm run fed:plugin-ui:dev -- @mms-ui/plugin-xxx-ui
 * FED_PLUGIN_PACKAGE=@mms-ui/plugin-xxx-ui pnpm run fed:plugin-ui:build
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const CMDS = new Set(['build', 'dev']);

// pnpm 在「pnpm run … -- 包名」时会把 `--` 传给子进程，需跳过
const raw = process.argv.slice(2).filter((a) => a !== '--');
const cmd = raw[0]?.trim();
const pkg = raw[1]?.trim() || process.env.FED_PLUGIN_PACKAGE?.trim();

if (!cmd || !CMDS.has(cmd)) {
  console.error(
    'fed-plugin-ui: 子命令应为 build 或 dev。\n' +
      '  pnpm run fed:plugin-ui:build -- @mms-ui/plugin-xxx-ui\n' +
      '  pnpm run fed:plugin-ui:dev -- @mms-ui/plugin-xxx-ui'
  );
  process.exit(1);
}
if (!pkg) {
  console.error(
    'fed-plugin-ui: 缺少 workspace 包名。\n' +
      '  见上；或 FED_PLUGIN_PACKAGE=@mms-ui/plugin-xxx-ui pnpm run fed:plugin-ui:build'
  );
  process.exit(1);
}

const r = spawnSync('pnpm', ['--filter', pkg, cmd], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
});
process.exit(r.status ?? 1);
