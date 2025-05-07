<script setup>
import { getDetail, update } from "@/api/personalCenter/analysisRecord/index.js";
import { toolDetail } from "@/api/analysis-tools/index.js";

import { ref } from "vue";
const { locale, setLocaleMessage } = useI18n({
	useScope: "global",
});
let emit = defineEmits(["editAfterRefreshTable"]);
const { t } = useI18n();
const userStore = useUserStore();

const isLanguage = ref(true);
const fields = ref([]);
const form = ref({});
const taskId = ref("");
const toolId = ref("");
const toolDetailData = ref({});
const parameterData = ref([]);
const snackbarOption = ref({
	snackbar: false,
	color: "success",
	location: "top",
	timeout: 1500,
	text: "成功",
});
const getLanguage = computed(() => userStore.getLanguage);
watch(getLanguage, (newValue, oldValue) => {
	isLanguage.value = false;
	nextTick(() => {
		isLanguage.value = true;
	});
});
const capitalizedLanguage = computed(() => capitalizeFirstLetter(getLanguage.value));
const capitalizeFirstLetter = str => {
	if (typeof str !== "string" || str.length === 0) {
		return str;
	}
	return str.charAt(0).toUpperCase() + str.slice(1);
};
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
					return `${item.nameSign}: { display: ${isActive} }`;
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
const initParameterList = async fieldArr => {
	nextTick(async () => {
		parameterData.value = fieldArr;
		let typeList = ["", "VTextField", "VTextField", "VFileInput", "VSelect", "VRadioGroup", "VCombobox", "VSwitch"];
		fields.value = [];
		if (fieldArr.length > 1) {
			fieldArr.forEach(item => {
				addDynamicMessages(item, setLocaleMessage);
				// 根据 item.required 的值决定是否添加校验规则
				if (item.defaultValue && item.inputType == 6) {
					item.defaultValue = JSON.parse(item.defaultValue) || [];
				}

				let rules = [];
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
				fields.value.push({
					label: `name_${item.id}`,
					prop: item.nameSign,
					type: typeList[item.inputType],
					display: item.displayOnReference == 1 ? Boolean(taskId.value) : !item.associatedStatus,
					disabled: item.adjustable == 0,
					cols: item.gridWidth == 1 ? 12 : 6,
					row: item.isFullRow == 1,
					value: item.value,
					hint: item.helpInfoDisplay == 1 ? `helpInfo_${item.id}` : "",
					dicDatazh: item.optionListZh,
					dicDataen: item.optionListEn,
					control: generateControlFunction(item),
					rules: rules, // 添加必填项校验
					multiple: item.inputType == 6,
					accept: item.fileType,
					parameterFileRelationsVOS: item.parameterFileRelationsVOS,
				});
			});
			isLanguage.value = false;
			nextTick(() => {
				isLanguage.value = true;
			});
		}
	});
};

const submit = formData => {
	// console.log(formData, "formData");

	parameterData.value.forEach(field => {
		if (formData[field.nameSign] !== undefined) {
			if (field.inputType == 3) {
				field.value = formData[`${field.nameSign}File`];
				field.nameValue = field?.file?.originalName;
			} else {
				field.value = formData[field.nameSign];
				if ([4, 5].includes(field.inputType)) {
					field[`optionList${capitalizedLanguage.value}`].forEach(item => {
						if (item.value == formData[field.nameSign]) {
							field.nameValue = item.label;
						}
					});
				} else if (field.inputType == 6) {
					formData[field.nameSign].forEach(item => {
						field[`optionList${capitalizedLanguage.value}`].forEach(it => {
							if (it.value == item.value) {
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
			return it.prop == field.nameSign && it.display;
		});
	});

	nextTick(async () => {
		const res = await update({
			toolId: toolId.value,
			id: taskId.value,
			analyzeParameters: JSON.stringify(parameterData.value),
		});
		if (res.code === 200) {
			snackbarOption.value.snackbar = true;
			snackbarOption.value.text = t("myFeedback.Success");
			snackbarOption.value.color = "success";
			emit("editAfterRefreshTable", true);
		} else {
			let errorObj = JSON.parse(res.msg);
			snackbarOption.value.snackbar = true;
			snackbarOption.value.text = errorObj[userStore.getLanguage];
			snackbarOption.value.color = "error";
		}
	});
};
// 返回操作
const handlerBack = async () => {
	// 1. 等待一个事件循环，确保Vuetify完成状态更新
	await nextTick();
	// 2. 再清空数据
	fields.value = [];
	// 3. 触发关闭事件
	emit("editAfterRefreshTable", false);
};

const getToolDetail = id => {
	nextTick(async () => {
		const res = await toolDetail({ toolId: id });
		toolDetailData.value = res.data;
	});
};

const getTaskDetail = id => {
	nextTick(async () => {
		const res = await getDetail(id);
		let data = res.data;
		if (data.analyzeParameters) {
			// parameterData.value = JSON.parse(data.analyzeParameters);
			initParameterList(JSON.parse(data.analyzeParameters));
		}
	});
};
const InitForm = (tId, id) => {
	toolId.value = tId;
	taskId.value = id;
	getToolDetail(tId);
	getTaskDetail(id);
};
defineExpose({
	InitForm,
});
</script>
<template>
	<VSnackbar v-model="snackbarOption.snackbar" :color="snackbarOption.color" :location="snackbarOption.location" :timeout="snackbarOption.timeout">
		{{ snackbarOption.text }}
	</VSnackbar>
	<VRow class="mt-2">
		<VCol cols="12" md="6" class="pt-5">
			<div class="d-flex flex-wrap justify-space-between gap-4">
				<h3>
					{{ t("analysisRecord.AnalysisTaskUpdate") }}
				</h3>
				<VSpacer />
				<VBtn color="primary" @click="handlerBack">
					<v-icon icon="ri-arrow-go-back-line" class="mr-2"></v-icon>
					{{ t("personalCenter.Back") }}
				</VBtn>
			</div>
		</VCol>
	</VRow>
	<VRow class="mt-2">
		<VCol cols="12" md="6" class="pt-5">
			<GenericForm
				v-if="isLanguage"
				:analyseId="''"
				:fields="fields"
				:toolDetailData="toolDetailData"
				:parameterData="parameterData"
				@submit="submit"
			></GenericForm>
		</VCol>
	</VRow>
</template>
<style scoped></style>
