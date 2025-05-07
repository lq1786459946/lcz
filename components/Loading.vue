<template>
	<div v-if="visible" class="loading">
		<div class="spinner"></div>
		<p class="title">
			{{ t("analysisTool.Task analyzing, please wait") }} <span class="time">{{ time }}</span>
			{{ t("analysisTool.minute please wait patiently") }}
		</p>
	</div>
</template>

<script setup>
import { defineProps } from "vue";

// 定义 props
const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
	time: {
		type: String,
		default: false,
	},
});
const { t } = useI18n();
</script>

<style scoped lang="scss">
.loading {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.spinner {
	width: 40px;
	height: 40px;
	border: 4px solid #ccc;
	border-top-color: rgb(var(--v-theme-primary));
	border-radius: 50%;
	animation: spin 1s infinite linear;
}

.title {
	color: #f59a23;
}
.time {
	color: #039d12;
}
@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
