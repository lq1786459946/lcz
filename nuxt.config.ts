// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  build: {
    transpile: ["pinia-plugin-persistedstate"],
  },
  css: ["~/assets/main.css"],
  modules: [
    "@element-plus/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
  ],
  runtimeConfig: {
    isServer1: "1211",
    aaaaa: 111111,
    public: {
      baseURL: "http://1.92.195.38:11014/api/blade-auth",
    },
  },
  // 配置 nitro 代理
  nitro: {
    devProxy: {
      // 示例：将 /api 开头的请求代理到目标地址
      "/api": {
        target: "http://1.92.195.38:11014/api/blade-auth", // 目标服务器地址
        changeOrigin: true,
        prependPath: true,
      },
    },
  },
});
