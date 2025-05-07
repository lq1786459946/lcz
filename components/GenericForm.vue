<script setup>
import { uploadFile } from "@/api/fileUploadEcho.js";
import { ref } from "vue";
import { VFileInput, VForm, VRadio, VRadioGroup, VSelect, VSwitch, VTextField } from "vuetify/components";
const { t } = useI18n();
const emit = defineEmits(["submit"]);
// 定义 props
const props = defineProps({
	height: {
		type: String,
		default: "",
	},
	analyseId: {
		type: String,
		default: "",
	},
	fields: {
		type: Array,
		default: [],
	},
	toolDetailData: {
		type: Object,
		default: {},
	},

	parameterData: {
		type: Array,
		default: [],
	},
	isSubmit: {
		type: Boolean,
		default: false,
	},
});
const form = ref(null);
const userStore = useUserStore();
const downloadAndCreateFile = async (url, prop) => {
	try {
		const response = await fetch(url);
		const blob = await response.blob();
		const file = new File([blob], "sample.xlsx", {
			type: blob.type,
			lastModified: new Date().getTime(),
		});
		return file;
	} catch (error) {
		console.error("下载文件失败:", error);
	}
};
const formData = ref({
	// 遍历 fields 数组，将有 value 属性的字段的默认值添加到 formData 中
	...props.fields.reduce((acc, field) => {
		if (field.value !== undefined) {
			acc[field.prop] = field.value;
			if (field.type == "VFileInput" && field.value) {
				acc[field.prop] = downloadAndCreateFile(field.value, field.prop);
				console.log(123123, acc[field.prop]);
			}
		}
		return acc;
	}, {}),
});
const initializeFormData = async () => {
	const formDataObj = {
		...props.fields.reduce((acc, field) => {
			if (field.value !== undefined) {
				acc[field.prop] = field.value;
			}
			return acc;
		}, {}),
	};

	for (const field of props.fields) {
		if (field.type === "VFileInput" && field.value) {
			formDataObj[`${field.prop}File`] = field.value;
			formDataObj[field.prop] = await downloadAndCreateFile(field.value);
		}
	}

	formData.value = formDataObj;
	console.log(formData.value, "formData.value");
};

initializeFormData();
console.log(formData.value, "formData.value");

// formData.testUploading =
const getComponent = type => {
	switch (type) {
		case "VSelect":
			return VSelect;
		case "VFileInput":
			return VFileInput;
		case "VTextField":
			return VTextField;
		case "VRadioGroup":
			return VRadioGroup;
		case "VCombobox":
			return VSelect;
		case "VSwitch":
			return VSwitch;
		default:
			return VTextField;
	}
};
// 新增函数，根据 control 函数的返回值来判断是否显示字段
const shouldDisplay = (fieldVal, formData) => {
	if (fieldVal.control && formData[fieldVal.prop] !== undefined && formData[fieldVal.prop] !== null) {
		const controlResult = fieldVal.control(formData[fieldVal.prop], formData);
		if (controlResult != undefined) {
			Object.keys(controlResult).forEach(item => {
				props.fields.forEach(field => {
					if (field.prop === item) {
						field.display = controlResult[item].display;
					}
				});
			});
		}
	}
	return fieldVal.display;
};
const getComponentProps = field => {
	// 根据字段类型返回对应的属性
	switch (field.type) {
		case "VSelect":
			return {
				items: field[`dicData${userStore.getLanguage}`],
				itemTitle: "label",
				itemValue: "value",
			};
		case "VCombobox":
			return {
				items: field[`dicData${userStore.getLanguage}`],
				itemTitle: "label",
				itemValue: "value",
				chips: true,
				multiple: true,
			};

		default:
			return {};
	}
};
const submit = async () => {
	const { valid } = await form.value.validate();

	if (valid) {
		console.log(formData.value, "formData.value");

		emit("submit", formData.value);
	}
};
const fineTuningAnalysis = async () => {
	const { valid } = await form.value.validate();

	if (valid) {
		console.log(formData.value, "formData.value");

		emit("fineTuningAnalysis", formData.value);
	}
};
const updateModelValue = (field, file) => {
	console.log(field, file, "val");
	if (field.type == "VFileInput") {
		const MAX_FILE_SIZE = Number(props.toolDetailData.fileSizeLimit) * 1024 * 1024; // 10MB，单位为字节
		if (file && file.size > MAX_FILE_SIZE) {
			alert("warning", t("userInfo.FileTip"), "ri-error-warning-line");
			// 这里可以添加提示用户的逻辑，比如使用 UI 组件显示错误信息
			return;
		}
		uploadFile(file).then(res => {
			formData.value[`${field.prop}File`] = res.data.bladeFile.link;
			if (field.parameterFileRelationsVOS.length > 0) {
				field.parameterFileRelationsVOS.forEach(item => {
					props.fields.forEach(it => {
						if (it.prop === item.nameSign) {
							it.dicDatazh = res.data.map[item.flieColumn];
							it.dicDataen = res.data.map[item.flieColumn];
						}
					});
				});
			}
		});
	}
};
</script>

<template>
	<!-- 使用 VForm 封装表单 -->
	<!-- <VRow > -->
	<VCard class="generic-form">
		<VCardText style="height: 100%; overflow-y: auto">
			<VForm ref="form">
				<VRow>
					<template v-for="(field, index) in fields" :key="index">
						<div
							:style="{
								'flex-basis': field.row ? '100%' : field.cols == 6 ? '50%' : '100%',
								'max-width': field.row ? '100%' : field.cols == 6 ? '50%' : '100%',
							}"
							v-if="shouldDisplay(field, formData)"
						>
							<VCol :cols="field.cols === 6 ? 12 : field.cols">
								<component
									:is="getComponent(field.type)"
									:label="t(`${field.label}`)"
									v-model="formData[field.prop]"
									:disabled="isSubmit && field.disabled"
									:rules="field.rules"
									:multiple="field.multiple"
									:hint="t(`${field.hint}`)"
									:accept="field.accept"
									v-bind="getComponentProps(field)"
									@update:modelValue="updateModelValue(field, $event)"
								>
									<template #default>
										<VRadioGroup v-if="field.type === 'VRadioGroup'" v-model="formData[field.prop]">
											<VRadio
												:label="option.label"
												:value="option.value"
												v-for="(option, optionIndex) in field[`dicData${userStore.getLanguage}`]"
												:key="optionIndex"
											></VRadio>
										</VRadioGroup>
									</template>
								</component>
							</VCol>
						</div>
					</template>
				</VRow>
			</VForm>
		</VCardText>
		<span class="operation">
			<v-btn
				append-icon="ri-send-plane-line"
				:disabled="toolDetailData.allowAdjustment == 2"
				v-if="analyseId"
				@click="fineTuningAnalysis"
				style="margin-right: 10px"
				>{{ t("analysisTool.Fine-tuning analysis") }}</v-btn
			>
			<v-btn v-else append-icon="ri-send-plane-line" @click="submit">{{ t("analysisTool.Submit") }}</v-btn></span
		>
	</VCard>

	<!-- </VRow> -->
</template>
<style lang="scss" scoped>
/* 可以添加自定义样式 */
.full-width {
	flex-basis: 100%;
	max-width: 100%;
}

:deep(.v-selection-control-group) {
	flex-direction: row;
}
.generic-form {
	position: relative;
	height: 100%;
	.operation {
		position: absolute;
		bottom: 30px;
		right: 30px;
	}
}
</style>
