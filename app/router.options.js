// 👉 Redirects
const redirects = [
	// ℹ️ We are redirecting to different pages based on role.
	// NOTE: Role is just for UI purposes. ACL is based on abilities.
	{
		path: "/",
		name: "index",
		redirect: () => {
			return { name: "front-pages-landing-page" };
			// return{ name: 'analysisTools-crm'}
		},
	},
	{
		path: "/analysisTool/:id",
		name: "analysisTool",
		component: () => import("@/pages/analysisTool/[id].vue"),
	},
];

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default {
	routes: scannedRoutes => [...redirects, ...scannedRoutes],
	scrollBehaviorType: "smooth",
	scrollBehavior(to, from, savedPosition) {
		// 如果是从其他页面跳转过来，保持原位置

		if (to.hash) return { el: to.hash, behavior: "smooth", top: 60 };
		if (to.path == "/analysisTools/All") {
			return false;
		} else {
			return { top: 0 };
		}
	},
};
