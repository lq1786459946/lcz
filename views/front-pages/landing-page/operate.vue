<script setup>
import { getListConfiguration } from "@/api/front-pages";
import sectionTitleIcon from "@images/pages/section-title-icon.png";
import { VideoPlayer } from "@videojs-player/vue";
import "video.js/dist/video-js.css";
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
const videoSrcId = ref("");
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

const handlePlay = index => {
	teamData.value.forEach((item, i) => {
		if (i === index) {
			item.isHover = true;
			videoSrcId.value = item.id;
		} else {
			item.isHover = false;
		}
	});
};

// 获取swiper实例
const swiper = ref(null);
// 滑动到上一页
const slidePrev = () => {
	swiper.value.swiper.slidePrev();
};

// 滑动到下一页
const slideNext = () => {
	swiper.value.swiper.slideNext();
};

// 获取操作实例数据
const getOperate = () => {
	nextTick(() => {
		getListConfiguration({ moduleType: 2 }).then(res => {
			let data = res.data;
			teamData.value = data;
			data[0].isHover = true;
			videoSrcId.value = data[0].id;
			teamData.value.forEach(item => {
				addDynamicMessages(item, setLocaleMessage);
			});
			// 数据加载完成，设置加载状态为 false
			isLoading.value = false;
		});
	});
};
getOperate();
</script>

<template>
	<VContainer id="operate">
		<!-- 加载状态下显示骨架屏 -->
		<!-- 根据主题状态动态添加类名 -->
		<div class="skeleton-loader" :class="{ 'dark-theme': isDark, hidden: !isLoading }">
			<div class="skeleton-header">
				<div class="skeleton-icon shimmer"></div>
				<div class="skeleton-title shimmer"></div>
				<div class="skeleton-subtitle shimmer"></div>
			</div>
			<div class="skeleton-video-container">
				<div class="skeleton-main-video shimmer"></div>
			</div>
		</div>
		<!-- 数据加载完成后显示实际内容 -->
		<div
			class="content-operate"
			:class="{
				hidden: isLoading, // 当 isLoading 为 true 时隐藏实际内容
			}"
		>
			<div class="our-team">
				<div class="headers d-flex justify-center flex-column align-center">
					<div class="mb-2">
						<img :src="sectionTitleIcon" alt="section title icon" height="24" width="25" />
						<span class="text-h3 d-inline-block font-weight-bold" style="line-height: 2rem">{{ t("home.Guidance") }}</span>
					</div>
					<div class="mb-2">
						<span class="text-h5" style="line-height: 2rem">
							{{ t("home.Upload the data, simply set params and wait for the result") }}
						</span>
					</div>
				</div>
				<!-- 大屏幕显示 -->
				<VRow class="desktop-view">
					<VCol cols="22">
						<VideoPlayer
							v-if="videoSrcId"
							:src="t(`link_${videoSrcId}`)"
							controls
							plays-inline
							style="height: 25.5rem"
							class="w-100 rounded"
						/>
					</VCol>
					<VCol cols="2" v-if="teamData.length > 1">
						<div
							class="videoList"
							:style="{
								background: isDark
									? 'linear-gradient( 270deg, #4B5C6D 0%, rgba(75,92,109,0) 100%)'
									: 'linear-gradient(270deg, #d4e3ee 0%, rgba(255, 255, 255, 0) 100%)',
							}"
						>
							<div class="video_item" v-for="(item, index) in teamData" :key="index">
								<div class="video" :class="{ 'has-border': item.isHover }">
									<div class="arrow" v-if="item.isHover">
										<img src="../../../assets/images/home/arrow.png" class="arrow_img" />
									</div>
									<VideoPlayer
										:src="t(`link_${item.id}`)"
										:controls="false"
										plays-inline
										style="width: 100%; height: 100%; cursor: pointer"
										class="w-100 rounded"
									/>
								</div>
								<div class="name ellipsis_A">{{ t(`title_${item.id}`) }}</div>
								<div class="mask" v-if="!item.isHover" @click="handlePlay(index)">
									<img src="../../../assets/images/home/play.png" class="play_img" />
								</div>
							</div>
						</div>
					</VCol>
				</VRow>
				<!-- 小屏幕显示 -->
				<VRow class="mobile-view">
					<VCol cols="24">
						<VideoPlayer v-if="videoSrcId" :src="t(`link_${videoSrcId}`)" controls plays-inline :height="200" class="w-100 rounded" />
						<div class="swiper_box" v-if="teamData.length > 1">
							<swiper-container ref="swiper" slides-per-view="2" space-between="10" events-prefix="swiper-">
								<swiper-slide v-for="(item, index) in teamData" :key="item">
									<div class="swiper_item">
										<VideoPlayer
											:class="{ 'has-border': item.isHover }"
											:src="t(`link_${item.id}`)"
											:controls="false"
											plays-inline
											style="width: 100%; height: 75%; cursor: pointer; border: 0.15rem solid transparent"
											class="w-100 rounded"
										/>
										<div class="name ellipsis_A">{{ t(`title_${item.id}`) }}</div>
										<div class="mask" v-if="!item.isHover" @click="handlePlay(index)">
											<img src="../../../assets/images/home/play.png" class="play_img" />
										</div>
									</div>
								</swiper-slide>
							</swiper-container>

							<div class="left_arrow" @click="slidePrev">
								<VIcon icon="ri-arrow-left-s-line" />
							</div>
							<div class="right_arrow" @click="slideNext">
								<VIcon icon="ri-arrow-right-s-line" />
							</div>
						</div>
					</VCol>
				</VRow>
			</div>
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
	.skeleton-main-video,
	.skeleton-video-thumbnail,
	.skeleton-video-title {
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
	.skeleton-subtitle,
	.skeleton-main-video,
	.skeleton-video-thumbnail,
	.skeleton-video-title {
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
	position: absolute;
	inset-block-start: -3.4rem;
	inset-inline: 0;
}
.content-operate {
	padding: 0 8rem;
	box-sizing: border-box;
}
.headers {
	margin-block-end: 1.25rem;
}

.our-team {
	margin-block: 3.5rem;
	margin-bottom: 3rem;
}
.videoList {
	height: 25.5rem;
	background: linear-gradient(270deg, #d4e3ee 0%, rgba(255, 255, 255, 0) 100%);
	padding: 1rem;
	padding-left: 0;
	padding-bottom: 0;
	overflow-y: auto;
	overflow-x: hidden;
	// 自定义滚动条宽度
	&::-webkit-scrollbar {
		width: 4px;
	}

	// 自定义滚动条轨道
	&::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 4px;
	}

	// 自定义滚动条滑块
	&::-webkit-scrollbar-thumb {
		background: #f1f1f1;
		border-radius: 4px;
	}

	// 鼠标悬停在滑块上的样式
	&::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
	.video_item {
		width: 100%;
		height: 8.2rem;
		position: relative;
		.video {
			width: 100%;
			height: 75%;
			border-radius: 0.3rem;
			border: 0.15rem solid transparent;
			position: relative;
			.arrow {
				position: absolute;
				right: -1.25rem;
				top: 50%;
				transform: translateY(-50%);
				width: 0.833rem;
				height: 1rem;
				.arrow_img {
					width: 100%;
					height: 100%;
				}
			}
		}
		.name {
			width: 100%;
			height: 25%;
			line-height: 1.5rem;
		}
		.mask {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 75%;
			border-radius: 0.3rem;
			background-color: rgba(0, 0, 0, 0.3);
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			.play_img {
				width: 1.167rem;
				height: 1.167rem;
			}
		}
	}
	.video_item:last-child {
		margin-bottom: 0;
	}
}
:deep(swiper-container)::part(pagination) {
	margin-block: 1rem !important;
}
.swiper_box {
	padding: 0 3rem;
	margin-top: 1rem;
	position: relative;
}
.swiper_item {
	width: 100%;
	height: 6.2rem;
	position: relative;
	.video {
		height: 75%;
		border-radius: 0.3rem;
		border: 0.15rem solid transparent;
	}
	.name {
		width: 100%;
		height: 25%;
	}
	.mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 75%;
		border-radius: 0.3rem;
		background-color: rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		.play_img {
			width: 1.167rem;
			height: 1.167rem;
		}
	}
}
.has-border {
	border: 0.15rem solid rgb(var(--v-theme-primary)) !important;
}
.left_arrow,
.right_arrow {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	width: 2.3rem;
	height: 2.3rem;
	border: 0.15rem solid rgb(var(--v-theme-primary));
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	z-index: 9999;
	font-size: 1.3rem;
	color: rgb(var(--v-theme-primary));
}

