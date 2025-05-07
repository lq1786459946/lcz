<script setup>
import { getDetail } from "@/api/personalCenter/analysisRecord/index.js";
import { analysisTaskDetail, toolDetail } from "@/api/analysis-tools";
import { useI18n } from "vue-i18n";
const userStore = useUserStore();
const { t } = useI18n();

// 确保在setup函数中调用useI18n
const { setLocaleMessage } = useI18n({
	useScope: "global",
});

const toolForm = ref({});
const taskForm = ref({});
let panel = ref("");
const toolTab = ref("one");
const subscribeResultRef = ref(null);
const subscribeRef = ref(null);

let statuaObj = {
	1: "Pending",
	2: "InProgress",
	3: "Completed",
	4: "Failed",
	5: "Cancelled",
	6: "TimedOut",
};
const headers = [
	{ title: "序号", key: "index", sortable: false, minWidth: 80, width: 80 },
	{ title: "分析类型", key: "originalName", sortable: false, minWidth: 120, width: 120 },
	{ title: "分析结果", key: "link", sortable: false, minWidth: 180, width: 180 },
	{ title: "操作", key: "actions", sortable: false, minWidth: 120, width: 120 },
];

const isLoading = ref(true);
let AnalyzeParametersData = ref([]);

let OriginalUploadedFileData = ref([]);
const OriginalUploadedFileHeaders = [
	{ title: "序号", key: "index", sortable: false, width: 80 },
	{ title: "文件名称", key: "originalName", sortable: false },
	{ title: "操作", key: "actions", sortable: false, width: 120 },
];
let analyzeResultData = ref([]);

let emit = defineEmits(["closeDetail"]);

// 调用全局挂载的方法
const nextStepAnalyse = id => {
	navigateTo(`/nextStepAnalyse/${taskForm.value.id}-${id}`);
};
// 文件下载操作

const downLoadFile = (url, filename) => {
	const x = new XMLHttpRequest();
	x.open("GET", url, true);
	x.responseType = "blob";
	x.onload = () => {
		const url = window.URL.createObjectURL(x.response);
		const a = document.createElement("a");
		a.href = url;
		a.target = "_blank";
		if (filename) {
			a.download = filename;
		}
		a.click();
		a.remove();
	};
	x.send();
};
// 返回操作
const handlerBack = async () => {
	// 1. 先重置面板状态
	panel.value = null;

	// 2. 等待一个事件循环，确保Vuetify完成状态更新
	await nextTick();

	// 3. 再清空数据
	analyzeResultData.value = [];
	OriginalUploadedFileData.value = [];
	taskForm.value = {};

	// 4. 触发关闭事件
	emit("closeDetail");
};
const InitAnalyzeParameters = analyzeParameters => {
	let cols = [];
	let arrObj = JSON.parse(analyzeParameters);
	// 输入框类型(1:数值;2:文本;3:上传文件;4:下拉选项;5:单选;6:复选;7:开关)
	for (let e of arrObj) {
		let obj = {
			id: e.id,
			labelZh: e.nameZh,
			labelEn: e.nameEn,
			value: "",
		};
		if (e.inputType == 1 || e.inputType == 2) {
			obj.value = e.value;
		} else if (e.inputType == 4 || e.inputType == 5) {
			let result = e.optionListZh.find(item => item.value == e.value);
			if (result) obj.value = result.label;
		} else if (e.inputType == 6) {
			obj.value = e.value.map(item => item.label).join(",");
		} else if (e.inputType == 7) {
			obj.value = e.value ? "开" : "关";
		}
		addDynamicMessages(obj, setLocaleMessage);
		cols.push(obj);
	}
	AnalyzeParametersData.value = cols;
};

const message = () => {
	getAnalysisTaskDetail(taskForm.value.id, false);
};

