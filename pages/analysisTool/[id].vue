<script setup>
import {
	analysisTaskDetail,
	analysisTaskSubmit,
	caseDetail,
	descriptionDetail,
	fineTuningBackend,
	parameterList,
	seoDetail,
	submitBackend,
	submitFineTuning,
	toolDetail,
} from "@/api/analysis-tools";
import noData from "@/assets/images/noData.svg?raw";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
const { locale, setLocaleMessage } = useI18n({
	useScope: "global",
});
const height = ref("");
const router = useRoute();
const { t } = useI18n();
const userStore = useUserStore();
const descriptionObj = ref({});
const idString = router.params.id;
const typeWeb = router.query.type;
const parts = idString.split("-");
const firstPart = parts[0];
const secondPart = parts[1];
const caseObj = ref({});
const seoObj = ref({});
const toolTab = ref("one");
const panel = ref("0");
const isLanguage = ref(true);
const parameterData = ref([]);
const taskDetailData = ref([]);
const analyseId = ref("");
const subscribeResultRef = ref(null);
const isSubmit = ref(false);
const headers = [
	{ title: "序号", key: "id" },
	{ title: "分析类型", key: "extension" },
	{ title: "分析结果", key: "originalName" },
];

const nextStepAnalyse = id => {
	navigateTo(`/nextStepAnalyse/${firstPart}-${id}?type=${typeWeb}`);
};
const fineTuningId = ref("");
const toolDetailData = ref({});
const subscribeRef = ref(null);
const fields = ref([]);
const getLanguage = computed(() => userStore.getLanguage);
watch(getLanguage, (newValue, oldValue) => {
	isLanguage.value = false;
	nextTick(() => {
		isLanguage.value = true;
	});
});
onMounted(() => {
	height.value = window.innerHeight - window.innerHeight / 9 + "px";
});
// 提取一个函数用于生成 control 函数
const generateControlFunction = config => {
	if (config.parameterRelationsVOS.length == 0) {
		return val => {
			return {};
		};
	}
	const uniqueValues = [...new Set(config.optionListZh.map(item => item.value))];
	// 生成条件分支
	const conditions = uniqueValues
		.map(val => {
			// 获取当前值对应的所有nameSign
			const activeKeys = config.parameterRelationsVOS.filter(item => item.parameterValue == val).map(item => item.nameSign);

			// 生成属性列表
			const properties = config.parameterRelationsVOS
				.map(item => {
					const isActive = activeKeys.includes(item.nameSign);
					return `${item.nameSign}: { display: ${
						item.operator == 1
							? item.associatedParameterDisplay == 2
								? !isActive
								: isActive
							: item.associatedParameterDisplay == 2
								? isActive
								: !isActive
					} }`;
				})
				.join(",\n    ");

			return `if (val == ${val}) {
  return {
    ${properties}
  };
}`;
		})
		.join("\n else ");

	let functionStr = ` (val) => {
${conditions}
}`;
	console.log(functionStr, "functionStr");

	// 去除首尾空格
	const trimmedStr = functionStr.trim();
	// 提取函数体
	const startIndex = trimmedStr.indexOf("{");
	const endIndex = trimmedStr.lastIndexOf("}");
	const functionBody = trimmedStr.slice(startIndex + 1, endIndex);
	return new Function("val", functionBody);
};
const getToolDetail = () => {
	nextTick(async () => {
		const res = await toolDetail({ toolId: firstPart });
		toolDetailData.value = res.data;
	});
};
getToolDetail();
const getCaseDetail = () => {
	nextTick(async () => {
		const res = await caseDetail({ toolId: firstPart });
		if (res.data) {
			addDynamicMessages(res.data, setLocaleMessage);
			caseObj.value = res.data;
		}
	});
};
getCaseDetail();
const getDescriptionDetail = () => {
	nextTick(async () => {
		const res = await descriptionDetail({ toolId: firstPart });
		if (res.data) {
			addDynamicMessages(res.data, setLocaleMessage);
			descriptionObj.value = res.data;
		}
	});
};
getDescriptionDetail();
const getAnalysisTaskDetail = (id, type) => {
	nextTick(async () => {
		taskDetailData.value = [];
		const res = await analysisTaskDetail({ id });
		taskDetailData.value = [res.data, ...res.data.analysisResultVOList];
		taskDetailData.value.forEach(item => {
			if (item.executionTimeZh) {
				addDynamicMessages(item, setLocaleMessage);
			}
			item.analyzeParameters = JSON.parse(item.analyzeParameters);
			item.analyzeParameters.forEach(it => {
				addDynamicMessages(it, setLocaleMessage);
			});
		});
		panel.value = taskDetailData.value.length - 1;
		nextTick(() => {
			if (type) {
				if (toolDetailData.value.analysisWaitingType == 1) {
					subscribeResultRef.value[0].initSse();
				} else {
					subscribeRef.value[0].initSse();
				}
			}
		});
	});
};
const fineTuningAnalysis = formData => {
	nextTick(async () => {
		parameterData.value.forEach(field => {
			if (formData[field.nameSign] !== undefined) {
				if (field.inputType == 3) {
					field.value = formData[`${field.nameSign}File`];
				} else {
					field.value = formData[field.nameSign];
				}
			}
		});
		let url = typeWeb ? fineTuningBackend : submitFineTuning;
		const res = await url({ toolId: firstPart, id: analyseId.value, analyzeParameters: JSON.stringify(parameterData.value) });
		fineTuningId.value = res.data;
		alert("primary", t("userInfo.OperationSuccessful"));
		getAnalysisTaskDetail(analyseId.value, true);
	});
};

