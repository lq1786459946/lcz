<script setup>
import sectionTitleIcon from "@images/pages/section-title-icon.png";
import noData from "@/assets/images/noData.svg?raw";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import fire from "@images/pages/fire.png";
import { getPage, getToolTypes, remove } from "@/api/personalCenter/myCollection/index.js";

const userStore = useUserStore();
const { t } = useI18n();
const { setLocaleMessage } = useI18n({
	useScope: "global",
});

let loading = ref(false);
const pageTable = ref({
	total: 0,
	currentPage: 1,
	pageSize: 9,
	options: [9, 18, 60, 90],
});
const snackbarOption = ref({
	snackbar: false,
	color: "success",
	location: "top",
	timeout: 1500,
	text: "成功",
});
// 下拉框选项列表
let analysisTopic = ref("");
let analysisTopicData = reactive([]);

let data = ref([]);
let height = ref("512px");
// 生命周期钩子
onMounted(() => {
	window.addEventListener("resize", getHeight);
	getHeight();
});

onBeforeUnmount(() => {
	window.removeEventListener("resize", getHeight);
});
const getHeight = () => {
	// 设置表格高度为窗口高度减去340px
	height.value = `${window.innerHeight - 380}px`;
};
const getAnalysisTopicData = () => {
	let params = {
		level: 1,
		status: 1,
	};
	nextTick(() => {
		getToolTypes(params).then(res => {
			let arrData = res.data;
			arrData.forEach(item => {
				addDynamicMessages(item, setLocaleMessage);
			});
			analysisTopicData = arrData;
		});
	});
};
getAnalysisTopicData();

const onLoad = () => {
	loading.value = true;
	let params = {
		memberId: userStore.getUserData.user_id,
	};
	if (analysisTopic.value) params.toolTypeId = analysisTopic.value;
	nextTick(() => {
		getPage(pageTable.value.currentPage, pageTable.value.pageSize, params)
			.then(res => {
				if (res.code == 200) {
					let arrData = res.data;
					pageTable.value.total = arrData.total;
					let tmpData = arrData.records;
					for (let item of tmpData) {
						item.logo = item.toolLogoFileList && item.toolLogoFileList.length ? item.toolLogoFileList[0].link : sectionTitleIcon;
						addDynamicMessages(item, setLocaleMessage);
					}
					data.value = tmpData;
				}
				loading.value = false;
			})
			.catch(err => {
				console.log(err);
				loading.value = false;
			});
	});
};
onLoad();

const handleSelectChange = () => {
	pageTable.value.currentPage = 1;
	onLoad();
};

const removeFromCollection = id => {
	remove(id)
		.then(res => {
			if (res.code == 200) {
				snackbarOption.value.snackbar = true;
				snackbarOption.value.text = t("personalCenter.Cancel");
				snackbarOption.value.color = "success";
				onLoad();
			} else {
				snackbarOption.value.snackbar = true;
				snackbarOption.value.text = res.msg;
				snackbarOption.value.color = "error";
			}
		})
		.catch(err => {
			snackbarOption.value.snackbar = true;
			snackbarOption.value.text = err;
			snackbarOption.value.color = "error";
		});
};
</script>
<template>
	<VSnackbar v-model="snackbarOption.snackbar" :color="snackbarOption.color" :location="snackbarOption.location" :timeout="snackbarOption.timeout">
		{{ snackbarOption.text }}
	</VSnackbar>
	<VCard>
		<VCardItem>
			<VCardTitle class="d-flex flex-wrap gap-4">
				<span>
					{{ t("myCollection.MyCollection") }}
				</span>
				<VSpacer />
				<VSelect
					v-model="analysisTopic"
					:placeholder="t('personalCenter.SelectPlaceholder')"
					style="inline-size: 300px"
					:items="analysisTopicData"
					item-value="id"
					:label="t('myCollection.AnalysisTopic')"
					class="flex-0-1 pt-2"
					:no-value-text="t('personalCenter.SelectPlaceholder')"
					clearable
					@update:modelValue="handleSelectChange"
				>
					<template #item="{ props, item }">
						<VListItem v-bind="props" :title="t(`title_${item.raw.id}`)">
							<!--							<template #title> {{ t(`title_${item.raw.id}`) }}</template>-->
						</VListItem>
					</template>
					<!-- 选择后的显示 -->
					<template #selection="{ item }">
						<span v-if="item && item.raw">{{ t(`title_${item.raw.id}`) }}</span>
						<span v-else class="text-disabled">{{ t("personalCenter.SelectPlaceholder") }}</span>
					</template>
				</VSelect>
			</VCardTitle>
		</VCardItem>
		<!--		<div :style="{ height: height }" class="overflow-y-auto overflow-x-hidden">-->
		<VRow v-show="data.length" class="pl-5 pr-5">
			<VCol v-for="(item, ind) in data" :key="ind" sm="4" cols="12" md="4">
				<VCard @click="navigateTo(`/analysisTool/${item.id}`, { replace: true })" variant="outlined">
					<VRow :gutter="0" class="ma-0">
						<VCol cols="12" md="5" class="ma-auto">
							<VImg class="ma-auto" width="130" height="130" :src="item.logo" />
						</VCol>
						<VDivider :vertical="$vuetify.display.mdAndUp" />
						<VCol cols="12" md="7" class="pa-0">
							<VCardItem>
								<VCardTitle>{{ t(`toolName_${item.id}`) }}</VCardTitle>

								<template #append>
									<div class="mt-n7 me-n3" v-show="userStore.getUserData && userStore.getUserData.user_id">
										<IconBtn
											size="small"
											icon="ri-star-fill"
											color="#FFB22C"
											@click.stop="removeFromCollection(item.toolFavoritesId)"
											class="me-1"
										/>
									</div>
								</template>
							</VCardItem>
							<VCardText>
								<div class="three-line-ellipsis">
									{{ t(`toolDescription_${item.id}`) }}
								</div>
							</VCardText>
							<VCardActions class="justify-space-between">
								<VBtn>
									<VImg :src="fire" alt="" height="20" width="20" />
									<span class="ms-2">{{ item.usedCount }}</span>
								</VBtn>
							</VCardActions>
						</VCol>
					</VRow>
				</VCard>
			</VCol>
		</VRow>
		<!--		</div>-->
		<VProgressLinear :active="loading" :indeterminate="loading" indeterminate color="primary" />
		<div class="d-flex align-center gap-x-3 justify-center mb-6" v-if="!data.length">
			<div>
				<VNodeRenderer
					:nodes="
						h('div', {
							innerHTML: processSvgCopy(noData),
							style: 'line-height:0; color: rgb(var(--v-global-theme-primary));',
						})
					"
				/>
				<div class="title" style="width: 100%; text-align: center">{{ t("personalCenter.noDataText") }}</div>
			</div>
		</div>
		<VCardActions v-show="data.length">
			<VSpacer />
			<VCardText class="pt-2">
				<div class="d-flex flex-wrap justify-end gap-y-2 mt-2">
					<div class="d-flex align-center mr-5">{{ `${t("total-header")}${pageTable.total}${t("total-footer")}` }}</div>
					<VPagination
						v-model="pageTable.currentPage"
						:total-visible="$vuetify.display.smAndDown ? 2 : 3"
						:length="Math.ceil(pageTable.total / pageTable.pageSize)"
						@update:model-value="onLoad"
					/>
				</div>
			</VCardText>
		</VCardActions>
	</VCard>
</template>
<style lang="scss">
.three-line-ellipsis {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3; /* 控制显示行数 */
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 14px;
}
</style>
