<script setup>
import { uploadVFileInput } from "@/api/fileUpload.js";
import { getTaskList, getTreeToolList } from "@/api/tool/type/index.js";
import { save, getDictionaryTree } from "@/api/personalCenter/myFeedback/index.js";
import { useI18n } from "vue-i18n";

const userStore = useUserStore();
const { setLocaleMessage } = useI18n({
	useScope: "global",
});
const { t, locale } = useI18n();
const emit = defineEmits(["refreshChange"]);
const isSubmitting = ref(false);
let isDialogVisible = ref(false);
let analysisTypeName = ref("");
let form = ref({ otherFile: null });
let formRef = ref(null);

let videoList = ref(null);
let imageList = ref([]);
const imgErrMsg = ref([]);
const videoErrMsg = ref([]);

const snackbarOption = ref({
	snackbar: false,
	color: "success",
	location: "top",
	timeout: 1500,
	text: "成功",
});

let feedbackTypeData = ref([]);
let issueTypeData = ref([]);
let analysisTypeData = ref([]);
let analysisTaskData = ref([]);

// 监听语言变化
watch(locale, () => {
	nextTick(() => {
		formRef.value?.resetValidation(); // 重置表单验证
	});
});

// 获取反馈类型
const getFeekTypeDictionary = () => {
	nextTick(() => {
		getDictionaryTree({ code: "feedback_type" }).then(res => {
			let arrData = res.data || [];
			for (let item of arrData) {
				item.titleZh = item.dictValue;
				item.titleEn = item.remark;
				addDynamicMessages(item, setLocaleMessage);
				for (let child of item.children) {
					child.titleZh = child.dictValue;
					child.titleEn = child.remark;
					addDynamicMessages(child, setLocaleMessage);
				}
			}
			feedbackTypeData.value = arrData;
		});
	});
};
getFeekTypeDictionary();

// 反馈类型更改
const handleFeedbackTypeChange = val => {
	if (val) {
		if (form.value.issueType) form.value.issueType = "";
		let selectedOption = feedbackTypeData.value.find(item => item.dictKey == val);
		issueTypeData.value = selectedOption?.children || [];
	} else {
		issueTypeData.value = [];
	}
};
// 获取工具类型
const getToolsTypeLists = () => {
	nextTick(() => {
		getTreeToolList().then(res => {
			let arrData = res.data || [];
			for (let item of arrData) {
				addDynamicMessages(item, setLocaleMessage);
				for (let level2 of item.children) {
					addDynamicMessages(level2, setLocaleMessage);
					for (let level3 of level2.children) {
						addDynamicMessages(level3, setLocaleMessage);
					}
				}
			}
			analysisTypeData.value = arrData;
		});
	});
};
getToolsTypeLists();

// 工具类型改变，任务改变
const handleAnalysisTypeChange = val => {
	if (val) {
		form.value.analysisTypeId = val;
		analysisTypeName.value = t(`title_${val}`);
		let presenterId = userStore.getUserData.user_id;
		getTaskList({ toolId: val, presenterId: presenterId }).then(res => {
			let arrData = res.data || [];
			for (let item of arrData) {
				addDynamicMessages(item, setLocaleMessage);
			}
			analysisTaskData.value = arrData;
		});
	} else {
		if (form.value.analysisTaskId) form.value.analysisTaskId = "";
		analysisTaskData = [];
	}
};

// 文件大小格式化工具函数
const formatFileSize = bytes => {
	if (bytes === 0) return "0 B";

	const units = ["B", "KB", "MB", "GB"];
	const k = 1024;
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + units[i];
};

