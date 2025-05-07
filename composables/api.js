// import { ElMessage } from 'element-plus';
import { refresh_token } from "@/api/user/index";

export const apiCore = (url, options) => {
	const nuxtapp = useNuxtApp();
	const userStore = useUserStore();
	return useFetch(url, {
		onRequest({ options }) {
			let token;
			let timeZone;
			if (import.meta.client) {
				token = userStore.getToken || useCookie("token").value;
				timeZone = userStore.getTimeZone || useCookie("timeZone").value;
			}
			options.headers = {
				...options.headers,
				Authorization: `Basic c2FiZXI6c2FiZXJfc2VjcmV0`,
				"Blade-Requested-With": "BladeHttpRequest",
			};
			if (token) {
				options.headers["Blade-Auth"] = `Bearer ${token}`;
				options.headers["Time-Zone"] = extractUTCOffset(timeZone);
			}
		},
		//正确错误都行执行onResponse
		onResponse({ response }) {},
		//只要错误了执行onResponseError
		onResponseError({ response }) {},
		...options,
	});
};
let isRefreshing = false; // 添加标志变量
let refreshQueue = []; // 用于存储等待刷新的请求

// export const getApi = (url, options) => {
// 	return new Promise((resolve, reject) => {
// 		apiCore(url, {
// 			method: "get",
// 			...options,
// 		})
// 			.then(res => {
// 				let data = res.data.value;
// 				if (data) {
// 					let status = data?.code || data?.error_code || 200;
// 					let message = data?.error_description || data?.msg;
// 					const userStore = useUserStore();
// 					const language = userStore.getLanguage;
// 					if (data && status !== 200) {
// 						let errorMessage;
// 						try {
// 							const errorObj = JSON.parse(message);
// 							errorMessage = errorObj[language] || message;
// 						} catch (e) {
// 							// 如果 message 不是 JSON 格式，直接使用 message
// 							errorMessage = message;
// 						}
// 						// 判断是否需要刷新token
// 						if ((status === 400 && errorMessage == "请登录！") || errorMessage == "您的登录已过期，请重新登录！") {
// 							if (!isRefreshing) {
// 								isRefreshing = true;
// 								refresh_token().then(res => {
// 									const newToken = res.access_token;
// 									userStore.setUserInfo(res);
// 									// 更新 cookie 中的 token
// 									const token = useCookie("token");
// 									token.value = newToken; // 确保更新 cookie 中的 token
// 									// 执行等待队列中的请求
// 									refreshQueue.forEach(cb => cb());
// 									refreshQueue = [];
// 									isRefreshing = false;
// 									setTimeout(() => {
// 										// 重新发起当前请求
// 										apiCore(url, {
// 											method: "get",
// 											...options,
// 										})
// 											.then(res => {
// 												resolve(res.data.value);
// 											})
// 											.catch(err => {
// 												reject(err);
// 											});
// 									});
// 								});
// 							} else {
// 								// 如果正在刷新，将请求加入队列
// 								refreshQueue.push(() => {
// 									apiCore(url, {
// 										method: "get",
// 										...options,
// 									})
// 										.then(res => {
// 											resolve(res.data.value);
// 										})
// 										.catch(err => {
// 											reject(err);
// 										});
// 								});
// 							}
// 						} else if (errorMessage == "认证信息错误或无效" || errorMessage == "令牌刷新错误或无效") {
// 							isRefreshing = false;
// 							alert("error", "您的登录已过期，请重新登录！", "ri-error-warning-line");
// 							userStore.logout();
// 						} else {
// 							alert("error", errorMessage, "ri-error-warning-line");
// 							reject(errorMessage);
// 						}
// 					} else {
// 						resolve(data);
// 					}
// 				}
// 			})
// 			.catch(err => {
// 				reject(err);
// 			});
// 	});
// };

export const getApi = (url, options) => {
	return new Promise(async (resolve, reject) => {
		let res = await useFetch("/api/tool", {
			method: options.method,
			params: {
				method: options.method,
				url,
				params: options.params || {},
				body: options.body || {},
			},
		});
		let data = res.data.value;
		if (data) {
			let status = data?.code || data?.error_code || 200;
			let message = data?.error_description || data?.msg;
			const userStore = useUserStore();
			const language = userStore.getLanguage;
			if (data && status !== 200) {
				let errorMessage;
				try {
					const errorObj = JSON.parse(message);
					errorMessage = errorObj[language] || message;
				} catch (e) {
					// 如果 message 不是 JSON 格式，直接使用 message
					errorMessage = message;
				}
				// 判断是否需要刷新token
				if ((status === 400 && errorMessage == "请登录！") || errorMessage == "您的登录已过期，请重新登录！") {
					if (!isRefreshing) {
						isRefreshing = true;
						// refresh_token().then(res => {
						// 	const newToken = res.access_token;
						// 	userStore.setUserInfo(res);
						// 	// 更新 cookie 中的 token
						// 	const token = useCookie("token");
						// 	token.value = newToken; // 确保更新 cookie 中的 token
						// 	// 执行等待队列中的请求
						// 	refreshQueue.forEach(cb => cb());
						// 	refreshQueue = [];
						// 	isRefreshing = false;
						// 	setTimeout(() => {
						// 		// 重新发起当前请求
						// 		apiCore(url, {
						// 			method: "get",
						// 			...options,
						// 		})
						// 			.then(res => {
						// 				resolve(res.data.value);
						// 			})
						// 			.catch(err => {
						// 				reject(err);
						// 			});
						// 	});
						// });
					} else {
						// 如果正在刷新，将请求加入队列
						// refreshQueue.push(() => {
						// 	apiCore(url, {
						// 		method: "get",
						// 		...options,
						// 	})
						// 		.then(res => {
						// 			resolve(res.data.value);
						// 		})
						// 		.catch(err => {
						// 			reject(err);
						// 		});
						// });
					}
				} else if (errorMessage == "认证信息错误或无效" || errorMessage == "令牌刷新错误或无效") {
					isRefreshing = false;
					alert("error", "您的登录已过期，请重新登录！", "ri-error-warning-line");
					userStore.logout();
				} else {
					alert("error", errorMessage, "ri-error-warning-line");
					reject(errorMessage);
				}
			} else {
				resolve(data);
			}
		}
	});
};
