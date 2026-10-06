export const fallbackBrand = {
  globalTitle: '模块化管理系统',
  globalDescription: '以模块构建业务，以统一工作台连接团队。',
  loginBg: '',
};
function text(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}
/** Accept web images and site-relative assets, never executable or local-file URLs. */
export function imageAddress(value: unknown): string {
  if (typeof value !== 'string') return '';
  const s = value.trim();
  if (!s || Array.from(s).some((char) => char === '\\' || char.charCodeAt(0) <= 32)) return '';
  if (s.startsWith('/') && !s.startsWith('//')) return s;
  try {
    const u = new URL(s);
    return ['http:', 'https:'].includes(u.protocol) && !u.username && !u.password ? u.href : '';
  } catch {
    return '';
  }
}
export function normalizeBrand(data: Record<string, unknown>, localLogo: string) {
  return {
    globalTitle: text(data.globalTitle, fallbackBrand.globalTitle),
    globalDescription: text(data.globalDescription, fallbackBrand.globalDescription),
    logo: imageAddress(data.logo) || localLogo,
    loginBg: imageAddress(data.loginBg),
  };
}
