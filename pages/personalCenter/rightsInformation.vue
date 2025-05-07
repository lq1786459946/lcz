<script setup>
import UserProfileHeader from "@/pages/personalCenter/components/UserProfileHeader.vue";
import { getMemberBenifitsPage } from "@/api/personalCenter/rightsInformation";
import { addDynamicMessages } from "@/composables/i18n-global.js";
import img from "@/assets/images/personalCenter/icon-yes.png";
import { nextTick } from "vue";
const { t } = useI18n();
const userData = useCookie("userData");
const form = ref({});
let loading = ref(true);
let data = ref([]);
const projectTableHeaders = [
	{
		title: "分析工具",
		key: "tool",
	},
	{
		title: "权益类型",
		key: "type",
		align: "center",
	},
];
const pageTable = ref({
	total: 0,
	currentPage: 1,
	pageSize: 10,
	options: [10, 20, 25, 50, 100],
});

// 获取用户信息
// 确保在setup函数中调用useI18n
const { setLocaleMessage } = useI18n({
	useScope: "global",
});
const onLoad = () => {
	loading.value = true;
	// nextTick(() => {
	getMemberBenifitsPage(pageTable.value.currentPage, pageTable.value.pageSize).then(res => {
		loading.value = false;
		data.value = res.data.records;
		pageTable.value.total = res.data.total;
		data.value.forEach(item => {
			addDynamicMessages(item, setLocaleMessage);
		});
		// });
	});
};
</script>
<template>
	<div>
		<UserProfileHeader class="mb-5" />
		<VCard class="mb-4" :title="t('rightsInformation.RightsInformation')">
			<VCardText>
				<VDataTableServer
					fixed-header
					v-model:items-per-page="pageTable.pageSize"
					v-model:page="pageTable.currentPage"
					:items-per-page-options="pageTable.options"
					:items-length="pageTable.total"
					:headers="projectTableHeaders"
					:loading="loading"
					loading-text=""
					:items="data"
					hide-default-footer
					@update:options="onLoad"
					item-value="id"
				>
					<template #header.tool>
						<div>{{ t("rightsInformation.AnalysisTools") }}</div>
					</template>
					<template #header.type>
						<div>{{ t("rightsInformation.EquityType") }}</div>
					</template>

					<template #item.tool="{ item }">
						<div class="d-flex align-center">
							<VAvatar variant="tonal" class="me-4" color="primary">
								<VIcon :icon="item.icon" size="28" />
							</VAvatar>
							<div>{{ t(`toolName_${item.id}`) }}</div>
						</div>
					</template>
					<template #item.type="{ item }">
						<VAvatar :size="28" color="success" variant="tonal">
							<VIcon :size="16" icon="ri-check-line" />
						</VAvatar>
					</template>
					<!-- 分页 -->
					<template #bottom>
						<VDivider />
						<VCardText class="pt-2">
							<div class="d-flex flex-wrap justify-end gap-y-2 mt-2">
								<div class="d-flex align-center mr-5">{{ `${t("total-header")}${pageTable.total}${t("total-footer")}` }}</div>
								<VSelect
									v-model="pageTable.pageSize"
									:items="[5, 10, 25, 50, 100]"
									label=""
									style="max-inline-size: 6rem; min-inline-size: 4rem; margin-right: 1rem"
								/>
								<VPagination
									v-model="pageTable.currentPage"
									:total-visible="$vuetify.display.smAndDown ? 2 : 3"
									:length="Math.ceil(pageTable.total / pageTable.pageSize)"
								/>
							</div>
						</VCardText>
					</template>
				</VDataTableServer>
			</VCardText>
			<!--			<template #append>-->
			<!--				<VBtn type="submit">{{ t("rightsInformation.EquityUpgrade") }}</VBtn>-->
			<!--			</template>-->
		</VCard>
	</div>
</template>

<style lang="scss"></style>
