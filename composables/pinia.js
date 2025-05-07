import { defineStore } from "pinia";
// 定义一个名为 user 的 store
export const useUserStore = defineStore("user", {
	// 定义状态，类似于 Vuex 中的 state
	state: () => {
		const userDataCookie = useCookie("userData");
		const tokenCookie = useCookie("token");
		const languageCookie = useCookie("language");
		const rememberMeCookie = useCookie("rememberMe");
		const savedUsernameCookie = useCookie("savedUsername");
		const savedPasswordCookie = useCookie("savedPassword");
		const industryIdCookie = useCookie("industryId");
		const redirectRouteCookie = useCookie("redirectRoute");
		const timeZoneCookie = useCookie("timeZone");
		const refresh_tokenCookie = useCookie("refresh_token");
		const isRefreshCookie = useCookie("isRefresh");
		return {
			userData: userDataCookie.value || null,
			token: tokenCookie.value || "",
			language: languageCookie.value, // 默认语言为中文
			rememberMe: rememberMeCookie.value || false,
			savedUsername: savedUsernameCookie.value || "",
			savedPassword: savedPasswordCookie.value || "",
			industryId: industryIdCookie.value || "",
			redirectRoute: redirectRouteCookie.value || null,
			timeZone: timeZoneCookie.value || null,
			refresh_token: refresh_tokenCookie.value || "",
			isRefresh: isRefreshCookie.value || false,
		};
	},
	// 定义 getter，类似于 Vuex 中的 getters
	getters: {
		// 获取用户的完整信息
		getUserData: state => {
			if (!state.userData) {
				const userDataCookie = useCookie("userData");
				return userDataCookie.value || null;
			}
			return state.userData;
		},
		// 获取token
		getToken: state => {
			if (!state.token) {
				const tokenCookie = useCookie("token");
				return tokenCookie.value || null;
			}
			return state.token;
		},
		// 获取refresh_token
		getRefreshToken: state => {
			if (!state.refresh_token) {
				const refresh_tokenCookie = useCookie("refresh_token");
				return refresh_tokenCookie.value || null;
			}
			return state.refresh_token;
		},
		// 获取当前语言
		getLanguage: state => {
			// state.language
			if (!state.language) {
				const languageCookie = useCookie("language");
				return languageCookie.value || null;
			}
			return state.language;
		},
		// 获取记住用户名和密码的标志
		getRememberMe: state => {
			if (!state.rememberMe) {
				const rememberMeCookie = useCookie("rememberMe");
				return rememberMeCookie.value || null;
			}
			return state.rememberMe;
		},
		// 获取保存的用户名和密码
		getSavedUsername: state => {
			if (!state.savedUsername) {
				const savedUsernameCookie = useCookie("savedUsername");
				return savedUsernameCookie.value || null;
			}
			return state.savedUsername;
		},
		getSavedPassword: state => {
			if (!state.savedPassword) {
				const savedPasswordCookie = useCookie("savedPassword");
				return savedPasswordCookie.value || null;
			}
			return state.savedPassword;
		},
		// industryId
		getIndustryId: state => {
			if (!state.industryId) {
				const industryIdCookie = useCookie("industryId");
				return industryIdCookie.value || null;
			}
			return state.industryId;
		},
		// redirectRoute
		getRedirectRoute: state => {
			if (!state.redirectRoute) {
				const redirectRouteCookie = useCookie("redirectRoute");
				return redirectRouteCookie.value || null;
			}
			return state.redirectRoute;
		},
		// 获取时区
		getTimeZone: state => {
			if (!state.timeZone) {
				const timeZoneCookie = useCookie("timeZone");
				return timeZoneCookie.value || null;
			}
			return state.timeZone;
		},
		// 获取是否刷新
		getIsRefresh: state => {
			if (!state.isRefresh) {
				const isRefreshCookie = useCookie("isRefresh");
				return isRefreshCookie.value || null;
			}
			return state.isRefresh;
		},
	},
	// 定义 actions，类似于 Vuex 中的 actions
	actions: {
		// 设置用户信息
		setUserInfo(user) {
			this.userData = user;
			this.token = user.access_token;
			this.refresh_token = user.refresh_token;
			const userInfoCookie = useCookie("userData", { path: "/" });
			userInfoCookie.value = user;
			const tokenCookie = useCookie("token", { path: "/" });
			tokenCookie.value = user.access_token;
			const refresh_tokenCookie = useCookie("refresh_token", { path: "/" });
			refresh_tokenCookie.value = user.refresh_token;
		},
		// 设置refresh_token
		setRefreshToken(refresh_token) {
			this.refresh_token = refresh_token;
			const refresh_tokenCookie = useCookie("refresh_token", { path: "/" });
			refresh_tokenCookie.value = refresh_token;
		},
		// 设置语言
		setLanguage(lang) {
			this.language = lang;
			const langCookie = useCookie("language", { path: "/" });
			langCookie.value = lang;
		},
		// 存储行业详情信息
		setIndustryId(industryId) {
			this.industryId = industryId;
			const industryIdCookie = useCookie("industryId", { path: "/" });
			industryIdCookie.value = industryId;
			navigateTo({ name: "front-pages-article-detail" });
		},
		// 用户登出
		logout() {
			this.token = "";
			this.userData = null;
			this.isLoggedIn = false;
			const userCookie = useCookie("userData");
			userCookie.value = null;
			const tokenCookie = useCookie("token");
			tokenCookie.value = null;
			const refresh_tokenCookie = useCookie("refresh_token");
			refresh_tokenCookie.value = null;
			const isRefreshCookie = useCookie("isRefresh");
			isRefreshCookie.value = false;
			setTimeout(() => {
				navigateTo("/login");
			}, 500);
		},
		// 记住用户名和密码
		setRememberMe(flag) {
			this.rememberMe = flag;
			const rememberMe = useCookie("rememberMe", { path: "/" });
			rememberMe.value = flag;
		},
		saveLoginCredentials(username, password) {
			// 存储用户名和密码到 Cookie 或其他持久化存储中
			this.savedUsername = username;
			const savedUsername = useCookie("savedUsername", { path: "/" });
			savedUsername.value = username;
			this.savedPassword = password;
			const savedPassword = useCookie("savedPassword", { path: "/" });
			savedPassword.value = password;
		},
		clearLoginCredentials() {
			this.savedUsername = "";
			const savedUsername = useCookie("savedUsername", { path: "/" });
			savedUsername.value = "";

			this.savedPassword = "";
			const savedPassword = useCookie("savedPassword", { path: "/" });
			savedPassword.value = "";

			this.rememberMe = false;
			const rememberMe = useCookie("rememberMe", { path: "/" });
			rememberMe.value = false;
		},
		// ... existing actions ...
		setRedirectRoute(route) {
			const router = useRouter();
			const routes = router.getRoutes();
			// 检查 route 是否在 routes 中存在
			const isValidRoute = routes.some(r => r.path === route);
			if (route != "/front-pages/null" && isValidRoute) {
				// 如果存在则保存，否则保存默认路径
				this.redirectRoute = route;
				const redirectRouteCookie = useCookie("redirectRoute", { path: "/" });
				redirectRouteCookie.value = route;
			} else {
				this.redirectRoute = "/front-pages/article";
				const redirectRouteCookie = useCookie("redirectRoute", { path: "/" });
				redirectRouteCookie.value = "/front-pages/article";
			}
		},
		clearRedirectRoute() {
			this.redirectRoute = null;
			const redirectRouteCookie = useCookie("redirectRoute", { path: "/" });
			redirectRouteCookie.value = null;
		},
		// 设置时区
		setTimeZone(timeZone) {
			this.timeZone = timeZone;
			const timeZoneCookie = useCookie("timeZone", { path: "/" });
			timeZoneCookie.value = timeZone;
		},
		// 设置是否刷新
		setIsRefresh(isRefresh) {
			this.isRefresh = isRefresh;
			const isRefreshCookie = useCookie("isRefresh", { path: "/" });
			isRefreshCookie.value = isRefresh;
		},
	},
});