const getToolDetail = id => {
	nextTick(async () => {
		const res = await toolDetail({ toolId: id });
		toolForm.value = res.data;
	});
};
const getAnalysisTaskDetail = (id, type) => {
	nextTick(async () => {
		analyzeResultData.value = [];
		const res = await getDetail(id);
		taskForm.value = res.data;
		OriginalUploadedFileData.value = res.data.originalFileList || [];
		for (let i = 0; i < OriginalUploadedFileData.value.length; i++) {
			addDynamicMessages(OriginalUploadedFileData.value[i], setLocaleMessage);
		}
		if (res.data.analyzeParameters) InitAnalyzeParameters(res.data.analyzeParameters);

		analyzeResultData.value = [res.data, ...res.data.analysisResultVOList];
		analyzeResultData.value.forEach(item => {
			if (item.executionTimeZh) {
				addDynamicMessages(item, setLocaleMessage);
			}
			item.analyzeParameters = JSON.parse(item.analyzeParameters);
			item.analyzeParameters.forEach(it => {
				addDynamicMessages(it, setLocaleMessage);
			});
		});
		panel.value = analyzeResultData.value.length - 1;
		nextTick(() => {
			if (type) {
				if (toolForm.value.analysisWaitingType == 1) {
					subscribeResultRef.value[0].initSse();
				} else {
					subscribeRef.value[0].initSse();
				}
			}
		});
	});
};
// const getTaskDetail = id => {
// 	panel.value = id;
// 	nextTick(async () => {
// 		let res = await getDetail(id);
// 		let obj = res.data;
// 		// addDynamicMessages(obj, setLocaleMessage);
//
// 		OriginalUploadedFileData.value = obj.originalFileList || [];
// 		for (let i = 0; i < OriginalUploadedFileData.value.length; i++) {
// 			addDynamicMessages(OriginalUploadedFileData.value[i], setLocaleMessage);
// 		}
// 		InitAnalyzeParameters(obj);
// 		analyzeResultData.value = [...[obj], ...obj.analysisResultVOList];
// 		for (let i = 0; i < analyzeResultData.value.length; i++) {
// 			addDynamicMessages(analyzeResultData.value[i], setLocaleMessage);
// 		}
// 		taskForm.value = obj;
// 	});
// };
const getAnalysisTask = (toolId, id) => {
	getToolDetail(toolId);
	getAnalysisTaskDetail(id, true);
};

