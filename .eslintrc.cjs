module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		// 自动导入生成的文件（避免未导入报错）
		".eslintrc-auto-import.json",

		// Vue3 官方推荐规则
		"plugin:vue/vue3-recommended",

		// 导入/导出规范化
		"plugin:import/recommended",

		// Promise 最佳实践
		"plugin:promise/recommended",

		// 代码质量检测（圈复杂度等）
		"plugin:sonarjs/recommended",

		// 命名格式规范（如 camelCase）
		"plugin:case-police/recommended",

		// 正则表达式校验规则
		"plugin:regexp/recommended",

		// 'plugin:unicorn/recommended',
	],

	parser: "vue-eslint-parser",
	parserOptions: {
		ecmaVersion: 13,
		sourceType: "module",
	},
	plugins: ["vue", "regex", "regexp"],

	// 忽略文件
	ignorePatterns: ["plugins/iconify/*.js", "node_modules", "dist", "*.d.ts", "vendor", "*.json"],
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

		// 禁止 switch 语句出现重复标签
		"no-duplicate-case": "error",

		// 禁止出现空代码块
		"no-empty": "error",

		// 禁止不必要的嵌套块
		"no-lone-blocks": "error",

		// 空行最多不超过4行
		"no-multiple-empty-lines": ["error", { max: 4 }],

		// 禁止数组中出现空值
		"no-sparse-arrays": "error",

		// 变量初始化时不能直接给它赋值为 undefined
		"no-undef-init": "error",

		// 不能有无法执行的代码
		"no-unreachable": "error",

		// 禁止不必要的 call 和 apply
		"no-useless-call": "error",

		// 禁止没必要的布尔值转换
		"no-extra-boolean-cast": "error",

		// 禁止多余分号
		"no-extra-semi": "error",

		// 禁止对象字面量存在重复键
		"no-dupe-keys": "error",

		// 禁止函数参数中出现重复参数
		"no-dupe-args": "error",

		// 禁止出现声明未使用
		"no-unused-vars": ["error", { args: "none" }],

		// 禁止使用 eval
		"no-eval": 2,

		// 控制逗号前后空格
		"comma-spacing": ["error", { before: false, after: true }],

		// 控制对象字面量冒号前后空格
		"key-spacing": ["error", { afterColon: true }],

		"node/prefer-global/process": ["off"],
		"sonarjs/cognitive-complexity": ["off"],

		// 控制vue模板标签中第一个属性的换行行为
		"vue/first-attribute-linebreak": [
			"error",
			{
				singleline: "beside",
				multiline: "below",
			},
		],

		// 代码风格配置
		// 强制 Tab 缩进
		indent: ["error", "tab"],

		// 多行尾随逗号
		"comma-dangle": ["error", "always-multiline"],

		// 对象花括号空格
		"object-curly-spacing": ["error", "always"],

		// 自闭合标签规则
		"vue/html-self-closing": [
			"error",
			{
				html: {
					void: "always",
					normal: "never",
					component: "always",
				},
			},
		],

		// 强制驼峰大小写命名规范
		camelcase: "error",

		// 禁用 max-len
		"max-len": "off",

		// 代码是否尾随分号
		semi: ["error", "always"],

		// 箭头函数参数括号
		"arrow-parens": ["error", "as-needed"],

		// 在 return 前添加空行
		"newline-before-return": "error",

		// 强制在注释前添加空行
		"lines-around-comment": [
			"error",
			{
				// 是否在块注释（/* */）前添加空行
				beforeBlockComment: true,

				// 是否在行注释（//）前添加空行
				beforeLineComment: true,

				// 是否在代码块开始处紧邻注释
				allowBlockStart: true,

				// 是否在类定义开始处紧邻注释
				allowClassStart: true,

				// 是否在对象定义开始处紧邻注释
				allowObjectStart: true,

				// 是否在数组定义开始处紧邻注释
				allowArrayStart: true,

				// 忽略特定正则表达式的注释。 忽略注释中包含 !SECTION 的行
				ignorePattern: "!SECTION",
			},
		],

		// 控制数组中每个元素的换行行为 consistent：如果数组中有。如果数组中有任意一个元素换行，则所有元素都必须换行；always：强制换行；never：禁止换行；
		"array-element-newline": ["error", "consistent"],

		// 控制数组括号是否换行 consistent：如果数组内容换行，则括号也必须换行；always：强制换行；never：禁止换行；
		"array-bracket-newline": ["error", "consistent"],

		// vue专属配置
		// 允许单单词组件名
		"vue/multi-word-component-names": "off",

		// 控制不同类型语句之间的空白行
		"padding-line-between-statements": [
			"error",
			{ blankLine: "always", prev: "expression", next: "const" },
			{ blankLine: "always", prev: "const", next: "expression" },
			{ blankLine: "always", prev: "multiline-const", next: "*" },
			{ blankLine: "always", prev: "*", next: "multiline-const" },
		],

		// 是否优先使用默认导出
		"import/prefer-default-export": "off",

		// 控制导入语句之后的空白行数量
		"import/newline-after-import": ["error", { count: 1 }],

		//控制哪些导入语句被禁止
		"no-restricted-imports": [
			"error",
			"vuetify/components",
			{
				name: "vue3-apexcharts",
				message: "apexcharts are auto imported",
			},
		],

		// 导入文件路径是否需要后缀扩展名
		"import/extensions": [
			"error",
			"ignorePackages",
			{
				js: "never",
				jsx: "never",
				ts: "never",
				tsx: "never",
			},
		],

		// 控制导入语句中的模块是否能够被正确解析
		"import/no-unresolved": [
			2,
			{
				ignore: [
					"~pages$",
					"virtual:generated-layouts",
					"#components$",

					// Ignore vite's ?raw imports
					".*\?raw",

					// Ignore nuxt auth in nuxt version
					"#auth$",
				],
			},
		],

		// 是否校验局部变量名和外部模块变量名是否重复
		"no-shadow": "off",

		// 校验promise是否有返回值
		"promise/always-return": "off",

		// 校验promise是否有捕获错误
		"promise/catch-or-return": "off",

		// ESLint plugin vue
		// 校验块级元素是否符合换行规范
		"vue/block-tag-newline": "error",

		// 校验Vue书写风格（Options API && Compostion API）是否符合规范
		"vue/component-api-style": "error",

		// 校验vue组件名的命名规范
		"vue/component-name-in-template-casing": ["error", "PascalCase"],

		// 校验自定义时间名称的命名规范
		"vue/custom-event-name-casing": [
			"error",
			"camelCase",
			{
				ignores: ["/^(click):[a-z]+((\d)|([A-Z0-9][a-z0-9]+))*([A-Z])?/"],
			},
		],

		// 校验defin...等宏函数的顺序
		"vue/define-macros-order": "error",

		// 校验vue模板中注释的换行行为
		"vue/html-comment-content-newline": "error",

		"vue/singleline-html-element-content-newline": "off",

		"vue/no-template-shadow": "off",

		// 校验vue模板中注释的前后空格
		"vue/html-comment-content-spacing": "error",

		// 校验vue模板中的注释缩进
		"vue/html-comment-indent": "error",

		// 校验vue组件名是否与文件名一致
		"vue/match-component-file-name": "error",

		// 校验vue组件是否允许子内容
		"vue/no-child-content": "error",

		// 校验vue组件中prop是否有默认值
		"vue/require-default-prop": "off",

		// 校验vue组件中是否有重复继承属性
		"vue/no-duplicate-attr-inheritance": "error",

		// 校验组件中是否存在空块
		"vue/no-empty-component-block": "error",

		// 校验class中是否存在多个对象
		"vue/no-multiple-objects-in-class": "error",

		// 校验vue组件名是否是保留字段
		"vue/no-reserved-component-names": "error",

		// 校验vue模板中是否使用target="_blank"
		"vue/no-template-target-blank": "error",

		// 校验模板中是否使用无效的插值表达式
		"vue/no-useless-mustaches": "error",

		// 校验模板中是否存在无用的v-bind
		"vue/no-useless-v-bind": "error",

		// 校验模板中不同块之间的空行
		"vue/padding-line-between-blocks": "error",

		// 校验模板中是否使用了单独的静态类
		"vue/prefer-separate-static-class": "error",
		"vue/prefer-true-attribute-shorthand": "error",
		"vue/v-on-function-call": "error",
		"vue/no-restricted-class": ["error", "/^(p|m)(l|r)-/"],
		"vue/valid-v-slot": [
			"error",
			{
				allowModifiers: true,
			},
		],

		// 校验vue模板中的缩进
		"vue/html-indent": "off",

		// 校验模板中单行属性数量
		"vue/max-attributes-per-line": "off",

		// 校验并禁止在 Vue 模板中使用不规则的空白字符
		"vue/no-irregular-whitespace": "error",

		// 校验vue插值语法内外的空格
		"vue/template-curly-spacing": "error",

		// -- Sonarlint
		"sonarjs/no-duplicate-string": "off",
		"sonarjs/no-nested-template-literals": "off",

		// 自定义eslit规则
		"regex/invalid": [
			"error",
			[
				// 禁止使用 @/assets/images 路径导入图片，改用 @images
				{
					regex: "@/assets/images",
					replacement: "@images",
					message: "请使用 '@images' 路径别名从 '@/assets/images' 导入图片",
				},
				{
					regex: "@/assets/styles",
					replacement: "@styles",
					message: "请使用 '@styles' 路径别名从 'assets/styles' 导入样式",
				},

				// 为什么不让使用 mdi- ？？
				// {
				// 	id: "Disallow icon of icon library",
				// 	regex: "(mdi|tabler)-\\w",
				// 	message: "Only 'remix' icons are allowed",
				// },

				{
					regex: "@core/\\w",
					message: "你不可以在 @layouts 模块中使用 @core",
					files: {
						inspect: "@layouts/.*",
					},
				},
				{
					regex: "useLayouts\\(",
					message: "`useLayouts` composable 仅允许在 @layouts & @core 目录中使用。请使用 useThemeConfig composable",
					files: {
						inspect: "^(?!.*(@core|@layouts)).*",
					},
				},
			],

			// Ignore files
			"\.eslintrc\.cjs",
		],
	},
	settings: {
		"import/resolver": {
			node: true,
			typescript: { project: "./jsconfig.json" },
		},
	},
};
