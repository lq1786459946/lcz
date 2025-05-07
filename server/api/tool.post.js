const extractUTCOffset = timeZoneStr => {
	const regex = /（UTC[+-]\d{2}:\d{2}）|\(UTC[+-]\d{2}:\d{2}\)/;
	const match = timeZoneStr.match(regex);
	if (match) {
		// 去除括号
		return match[0].replace(/[（）()]/g, "");
	}
	return null;
};

export default defineEventHandler(async event => {
	let p = getQuery(event);
	console.log(p, "ppp");
	const cookies = parseCookies(event);
	let headers = {
		Authorization: `Basic c2FiZXI6c2FiZXJfc2VjcmV0`,
		"Blade-Requested-With": "BladeHttpRequest",
	};
	if (cookies.token) {
		headers["Blade-Auth"] = `Bearer ${cookies.token}`;
	}
	if (cookies.timeZone) {
		headers["Time-Zone"] = extractUTCOffset(cookies.timeZone);
	}
	let api = "http://116.204.123.72:13000/" + p.url;
	let res = await $fetch(api, {
		method: p.method,
		params: JSON.parse(p.params),
		body: JSON.parse(p.body),
		headers,
		// onRequest({ options }) {
		// 	console.log(options.headers, "options123");
		// },
	});
	// console.log(res, "返回的结果");
	return res;
});
