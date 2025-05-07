<script setup>
import { getListConfiguration } from "@/api/front-pages";
import sectionTitleIcon from "@images/pages/section-title-icon.png";
import { register } from "swiper/element/bundle";
import { nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "vuetify";
register();

const theme = useTheme();
const isDark = ref(theme.global.name.value === "dark");
const { t } = useI18n();
const { setLocaleMessage } = useI18n({
	useScope: "global",
});
const reviewData = ref([]);
const isLoading = ref(true);

// 监听主题变化
watch(
	() => theme.global.name.value,
	newTheme => {
		isDark.value = newTheme === "dark";
	},
	{ immediate: true },
);

// 获取应用列表
const getAppList = () => {
	nextTick(() => {
		getListConfiguration({ moduleType: 5 }).then(res => {
			let data = res.data;
			reviewData.value = data;
			reviewData.value.forEach(item => {
				addDynamicMessages(item, setLocaleMessage);
			});
			isLoading.value = false;
		});
	});
};
getAppList();

const stopAutoplay = swiper => {
	const swiperInstance = swiper.target.swiper;
	if (swiperInstance && swiperInstance.autoplay) {
		swiperInstance.autoplay.stop();
	}
};

const startAutoplay = swiper => {
	const swiperInstance = swiper.target.swiper;
	if (swiperInstance && swiperInstance.autoplay) {
		swiperInstance.autoplay.start();
	}
};

const hToApp = item => {
	navigateTo(`/analysisTool/${item.associationId}`);
};
</script>

<template>
	<VContainer id="application" style="margin-left: 0; margin-right: 0; width: 100%; max-width: 100%">
		<!-- 加载状态下显示骨架屏 -->
		<div :class="{ hidden: !isLoading }">
			<div class="skeleton-loader" :class="{ 'dark-theme': isDark }">
				<div class="skeleton-headers">
					<div class="d-flex gap-x-3 mb-6">
						<div class="skeleton-icon shimmer"></div>
						<div class="skeleton-title shimmer"></div>
					</div>
					<div class="skeleton-subtitle shimmer"></div>
				</div>
				<div class="skeleton-swiper-container">
					<div class="skeleton-swiper-list">
						<div v-for="i in 4" :key="i" class="skeleton-swiper-slide">
							<div class="skeleton-card shimmer">
								<div class="skeleton-card-image shimmer"></div>
								<div class="skeleton-card-info">
									<div class="skeleton-card-title shimmer"></div>
									<div class="skeleton-card-heat shimmer"></div>
								</div>
								<div class="skeleton-card-description shimmer"></div>
							</div>
						</div>
					</div>
				</div>
				<div class="skeleton-button shimmer"></div>
			</div>
		</div>
		<!-- 数据加载完成后显示实际内容 -->
		<!-- 实际内容 -->
		<div class="pricing-plans d-flex flex-column" :class="{ hidden: isLoading }" style="margin-bottom: 2rem">
			<!-- 👉 Headers  -->
			<div class="headers d-flex justify-center flex-column align-center">
				<div class="d-flex gap-x-3 mb-6">
					<img :src="sectionTitleIcon" alt="section title icon" height="24" width="25" />
					<div class="text-h3 d-inline-block font-weight-bold" style="line-height: 2rem">{{ t("home.Application Display") }}</div>
				</div>
				<p class="text-h5" style="letter-spacing: 0.15px !important">{{ t("home.What Applications We Have") }}?</p>
			</div>

			<div class="swiper-reviews-carousel">
				<!-- eslint-disable vue/attribute-hyphenation -->
				<ClientOnly>
					<swiper-container
						v-if="reviewData.length > 0"
						ref="swiper"
						@mouseover="stopAutoplay"
						@mouseleave="startAutoplay"
						slides-per-view="1"
						space-between="5"
						centered-slides="true"
						loop="true"
						autoplay-delay="3000"
						autoplay-disable-on-interaction="false"
						events-prefix="swiper-"
						:pagination="{
							clickable: 'true',
						}"
						:injectStyles="[
							`
            .swiper-pagination{
              position: static;
              margin-block: 1rem;
            },
            .swiper-pagination-bullet-active{
              width: 1rem;
            }
  
        `,
						]"
						:breakpoints="{
							1400: {
								slidesPerView: 4,
								spaceBetween: 20,
							},
							992: {
								slidesPerView: 3,
								spaceBetween: 20,
							},
							768: {
								slidesPerView: 2,
								spaceBetween: 20,
							},
						}"
					>
						<swiper-slide v-for="(data, index) in reviewData" :key="index">
							<VCard class="h-100 d-flex align-stretch" style="width: 100% !important" @click="hToApp(data)">
								<VCardText
									class="pa-4 pa-sm-6 pa-md-8 d-flex flex-column justify-space-between align-center"
									style="cursor: pointer; width: 100%; box-sizing: border-box"
								>
									<div
										style="
											height: 11rem;
											width: 100%;
											overflow: hidden;
											border: 1px solid #e6e5e7;
											background-color: #f0f0f0;
											border-radius: 0.5rem;
											overflow: hidden;
										"
									>
										<VImg
											v-if="data.toolLogoFile && data.toolLogoFile.length != 0"
											:src="data.toolLogoFile[0].link"
											cover
											aspect-ratio="16/9"
											class="zoom-image"
										/>
									</div>
									<div style="width: 100%; margin-top: 1rem" class="d-flex">
										<div class="align-center single-line-ellipsis" style="width: 70%; height: 1.5rem">
											{{ t(`toolName_${data.id}`) }}
										</div>
										<div class="d-flex align-center justify-end" style="width: 30%; height: 1.5rem">
											<img src="../../../assets/images/home/flame.png" alt="" />
											{{ data.toolHeat }}
										</div>
									</div>
									<div class="toolDescription">{{ t(`toolDescription_${data.id}`) }}</div>
								</VCardText>
							</VCard>
						</swiper-slide>
					</swiper-container>
				</ClientOnly>
			</div>
			<div class="text-center">
				<VBtn variant="text" @click="navigateTo('/analysisTools/All')">
					{{ t("home.More Applications") }}
					<VIcon icon="ri-arrow-right-line" />
				</VBtn>
			</div>
		</div>
	</VContainer>
