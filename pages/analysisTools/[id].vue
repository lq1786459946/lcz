<script setup>
import noData from "@/assets/images/noData.svg?raw";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { remove, save } from "@/api/personalCenter/myCollection/index.js";
import { getPage } from "@/api/tool/tool/index.js";
import { getToolsTypelist } from "@/api/tool/type/index.js";
import fire from "@images/pages/fire.png";
import sectionTitleIcon from "@images/pages/section-title-icon.png";
import { useI18n } from "vue-i18n";
const router = useRoute();
import { addDynamicMessages } from "@/composables/i18n-global";
import { ref } from "vue";

const userStore = useUserStore();

const { setLocaleMessage } = useI18n({
	useScope: "global",
});
// 使用 useI18n 函数获取 t 函数，用于翻译文本
const { t } = useI18n();

const snackbarOption = ref({
	snackbar: false,
	color: "success",
	location: "top",
	timeout: 1500,
	text: "成功",
});

let all = [{ id: 0, titleEn: "All", titleZh: "全部", children: [] }];
let loading = ref(false);
//表单数据对象
let form = ref({
	ToolName: "",
	AnalysisTopic: 0,
	AnalysisType: router.params.id == "All" ? 0 : router.params.id,
});
// 分页
const pageTable = ref({
	total: 0,
	currentPage: 1,
	pageSize: 9,
});
// 分析主题
let analysisTopicData = ref([]);
// 分析类型数据
let analysisTypeData = ref([]);

let data = ref([]);

const getAnalysisTopicData = () => {
	nextTick(() => {
		getToolsTypelist().then(res => {
			let arrData = [...all, ...res.data];
			for (let item of arrData) {
				addDynamicMessages(item, setLocaleMessage);
				for (let child of item.children) {
					if (router.params.id != "All" && child.id == router.params.id) {
						form.value.AnalysisTopic = item.id;
					}
					addDynamicMessages(child, setLocaleMessage);
				}
			}
			analysisTopicData.value = arrData;
			const selectedOption = analysisTopicData.value.find(item => item.id === form.value.AnalysisTopic);
			analysisTypeData.value = [...all, ...(selectedOption?.children || [])];
			form.value.AnalysisType = router.params.id == "All" ? analysisTypeData.value[0].id : router.params.id;
			console.log("getAnalysisTopicData");
		});
	});
};
getAnalysisTopicData();
// 处理 tab 切换
const handleChangeTopic = id => {
	form.value.toolName = "";
	const selectedOption = analysisTopicData.value.find(item => item.id === id);
	analysisTypeData.value = [...all, ...(selectedOption?.children || [])];
	form.value.AnalysisType = router.params.id == "All" ? analysisTypeData.value[0].id : router.params.id;
	refreshTable();
};
const refreshTable = () => {
	pageTable.value.currentPage = 1;
	onLoad();
};

const handlerClickStar = item => {
	if (item.toolFavoritesId) {
		handlerRemove(item.toolFavoritesId);
	} else {
		handlerSave(item.id);
	}
};

const handlerSave = id => {
	save({ toolId: id, memberId: userStore.getUserData.user_id })
		.then(res => {
			if (res.code == 200) {
				snackbarOption.value.snackbar = true;
				snackbarOption.value.text = t("myCollection.Save");
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

const handlerRemove = id => {
	remove(id)
		.then(res => {
			if (res.code == 200) {
				snackbarOption.value.snackbar = true;
				snackbarOption.value.text = t("myCollection.Cancel");
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
const onLoad = () => {
	console.log("onLoad");
	let params = {};
	// if (form.value.AnalysisTopic) params.toolTypeId = form.value.AnalysisTopic;
	if (form.value.AnalysisType) {
		params.toolTypeIds = [form.value.AnalysisType];
	} else if (form.value.AnalysisTopic) {
		let arr = [];
		for (let e of analysisTypeData.value) {
			if (e.id) arr.push(e.id);
		}
		if (arr.length) {
			params.toolTypeIds = arr;
		} else {
			pageTable.value.total = 0;
			data.value = [];
			return;
		}
	}
	loading.value = true;
	if (form.value.toolName) params.toolName = form.value.toolName;
	nextTick(() => {
		getPage(pageTable.value.currentPage, pageTable.value.pageSize, params)
			.then(res => {
				if (res.code == 200) {
					let arrData = res.data || [];
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
</script>

<template>
	<VSnackbar v-model="snackbarOption.snackbar" :color="snackbarOption.color" :location="snackbarOption.location" :timeout="snackbarOption.timeout">
		{{ snackbarOption.text }}
	</VSnackbar>
	<VTabs v-model="form.AnalysisTopic" @update:modelValue="handleChangeTopic" class="v-tabs-pill">
		<VTab v-for="item in analysisTopicData" :key="item.id" :value="item.id">
			<div class="ellipsis">{{ t(`title_${item.id}`) }}</div>
		</VTab>
	</VTabs>

	<VCard class="mt-2">
		<VCardItem>
			<VCardTitle> </VCardTitle>
			<VCardSubtitle>
				<div class="d-flex flex-wrap gap-4 justify-space-between">
					<div class="d-flex flex-wrap justify-sm-start justify-start">
						<div class="mt-2">{{ t("allTools.AnalysisType") }} :</div>

						<VRadioGroup v-model="form.AnalysisType" inline @update:modelValue="refreshTable">
							<VRadio v-for="(item, ind) in analysisTypeData" :key="ind" :label="t(`title_${item.id}`)" :value="item.id"></VRadio>
						</VRadioGroup>
					</div>
					<VSpacer />
					<div class="pt-2">
						<VTextField
							clearable
							v-model="form.toolName"
							@update:modelValue="refreshTable"
							:placeholder="t('personalCenter.InputPlaceholder') + ' ' + t('allTools.AnalysisName')"
							style="inline-size: 300px"
							prepend-inner-icon="ri-search-line"
							:label="t('allTools.AnalysisName')"
						></VTextField>
					</div>
				</div>
			</VCardSubtitle>
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
											:color="item.toolFavoritesId ? '#FFB22C' : '#E2E2E2'"
											@click.stop="handlerClickStar(item)"
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
	</VCard>
</template>
<style lang="scss">
.three-line-ellipsis {
	//height: 4.125rem;
	height: 2.65rem;
	width: 100%;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	//-webkit-line-clamp: 3; /* 控制显示行数 */
	overflow: hidden;
	text-overflow: ellipsis;
	word-break: break-word;
	font-size: 14px;
}

.ellipsis {
	white-space: nowrap; /* 禁止文本换行 */
	overflow: hidden; /* 隐藏溢出内容 */
	text-overflow: ellipsis; /* 用省略号表示被截断的文本 */
	max-width: 140px; /* 必须设置一个固定宽度或最大宽度 */
	display: block; /* 或者inline-block，但不能是inline */
}
</style>
