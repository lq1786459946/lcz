
import { cookieRef } from '@layouts/stores/config';
import { themeConfig } from '@themeConfig';

// 导入所有模块的语言文件
const moduleLocales = import.meta.glob('@/plugins/i18n/locales/**/*.json', { eager: true });
const messages = Object.fromEntries(
  Object.entries(
    import.meta.glob('@/plugins/i18n/locales/*.json', { eager: true }))
    .map(([key, value]) => [key.slice(-7, -5), value.default]),
)
// 遍历所有语言文件并合并到 messages 对象中
Object.entries(moduleLocales).forEach(([key, value]) => {
  // 提取语言代码和模块名
  const match = key.match(/locales\/(.*)\/(.*)\.json/);
  if (match) {
    const moduleName = match[1];
    const lang = match[2];
    if (!messages[lang]) {
      messages[lang] = {};
    }
    messages[lang][moduleName] = value.default;
  }
});

export default defineI18nConfig(() => ({
  legacy: false,
  locale: cookieRef('language', themeConfig.app.i18n.defaultLocale).value,
  fallbackLocale: 'en',
  messages,
}));