defineExpose({
	getAnalysisTask,
});
</script>
<template>
	<div>
		<div class="d-flex justify-end align-center flex-wrap gap-4">
			<VBtn prepend-icon="ri-arrow-go-back-line" @click="handlerBack"> {{ t("personalCenter.Back") }} </VBtn>
		</div>
		<VRow class="mt-2">
			<VCol cols="12" md="6">
				<VCard>
					<VCardText>
						<VRow>
							<VCol cols="12" sm="12" md="12" class="text-body-3 text-disabled mt-6">
								{{ t("analysisRecord.AnalysisParams") }}
							</VCol>
							<VCol cols="12" sm="12" md="12"
								><span class="mr-4"> {{ t("analysisRecord.TaskID") }}:</span><span>{{ taskForm?.taskId || "-" }}</span></VCol
							>
							<!--							<VCol cols="12" sm="12" md="12">-->
							<!--								<span class="mr-4"> {{ t("analysisRecord.TaskName") }}:</span><span> {{ taskForm?.taskName || "-" }}</span></VCol-->
							<!--							>-->
							<VCol cols="12" sm="12" md="12" v-for="(item, ind) in AnalyzeParametersData || []" :key="ind">
								<span class="mr-4"> {{ t(`label_${item.id}`) }} :</span><span>{{ item.value || "-" }}</span>
							</VCol>
						</VRow>
						<VRow>
							<VCol cols="12" sm="12" md="12" class="text-body-3 text-disabled mt-3">
								{{ t("analysisRecord.OriginalUploadedFile") }}
							</VCol>

							<VCol cols="12" sm="12" md="12">
								<VDataTable
									:headers="OriginalUploadedFileHeaders"
									:items="OriginalUploadedFileData"
									hide-default-footer
									item-value="name"
								>
									<template #header.index>
										<div>{{ t("personalCenter.index") }}</div>
									</template>
									<template #header.originalName>
										<div>{{ t("analysisRecord.FileName") }}</div>
									</template>
									<template #header.actions>
										<div>{{ t("personalCenter.Actions") }}</div>
									</template>
									<template v-slot:item.index="{ index }"> {{ index + 1 }} </template>
									<template v-slot:item.originalName="{ item }">
										{{ t(`name_${item.id}`) }}
										<!--										{{ userStore.getLanguage == "zh" ? item.nameZh : item.nameEn }}-->
									</template>
									<template #item.actions="{ item }">
										<VBtn variant="text" color="primary" @click="downLoadFile(item.value, t(`name_${item.id}`))">
											<VIcon icon="ri-download-line"></VIcon>
											{{ t("personalCenter.Download") }}
										</VBtn>
									</template>
								</VDataTable>
							</VCol>
						</VRow>
						<VRow gutter="10">
							<VCol cols="12" sm="12" md="12" class="text-body-3 text-disabled mt-3">
								{{ t("analysisRecord.TaskOwnershipInformation") }}
							</VCol>
							<VCol cols="12" sm="12" md="12">
								<span class="mr-4"> {{ t("analysisRecord.MemberAccount") }}</span>
								<span>{{ taskForm.memberAccount }}</span>
							</VCol>

							<VCol cols="12" sm="12" md="12">
								<span class="mr-4"> {{ t("analysisRecord.MemberAlias") }}：</span>
								<span>{{ taskForm.nick || "-" }}</span>
							</VCol>

							<VCol cols="12" sm="12" md="12">
								<span class="mr-4"> {{ t("analysisRecord.MembershipTier") }}：</span>
								<!--								<span>{{ t(`memLevels_${taskForm.id}`) }}</span>-->
								<span v-show="userStore.getLanguage == 'zh'">{{ taskForm.memLevelsZh }}</span>
								<span v-show="userStore.getLanguage == 'en'">{{ taskForm.memLevelsEn }}</span>
							</VCol>
						</VRow>
					</VCardText>
				</VCard>
			</VCol>
			<VCol cols="12" md="6">
				<VCard style="height: 100%">
					<VTabs v-model="toolTab" class="custom-underlined-tabs">
						<VTab value="1">{{ t("analysisRecord.AnalysisResults") }}</VTab>
					</VTabs>

					<VCardText>
						<VTabsWindow v-model="toolTab">
							<VTabsWindowItem value="1">
								<VExpansionPanels v-model="panel" v-if="analyzeResultData.length > 0">
									<VExpansionPanel v-for="(item, ind) in analyzeResultData" :key="`panel-${item.id}`" :value="item.id">
										<VExpansionPanelTitle>
											<VRow no-gutters>
												<VCol cols="12" md="4">
													<span class="size">
														{{
															ind === 0
																? t("analysisRecord.FirstRun")
																: ` ${t("analysisRecord.FineTuning", { No: ind + 1 })}`
														}}
													</span>
												</VCol>

												<VCol class="text--secondary" cols="12" md="8">
													<div v-if="item.status && item">
														<span> {{ t("analysisRecord." + statuaObj[item.status]) }}, </span>

														<!--														<span v-if="item.status == 1"> {{ t("analysisRecord.Pending") }}, </span>-->
														<!--														<span v-if="item.status == 2"> {{ t("analysisRecord.InProgress") }}, </span>-->
														<!--														<span v-if="item.status == 3"> {{ t("analysisRecord.Completed") }}, </span>-->
														<!--														<span v-if="item.status == 4"> {{ t("analysisRecord.Failed") }}, </span>-->
														<!--														<span v-if="item.status == 5"> {{ t("analysisRecord.Cancelled") }}, </span>-->
														<!--														<span v-if="item.status == 6"> {{ t("analysisRecord.TimedOut") }}, </span>-->
														<!--  等待执行 执行中-->
														<span
															v-if="item.status <= 2"
															v-html="
																$t('analysisRecord.EstimatedWaitTime', {
																	time: item.waitingTime || '-',
																	color: '#039D12',
																})
															"
														></span>
														<!--  执行成功  执行失败 暂停任务 执行超时  && item.status <= 5-->
														<span
															v-if="item.status > 2"
															v-html="
																$t('analysisRecord.ElapsedTime', {
																	seconds:
																		userStore.getLanguage == 'zh' ? item.executionTimeZh : item.executionTimeEn,
																	color: '#039D12',
																})
															"
														></span
														>-- {{ item.executeTimeEnd }}
													</div>
												</VCol>
											</VRow>
										</VExpansionPanelTitle>
										<VExpansionPanelText>
											<VRow>
												<VCol cols="12">{{ t("analysisRecord.TaskSubmissionTime") }}：{{ item.submitTime }}</VCol>
												<VCol cols="12">{{ t("analysisRecord.TaskStartTime") }}：{{ item.executeTimeBegin }}</VCol>
												<VCol cols="12">{{ t("analysisRecord.TaskCompletionTime") }}：{{ item.executeTimeEnd }}</VCol>
												<VCol cols="12" class="operation-analyse"
													>{{ t("analysisRecord.ComputationInputValues") }}：
													<!--                          item.analyzeParameters-->
													<v-chip
														v-show="param.inputType != 3 && ind >= 1"
														class="mt-3 chip-analyse"
														v-for="(param, ind) in AnalyzeParametersData"
														:key="param.label"
														:text="t(`label_${param.id}`) + ' : ' + (param.value || '-')"
													></v-chip>
												</VCol>
											</VRow>

											<!--                        执行成功-->
											<VRow v-show="item.status == 3">
												<VCol cols="12" v-show="!$vuetify.display.lgAndUp">{{ t("analysisRecord.AnalysisResults") }}：</VCol>
												<VCol cols="12" class="wrap">
													<span class="calculate-result">
														<span v-show="$vuetify.display.lgAndUp">{{ t("analysisRecord.AnalysisResults") }}：</span>
													</span>
													<VDataTable
														hide-default-footer
														:headers="headers"
														:items="item.calculationResultFileList || []"
														class="text-no-wrap"
													>
														<template #header.index>
															<div>{{ t("personalCenter.index") }}</div>
														</template>
														<template #header.originalName>
															<div>{{ t("analysisRecord.AnalysisType") }}</div>
														</template>
														<template #header.link>
															<div>{{ t("analysisRecord.AnalysisResults") }}</div>
														</template>
														<template #header.actions>
															<div>{{ t("personalCenter.Actions") }}</div>
														</template>
														<template #item.originalName="{ item }">
															{{ item.extension }}
														</template>

														<template v-slot:item.index="{ index }"> {{ index + 1 }} </template>
														<template #item.actions="{ item }">
															<VBtn variant="text" color="primary" @click="downLoadFile(item.link, item.originalName)">
																<VIcon icon="ri-download-line"></VIcon>
																{{ t("personalCenter.Download") }}
															</VBtn>
														</template>
													</VDataTable>
												</VCol>
												<VCol cols="12" v-show="!$vuetify.display.lgAndUp">{{ t("analysisRecord.VolcanoPlot") }}：</VCol>
												<VCol cols="12" class="wrap">
													<span v-show="$vuetify.display.lgAndUp">{{ t("analysisRecord.VolcanoPlot") }}：</span>
													<template v-if="item.analysisResultFileList && item.analysisResultFileList.length">
														<VImg
															v-for="(d, index) of item.analysisResultFileList"
															:key="index"
															:width="300"
															height="125"
															aspect-ratio="16/9"
															cover
															:src="d.link"
														></VImg>
													</template>
												</VCol>
											</VRow>
											<VRow>
												<VCol cols="12" v-if="toolForm.analysisWaitingType == 2"
													><SseComponent
														type="subscribe"
														:withCredentials="true"
														:executionTime="item.executionTimeZh"
														ref="subscribeRef"
														@message="message"
														:url="`/sciapi/sse/subscribe/${taskForm.id}`"
													></SseComponent
												></VCol>

												<VCol cols="12" v-if="toolForm.analysisWaitingType == 1"
													><SseComponent
														type="subscribeResult"
														:withCredentials="true"
														@message="message"
														:time="toolForm.analysisDuration"
														:executionTime="item.executionTimeZh"
														ref="subscribeResultRef"
														:url="`/sciapi/sse/subscribe/${taskForm.id}`"
													></SseComponent
												></VCol>
												<VCol v-show="item.status == 2" cols="12">
													<Loading :visible="isLoading" :title="t(`analysisResult_${item.id}`)"></Loading>
												</VCol>
												<VCol cols="12" v-show="t(`analysisResult_${item.id}`) != 'null'">
													<span v-html="t(`analysisResult_${item.id}`)"></span>
												</VCol>
												<VCol v-show="item.status == 3" cols="12" class="operate">
													<VBtn class="next-step-analyse" @click="nextStepAnalyse(item.id)">{{
														t("analysisRecord.NextStepAnalyse")
													}}</VBtn>
												</VCol>
											</VRow>
										</VExpansionPanelText>
									</VExpansionPanel>
								</VExpansionPanels>
							</VTabsWindowItem>
						</VTabsWindow>
					</VCardText>
				</VCard>
			</VCol>
		</VRow>
	</div>
</template>

<style scoped lang="scss">
.text {
	font-size: 14px;
	margin: 12px auto;
}
.card-header > div {
	position: relative;
	padding-left: 10px;
	margin-top: 10px;
}

.card-header > div:before {
	content: "";
	background-color: #3796ec;
	width: 3px;
	height: 18px;
	position: absolute;
	left: 0;
	top: 50%;
	margin-top: -9px;
	-webkit-border-radius: 3px;
	-moz-border-radius: 3px;
	border-radius: 3px;
}

.flex {
	display: flex;
	flex-wrap: wrap;
}
.ml-2 {
	margin-left: 5px;
	margin-bottom: 5px;
}
.content {
	border: 1px solid #e4e7ed;
	padding: 10px;
	margin-bottom: 10px;
}
.mt10 {
	margin-top: 10px;
}
</style>
