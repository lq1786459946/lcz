<script setup>
import { getListConfiguration } from "@/api/front-pages";
import { computed, nextTick, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "vuetify";

const { t } = useI18n();
const { locale } = useI18n({ useScope: "global" });
const theme = useTheme();
const isDark = ref(theme.name);
const bannerListZh = ref([]);
const bannerListEn = ref([]);

// 获取轮播图数据
const getBanner = () => {
	nextTick(() => {
		getListConfiguration({ moduleType: 1 }).then(res => {
			let data = res.data;
			data.forEach(item => {
				bannerListZh.value.push(...item.linkZh);
				bannerListEn.value.push(...item.linkEn);
			});
		});
	});
};
getBanner();

const bannerList = computed(() => {
	return locale.value === "zh" ? bannerListZh.value : bannerListEn.value;
});
</script>

<template>
	<section id="home">
		<div class="landing-hero">
			<VContainer class="describe-1">
				<div class="text-center px-6">
					<div class="mb-4">
						<div class="landing-page-title">{{ t("home.OnlineAnalysisandPlotTools") }}</div>
					</div>
					<div class="text-body-1 font-weight-medium text-high-emphasis pb-8">
						<p class="mb-0">{{ t("home.Describe") }}</p>
						<p class="mb-0" style="margin-top: 1rem">{{ t("home.DescribeTwo") }}</p>
					</div>
					<VBtn @click="navigateTo('/analysisTools/All')" size="large" :active="false">
						{{ t("home.StartingNow") }}
						<VIcon icon="ri-arrow-right-line" />
					</VBtn>
				</div>
			</VContainer>
			<VContainer class="describe-2">
				<div class="text-center landing-page-title">{{ t("home.OnlineAnalysisandPlotTools") }}</div>
			</VContainer>
			<swiper-container pagination="true" autoplay="true" events-prefix="swiper-">
				<swiper-slide v-for="swiperImg in bannerList" :key="swiperImg" style="position: relative">
					<div class="mask" v-if="isDark == 'dark'"></div>
					<VImg :src="swiperImg" cover aspect-ratio="16/9" />
				</swiper-slide>
			</swiper-container>
		</div>
	</section>
</template>

<style lang="scss" scoped>
section {
	display: block;
	background-color: rgba(var(--v-theme-surface), 0.6);
	position: relative;
}

.landing-hero {
	background-position: bottom;
	background-repeat: no-repeat;
	background-size: cover;
}

.describe-1,
.describe-2 {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	z-index: 99;
}

.describe-1 {
	top: 35%;
	display: none;
}

.describe-2 {
	top: 60%;
	transform: translate(-50%, -50%);
}

@media (min-width: 960px) {
	section {
		padding-block-start: 0;
		height: 100vh;
	}

	.describe-1 {
		display: block;
	}

	.describe-2 {
		display: none;
	}

	swiper-slide {
		height: 100vh;
	}
}

@media (max-width: 959px) {
	section {
		padding-block-start: 4rem;
		height: 30vh;
	}

	swiper-slide {
		height: auto;
	}
}

.landing-hero {
	.landing-page-title {
		font-size: 3rem;
	}

	.mb-0 {
		font-size: 1.2rem;
	}
}

.describe-2 .landing-page-title {
	font-size: 1.5rem;
}

.hero-dashboard-img {
	img {
		inline-size: 85%;
	}
}

.mask {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 999;
	width: 100%;
	height: 100%;
	background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7));
}

.hero-elements-img {
	position: absolute;
	inline-size: 100%;
	inset: 0;
	margin-block: 15%;
	margin-inline: auto;

	img {
		inline-size: 100%;
	}
}

.container {
	margin-inline: auto;
	max-inline-size: 85vw;
}

.feature-cards {
	margin-block-start: 6.25rem;
}

.landing-page-title {
	color: rgb(var(--v-theme-primary));
	font-size: 2.375rem;
	font-weight: 800;
	line-height: 2.75rem;
}

.hero-animation-img {
	inset-block-start: 0;
	margin-block-end: -16rem;
}

@media (max-width: 960px) {
	.hero-animation-img {
		inset-block-start: 2rem;
		margin-block-end: -8rem;
	}
}

@media (max-width: 600px) {
	.hero-animation-img {
		inset-block-start: 1rem;
		margin-block-end: -2rem;
	}
}

.v-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
</style>
