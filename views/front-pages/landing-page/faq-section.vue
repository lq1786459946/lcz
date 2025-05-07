<script setup>
import { getListConfiguration } from "@/api/front-pages";
import sittingGirlWithLaptop from "@images/home/sitting-girl-with-laptop.png";
import sectionTitleIcon from "@images/pages/section-title-icon.png";
import { nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "vuetify";

const theme = useTheme();
// 初始化主题状态
const isDark = ref(theme.global.name.value === "dark");
const { t } = useI18n();
const { setLocaleMessage } = useI18n({
	useScope: "global",
});
const faqData = ref([]);
const isLoading = ref(true);

// 监听主题变化
watch(
	() => theme.global.name.value,
	newTheme => {
		isDark.value = newTheme === "dark";
	},
	{ immediate: true },
);

const getProblem = () => {
	nextTick(() => {
		getListConfiguration({ moduleType: 4 }).then(res => {
			let data = res.data;
			faqData.value = data;
			faqData.value.forEach(item => {
				addDynamicMessages(item, setLocaleMessage);
			});
			isLoading.value = false;
		});
	});
};
getProblem();
</script>

<template>
	<VContainer id="problem">
		<!-- 加载状态下显示骨架屏 -->
		<div :class="{ hidden: !isLoading }">
			<!-- 根据主题状态动态添加类名 -->
			<div class="skeleton-loader" :class="{ 'dark-theme': isDark }">
				<div class="skeleton-headers">
					<div class="d-flex gap-x-3 mb-6">
						<div class="skeleton-icon shimmer"></div>
						<div class="skeleton-title shimmer"></div>
					</div>
				</div>
				<div class="skeleton-faq-container">
					<div class="skeleton_left shimmer"></div>
					<div class="skeleton-faq-list">
						<div v-for="i in 4" :key="i" class="skeleton-faq-item shimmer">
							<div class="skeleton-left-block shimmer"></div>
							<div class="skeleton-right-content">
								<div class="skeleton-right-line shimmer"></div>
								<div class="skeleton-right-line shimmer"></div>
							</div>
						</div>
					</div>
				</div>
				<div class="text-center">
					<div class="skeleton-button shimmer"></div>
				</div>
			</div>
		</div>
		<!-- 数据加载完成后显示实际内容 -->
		<div class="faq-section" :class="{ hidden: isLoading }">
			<div class="headers d-flex justify-center flex-column align-center">
				<div class="d-flex gap-x-3 mb-6">
					<img :src="sectionTitleIcon" alt="section title icon" height="24" width="25" />
					<span class="text-h3 d-inline-block font-weight-bold" style="line-height: 2rem">{{ t("home.Frequently Asked Questions") }}</span>
				</div>
			</div>

			<div class="d-flex align-center justify-space-between flex-wrap flex-md-nowrap" style="gap: 6.25rem">
				<VImg :src="sittingGirlWithLaptop" height="340" width="320" />
				<div style="border-radius: 0.5rem; width: 60rem" :class="isDark ? 'shadow_box_dark' : 'shadow_box'">
					<VExpansionPanels>
						<VExpansionPanel v-for="faq in faqData" :key="faq.question">
							<VExpansionPanelTitle>
								{{ t(`title_${faq.id}`) }}
							</VExpansionPanelTitle>
							<VExpansionPanelText>
								<div v-html="decodeURIComponent(t(`content_${faq.id}`))"></div>
							</VExpansionPanelText>
						</VExpansionPanel>
					</VExpansionPanels>
				</div>
			</div>
			<div class="text-center" style="margin-top: 2rem">
				<VBtn variant="text" :to="{ name: 'front-pages-moreProblems' }">
					{{ t("home.More common questions") }}
					<VIcon icon="ri-arrow-right-line" />
				</VBtn>
			</div>
		</div>
	</VContainer>
</template>

<style lang="scss" scoped>
.hidden {
	display: none;
}
// 浅色主题样式
.skeleton-loader {
	padding: 20px;

	.skeleton-icon,
	.skeleton-title,
	.skeleton-left-block,
	.skeleton-right-line,
	.skeleton-button {
		background-color: #f0f0f0;
	}

	.shimmer {
		background-color: #f0f0f0;
	}
}

// 深色主题样式
.skeleton-loader.dark-theme {
	.skeleton-icon,
	.skeleton-title,
	.skeleton-left-block,
	.skeleton-right-line,
	.skeleton-button {
		background-color: #333;
	}

	.shimmer {
		background-color: #333;
	}

	.shimmer::after {
		background-image: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0) 0,
			rgba(255, 255, 255, 0.1) 20%,
			rgba(255, 255, 255, 0.3) 60%,
			rgba(255, 255, 255, 0)
		);
	}
}

.faq-section {
	margin-block: 5.25rem 4.25rem;
}
.shadow_box {
	box-shadow: 0rem 0rem 1rem 0rem #d7e6ee !important;
}
.shadow_box_dark {
	box-shadow: 0rem 0rem 1rem 0rem #0b1d27 !important;
}

.skeleton-loader {
	padding: 20px;
}

.skeleton-headers {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	margin-bottom: 20px;
}

.skeleton-icon {
	width: 25px;
	height: 24px;
	background-color: #f0f0f0;
	border-radius: 4px;
}

.skeleton-title {
	width: 300px;
	height: 30px;
	background-color: #f0f0f0;
	border-radius: 4px;
}

.skeleton-faq-container {
	width: 100%;
	display: flex;
}
.skeleton_left {
	width: 15rem;
	height: 15rem;
	border-radius: 4px;
	margin-right: 20px;
}

.skeleton-faq-list {
	width: calc(100% - 15rem);
	display: grid;
	// 初始状态下一行显示 4 个卡片
	grid-template-columns: repeat(1, 1fr);
	gap: 20px;
}

.skeleton-faq-item {
	background-color: #fff;
	border-radius: 8px;
	padding: 1rem;
}

.skeleton-faq-question {
	width: 100%;
	height: 20px;
	background-color: #f0f0f0;
	border-radius: 4px;
}

.skeleton-faq-answer {
	width: 100%;
	height: 60px;
	background-color: #f0f0f0;
	border-radius: 4px;
}

.skeleton-button {
	width: 200px;
	height: 40px;
	background-color: #f0f0f0;
	border-radius: 4px;
	margin: 20px auto 0;
}

.shimmer {
	position: relative;
	overflow: hidden;
}

.shimmer::after {
	content: "";
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	transform: translateX(-100%);
	background-image: linear-gradient(
		90deg,
		rgba(255, 255, 255, 0) 0,
		rgba(255, 255, 255, 0.2) 20%,
		rgba(255, 255, 255, 0.5) 60%,
		rgba(255, 255, 255, 0)
	);
	animation: shimmer 2s infinite;
}

@keyframes shimmer {
	100% {
		transform: translateX(100%);
	}
}

// 小屏幕适配
@media (max-width: 1400px) {
	.skeleton-faq-list {
		// 宽度小于 1400px 时，一行显示 3 个卡片
		grid-template-columns: repeat(3, 1fr);
	}
}

@media (max-width: 992px) {
	.skeleton-faq-list {
		// 宽度小于 992px 时，一行显示 2 个卡片
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (max-width: 600px) {
	.skeleton-faq-list {
		// 宽度小于 600px 时，一行显示 1 个卡片
		grid-template-columns: 1fr;
	}
}
</style>
