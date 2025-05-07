// const { $website } = useNuxtApp();
import { layoutConfig } from "@layouts/config";
import { AppContentLayoutNav } from "@layouts/enums";
import { useLayoutConfigStore } from "@layouts/stores/config";
import { sm2 } from "sm-crypto";
import { useI18n } from "vue-i18n";

export const openGroups = ref([]);

/**
 * Return nav link props to use
 // @param {Object, String} item navigation routeName or route Object provided in navigation data
 */
export const getComputedNavLinkToProp = computed(() => link => {
	const props = {
		target: link.target,
		rel: link.rel,
	};

	// If route is string => it assumes string is route name => Create route object from route name
	// If route is not string => It assumes it's route object => returns passed route object
	if (link.to) props.to = typeof link.to === "string" ? { name: link.to } : link.to;
	else props.href = link.href;

	return props;
});

/**
 * Return route name for navigation link
 * If link is string then it will assume it is route-name
 * IF link is object it will resolve the object and will return the link
 // @param {Object, String} link navigation link object/string
 */
export const resolveNavLinkRouteName = (link, router) => {
	if (!link.to) return null;
	if (typeof link.to === "string") return link.to;

	return router.resolve(link.to).name;
};

/**
 * Check if nav-link is active
 * @param {object} link nav-link object
 */
export const isNavLinkActive = (link, router) => {
	// Matched routes array of current route
	const matchedRoutes = router.currentRoute.value.matched;

	// Check if provided route matches route's matched route
	const resolveRoutedName = resolveNavLinkRouteName(link, router);
	if (!resolveRoutedName) return false;

	return matchedRoutes.some(route => {
		return route.name === resolveRoutedName || route.meta.navActiveLink === resolveRoutedName;
	});
};

/**
 * Check if nav group is active
 * @param {Array} children Group children
 */
export const isNavGroupActive = (children, router) =>
	children.some(child => {
		// If child have children => It's group => Go deeper(recursive)
		if ("children" in child) return isNavGroupActive(child.children, router);

		// else it's link => Check for matched Route
		return isNavLinkActive(child, router);
	});

/**
 * Change `dir` attribute based on direction
 * @param dir 'ltr' | 'rtl'
 */
export const _setDirAttr = dir => {
	// Check if document exists for SSR
	if (typeof document !== "undefined") document.documentElement.setAttribute("dir", dir);
};

/**
 * Return dynamic i18n props based on i18n plugin is enabled or not
 * @param key i18n translation key
 * @param tag tag to wrap the translation with
 */
export const getDynamicI18nProps = (key, tag = "span") => {
	if (!layoutConfig.app.i18n.enable) return {};

	return {
		keypath: key,
		tag,
		scope: "global",
	};
};
export const switchToVerticalNavOnLtOverlayNavBreakpoint = () => {
	const configStore = useLayoutConfigStore();

	/*
        ℹ️ This is flag will hold nav type need to render when switching between lgAndUp from mdAndDown window width
  
        Requirement: When we nav is set to `horizontal` and we hit the `mdAndDown` breakpoint nav type shall change to `vertical` nav
        Now if we go back to `lgAndUp` breakpoint from `mdAndDown` how we will know which was previous nav type in large device?
  
        Let's assign value of `appContentLayoutNav` as default value of lgAndUpNav. Why 🤔?
          If template is viewed in lgAndUp
            We will assign `appContentLayoutNav` value to `lgAndUpNav` because at this point both constant is same
            Hence, for `lgAndUpNav` it will take value from theme config file
          else
            It will always show vertical nav and if user increase the window width it will fallback to `appContentLayoutNav` value
            But `appContentLayoutNav` will be value set in theme config file
      */
	const lgAndUpNav = ref(configStore.appContentLayoutNav);

	/*
        There might be case where we manually switch from vertical to horizontal nav and vice versa in `lgAndUp` screen
        So when user comes back from `mdAndDown` to `lgAndUp` we can set updated nav type
        For this we need to update the `lgAndUpNav` value if screen is `lgAndUp`
      */
	watch(
		() => configStore.appContentLayoutNav,
		value => {
			if (!configStore.isLessThanOverlayNavBreakpoint) lgAndUpNav.value = value;
		},
	);

	/*
        This is layout switching part
        If it's `mdAndDown` => We will use vertical nav no matter what previous nav type was
        Or if it's `lgAndUp` we need to switch back to `lgAndUp` nav type. For this we will tracker property `lgAndUpNav`
      */
	const shouldChangeContentLayoutNav = refAutoReset(true, 500);

	shouldChangeContentLayoutNav.value = false;

	watch(
		() => configStore.isLessThanOverlayNavBreakpoint,
		val => {
			if (!val) {
				configStore.appContentLayoutNav = lgAndUpNav.value;
			} else {
				if (!shouldChangeContentLayoutNav.value) {
					setTimeout(() => {
						configStore.appContentLayoutNav = AppContentLayoutNav.Vertical;
					}, 500);
				} else {
					configStore.appContentLayoutNav = AppContentLayoutNav.Vertical;
				}
			}
		},
		{ immediate: true },
	);
};

/**
 * sm2 加密方法
 * @param data
 * @returns {*}
 */
export function encrypt(data) {
	let publicKey =
		"04105cc44bc6dec4dd1f7e55e8308dd35b66fefabc161b1b389d1d4f70e5f40c4529ba634133c9920191036b549d92f509f7ef6a31dfe7c91a5e1cb96bf824ef14";
	try {
		return sm2.doEncrypt(data, publicKey, 0);
	} catch {
		return "";
	}
}

/**
 * sm2 解密方法
 * @param encryptedData 加密后的数据
 * @param privateKey 私钥
 * @returns {*} 解密后的数据，如果解密失败则返回空字符串
 */
export function decrypt(encryptedData) {
	let privateKey = "6427211d4225a4b608482b350a6c9f4a708461fe68985d7d060ac9f2d9fdad87";
	try {
		return sm2.doDecrypt(encryptedData, privateKey, 0);
	} catch {
		return "";
	}
}

/**
 *  动态数据中英文转换方法
 * @param data 动态数据
 * @param baseName 字段名
 * @returns {*}
 */
export const getLanguageValue = (data, baseName) => {
	const { locale } = useI18n({ useScope: "global" });
	var key = locale.value;
	if (locale.value == "zh") {
		key = "Zh";
	} else {
		key = "En";
	}

	const langKey = `${baseName}${key}`;
	console.log("key", key, langKey);
	return data[langKey] || "";
};

/**
 *  统一处理SVG的fill颜色
 * @param svg 图片
 * @returns {*}
 *
 * */
export const processSvg = svg => {
	return svg.replace('fill="black"', 'fill="currentColor"');
};

/**
 *  统一处理SVG的fill颜色
 * @param svg 图片
 * @returns {*}
 *
 * */
export const processSvgCopy = svg => {
	return svg.replace(/fill="#2AB2AB"/g, 'fill="currentColor"');
};

/**
 *  统一处理SVG的fill颜色
 * @param svg 图片
 * @returns {*}
 *
 * */
export const processSvgNone = svg => {
	return svg.replace(/fill="#423C50"/g, 'fill="currentColor"');
};
/**
 *  统一处理时区
 * @param svg 图片
 * @returns {*}
 * 	* */

export const extractUTCOffset = timeZoneStr => {
	const regex = /（UTC[+-]\d{2}:\d{2}）|\(UTC[+-]\d{2}:\d{2}\)/;
	const match = timeZoneStr.match(regex);
	if (match) {
		// 去除括号
		return match[0].replace(/[（）()]/g, "");
	}
	return null;
};
