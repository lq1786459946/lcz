export default defineNuxtRouteMiddleware((to, from) => {
	console.log(to, "to");

	useHead({
		title: "SciAnalyse",
	});
	const userStore = useUserStore();
	// 检查用户是否已登录
	const isLoggedIn = userStore.getToken || useCookie("token").value || false;
	// 定义不需要登录就可以访问的页面路径
	// '/analysisTools/crm'
	const publicRoutes = [
		"/login",
		"/register",
		"/analysisTools/crm",
		"/analysisTools",
		"/analysisTools/gutMicrobiotaMendel",
		"/front-pages/landing-page",
		"/forgot-password",
		"/front-pages/pricing",
		"/front-pages/industry",
		"/front-pages/moreProblems",
		"/analysisTool",
		"/nextStepAnalyse",
		"/front-pages/article/detail",
		"/analysisTools/All",
	];
	// 提取路径前缀的函数
	function getPathPrefix(path) {
		// 使用正则表达式匹配路径末尾的 / 加数字或者 /All 并替换为空
		return path.replace(/(\/\d+|\/All)$/, "");
	}
	if (import.meta.client) {
		// 如果用户未登录且访问的不是公共页面，则重定向到登录页
		if (!isLoggedIn && !publicRoutes.includes(getPathPrefix(to.path))) {
			return navigateTo("/login");
		}
		// 如果用户已登录且访问的是登录页，则重定向到首页
		if (isLoggedIn && to.path === "/login") {
			console.log("已登录");
			return navigateTo("/front-pages/landing-page");
		}
		if (isLoggedIn && publicRoutes.includes(getPathPrefix(to.path))) {
			console.log("用户已登录且访问的是公共页面，则允许访问");
			return;
		}
		// 如果用户已登录且访问的是其他页面，则允许访问
		if (isLoggedIn && !publicRoutes.includes(getPathPrefix(to.path))) {
			console.log("用户已登录且访问的是其他页面，则允许访问");
			return;
		}
		// 如果用户未登录且访问的是公共页面，则允许访问
		if (!isLoggedIn && publicRoutes.includes(getPathPrefix(to.path))) {
			console.log("用户未登录且访问的是公共页面，则允许访问");
			return;
		}
	}
});