const getSeoDetail = () => {
	nextTick(async () => {
		const res = await seoDetail({ toolId: firstPart });
		if (res.data) {
			addDynamicMessages(res.data, setLocaleMessage);
			seoObj.value = res.data;
			// 设置 SEO 信息
			useHead({
				title: seoObj.value.titleZh,
				meta: [
					{ name: "description", content: seoObj.value.descriptionZh },
					{ name: "keywords", content: seoObj.value.wordZh },
				],
			});
		}
	});
};
getSeoDetail();

const getParameterList = async () => {
	nextTick(async () => {
		const res = await parameterList({ toolId: firstPart, taskId: secondPart });
		let typeList = ["", "VTextField", "VTextField", "VFileInput", "VSelect", "VRadioGroup", "VCombobox", "VSwitch"];
		console.log(res, "res");
		parameterData.value = res.data;
		fields.value = [];
		if (res.data.length > 1) {
			res.data.forEach(item => {
				addDynamicMessages(item, setLocaleMessage);
				// 根据 item.required 的值决定是否添加校验规则
				if (item.inputType == 6) {
					if (item.defaultValue?.length > 0) {
						item.defaultValue = JSON.parse(item.defaultValue) || [];
					} else {
						item.defaultValue = [];
					}
				}
				let rules = [];
				if (item.required == 1) {
					switch (item.inputType) {
						case 1:
							rules = [
								v => !!v || t("personalCenter.InputPlaceholder"),
								v => parseFloat(v) <= 99999999 || `${t("analysisTool.Input value cannot exceed")}99999999`,
							];
							break;
						case 2:
							rules = [
								v => !!v || t("personalCenter.InputPlaceholder"),
								v => (v || "")?.length <= 100 || t("analysisTool.Cannot exceed one hundred characters"),
							];
							break;
						case 4:
							rules = [v => (v !== null && v !== undefined && v !== "") || t("personalCenter.SelectPlaceholder")];
							break;
						case 5:
							rules = [v => (v !== null && v !== undefined && v !== "") || t("personalCenter.SelectPlaceholder")];
							break;
						case 6:
							rules = [v => (v !== null && v !== undefined && v !== "") || t("personalCenter.SelectPlaceholder")];

							break;
						case 7:
							rules = [v => (v !== null && v !== undefined && v !== "") || t("analysisTool.Please set the switch state")];
							break;
						case 3:
							rules = [v => (v && v.length > 0) || t("analysisTool.Please upload a file")];
							break;
						default:
							rules = [];
					}
				}

				fields.value.push({
					label: `name_${item.id}`,
					prop: item.nameSign,
					type: typeList[item.inputType],
					display: secondPart ? item.displayOnReference == 1 : !item.associatedStatus,
					disabled: item.adjustable == 0,
					cols: item.gridWidth == 1 ? 12 : 6,
					row: item.isFullRow == 1,
					value: item.defaultValue,
					hint: item.helpInfoDisplay == 1 ? `helpInfo_${item.id}` : "",
					dicDatazh: item.optionListZh,
					dicDataen: item.optionListEn,
					control: generateControlFunction(item),
					rules: rules, // 添加必填项校验
					multiple: item.inputType == 6,
					accept: item.fileType,
					parameterFileRelationsVOS: item.parameterFileRelationsVOS,
				});
				console.log(fields.value, "fields.value");
			});
			isLanguage.value = false;
			nextTick(() => {
				isLanguage.value = true;
			});
		}
	});
};
// 定义首字母大写函数
const capitalizeFirstLetter = str => {
	if (typeof str !== "string" || str.length === 0) {
		return str;
	}
	return str.charAt(0).toUpperCase() + str.slice(1);
};
const downloadFile = (url, filename) => {
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
// 使用示例
const capitalizedLanguage = computed(() => capitalizeFirstLetter(getLanguage.value));
getParameterList();
const submit = formData => {
	console.log(formData, "formData");

	parameterData.value.forEach(field => {
		if (formData[field.nameSign] !== undefined) {
			if (field.inputType == 3) {
				field.value = formData[`${field.nameSign}File`];
			} else {
				field.value = formData[field.nameSign];
				if ([4, 5].includes(field.inputType)) {
					console.log(field, "field");

					field[`optionList${capitalizedLanguage.value}`].forEach(item => {
						if (item.value == formData[field.nameSign]) {
							field.nameValue = item.label;
						}
					});
				} else if (field.inputType == 6) {
					formData[field.nameSign].forEach(item => {
						field[`optionList${capitalizedLanguage.value}`].forEach(it => {
							if (it.value == item) {
								field.nameValue = field.nameValue ? field.nameValue + "," + it.label : it.label;
							}
						});
					});
				} else if (field.inputType == 7) {
					field.nameValue = formData[field.nameSign] ? "开" : "关";
				} else {
					field.nameValue = formData[field.nameSign];
				}
			}
		}
	});
	// 过滤掉没有值的 field
	parameterData.value = parameterData.value.filter(field => {
		return fields.value.find(it => {
			return (
				it.prop == field.nameSign &&
				it.prop != "taskName" &&
				it.display &&
				field.inputType != 3 &&
				(typeof field.value === "boolean" || field.value.length > 0)
			);
		});
	});
	nextTick(async () => {
		let url = typeWeb ? submitBackend : analysisTaskSubmit;
		const res = await url({ toolId: firstPart, analyzeParameters: JSON.stringify(parameterData.value) });
		console.log(res, "res");
		alert("primary", t("userInfo.OperationSuccessful"));
		isSubmit.value = true;
		analyseId.value = res.data;
		getAnalysisTaskDetail(res.data, true);
	});
};
const message = () => {
	getAnalysisTaskDetail(analyseId.value, false);
};
</script>

<template>
	<VRow>
		<VCol cols="12" md="6" :style="{ height: height }">
			<GenericForm
				v-if="isLanguage"
				:analyseId="analyseId"
				:fields="fields"
				:isSubmit="isSubmit"
				:toolDetailData="toolDetailData"
				:parameterData="parameterData"
				@submit="submit"
				@fineTuningAnalysis="fineTuningAnalysis"
			></GenericForm>
		</VCol>
		<VCol cols="12" md="6" :style="{ height: height, overflowY: 'auto' }">
			<VCard style="height: 100%">
				<VTabs v-model="toolTab" class="custom-underlined-tabs">
					<VTab value="1">{{ t("analysisTool.Result display") }}</VTab>
					<VTab value="2" v-if="caseObj?.status == 1">{{ t("analysisTool.Application Case") }}</VTab>
					<VTab value="3" v-if="descriptionObj?.status == 1">{{ t("analysisTool.Tool Description") }}</VTab>
				</VTabs>

				<VCardText style="height: 100%; overflow-y: auto">
					<div>
						<VTabsWindow v-model="toolTab">
							<VTabsWindowItem value="1">
								<VExpansionPanels v-model="panel" v-if="taskDetailData.length > 0">
									<VExpansionPanel v-for="(i, index) in taskDetailData">
										<VExpansionPanelTitle v-slot="{ expanded }">
											<VRow no-gutters>
												<VCol class="d-flex justify-start" cols="4"
													><span class="size">
														{{
															index == 0
																? t("analysisTool.First run")
																: `${t("analysisTool.No.")}${index}${t("analysisTool.tweak")}`
														}}</span
													></VCol
												>
												<VCol class="text--secondary" cols="8">
													<VFadeTransition leave-absolute>
														<VRow style="width: 100%" no-gutters v-show="i.executionTimeZh">
															<VCol class="d-flex justify-end task-time" cols="12"
																>{{ t("analysisTool.Mission accomplished! take time") }}：
																{{ t(`executionTime_${i.id}`) }} --[2025-02-16 18:03]</VCol
															>
														</VRow>
													</VFadeTransition>
												</VCol>
											</VRow>
										</VExpansionPanelTitle>
										<VExpansionPanelText>
											<VRow>
												<VCol cols="12">{{ t("analysisTool.Task submission time") }}：{{ i.submitTime }}</VCol>
												<VCol cols="12" v-if="i.executionTimeZh"
													>{{ t("analysisTool.Task start time") }}：{{ i.executeTimeBegin }}</VCol
												>
												<VCol cols="12" v-if="i.executionTimeZh"
													>{{ t("analysisTool.Task end time") }}：{{ i.executeTimeEnd }}</VCol
												>
												<VCol cols="12" class="operation-analyse"
													>{{ t("analysisTool.Analysis values") }}：
													<v-chip
														class="mt-3 chip-analyse"
														v-for="item in i.analyzeParameters"
														:key="item.id"
														:text="`${t(`name_${item.id}`)}:${item.nameValue}`"
														:value="`${t(`name_${item.id}`)}:${item.nameValue}`"
													></v-chip>
												</VCol>
												<div v-if="i.executionTimeZh">
													<VCol cols="12" v-show="!$vuetify.display.lgAndUp"
														>{{ t("analysisTool.Calculation results") }}：</VCol
													>
													<VCol cols="12" class="wrap"
														><span class="calculate-result">
															<span v-show="$vuetify.display.lgAndUp"
																>{{ t("analysisTool.Calculation results") }}：</span
															></span
														><VDataTable
															hide-default-footer
															:headers="headers"
															:items="i.calculationResultFileList"
															class="text-no-wrap"
														>
															<template #item.id="{ item, index }">
																<span class="text-h6">{{ index + 1 }}</span>
															</template>
															<template #header.id>
																<div>{{ t("analysisTool.No") }}</div>
															</template>
															<template #header.extension>
																<div>{{ t("analysisTool.Analysis type") }}</div>
															</template>
															<template #item.extension="{ item, index }">
																<div>
																	<VChip color="success" size="small" class="text-capitalize">
																		{{ item.extension }}
																	</VChip>
																</div>
															</template>
															<template #item.originalName="{ item, index }">
																<div>
																	<VChip
																		color="primary"
																		size="small"
																		@click="downloadFile(item.link, item.originalName)"
																		class="text-capitalize"
																	>
																		{{ item.originalName }}
																	</VChip>
																</div>
															</template>
															<template #header.originalName>
																<div>{{ t("analysisTool.Analysis result") }}</div>
															</template>
														</VDataTable></VCol
													>
													<VCol cols="12" v-show="!$vuetify.display.lgAndUp"
														>{{ t("analysisTool.Analyze volcano plot") }}：</VCol
													>
													<VCol cols="12" class="wrap"
														><span v-show="$vuetify.display.lgAndUp">{{ t("analysisTool.Analyze volcano plot") }}：</span
														><VImg
															:width="300"
															height="125"
															aspect-ratio="16/9"
															cover
															:src="i.analysisResultFileList[0].link"
														></VImg
													></VCol>
													<VCol cols="12" v-html="t(`analysisResult_${i.id}`)"></VCol>
												</div>
												<VCol cols="12" v-if="toolDetailData.analysisWaitingType == 2"
													><SseComponent
														type="subscribe"
														:withCredentials="true"
														:executionTime="i.executionTimeZh"
														ref="subscribeRef"
														@message="message"
														:url="`/sciapi/sse/subscribe/${fineTuningId || analyseId}`"
													></SseComponent
												></VCol>

												<VCol cols="12" v-if="toolDetailData.analysisWaitingType == 1"
													><SseComponent
														type="subscribeResult"
														:withCredentials="true"
														@message="message"
														:time="toolDetailData.analysisDuration"
														:executionTime="i.executionTimeZh"
														ref="subscribeResultRef"
														:url="`/sciapi/sse/subscribe/${fineTuningId || analyseId}`"
													></SseComponent
												></VCol>
												<VCol cols="12" class="operate" v-if="i.executionTimeZh"
													><VBtn class="next-step-analyse" @click="nextStepAnalyse(i.id)">{{
														t("analysisTool.Further analysis")
													}}</VBtn></VCol
												>
											</VRow>
										</VExpansionPanelText>
									</VExpansionPanel>
								</VExpansionPanels>
								<div class="no-data" v-show="taskDetailData.length == 0">
									<VNodeRenderer
										:nodes="
											h('div', {
												innerHTML: processSvgCopy(noData),
												style: 'line-height:0; color: rgb(var(--v-global-theme-primary));',
											})
										"
									/>
									<div class="title" style="width: 100%">{{ t("personalCenter.noDataText") }}</div>
								</div>
							</VTabsWindowItem>

							<VTabsWindowItem value="2">
								<div
									v-html="
										t(`
applicationCase_${caseObj.id}`)
									"
								></div>
							</VTabsWindowItem>

							<VTabsWindowItem value="3"
								><div
									v-html="
										t(`
description_${descriptionObj.id}`)
									"
								></div>
							</VTabsWindowItem>
						</VTabsWindow>
					</div>
				</VCardText>
			</VCard>
		</VCol>
	</VRow>
</template>

<style scoped lang="scss">
.task-time {
	color: #03a71e;
}
.chip-analyse {
	margin-left: 10px;
}
.operation-analyse {
	margin-top: -10px;
}
.wrap {
	display: flex;
	.calculate-result {
		display: inline-block;
		width: 100px;
	}
}
.no-data {
	display: flex;
	flex-direction: column;
	align-items: center;
	.title {
		text-align: center;
	}
	:deep(svg) {
		width: 15rem !important;
		height: 15rem !important;
	}
}

.next-step-analyse {
	display: flex;
	margin-bottom: 10px;
}
.operate {
	display: flex;
}
.size {
	font-size: 0.9375rem;
}
</style>
