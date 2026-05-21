/**
 * 插件本地字典工具。
 * 各插件按自己的字典类型扩展本文件中的 map 和 options。
 * 纯 TypeScript，零宿主依赖。
 */

// ─── 通用状态映射 ───

export const SYS_STATE_MAP: Record<number, string> = { 1: '正常', 0: '停用' };
export const SYS_STATE_OPTIONS = [
  { label: '正常', value: 1 },
  { label: '停用', value: 0 },
];

// ─── helper ───

export function labelFromMap(map: Record<number, string>, val: number | string): string {
  const v = typeof val === 'string' ? parseInt(val, 10) : val;
  return map[v] ?? String(val);
}

export function optionsFromMap(map: Record<number, string>): { label: string; value: number }[] {
  return Object.entries(map).map(([k, v]) => ({ label: v, value: Number(k) }));
}