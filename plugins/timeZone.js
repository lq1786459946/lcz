export async function prefixZh() {
	const timeZones = [
		// UTC-12:00 至 UTC-0:00
		{ offset: "UTC-12:00", cities: ["国际日期变更线西侧（无常住城市）"] },
		{ offset: "UTC-11:00", cities: ["帕果帕果（美属萨摩亚）", "中途岛"] },
		{ offset: "UTC-10:00", cities: ["火奴鲁鲁（美国夏威夷）"] },
		{ offset: "UTC-09:00", cities: ["安克雷奇（美国阿拉斯加）"] },
		{ offset: "UTC-08:00", cities: ["洛杉矶", "旧金山", "温哥华", "提华纳"] },
		{ offset: "UTC-07:00", cities: ["凤凰城", "丹佛", "卡尔加里"] },
		{ offset: "UTC-06:00", cities: ["芝加哥", "墨西哥城", "休斯顿"] },
		{ offset: "UTC-05:00", cities: ["纽约", "多伦多", "哈瓦那", "利马"] },
		{ offset: "UTC-04:00", cities: ["圣地亚哥（智利）", "加拉加斯", "拉巴斯"] },
		{ offset: "UTC-03:00", cities: ["布宜诺斯艾利斯", "里约热内卢", "圣保罗"] },
		{ offset: "UTC-02:00", cities: ["努克（格陵兰）", "费尔南多·迪诺罗尼亚群岛"] },
		{ offset: "UTC-01:00", cities: ["亚速尔群岛（葡萄牙）", "佛得角"] },
		{ offset: "UTC±00:00", cities: ["伦敦", "里斯本", "雷克雅未克", "阿克拉"] },

		// UTC+01:00 至 UTC+12:00
		{ offset: "UTC+01:00", cities: ["巴黎", "柏林", "罗马", "马德里", "拉各斯"] },
		{ offset: "UTC+02:00", cities: ["开罗", "约翰内斯堡", "雅典", "赫尔辛基"] },
		{ offset: "UTC+03:00", cities: ["莫斯科", "伊斯坦布尔", "利雅得", "内罗毕"] },
		{ offset: "UTC+04:00", cities: ["迪拜", "巴库", "第比利斯", "马斯喀特"] },
		{ offset: "UTC+05:00", cities: ["伊斯兰堡", "卡拉奇", "叶卡捷琳堡"] },
		{ offset: "UTC+06:00", cities: ["达卡", "阿拉木图", "科伦坡"] },
		{ offset: "UTC+07:00", cities: ["曼谷", "雅加达", "胡志明市", "克拉斯诺亚尔斯克"] },
		{ offset: "UTC+08:00", cities: ["北京", "重庆", "香港特别行政区", "乌鲁木齐", "新加坡", "珀斯"] },
		{ offset: "UTC+09:00", cities: ["东京", "首尔", "平壤", "札幌"] },
		{ offset: "UTC+10:00", cities: ["悉尼", "墨尔本", "布里斯班", "符拉迪沃斯托克"] },
		{ offset: "UTC+11:00", cities: ["霍尼亚拉（所罗门群岛）", "努美阿（新喀里多尼亚）"] },
		{ offset: "UTC+12:00", cities: ["奥克兰", "惠灵顿", "斐济", "马加丹"] },

		// 特殊时区
		{ offset: "UTC+05:30", cities: ["新德里", "孟买", "科伦坡"] },
		{ offset: "UTC+05:45", cities: ["加德满都"] },
		{ offset: "UTC+09:30", cities: ["阿德莱德（澳大利亚）"] },
		{ offset: "UTC+13:00", cities: ["阿皮亚（萨摩亚）", "努库阿洛法（汤加）"] },
		{ offset: "UTC+14:00", cities: ["基里巴斯圣诞岛"] },
	];
	return timeZones.map(item => {
		return `（${item.offset}）${item.cities.join(", ")}`;
	});
}