.left_arrow {
	left: 0rem;
}
.right_arrow {
	right: 0rem;
}
.ellipsis_A {
	white-space: nowrap; /* 防止文字换行 */
	overflow: hidden; /* 超出部分隐藏 */
	text-overflow: ellipsis; /* 超出部分显示省略号 */
}

// 默认隐藏移动端视图
.mobile-view {
	display: none;
}

// 大屏幕样式
@media (min-width: 960px) {
	.content-operate {
		padding: 0 8rem;
	}

	.desktop-view {
		display: flex;
	}
	.skeleton-main-video {
		height: 25.5rem !important;
	}
}

// 小屏幕样式
@media (max-width: 959px) {
	.content-operate {
		padding: 0;
	}

	.desktop-view {
		display: none;
	}

	.mobile-view {
		display: flex;
	}
	.skeleton-main-video {
		height: 10rem !important;
	}
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
	width: 200px;
	height: 30px;
	background-color: #eee;
	border-radius: 4px;
	animation: skeleton-loading 1s infinite alternate;
}
.skeleton-subtitle {
	width: 300px;
	height: 24px;
	background-color: #eee;
	border-radius: 4px;
	animation: skeleton-loading 1s infinite alternate;
}
.skeleton-video-container {
	display: flex;
	gap: 20px;
}
.skeleton-main-video {
	flex: 2;
	height: 10rem;
	background-color: #eee;
	border-radius: 8px;
	animation: skeleton-loading 1s infinite alternate;
}
.skeleton-video-list {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 10px;
}
.skeleton-video-item {
	display: flex;
	flex-direction: column;
	gap: 5px;
}
.skeleton-video-thumbnail {
	width: 100%;
	height: 60px;
	background-color: #eee;
	border-radius: 4px;
	animation: skeleton-loading 1s infinite alternate;
}
.skeleton-video-title {
	width: 80%;
	height: 16px;
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
