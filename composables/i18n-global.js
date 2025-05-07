import { useNuxtApp } from "#app";
/**
 * 动态添加国际化消息到当前的国际化实例中。
 *
 * @param {Object} dynamicMessages - 包含动态国际化消息的对象，键为语言代码，值为对应语言的消息对象。
 * @example
 * const dynamicMessages = {
 *   en: {
 *     greeting: 'Hello!'
 *   },
 *   zh: {
 *     greeting: '你好！'
 *   }
 * };
 * addDynamicMessages(dynamicMessages);
 */
function splitZhEnFields(obj) {
	const result = { zh: {}, en: {} };
	Object.keys(obj).forEach(key => {
		if (key.endsWith("Zh")) {
			const baseKey = `${key.slice(0, -2)}_${obj.id}`; // 将id拼接到中文;
			result.zh[baseKey] = `${obj[key]}`;
		} else if (key.endsWith("En")) {
			const baseKey = `${key.slice(0, -2)}_${obj.id}`; // 将id拼接到中文;
			result.en[baseKey] = `${obj[key]}`;
		}
	});
	return result;
}
export const addDynamicMessages = (dynamicMessages, setLocaleMessage) => {
	const { $i18n } = useNuxtApp();
	const vuei18n = { global: $i18n };

	// 处理动态消息
	if (!dynamicMessages || typeof dynamicMessages !== "object") {
		console.error("Invalid dynamicMessages object");
		return;
	}
	let i18nObj = splitZhEnFields(dynamicMessages);
	Object.keys(i18nObj).forEach(lang => {
		// const existingMessages = vuei18n.global.getLocaleMessage(lang) || {};
		// console.log("existingMessages", existingMessages);

		// const newMessages = { ...existingMessages, ...i18nObj[lang] };
		// setLocaleMessage(lang, newMessages);

		const existingMessages = vuei18n.global.getLocaleMessage(lang) || {};
		const newMessages = {};

		// 对比新旧数据，只插入不存在的数据
		Object.keys(i18nObj[lang]).forEach(key => {
			if (!existingMessages[key]) {
				newMessages[key] = i18nObj[lang][key];
			}
		});

		// 如果有新数据，则更新
		if (Object.keys(newMessages).length > 0) {
			setLocaleMessage(lang, { ...existingMessages, ...newMessages });
		}
	});
};