</template>

<style lang="scss" scoped>
@use "swiper/css/bundle";

swiper-container::part(bullet-active) {
	border-radius: 6px;
	background-color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity));
	inline-size: 38px;
}

swiper-container::part(bullet) {
	background-color: rgba(var(--v-theme-on-background));
}

swiper-container::part(pagination) {
	margin-block: 1.5rem;
}

.swiper-reviews-carousel {
	swiper-container {
		--swiper-pagination-bullet-width: 10px;
		--swiper-pagination-bullet-height: 10px;
		--swiper-pagination-bullet-horizontal-gap: 6px;

		.swiper {
			padding-block-end: 3rem;
		}
	}

	swiper-slide {
		block-size: auto;
		opacity: 0.5;
		padding-block: 1rem;
		padding-block-end: 1rem;
		transition: all 0.35s ease;

		&.swiper-slide-active {
			opacity: 1;
			padding-block: 0;
		}
	}

	.swiper-pagination {
		inset-block: 0 0 !important;
	}
}
.hidden {
	display: none;
}
.toolDescription {
	text-align: left;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2; // 添加这行
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: normal;
	word-wrap: break-word;
	width: 100%;
}

.single-line-ellipsis {
	white-space: nowrap; /* 禁止换行 */
	overflow: hidden; /* 超出部分隐藏 */
	text-overflow: ellipsis; /* 超出部分显示省略号 */
}
</style>

<style lang="scss" scoped>
.customer-reviews {
	margin-top: 23rem;
	// margin-block: 6.25rem;
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
	width: 250px;
	height: 30px;
	background-color: #f0f0f0;
	border-radius: 4px;
}

.skeleton-subtitle {
	width: 350px;
	height: 24px;
	background-color: #f0f0f0;
	border-radius: 4px;
}

.skeleton-swiper-container {
	width: 100%;
}

.skeleton-swiper-list {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 20px;
}

.skeleton-swiper-slide {
	width: 100%;
}

.skeleton-card {
	background-color: #fff;
	border-radius: 8px;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.skeleton-card-image {
	width: 100%;
	height: 150px;
	background-color: #f0f0f0;
	border-radius: 4px;
}

.skeleton-card-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.skeleton-card-title {
	width: 70%;
	height: 20px;
	background-color: #f0f0f0;
	border-radius: 4px;
}

.skeleton-card-heat {
	width: 30%;
	height: 20px;
	background-color: #f0f0f0;
	border-radius: 4px;
}

.skeleton-card-description {
	width: 100%;
	height: 40px;
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

@media (max-width: 600px) {
	.skeleton-swiper-list {
		grid-template-columns: 1fr;
	}
}

// 浅色主题样式
.skeleton-loader {
	padding: 20px;
	.skeleton-icon,
	.skeleton-title,
	.skeleton-subtitle,
	.skeleton-card-image,
	.skeleton-card-title,
	.skeleton-card-heat,
	.skeleton-card-description,
	.skeleton-button {
		background-color: #f0f0f0;
	}
}
// 深色主题样式
.skeleton-loader.dark-theme {
	.skeleton-icon,
	.skeleton-title,
	.skeleton-subtitle,
	.skeleton-card-image,
	.skeleton-card-title,
	.skeleton-card-heat,
	.skeleton-card-description,
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
</style>