// 处理文件选择
const handleImageFileChange = files => {
	if (!files) {
		imgErrMsg.value = [];
		return;
	}

	try {
		snackbarOption.value.snackbar = false;
		if (imageList.value.length + files?.length > 4) {
			imgErrMsg.value.push(t("myFeedback.UploadFileNum", { num: 4 }));
			throw new Error(t("myFeedback.UploadFileNum", { num: 4 }));
		}
		Array.from(files).forEach(file => {
			if (!["image/jpg", "image/png", "image/jpeg"].includes(file.type)) {
				imgErrMsg.value.push(t("myFeedback.UploadFileType", { filetype: "png, jpg, jpeg" }));
				throw new Error(t("myFeedback.UploadFileType", { filetype: "png, jpg, jpeg" }));
			}
			// 验证大小
			if (file.size > 2 * 1024 * 1024) {
				imgErrMsg.value.push(t("myFeedback.UploadFileSize", { size: "2MB" }));
				throw new Error(t("myFeedback.UploadFileSize", { size: "2MB" }));
			}
		});
		form.value.imageFile = [...(form.value.imageFile || []), ...files];
		imgErrMsg.value = [];
		Array.from(files).forEach(file => {
			uploadVFileInput(file).then(res => {
				if (res.code == 200) {
					res.data.size = formatFileSize(file.size);
					imageList.value.push(res.data);
				} else {
					snackbarOption.value.snackbar = true;
					snackbarOption.value.text = res.msg;
					snackbarOption.value.color = "error";
				}
			});
		});
	} catch (error) {
		console.log(error);
	}
};
// 移除文件
const removeImageFile = index => {
	imgErrMsg.value = [];
	const newFiles = [...form.value.imageFile];
	newFiles.splice(index, 1);
	form.value.imageFile = newFiles;
	imageList.value.splice(index, 1);
};
const handleImageClear = () => {
	imgErrMsg.value = [];
	form.value.imageFile = [];
	imageList.value = [];
};

// 处理视频选择
const handleVideoFileChange = file => {
	if (!file) {
		videoErrMsg.value = [];
		return;
	}
	try {
		// 验证视频类型
		if (!["video/mp4"].includes(file.type)) {
			videoErrMsg.value.push(t("myFeedback.UploadFileType", { filetype: "mp4" }));
			throw new Error(t("myFeedback.UploadFileType", { filetype: "mp4" }));
		}
		// 验证大小
		if (file.size > 50 * 1024 * 1024) {
			videoErrMsg.value.push(t("myFeedback.UploadFileSize", { size: "50MB" }));
			throw new Error(t("myFeedback.UploadFileSize", { size: "50MB" }));
		}
		videoErrMsg.value = [];
		form.value.otherFile = file;
		uploadVFileInput(file).then(res => {
			if (res.code == 200) {
				res.data.size = formatFileSize(file.size);
				videoList.value = res.data;
			} else {
				snackbarOption.value.snackbar = true;
				snackbarOption.value.text = res.msg;
				snackbarOption.value.color = "error";
			}
		});
	} catch (error) {
		console.log(error);
	}
};
const handleVideoClear = () => {
	videoErrMsg.value = [];
	form.value.otherFile = null;
	videoList.value = null;
};
// 置表单数据并关闭对话框
const resetForm = async () => {
	await nextTick();
	formRef.value?.reset();
	init();
};

