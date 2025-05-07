<template>
	<div class="navigation">
		<div class="menu-title-page">
			<img class="positioning" src="../../assets/images/home/positioning.png" alt="" />
			<div v-if="titlePath">{{ titlePath }}</div>
			<div v-if="routeTitle">{{ routeTitle }}</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
const porps = defineProps({
	menuData: {
		type: Array,
		required: true,
	},
});
const { locale } = useI18n({
	useScope: "global",
});
const { t } = useI18n();
// 响应式变量
const titlePath = ref("");
const searchTriggered = ref(false);

// 构建包含每一级标题和对应 id 的路径
const buildTitlePath = (menuItems, targetId, parentTitles = []) => {
	for (const item of menuItems) {
		if (item.title) {
			const currentTitle = t(item.title);
			const newParentTitles = [...parentTitles, currentTitle];
			if (item.id === targetId) {
				if (item.children && item.children.length > 0) {
					return newParentTitles.join(" - ") + " - " + t("home.moreTool");
				} else {
					return newParentTitles.join(" - ");
				}
			}
			if (item.children && item.children.length > 0) {
				const result = buildTitlePath(item.children, targetId, newParentTitles);
				if (result) {
					return result;
				}
			}
		}
	}
	return null;
};

// 查找标题路径
const fetchTitlePath = id => {
	searchTriggered.value = true;
	titlePath.value = buildTitlePath(porps.menuData, id) || "";
};

const route = useRoute();

const isPureNumber = str => {
	return /^\d+$/.test(str);
};

// 递归查找匹配的菜单项并生成标题
const findMenuItemTitle = (menuItems, routeName, hash, id) => {
	for (const item of menuItems) {
		if (item.title) {
			if (isPureNumber(id)) {
				fetchTitlePath(id);
			} else {
				if (item.to == routeName && hash == "") {
					return t(item.title);
				} else if (routeName.includes("personalCenter") && item.title == "home.PersonalCenter") {
					const childTitle = findMenuItemTitle(item.children, routeName, hash);
					if (childTitle) {
						const parentTitle = "home.PersonalCenter";
						return `${t(parentTitle)} - ${t(childTitle)}`;
					}
				}
			}
		}
	}
};

// 获取当前路由对应的标题
const getRouteTitle = () => {
	const routeName = route.name;
	const fullPath = route.fullPath;
	const parts = fullPath.split("/");
	const id = parts.length > 2 ? parts[2] : "";
	const hash = route.hash;
	return findMenuItemTitle(porps.menuData, routeName, hash, id) || "";
};

// 初始标题
const routeTitle = ref("");

watch(
	() => [route.name, route.hash, locale, porps.menuData],
	() => {
		// 当路由或语言变化时更新标题
		titlePath.value = "";
		routeTitle.value = getRouteTitle();
	},
	{ deep: true },
);
onMounted(() => {
	routeTitle.value = getRouteTitle();
});
</script>

<style lang="scss" scoped>
.navigation {
	display: block;
}
.menu-title-page {
	display: flex;
	align-items: center;
	.positioning {
		width: 1.5rem;
		height: 1.5rem;
		margin-right: 0.5rem;
	}
}

@media (max-width: 959px) {
	.navigation {
		display: none;
	}
}
</style>
