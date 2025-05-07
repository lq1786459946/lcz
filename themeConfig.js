import { defineThemeConfig } from "@core";
import { Skins } from "@core/enums";
import logo from "@images/Subtract.svg?raw";
import titleLogo from "@images/title.svg?raw";
import { AppContentLayoutNav, ContentWidth, FooterType, NavbarType } from "@layouts/enums";
import { breakpointsVuetifyV3 } from "@vueuse/core";
import { VIcon } from "vuetify/components/VIcon";
export const { themeConfig, layoutConfig } = defineThemeConfig({
	app: {
		title: "SciAnalyse",
		// ❗ if you have SVG logo and want it to adapt according to theme color, you have to apply color as `color: rgb(var(--v-global-theme-primary))`
		titleLogo: h("div", { innerHTML: processSvgNone(titleLogo), style: "line-height:0; color: rgba(var(--v-theme-on-background))" }),
		logo: h("div", { innerHTML: processSvgCopy(logo), style: "line-height:0; color: rgb(var(--v-theme-primary))" }),
		contentWidth: ContentWidth.Boxed,
		contentLayoutNav: AppContentLayoutNav.Vertical,
		overlayNavFromBreakpoint: breakpointsVuetifyV3.lg - 1, // 1 for matching with vuetify breakpoint. Docs: https://next.vuetifyjs.com/en/features/display-and-platform/
		i18n: {
			enable: true,
			defaultLocale: "zh",
			langConfig: [
				{
					label: "简体中文",
					i18nLang: "zh",
					isRTL: false,
				},
				{
					label: "English",
					i18nLang: "en",
					isRTL: false,
				},
			],
		},
		theme: "light",
		skin: Skins.Default,
		iconRenderer: VIcon,
	},
	navbar: {
		type: NavbarType.Sticky,
		navbarBlur: true,
	},
	footer: { type: FooterType.Static },
	verticalNav: {
		isVerticalNavCollapsed: false,
		defaultNavItemIconProps: { icon: "ri-circle-line" },
		isVerticalNavSemiDark: true,
	},
	horizontalNav: {
		type: "sticky",
		transition: "slide-y-reverse-transition",
		popoverOffset: 4,
	},

	/*
    // ℹ️  In below Icons section, you can specify icon for each component. Also you can use other props of v-icon component like `color` and `size` for each icon.
    // Such as: chevronDown: { icon: 'ri-arrow-down-s-line', color:'primary', size: '24' },
    */
	icons: {
		chevronDown: { icon: "ri-arrow-down-s-line" },
		chevronRight: { icon: "ri-arrow-right-s-line" },
		close: { icon: "ri-close-line", size: "20" },
		verticalNavPinned: { icon: "ri-radio-button-line", size: "20" },
		verticalNavUnPinned: { icon: "ri-circle-line", size: "20" },
		sectionTitlePlaceholder: { icon: "ri-subtract-line" },
	},
});
