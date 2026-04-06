/** 插件日志预览区 HTML 转义与行内语法高亮（与 .plugin-log-hl-* 样式配合） */

export function escapeHtmlLog(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function highlightPluginLogLine(line: string): string {
  let s = escapeHtmlLog(line);
  s = s.replace(
    /^(\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:[.,:]\d{1,9})?)/,
    '<span class="plugin-log-hl-ts">$1</span>'
  );
  s = s.replace(/\b(ERROR|FATAL)\b/g, '<span class="plugin-log-hl-err">$1</span>');
  s = s.replace(/\b(WARN|WARNING)\b/g, '<span class="plugin-log-hl-warn">$1</span>');
  s = s.replace(/\bINFO\b/g, '<span class="plugin-log-hl-info">$1</span>');
  s = s.replace(/\b(DEBUG|TRACE)\b/g, '<span class="plugin-log-hl-debug">$1</span>');
  return s;
}

export function highlightPluginLogText(text: string): string {
  if (!text) return '';
  return text.split('\n').map((line) => highlightPluginLogLine(line)).join('\n');
}
