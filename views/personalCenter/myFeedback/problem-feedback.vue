<script setup>
import { useI18n } from "vue-i18n";
import FeedbackAdd from "./feedback-add.vue";

const userStore = useUserStore();
const { t } = useI18n();

let formRef = ref(null);

const OpenDetail = () => {
	formRef.value.InitForm();
};
</script>

<template>
	<VBtn
		v-show="userStore.getUserData && userStore.getUserData.user_id"
		class="buy-now-button d-print-none"
		role="button"
		rel="noopener"
		target="_blank"
		@click="OpenDetail"
	>
		{{ t("myFeedback.ProblemFeedback") }}
	</VBtn>
	<FeedbackAdd ref="formRef"></FeedbackAdd>
</template>

<style lang="scss" scoped>
.buy-now-button,
.button-inner {
	display: inline-flex;
	box-sizing: border-box;
	align-items: center;
	justify-content: center;
	border: 0;
	border-radius: 6px;
	margin: 0;
	animation: anime 12s linear infinite;
	appearance: none;
	background: linear-gradient(-45deg, #ffa63d, #ff3d77, #338aff, #3cf0c5);
	background-size: 600%;
	color: rgba(255, 255, 255, 90%);
	cursor: pointer;
	font-size: 0.9375rem;
	font-weight: 500;
	letter-spacing: 0.43px;
	line-height: 1.2;
	min-inline-size: 50px;
	outline: 0;
	padding-block: 0.625rem;
	padding-inline: 1.25rem;
	text-decoration: none;
	text-transform: none;
	vertical-align: middle;
}

.buy-now-button {
	position: fixed;
	z-index: 999;
	inset-block-end: 3%;
	inset-inline-end: 87px;

	&:hover {
		color: white;
		text-decoration: none;
	}

	.button-inner {
		position: absolute;
		z-index: -1;
		filter: blur(12px);
		inset: 0;
		opacity: 0;
		transition: opacity 200ms ease-in-out;
	}

	&:not(:hover) .button-inner {
		opacity: 0.8;
	}
}

@keyframes anime {
	0% {
		background-position: 0% 50%;
	}

	50% {
		background-position: 100% 50%;
	}

	100% {
		background-position: 0% 50%;
	}
}
</style>
