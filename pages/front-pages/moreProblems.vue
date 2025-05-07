<script setup>
import { getListConfiguration } from "@/api/front-pages";
import Contact from "@/views/front-pages/front-page-contact.vue";
import Footer from "@/views/front-pages/front-page-footer.vue";
import Navbar from "@/views/front-pages/front-page-navbar.vue";

import { useConfigStore } from "@core/stores/config";
const store = useConfigStore();
const { t } = useI18n();
const { locale, setLocaleMessage } = useI18n({
	useScope: "global",
});
store.skin = "default";
definePageMeta({
	layout: "blank",
	public: true,
});
const search = title => {
	getProblem(title);
};
const faqData = ref([]);
// 获取操作实例数据
const getProblem = (title = "") => {
	nextTick(() => {
		let obj = { moduleType: 4, allData: 1 };
		if (locale.value == "zh") {
			obj.titleZh = title;
		} else {
			obj.titleEn = title;
		}
		getListConfiguration(obj).then(res => {
			let data = res.data;
			faqData.value = data;
			faqData.value.forEach(item => {
				addDynamicMessages(item, setLocaleMessage);
			});
		});
	});
};
getProblem();
</script>

<template>
	<div class="pricing-page">
		<Navbar />
		<!-- 👉 联系我们 -->
		<Contact />
		<div>
			<AppSearchHeader :title="t('home.Hello, how can we help')" subtitle="" :placeholder="''" custom-class="rounded-0" @search="search" />
		</div>
		<VContainer style="min-height: 40rem">
			<VExpansionPanels>
				<VExpansionPanel v-for="faq in faqData" :key="faq.question">
					<VExpansionPanelTitle>
						{{ t(`title_${faq.id}`) }}
					</VExpansionPanelTitle>
					<VExpansionPanelText>
						<div v-html="decodeURIComponent(t(`content_${faq.id}`))"></div>
					</VExpansionPanelText>
				</VExpansionPanel>
			</VExpansionPanels>
		</VContainer>
		<Footer />
	</div>
</template>

<style lang="scss"></style>
