<script setup>
import { getListConfiguration } from "@/api/front-pages";
import { addDynamicMessages } from "@/composables/i18n-global";
import sectionTitleIcon from "@images/pages/section-title-icon.png";
import { nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "vuetify";

const userStore = useUserStore();
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

// 获取行业信息数据
const getIndustry = () => {
	nextTick(() => {
		getListConfiguration({ moduleType: 3 }).then(res => {
			let data = res.data;
			teamData.value = data;
			teamData.value.forEach(item => {
				addDynamicMessages(item, setLocaleMessage);
			});
			// 数据加载完成，更新加载状态
			isLoading.value = false;
		});
	});
};
getIndustry();

const handelDetail = id => {
	userStore.setIndustryId(id);
};
</script>

<template>
	<VContainer id="industry">
		<!-- 骨架屏 -->
		<div
			class="skeleton-loader"
			:class="{
				'dark-theme': isDark,
				hidden: !isLoading, // 当 isLoading 为 false 时隐藏骨架屏
			}"
		>
			<div class="skeleton-header">
				<div class="skeleton-icon shimmer"></div>
				<div class="skeleton-title shimmer"></div>
				<div class="skeleton-subtitle shimmer"></div>
			</div>
			<div class="skeleton-card-container">
				<div v-for="i in 4" :key="i" class="skeleton-card">
					<div class="skeleton-card-image shimmer"></div>
					<div class="skeleton-card-text shimmer"></div>
				</div>
			</div>
			<div class="skeleton-button shimmer"></div>
		</div>

		<!-- 数据加载完成后显示实际内容 -->
		<div
			class="our-team"
			:class="{
				hidden: isLoading, // 当 isLoading 为 true 时隐藏实际内容
			}"
		>
			<div class="headers d-flex justify-center flex-column align-center">
				<div class="mb-2">
					<img :src="sectionTitleIcon" alt="section title icon" height="24" width="25" />
					<span class="text-h3 d-inline-block font-weight-bold" style="line-height: 2rem">{{ t("home.IndustryInformation") }}</span>
				</div>
				<div class="mb-2">
					<span class="text-h5" style="line-height: 2rem">
						{{ t("home.Insight into the latest industry news") }}
					</span>
				</div>
			</div>
			<VRow>
				<VCol v-for="(data, index) in teamData" :key="index" cols="12" lg="3" sm="6">
					<VCard
						flat
						variant="outlined"
						min-width="267"
						class="overflow-visible mt-16"
						style="cursor: pointer"
						:style="data.isHover ? { border: `1px solid ${data.borderColor}` } : {}"
						@mouseenter="data.isHover = true"
						@mouseleave="data.isHover = false"
						@click="handelDetail(data.id)"
					>
						<div style="height: 11rem; width: 100%; overflow: hidden">
							<VImg
								:src="t(`link_${data.id}`)"
								cover
								aspect-ratio="16/9"
								class="zoom-image"
								:style="{ transform: data.isHover ? 'scale(1.1)' : 'scale(1)' }"
							/>
						</div>
						<VCardText style="padding: 1rem 1.25rem">
							<div class="text-body-1" style="height: 2.5rem">
								{{ t(`title_${data.id}`) }}
							</div>
						</VCardText>
					</VCard>
				</VCol>
			</VRow>
			<VRow style="margin-top: 2rem">
				<VCol cols="24" align="center">
					<VBtn variant="text" :to="{ name: 'front-pages-industry' }" size="large" :active="false">
						{{ t("home.MoreIndustryNews") }}
						<VIcon icon="ri-arrow-right-line" />
					</VBtn>
				</VCol>
			</VRow>
		</div>
	</VContainer>
</template>

<style lang="scss" scoped>
// 浅色主题样式
.skeleton-loader {
	padding: 20px;

	.skeleton-icon,
	.skeleton-title,
	.skeleton-subtitle,
	.skeleton-card-image,
	.skeleton-card-text,
	.skeleton-button {
		background-color: #eee;
	}

	.shimmer {
		background-color: #f0f0f0;
	}
}

// 深色主题样式
.skeleton-loader.dark-theme {
	.skeleton-icon,
	.skeleton-title,
	.skeleton-subtitle,
	.skeleton-card-image,
	.skeleton-card-text,
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

.team-image {
	inset-inline: 0;
}

.headers {
	margin-block-end: 1.25rem;
}

.our-team {
	margin-block: 6rem;
	margin-bottom: 6rem;
}
.text-body-1 {
	height: 2.5rem;
	text-align: left;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2; // 限制显示两行
	overflow: hidden;
	text-overflow: ellipsis;
}

.zoom-image {
	transition: transform 0.3s ease;
}

.skeleton-loader {
	padding: 20px;
}

.skeleton-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	margin-bottom: 20px;
}

.skeleton-icon {
	width: 25px;
	height: 24px;
	background-color: #eee;
	border-radius: 4px;
	animation: skeleton-loading 1s infinite alternate;
}

.skeleton-title {
	width: 250px;
	height: 30px;
	background-color: #eee;
	border-radius: 4px;
	animation: skeleton-loading 1s infinite alternate;
}

.skeleton-subtitle {
	width: 350px;
	height: 24px;
	background-color: #eee;
	border-radius: 4px;
	animation: skeleton-loading 1s infinite alternate;
}

.skeleton-card-container {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(267px, 1fr));
	gap: 20px;
}

.skeleton-card {
	// border: 1px solid #eee;
	border-radius: 4px;
	overflow: hidden;
}

.skeleton-card-image {
	height: 11rem;
	background-color: #eee;
	animation: skeleton-loading 1s infinite alternate;
}

.skeleton-card-text {
	height: 2.5rem;
	margin: 1rem 1.25rem;
	background-color: #eee;
	border-radius: 4px;
	animation: skeleton-loading 1s infinite alternate;
}

.skeleton-button {
	width: 200px;
	height: 40px;
	margin: 2rem auto 0;
	background-color: #eee;
	border-radius: 4px;
	animation: skeleton-loading 1s infinite alternate;
}

@keyframes skeleton-loading {
	from {
		opacity: 0.6;
	}
	to {
		opacity: 1;
	}
}

.shimmer {
	position: relative;
	background-color: #f0f0f0;
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
.hidden {
	display: none;
}
</style>
