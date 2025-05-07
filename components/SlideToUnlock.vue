<script setup>
import { useTheme } from "vuetify";

const props = defineProps({
	disabled: {
		type: Boolean,
		default: false,
	},
	offset: {
		type: Number,
		default: 3,
	},
	dBgColor: {
		type: String,
		default: "#FFFFFF",
	},
	sBgColor: {
		type: String,
		default: "#FFFFFF",
	},
	dColor: {
		type: String,
		default: "rgba(var(--v-theme-primary),0.7)",
	},
	sColor: {
		type: String,
		default: "rgba(var(--v-theme-primary))",
	},
});

const emit = defineEmits(["change"]);

const { t } = useI18n();

const theme = useTheme();
const isDark = ref(theme.name);
const sliderPosition = ref(0);
const isDragging = ref(false);
const success = ref(false);
const verification = ref(0);
const sliderWidth = ref(0);
const sliderRef = ref(null);
const sliderThumbRef = ref(null); // 新增滑块元素的引用

const onMouseDown = () => {
	if (props.disabled || success.value) return;
	isDragging.value = true;
	window.addEventListener("mousemove", throttledMouseMove);
	window.addEventListener("mouseup", onMouseUp);
	window.addEventListener("touchmove", throttledMouseMove);
	window.addEventListener("touchend", onMouseUp);
};

const onMouseMove = e => {
	if (!isDragging.value) return;
	const clientX = e.touches ? e.touches[0].clientX : e.clientX;
	const rect = sliderRef.value.getBoundingClientRect();
	const thumbWidth = sliderThumbRef.value?.clientWidth || 0;
	let newPosition = clientX - rect.left;
	newPosition = Math.max(0, Math.min(rect.width - thumbWidth, newPosition));
	sliderPosition.value = newPosition;
};

const onMouseUp = () => {
	isDragging.value = false;
	window.removeEventListener("mousemove", throttledMouseMove);
	window.removeEventListener("mouseup", onMouseUp);
	window.removeEventListener("touchmove", throttledMouseMove);
	window.removeEventListener("touchend", onMouseUp);

	const rect = sliderRef.value.getBoundingClientRect();
	const thumbWidth = sliderThumbRef.value?.clientWidth || 0; // 动态获取滑块宽度
	if (sliderPosition.value >= rect.width - thumbWidth - props.offset) {
		success.value = true;
		emit("change", { state: true, verification: verification.value });
	} else {
		// 添加返回动画
		sliderPosition.value = 0;
		verification.value++;
		emit("change", { state: false, verification: verification.value });
	}
};

// import { throttle } from "lodash";
import _ from "lodash";

const throttle = _.throttle;
const throttledMouseMove = throttle(onMouseMove, 16); // 16ms 约等于 60fps

const initialization = () => {
	sliderPosition.value = 0;
	success.value = false;
	verification.value = 0;
};

onMounted(() => {
	sliderWidth.value = sliderRef.value?.clientWidth || 0;
});

defineExpose({
	initialization,
});
</script>

<template>
	<div ref="sliderRef" class="slider-verify" :style="{ 'border-color': isDark == 'dark' ? '#595572' : '#d1cfd4' }" @mouseup="onMouseUp">
		<div class="slider-prompt" :style="success ? `color: ${sColor}` : `color: ${dColor}`">
			{{ success ? t("login.VerifiedBy") : t("login.PleaseSlideToTheFarRight") }}
		</div>
		<div class="slider-bg" :style="`transform: translateX(${sliderPosition}px);`"></div>
		<div class="slider-area">
			<div
				ref="sliderThumbRef"
				class="slider-thumb"
				:style="`transform: translateX(${sliderPosition}px); border-color: ${success ? sBgColor : dBgColor}`"
				@mousedown="onMouseDown"
				@touchstart="onMouseDown"
			>
				<VIcon icon="ri-arrow-right-s-line" />
			</div>
		</div>
	</div>
</template>

<style scoped>
.slider-verify {
	position: relative;
	width: 100%;
	height: 3rem;
	overflow: hidden;
	border-radius: 0.4rem;
	border: 0.1rem solid;
	margin-bottom: 1.5rem;
}

.slider-prompt {
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	top: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.875rem; /* 14px -> 0.875rem */
	z-index: 99;
}

.slider-bg {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	transition: transform 0.1s ease;
}

.slider-area {
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	z-index: 999;
}

.slider-thumb {
	position: absolute;
	width: 3rem;
	height: 100%;
	box-sizing: border-box;
	border-radius: 0.3rem;
	background-color: rgba(var(--v-theme-primary));
	cursor: pointer;
	transition: transform 0.15s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	will-change: transform;
	color: #fff;
	font-size: 1.1rem; /* 16px -> 1rem */
}
</style>
