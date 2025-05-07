// server/api/proxy.ts
export default defineEventHandler(async event => {
	console.log(123123123123132123);

	const apiUrl = "https://api.vvhan.com/api/horoscope?type=scorpio&time=today"; // 外部 API 地址

	// 代理请求
	return await $fetch(apiUrl);
});