// 保存表单数据并关闭对话框
const submitForm = async () => {
	if (isSubmitting.value) return; // 防止重复提交
	isSubmitting.value = true;
	// 手动触发验证
	const { valid } = await formRef.value.validate();
	if (valid == true) {
		if (!analysisTypeName.value) form.value.analysisTypeId = "";
		if (imageList.value.length) {
			let arr = imageList.value.map(item => item.attachId || item.id);
			form.value.imageFileId = arr.join(",");
		} else {
			form.value.imageFileId = "";
		}
		if (videoList.value) {
			form.value.otherFileId = videoList.value.attachId || videoList.value.id;
		} else {
			form.value.otherFileId = "";
		}
		form.value.memberId = userStore.getUserData.user_id;
		save(form.value).then(res => {
			if (res.code == 200) {
				init();
				isDialogVisible.value = false;
				snackbarOption.value.snackbar = true;
				snackbarOption.value.text = t("myFeedback.Success");
				snackbarOption.value.color = "success";
				emit("refreshChange", true);
			} else {
				let errorObj = JSON.parse(res.msg);
				snackbarOption.value.snackbar = true;
				snackbarOption.value.text = errorObj[userStore.getLanguage];
				snackbarOption.value.color = "error";
				isSubmitting.value = false;
			}
		});
	} else {
		isSubmitting.value = false;
	}
};
const handleDialogChange = () => {
	init();
};
const init = () => {
	imgErrMsg.value = [];
	videoErrMsg.value = [];
	form.value = { otherFile: null };
	imageList.value = [];
	videoList.value = null;
	analysisTypeName.value = "";
};
const InitForm = () => {
	init();
	if (userStore.getUserData.user_id) {
		isSubmitting.value = false;
		isDialogVisible.value = true;
	} else {
		snackbarOption.value.snackbar = true;
		snackbarOption.value.text = t("myFeedback.Login");
		snackbarOption.value.color = "warning";
	}
};
defineExpose({
	InitForm,
});
</script>
<template>
	<VSnackbar v-model="snackbarOption.snackbar" :color="snackbarOption.color" :location="snackbarOption.location" :timeout="snackbarOption.timeout">
		{{ snackbarOption.text }}
	</VSnackbar>
	<VDialog v-model="isDialogVisible" :width="$vuetify.display.smAndDown ? 'auto' : '50%'" @update:modelValue="handleDialogChange">
		<DialogCloseBtn variant="text" size="default" @click="isDialogVisible = false" />
		<VCard>
			<VCardItem>
				<VCardTitle> </VCardTitle>
			</VCardItem>
			<div class="text-center mb-6">
				<h4 class="text-h4 mb-2">{{ t("myFeedback.ProblemFeedback") }}</h4>
			</div>
			<VCardText>
				<!-- 👉 Form -->
				<VForm ref="formRef" @submit.prevent="submitForm">
					<VRow>
						<!-- 反馈类型 -->
						<VCol cols="12" md="6">
							<VSelect
								:rules="[v => (v !== null && v !== undefined) || t('personalCenter.SelectPlaceholder')]"
								v-model="form.feedbackType"
								:placeholder="t('myFeedback.FeedbackType')"
								:items="feedbackTypeData"
								item-value="dictKey"
								:label="t('myFeedback.FeedbackType')"
								persistent-hint
								required
								@update:modelValue="handleFeedbackTypeChange"
							>
								<template #item="{ props, item }">
									<VListItem v-bind="props" :title="t(`title_${item.raw.id}`)"> </VListItem>
								</template>
								<!-- 选择后的显示 -->
								<template #selection="{ item }">
									<span v-show="item && item.raw">{{ t(`title_${item.raw.id}`) }}</span>
									<span v-show="!item" class="text-disabled">{{ t("personalCenter.SelectPlaceholder") }}</span>
								</template>
							</VSelect>
						</VCol>

						<!-- 反馈事项 -->
						<VCol cols="12" md="6">
							<VSelect
								:rules="[v => (v !== null && v !== undefined) || t('personalCenter.SelectPlaceholder')]"
								v-model="form.issueType"
								:placeholder="t('myFeedback.IssueType')"
								:items="issueTypeData"
								item-value="dictKey"
								:label="t('myFeedback.IssueType')"
								persistent-hint
								required
							>
								<template #item="{ props, item }">
									<VListItem v-bind="props" :title="t(`title_${item.raw.id}`)">
										<!--										<template #title> {{ t(`title_${item.raw.id}`) }}</template>-->
									</VListItem>
								</template>
								<!-- 选择后的显示 -->
								<template #selection="{ item }">
									<span v-show="item && item.raw">{{ t(`title_${item.raw.id}`) }}</span>
									<span v-show="!item" class="text-disabled">{{ t("personalCenter.SelectPlaceholder") }}</span>
								</template>
							</VSelect>
						</VCol>

						<!-- 问题描述 -->
						<VCol cols="12" md="12">
							<VTextarea
								:rules="[v => (v !== null && v !== undefined) || t('personalCenter.InputPlaceholder')]"
								v-model="form.issueContent"
								:label="t('myFeedback.IssueContent')"
								:placeholder="t('myFeedback.Tip')"
								clearable
								maxlength="500"
								counter
								rows="3"
								required
							>
							</VTextarea>
						</VCol>

						<!-- 分析类型 -->
						<VCol cols="12" md="6">
							<VMenu location="bottom start">
								<template v-slot:activator="{ props }">
									<VTextField
										clearable
										:placeholder="t('myFeedback.AnalysisType')"
										v-model="analysisTypeName"
										:label="t('myFeedback.AnalysisType')"
										v-bind="props"
										append-inner-icon="ri-arrow-down-s-line"
									/>
								</template>

								<VList>
									<VListItem v-for="item in analysisTypeData" :key="item.id" @click.stop>
										<VListItemTitle>{{ t(`title_${item.id}`) }}</VListItemTitle>
										<template v-slot:append>
											<VIcon v-if="item.children && item.children.length" icon="ri-arrow-right-s-line" size="x-small"></VIcon>
										</template>

										<VMenu activator="parent" location="end top" :close-on-content-click="false">
											<VList>
												<VListItem v-for="child in item.children" :key="child.id" @click.stop>
													<VListItemTitle>{{ t(`title_${child.id}`) }}</VListItemTitle>
													<template v-slot:append>
														<VIcon
															v-if="child.children && child.children.length"
															icon="ri-arrow-right-s-line"
															size="x-small"
														></VIcon>
													</template>

													<VMenu activator="parent" location="end top">
														<VList>
															<VListItem v-for="lastchild in child.children" :key="lastchild.id" link>
																<VListItemTitle @click="handleAnalysisTypeChange(lastchild.id)">{{
																	t(`title_${lastchild.id}`)
																}}</VListItemTitle>
															</VListItem>
														</VList>
													</VMenu>
												</VListItem>
											</VList>
										</VMenu>
									</VListItem>
								</VList>
							</VMenu>
						</VCol>

						<!-- 分析任务 -->
						<VCol cols="12" md="6">
							<VSelect
								clearable
								v-model="form.analysisTaskId"
								:placeholder="t('myFeedback.AnalysisTask')"
								:items="analysisTaskData"
								item-value="id"
								item-title="taskName"
								:label="t('myFeedback.AnalysisTask')"
								persistent-hint
							>
							</VSelect>
						</VCol>

						<!-- 相关图片 -->
						<VCol cols="12" md="12">
							<VFileInput
								:placeholder="t('myFeedback.ImageFileId')"
								:model-value="form.imageFile"
								:label="t('myFeedback.ImageFileId')"
								accept=".png,.jpg,.jpeg"
								prepend-icon="ri-camera-line"
								validate-on-blur
								multiple
								show-size
								:error-messages="imgErrMsg"
								@update:modelValue="handleImageFileChange"
								@click:clear="handleImageClear"
								clearable
								hide-selected
								:max-files="4"
							>
								<template v-slot:selection>
									<template v-for="item in imageList" :key="item.id">
										<VChip class="me-2" color="primary" size="small" label> {{ item.originalName }} ({{ item.size }}) </VChip>
									</template>
								</template>
							</VFileInput>

							<!-- 文件预览区域 -->
							<div v-show="imageList.length" class="d-flex flex-wrap mt-2">
								<VCard v-for="(item, index) in imageList" :key="item.id" class="ma-1" width="120">
									<VImg :src="item.link" height="80" width="120" scale-down />
									<VCardText class="d-flex text-caption text-truncate pa-1 justify-space-between" width="120">
										<div class="text">{{ item.originalName }}</div>
										<VBtn icon size="x-small" variant="text" @click="removeImageFile(index)">
											<VIcon icon="ri-close-line"></VIcon>
										</VBtn>
									</VCardText>
								</VCard>
							</div>
						</VCol>
						<!-- 附加附件 -->
						<VCol cols="12" md="12">
							<VFileInput
								:model-value="form.otherFile"
								:label="t('myFeedback.OtherFileId')"
								accept="video/mp4"
								:multiple="false"
								show-size
								:max-files="1"
								clearable
								prepend-icon="ri-video-line"
								:error-messages="videoErrMsg"
								@click:clear="handleVideoClear"
								@update:model-value="handleVideoFileChange"
							>
								<template v-slot:selection>
									<v-chip class="me-2" color="primary" size="small" label>
										{{ videoList?.originalName }} ({{ videoList?.size }})
									</v-chip>
								</template>
							</VFileInput>
						</VCol>

						<!-- 提交和取消按钮 -->
						<VCol cols="12" class="text-center mt-5">
							<VBtn type="submit" class="me-3" :loading="isSubmitting">
								{{ t("personalCenter.Submit") }}
							</VBtn>
							<VBtn variant="outlined" color="secondary" @click.stop="resetForm">
								{{ t("personalCenter.Reset") }}
							</VBtn>
						</VCol>
					</VRow>
				</VForm>
			</VCardText>
		</VCard>
	</VDialog>
</template>
<style lang="scss" scoped>
.text {
	line-height: 28px;
	height: 28px;
	white-space: nowrap; /* 防止文字换行 */
	overflow: hidden; /* 超出部分隐藏 */
	text-overflow: ellipsis; /* 超出部分显示省略号 */
}
</style>
