<script setup>
import ScrollToTop from "@core/components/ScrollToTop.vue";
import initCore from "@core/initCore";
import { initConfigStore, useConfigStore } from "@core/stores/config";
import { hexToRgb } from "@core/utils/colorConverter";
import { useTheme } from "vuetify";
const { locale } = useI18n({ useScope: "global" });
const userStore = useUserStore();
const { global } = useTheme();

// ℹ️ Sync current theme with initial loader theme
initCore();
initConfigStore();
onMounted(() => {
	if (userStore.getLanguage) {
		locale.value = userStore.getLanguage;
	} else {
		locale.value = Intl.DateTimeFormat().resolvedOptions().timeZone.includes("Asia/Shanghai") ? "zh" : "en";
		userStore.setLanguage(locale.value);
	}
});
const configStore = useConfigStore();
const { isMobile } = useDevice();
if (isMobile) configStore.appContentLayoutNav = "vertical";
</script>

<template>
	<VLocaleProvider :rtl="configStore.isAppRTL">
		<!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
		<VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
			<NuxtLayout>
				<NuxtPage />
			</NuxtLayout>
			<ScrollToTop />
		</VApp>
	</VLocaleProvider>
</template>
