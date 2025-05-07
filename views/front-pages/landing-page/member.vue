<script setup>
import Member_item from "@/components/Member_item.vue";
import sectionTitleIcon from "@images/pages/section-title-icon.png";
const { t } = useI18n();
const userTab = ref("Monthly");
const tabs = ref([{ title: "Monthly" }, { title: "Year" }]);
</script>

<template>
	<VContainer id="member">
		<div class="pricing-plans d-flex flex-column gap-12">
			<!-- 👉 Headers  -->
			<div class="headers d-flex justify-center flex-column align-center">
				<div class="d-flex gap-x-3 mb-6">
					<img :src="sectionTitleIcon" alt="section title icon" height="24" width="25" />
					<span class="text-h3 d-inline-block font-weight-bold" style="line-height: 2rem">{{ t("home.Member Subscription") }}</span>
				</div>

				<p class="text-h5" style="letter-spacing: 0.15px !important">
					{{ t("home.Pricing & package") }}
				</p>
			</div>
			<VTabs v-model="userTab" fixed-tabs class="custom-underlined-tabs">
				<VTab v-for="tab in tabs" :key="tab.title">
					<span>{{ t(`home.${tab.title}`) }}</span>
				</VTab>
			</VTabs>
			<Member_item :type="userTab"></Member_item>
			<div class="text-center">
				<VBtn variant="text" :to="{ name: 'front-pages-pricing' }">
					{{ t("home.Members Introduction") }}
					<VIcon icon="ri-arrow-right-line" />
				</VBtn>
			</div>
		</div>
	</VContainer>
</template>

<style lang="scss">
.card-list {
	--v-card-list-gap: 12px;
}

.pricing-plans {
	margin-block: 5.25rem;
}

// .custom-underlined-tabs {
// 	.v-tab {
// 		// border-bottom: 2px solid currentColor !important;
// 		box-shadow: none !important;
// 	}
// }
</style>

<style lang="scss" scoped>
.plan-price-text {
	color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
	font-size: 48px;
	font-weight: 700;
	line-height: 56px;
}
</style>
