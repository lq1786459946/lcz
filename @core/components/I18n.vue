<script setup>
const userStore = useUserStore();
const props = defineProps({
	languages: {
		type: Array,
		required: true,
	},
	location: {
		type: null,
		required: false,
		default: "bottom end",
	},
});

const { locale } = useI18n({ useScope: "global" });

const switchLanguage = lang => {
	locale.value = lang.i18nLang;
	userStore.setLanguage(lang.i18nLang);
};
</script>

<template>
	<IconBtn>
		<VIcon icon="ri-translate-2" />

		<!-- Menu -->
		<VMenu activator="parent" :location="props.location" offset="15px" width="160">
			<!-- List -->
			<VList :selected="[locale]" color="primary" mandatory>
				<!-- List item -->
				<VListItem v-for="lang in props.languages" :key="lang.i18nLang" :value="lang.i18nLang" @click="switchLanguage(lang)">
					<!-- Language label -->
					<VListItemTitle>
						{{ lang.label }}
					</VListItemTitle>
				</VListItem>
			</VList>
		</VMenu>
	</IconBtn>
</template>
