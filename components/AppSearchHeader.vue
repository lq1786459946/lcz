<script setup>
import AppSearchHeaderBgDark from "@images/pages/app-search-header-bg-dark.png";

const props = defineProps({
	title: {
		type: String,
		required: false,
	},
	subtitle: {
		type: String,
		required: false,
	},
	customClass: {
		type: String,
		required: false,
	},
	placeholder: {
		type: String,
		required: false,
		default: "Ask a question..",
	},
});
const keyWords = ref("");
defineOptions({
	inheritAttrs: false,
});

// const themeBackgroundImg = useGenerateImageVariant(AppSearchHeaderBgLight, AppSearchHeaderBgDark);
const themeBackgroundImg = AppSearchHeaderBgDark;
const emit = defineEmits(["search"]);
// 处理回车事件
const handleEnter = () => {
	console.log("回车键被按下，搜索关键词:", keyWords.value);
	emit("search", keyWords.value);
};
</script>

<template>
	<!-- 👉 Search Banner  -->
	<VCard flat class="text-center search-header" :class="customClass" :style="`background: url(${themeBackgroundImg});`">
		<VCardText>
			<slot>
				<h4 class="text-h4 text-primary">
					{{ title }}
				</h4>

				<!-- 👉 Search Input -->
				<VTextField
					v-bind="$attrs"
					v-model="keyWords"
					:placeholder="placeholder"
					@keydown.enter="handleEnter"
					class="search-header-input mx-auto my-4"
				>
					<template #prepend-inner>
						<VIcon icon="ri-search-line" size="18" />
					</template>
				</VTextField>

				<p class="text-body-1">
					{{ subtitle }}
				</p>
			</slot>
		</VCardText>
	</VCard>
</template>

<style lang="scss">
.search-header {
	padding: 6rem !important;
	background-size: cover !important;
}

// search input
.search-header-input {
	border-radius: 0.25rem !important;
	background-color: rgb(var(--v-theme-surface));
	max-inline-size: 32.125rem;
}

@media (max-width: 37.5rem) {
	.search-header {
		padding: 1.5rem !important;
	}
}
</style>
