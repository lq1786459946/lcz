<script setup>
import Contact from "@/views/front-pages/front-page-contact.vue";
import Footer from "@/views/front-pages/front-page-footer.vue";
import Navbar from "@/views/front-pages/front-page-navbar.vue";

// home
import HeroSection from "@/views/front-pages/landing-page/hero-section.vue";
// 行业信息
import Industry from "@/views/front-pages/landing-page/industry.vue";
// 操作示例
import Operate from "@/views/front-pages/landing-page/operate.vue";
// 平台特征
import Characteristic from "@/views/front-pages/landing-page/characteristic.vue";
// 会员订阅
import Member from "@/views/front-pages/landing-page/member.vue";
// 应用展示
import Application from "@/views/front-pages/landing-page/application.vue";
// 常见问题
import FaqSection from "@/views/front-pages/landing-page/faq-section.vue";

import { useConfigStore } from "@core/stores/config";

const store = useConfigStore();
const route = useRoute();
store.skin = "default";
definePageMeta({
	layout: "blank",
	public: true,
});

const activeSectionId = ref("operate");
const refHome = ref();
const refIndustry = ref();
const refOperate = ref();
const refFeatures = ref();
const refMember = ref();
const refApplication = ref();
const refProblem = ref();

useIntersectionObserver(
	[refHome, refIndustry, refOperate, refFeatures, refMember, refApplication, refProblem],
	([{ isIntersecting, target }]) => {
		if (isIntersecting) activeSectionId.value = target.id;
	},
	{ threshold: 0.25 },
);

// 在路由跳转逻辑中需要添加主动滚动控制
const handleScroll = () => {
	setTimeout(() => {
		nextTick(() => {
			const hash = window.location.hash;
			if (hash) {
				const el = document.querySelector(hash);
				if (el) el.scrollIntoView({ behavior: "smooth" });
			}
		});
	}, 1000);
};
// 添加以下生命周期钩子
onMounted(() => {
	handleScroll(); // 初始化时执行
	window.addEventListener("hashchange", handleScroll); // 监听 hash 变化
});

// 添加路由监听（需在 setup 顶部添加 useRoute）
watch(
	() => route.name,
	name => {
		let newHash = route.hash.replace("#", "");
		if (newHash) {
			handleScroll();
		}
	},
);
// 销毁时移除监听
onUnmounted(() => {
	window.removeEventListener("hashchange", handleScroll);
});
</script>

<template>
	<div class="landing-page-wrapper">
		<!-- 头部 -->
		<Navbar :active-id="activeSectionId" />
		<!-- 👉 联系我们 -->
		<Contact />
		<!-- 👉 轮播图  -->
		<HeroSection ref="refHome" />
		<!-- 👉 行业信息 -->
		<Industry ref="refIndustry" />
		<!-- 操作实例 -->
		<div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
			<Operate ref="refOperate" />
		</div>
		<!-- 👉 平台特征  -->
		<Characteristic ref="refFeatures" />
		<!-- 👉 会员订阅 -->
		<div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
			<Member ref="refMember" />
		</div>

		<!-- 👉 应用展示 -->
		<Application ref="refApplication" />

		<!-- 👉 常见问题  -->
		<div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
			<FaqSection ref="refProblem" />
		</div>
		<Footer />
	</div>
</template>

<style lang="scss">
@media (max-width: 960px) and (min-width: 600px) {
	.landing-page-wrapper {
		.v-container {
			padding-inline: 2rem !important;
		}
	}
}
</style>
