<script setup>
import { getListConfiguration } from "@/api/front-pages";
import sectionTitleIcon from "@images/pages/section-title-icon.png";
import { nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "vuetify";

const theme = useTheme();
const isDark = ref(theme.global.name.value === "dark");
const { t } = useI18n();
const { setLocaleMessage } = useI18n({
	useScope: "global",
});
const teamData = ref([]);
const isLoading = ref(true);

// 监听主题变化
watch(
	() => theme.global.name.value,
	newTheme => {
		isDark.value = newTheme === "dark";
	},
	{ immediate: true },
);

const getFeatures = () => {
	nextTick(() => {
		getListConfiguration({ moduleType: 6 }).then(res => {
			let data = res.data;
			teamData.value = data;
			teamData.value.forEach(item => {
				addDynamicMessages(item, setLocaleMessage);
			});
			isLoading.value = false;
		});
	});
};
getFeatures();
</script>

<template>
	<VContainer id="features">
		<!-- 加载状态下显示骨架屏 -->
		<div :class="{ hidden: !isLoading }">
			<div class="skeleton-loader" :class="{ 'dark-theme': isDark }">
				<div class="skeleton-headers">
					<div class="skeleton-icon shimmer"></div>
					<div class="skeleton-title shimmer"></div>
					<div class="skeleton-subtitle shimmer"></div>
				</div>
				<div class="skeleton-feature-cards">
					<div v-for="i in 4" :key="i" class="skeleton-feature">
						<div class="skeleton-avatar shimmer"></div>
						<div class="skeleton-feature-title shimmer"></div>
						<div class="skeleton-feature-content shimmer"></div>
					</div>
				</div>
			</div>
		</div>
		<!-- 数据加载完成后显示实际内容 -->
		<div class="feature-cards" :class="{ hidden: isLoading }">
			<div class="headers d-flex justify-center flex-column align-center mb-6">
				<div class="d-flex gap-x-3 mb-6">
					<img :src="sectionTitleIcon" alt="section title icon" height="24" width="25" />
					<span class="text-h3 d-inline-block font-weight-bold" style="line-height: 2rem">{{ t("home.Platform features") }}</span>
				</div>
				<p class="text-h5" style="letter-spacing: 0.15px !important">
					{{ t("home.Anybody can operate without any barriers") }}
				</p>
			</div>

			<VRow>
				<VCol v-for="(data, index) in teamData" :key="index" cols="12" sm="12" md="6">
					<div class="feature d-flex flex-column gap-y-2 align-center justify-center mt-2">
						<VAvatar variant="outlined" size="160" color="primary" class="mb-2">
							<VImg cover aspect-ratio="16/9" :src="t(`link_${data.id}`)" />
						</VAvatar>
						<h5 class="text-h5">
							{{ t(`title_${data.id}`) }}
						</h5>
						<p class="text-center text-medium-emphasis" style="max-inline-size: 360px">
							{{ t(`content_${data.id}`) }}
						</p>
					</div>
				</VCol>
			</VRow>
		</div>
	</VContainer>
</template>

<style lang="scss" scoped>
.feature-cards {
	margin-block-end: 4.25rem;
}

#features {
	padding-block-start: 5rem;
}

@media (max-width: 960px) {
	#features {
		padding-block-start: 6rem;
	}
}

@media (max-width: 600px) {
	#features {
		padding-block-start: 2rem;
	}
}
</style>

<style lang="scss" scoped>
.feature {
	.v-avatar {
		&.v-avatar--variant-outlined {
			border: 2px solid rgba(var(--v-theme-primary), 0.32);

			&:hover {
				background: rgba(var(--v-theme-primary), 0.16);
				cursor: pointer;
			}
		}
	}
}
.skeleton-loader {
	padding: 20px;

	.skeleton-icon,
	.skeleton-title,
	.skeleton-subtitle,
	.skeleton-avatar,
	.skeleton-feature-title,
	.skeleton-feature-content {
		background-color: #f0f0f0;
	}

	.shimmer {
		background-color: #f0f0f0;
	}
}

// 浅色主题样式
.skeleton-loader.dark-theme {
	.skeleton-icon,
	.skeleton-title,
	.skeleton-subtitle,
	.skeleton-avatar,
	.skeleton-feature-title,
	.skeleton-feature-content {
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
.skeleton-subtitle {
	width: 400px;
	height: 24px;
	background-color: #f0f0f0;
	border-radius: 4px;
}
.skeleton-feature-cards {
	display: grid;
	// 设置为一行显示两个卡片
	grid-template-columns: repeat(2, 1fr);
	gap: 20px;
}
.skeleton-feature {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
}
.skeleton-avatar {
	width: 160px;
	height: 160px;
	background-color: #f0f0f0;
	border-radius: 50%;
}
.skeleton-feature-title {
	width: 200px;
	height: 24px;
	background-color: #f0f0f0;
	border-radius: 4px;
}
.skeleton-feature-content {
	width: 300px;
	height: 60px;
	background-color: #f0f0f0;
	border-radius: 4px;
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

// 小屏幕适配，一行显示一个卡片
@media (max-width: 600px) {
	.skeleton-feature-cards {
		grid-template-columns: 1fr;
	}
}
.hidden {
	display: none;
}
</style>
