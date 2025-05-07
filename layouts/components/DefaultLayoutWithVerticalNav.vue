<script setup>
import { toolTreeList } from "@/api/analysis-tools";
import { isLoginRoutes, routes } from "@/navigation/vertical";
import { themeConfig } from "@themeConfig";
// Components
import UserProfile from "@/layouts/components/UserProfile.vue";
import ProblemFeedback from "@/views/personalCenter/myFeedback/problem-feedback.vue";
import NavBarI18n from "@core/components/I18n.vue";
import navigation from "./navigation.vue";
// @layouts plugin
import { VerticalNavLayout } from "@layouts";
const { locale, setLocaleMessage } = useI18n({
	useScope: "global",
});
const { t } = useI18n();
const isData = ref(false);
const userStore = useUserStore();
// 检查用户是否已登录
const isLoggedIn = userStore.getToken || useCookie("token").value || false;
const navData = ref([...(isLoggedIn ? isLoginRoutes : routes)]); // 使用展开运算符创建新数组
const traverseMenu = (menuItems, data) => {
	menuItems.forEach(item => {
		// 这里可以添加你想要对每个菜单项执行的操作
		if (item.title != "home.moreTool") {
			addDynamicMessages(item, setLocaleMessage);
			item.title = `title_${item.id}`;
			item.to = `analysisTool-id`;
			item.path = `/analysisTool/${item.id}`;
			item.icon = { icon: item.icon };
		}

		if (item.level == 2 && item.more) {
			item.children.push({
				id: item.id,
				title: "home.moreTool",
				icon: { icon: "ri-file-copy-line" },
				to: "analysisTools-id",
				path: `/analysisTools/${item.id}`,
			});
		}
		// 如果 children 存在且为空数组，删除该属性
		if (item.children && item.children.length === 0) {
			delete item.children;
		} else if (item.children && item.children.length > 0) {
			// 如果存在 children 且长度大于 0，则递归调用
			traverseMenu(item.children, data);
		}
	});
};

const getToolTreeList = () => {
	nextTick(async () => {
		isData.value = false;
		const res = await toolTreeList();
		// 假设 res.data 是菜单结构，调用递归函数
		isData.value = true;
		if (Array.isArray(res.data)) {
			traverseMenu(res.data, res.data);
		}
		// 在第一个元素后面追加 res.data 元素
		if (navData.value.length > 0) {
			navData.value.splice(2, 0, ...res.data);
		} else {
			// 如果 navData 为空，直接添加
			navData.value.push(...res.data);
		}
	});
};
getToolTreeList();
</script>

<template>
	<VerticalNavLayout v-if="isData" :nav-items="navData">
		<!-- 👉 navbar -->
		<template #navbar="{ toggleVerticalOverlayNavActive }">
			<div class="d-flex h-100 align-center">
				<IconBtn id="vertical-nav-toggle-btn" class="ms-n2 d-lg-none" @click="toggleVerticalOverlayNavActive(true)">
					<VIcon icon="ri-menu-line" />
				</IconBtn>
				<navigation :menuData="navData"></navigation>
				<VSpacer />

				<NavBarI18n
					class="me-2"
					v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
					:languages="themeConfig.app.i18n.langConfig"
				/>
				<!-- <NavbarThemeSwitcher class="me-2" /> -->
				<!-- <NavBarNotifications class="me-2" /> -->
				<UserProfile />
			</div>
		</template>

		<!-- 👉 Pages -->
		<slot />
		<ProblemFeedback></ProblemFeedback>
		<!-- 👉 Customizer -->
		<!-- <TheCustomizer /> -->
	</VerticalNavLayout>
</template>
