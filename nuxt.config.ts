import { fileURLToPath } from "node:url";
import vuetify from "vite-plugin-vuetify";
import svgLoader from "vite-svg-loader";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	runtimeConfig: {
		apiSecret: "default-value",
		// 公共配置，客户端也可访问
		public: {
			apiBase: process.env.NUXT_PUBLIC_APP_BASE_API_URL,
		},
	},
    routeRules: {
    '/**': { static: true }
  },
   nitro: {
    prerender: {
      routes: [
        // 预定义动态路由，根据实际情况修改
        '/analysisTool/1912040712307245058',
        '/analysisTools/All'
      ]
    }
  },
	app: {
    baseURL: process.env.NUXT_PUBLIC_APP_PUBLICPATH,
		head: {
			// titleTemplate: "%s - NuxtJS Admin Template",
			title: "SciAnalyse",
			link: [
				{
					rel: "icon",
					type: "image/x-icon",
					href: process.env.NUXT_PUBLIC_APP_PUBLICPATH  == '/' ? "/favicon.ico" : `${process.env.NUXT_PUBLIC_APP_PUBLICPATH}/favicon.ico`,
				},
			],
			meta: [
				{ charset: 'utf-8' },
			],
		},
	},

	devtools: {
		enabled: true,
	},

	css: ["@core/scss/template/index.scss", "@styles/styles.scss", "@/plugins/iconify/icons.css","@/plugins/fonts/iconfont.css"],

	/*
    ❗ Please read the docs before updating runtimeConfig
    https://nuxt.com/docs/guide/going-further/runtime-config
  */
	components: {
		dirs: [
			{
				path: "@/@core/components",
				pathPrefix: false,
			},
			{
				path: "~/components/global",
				global: true,
			},
			{
				path: "~/components",
				pathPrefix: false,
			},
		],
	},

	// auth: {
	//   baseURL: process.env.AUTH_ORIGIN,
	//   globalAppMiddleware: false,
	//
	//   provider: {
	//     type: 'authjs',
	//   },
	// },

	plugins: ["@/plugins/casl/index.js", "@/plugins/vuetify/index.js","@/plugins/fonts/iconfont.js", "@/plugins/iconify/index.js", "@/plugins/timeZone.js", "@/plugins/phone.js"],

	imports: {
		dirs: ["./@core/utils", "./@core/composable/", "./plugins/*/composables/*"],
	},

	hooks: {},

	experimental: {
		typedPages: true,
	},

	typescript: {
		tsConfig: {
			compilerOptions: {
				paths: {
					"@/*": ["../*"],
					"@themeConfig": ["../themeConfig.js"],
					"@layouts/*": ["../@layouts/*"],
					"@layouts": ["../@layouts"],
					"@core/*": ["../@core/*"],
					"@core": ["../@core"],
					"@images/*": ["../assets/images/*"],
					"@styles/*": ["../assets/styles/*"],
					"@validators": ["../@core/utils/validators"],
					"@db/*": ["../server/fake-db/*"],
					"@api-utils/*": ["../server/utils/*"],
				},
			},
		},
	},

	// ℹ️ Disable source maps until this is resolved: https://github.com/vuetifyjs/vuetify-loader/issues/290
	sourcemap: {
		server: false,
		client: false,
	},

	vue: {
		compilerOptions: {
			isCustomElement: tag => tag === "swiper-container" || tag === "swiper-slide",
		},
	},

	vite: {
		define: { "process.env": {} },
		server: {
			proxy: {
				"/sciapi": {
					target: process.env.NUXT_PUBLIC_APP_BASE_API_URL, // 替换为实际的 API 域名
					changeOrigin: true,
					rewrite: path => path.replace(/^\/sciapi/, ""),
				},
			},
		},
		resolve: {
			alias: {
				"@": fileURLToPath(new URL(".", import.meta.url)),
				"@themeConfig": fileURLToPath(new URL("./themeConfig.js", import.meta.url)),
				"@core": fileURLToPath(new URL("./@core", import.meta.url)),
				"@layouts": fileURLToPath(new URL("./@layouts", import.meta.url)),
				"@images": fileURLToPath(new URL("./assets/images/", import.meta.url)),
				"@styles": fileURLToPath(new URL("./assets/styles/", import.meta.url)),
				"@configured-variables": fileURLToPath(new URL("./assets/styles/variables/_template.scss", import.meta.url)),
				"@db": fileURLToPath(new URL("./server/fake-db/", import.meta.url)),
				"@api-utils": fileURLToPath(new URL("./server/utils/", import.meta.url)),
			},
		},

		build: {
			chunkSizeWarningLimit: 5000,
		},

		optimizeDeps: {
			exclude: ["vuetify"],
			entries: ["./**/*.vue"],
		},

		plugins: [
			svgLoader(),
			vuetify({
				styles: {
					configFile: "assets/styles/variables/_vuetify.scss",
				},
			}),
		],
	},

	build: {
		transpile: ["vuetify"],
	},

	i18n: {
		vueI18n: "i18n.config.js",
	},

	modules: ["@vueuse/nuxt", "@nuxtjs/i18n", "@nuxtjs/device", "@sidebase/nuxt-auth", "@pinia/nuxt"],
});