export async function prefixEn() {
	const timeZones = [
		// UTC-12:00 to UTC-0:00
		{ offset: "UTC-12:00", cities: ["International Date Line West (uninhabited)"] },
		{ offset: "UTC-11:00", cities: ["Pago Pago (American Samoa)", "Midway Island"] },
		{ offset: "UTC-10:00", cities: ["Honolulu (Hawaii, USA)"] },
		{ offset: "UTC-09:00", cities: ["Anchorage (Alaska, USA)"] },
		{ offset: "UTC-08:00", cities: ["Los Angeles", "San Francisco", "Vancouver", "Tijuana"] },
		{ offset: "UTC-07:00", cities: ["Phoenix", "Denver", "Calgary"] },
		{ offset: "UTC-06:00", cities: ["Chicago", "Mexico City", "Houston"] },
		{ offset: "UTC-05:00", cities: ["New York", "Toronto", "Havana", "Lima"] },
		{ offset: "UTC-04:00", cities: ["Santiago (Chile)", "Caracas", "La Paz"] },
		{ offset: "UTC-03:00", cities: ["Buenos Aires", "Rio de Janeiro", "São Paulo"] },
		{ offset: "UTC-02:00", cities: ["Nuuk (Greenland)", "Fernando de Noronha"] },
		{ offset: "UTC-01:00", cities: ["Azores (Portugal)", "Cape Verde"] },
		{ offset: "UTC±00:00", cities: ["London", "Lisbon", "Reykjavik", "Accra"] },

		// UTC+01:00 to UTC+12:00
		{ offset: "UTC+01:00", cities: ["Paris", "Berlin", "Rome", "Madrid", "Lagos"] },
		{ offset: "UTC+02:00", cities: ["Cairo", "Johannesburg", "Athens", "Helsinki"] },
		{ offset: "UTC+03:00", cities: ["Moscow", "Istanbul", "Riyadh", "Nairobi"] },
		{ offset: "UTC+04:00", cities: ["Dubai", "Baku", "Tbilisi", "Muscat"] },
		{ offset: "UTC+05:00", cities: ["Islamabad", "Karachi", "Yekaterinburg"] },
		{ offset: "UTC+06:00", cities: ["Dhaka", "Almaty", "Colombo"] },
		{ offset: "UTC+07:00", cities: ["Bangkok", "Jakarta", "Ho Chi Minh City", "Krasnoyarsk"] },
		{ offset: "UTC+08:00", cities: ["Beijing", "Chongqing", "Hong Kong SAR", "Urumqi", "Singapore", "Perth"] },
		{ offset: "UTC+09:00", cities: ["Tokyo", "Seoul", "Pyongyang", "Sapporo"] },
		{ offset: "UTC+10:00", cities: ["Sydney", "Melbourne", "Brisbane", "Vladivostok"] },
		{ offset: "UTC+11:00", cities: ["Honiara (Solomon Islands)", "Nouméa (New Caledonia)"] },
		{ offset: "UTC+12:00", cities: ["Auckland", "Wellington", "Fiji", "Magadan"] },

		// Special time zones
		{ offset: "UTC+05:30", cities: ["New Delhi", "Mumbai", "Colombo"] },
		{ offset: "UTC+05:45", cities: ["Kathmandu"] },
		{ offset: "UTC+09:30", cities: ["Adelaide (Australia)"] },
		{ offset: "UTC+13:00", cities: ["Apia (Samoa)", "Nuku'alofa (Tonga)"] },
		{ offset: "UTC+14:00", cities: ["Kiritimati (Christmas Island)"] },
	];
	return timeZones.map(item => {
		return `(${item.offset}) ${item.cities.join(", ")}`;
	});
}

export default defineNuxtPlugin(async nuxtApp => {
	const timeZonePrefixZh = await prefixZh();
	nuxtApp.provide("timeZonePrefixZh", timeZonePrefixZh);

	const timeZonePrefixEn = await prefixEn();
	nuxtApp.provide("timeZonePrefixEn", timeZonePrefixEn);
});
