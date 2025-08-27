module.exports = {
	// 一行最多多少个字符（适合大多数屏幕阅读）
	printWidth: 100,

	// 指定每个缩进级别的空格数
	tabWidth: 2,

	// 使用空格而不是制表符缩进行（避免与ESLint冲突）
	useTabs: false,

	// 在语句末尾打印分号
	semi: true,

	// 使用单引号而不是双引号
	singleQuote: true,

	// 对象属性引号处理：按需要添加引号
	quoteProps: 'as-needed',

	// 在JSX中使用单引号而不是双引号
	jsxSingleQuote: false,

	// 多行时尽可能打印尾随逗号
	trailingComma: 'es5',

	// 在对象文字中的括号之间打印空格
	bracketSpacing: true,

	// JSX标签的闭合括号位置（新版本选项名，替换已弃用的 jsxBracketSameLine）
	bracketSameLine: false,

	// 在单独的箭头函数参数周围包括括号 always：(x) => x
	arrowParens: 'always',

	// 不需要自动在文件开头插入 @prettier
	requirePragma: false,

	// 不需要自动在文件开头插入 @prettier
	insertPragma: false,

	// 使用默认的折行标准
	proseWrap: 'preserve',

	// 指定HTML文件的全局空格敏感度
	htmlWhitespaceSensitivity: 'css',

	// Vue文件脚本和样式标签缩进（启用以更好地格式化Vue文件）
	vueIndentScriptAndStyle: true,

	// 换行符使用 lf
	endOfLine: 'lf',

	// 文件类型覆盖配置
	overrides: [
		{
			files: '*.vue',
			options: {
				parser: 'vue',
				htmlWhitespaceSensitivity: 'ignore'
			}
		},
		{
			files: '*.html',
			options: {
				parser: 'html'
			}
		},
		{
			files: '*.json',
			options: {
				parser: 'json'
			}
		},
		{
			files: '*.md',
			options: {
				parser: 'markdown'
			}
		}
	]
};
