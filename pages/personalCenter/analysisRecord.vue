<script setup>
// 详情
import Info from "../../views/personalCenter/analysisRecord/analysisRecord-info.vue";
import AnalysisRecordUpdate from "../../views/personalCenter/analysisRecord/analysisRecord-update.vue";
import { addDynamicMessages } from "@/composables/i18n-global";
import { getPage, remove, pauseTask, startTask } from "@/api/personalCenter/analysisRecord/index.js";
import { useI18n } from "vue-i18n";

const userStore = useUserStore();
const { t } = useI18n();
// 确保在setup函数中调用useI18n
const { setLocaleMessage } = useI18n({
	useScope: "global",
});

let detailRef = ref(null);
let analysisRecordUpdateRef = ref(null);
let optype = ref(1);
let actionStr = ref("");
let isDialogVisible = ref(false);

// 表格配置
let form = ref(null);
const loading = ref(false);
const height = ref("700px");
let query = ref({
	dateRange: "",
});
const pageTable = ref({
	pageSize: 10,
	currentPage: 1,
	total: 2,
	options: [10, 20, 50, 100],
});
// 表格数据
const data = ref([]);

// 表头配置
let headers = [
	{ title: "序号", key: "index", zh: "序号", en: "No.", sortable: false, minWidth: 80, width: 80, align: "center" },
	{ title: "任务名称", key: "taskName", zh: "任务名称", en: "Task Name", sortable: false, minWidth: 200, align: "left" },
	{ title: "任务标识ID", key: "taskId", zh: "任务标识ID", en: "Task ID", sortable: false, minWidth: 120, width: 120, align: "center" },
	{ title: "任务类型", key: "taskType", zh: "任务类型", en: "Task Type", sortable: false, minWidth: 200, width: 200, align: "center" },
	{ title: "任务状态", key: "status", zh: "任务状态", en: "Task Status", minWidth: 120, sortable: false, align: "center" },
	{ title: "任务耗时", key: "executionTime", zh: "任务耗时", en: "Task Duration", sortable: false, false: true, minWidth: 150, align: "center" },
	{ title: "任务提交时间", key: "submitTime", zh: "任务提交时间", en: "Submit Time", minWidth: 200, width: 200, align: "center", sortable: false },
	{ title: "操作", key: "actions", zh: "操作", en: "Action", sortable: false, width: 100, align: "center" },
];

// 任务状态
let taskStatusData = [
	{ id: 1, color: "info", zh: "等待执行", en: "Pending" },
	{ id: 2, color: "primary", zh: "执行中", en: "In Progress" },
	{ id: 3, color: "success", zh: "执行成功", en: "Completed" },
	{ id: 4, color: "error", zh: "执行失败", en: "Failed" },
	{ id: 5, color: "warning", zh: "暂停任务", en: "Pause" },
	{ id: 6, color: "error", zh: "执行超时", en: "Timed Out" },
];

const resolveStatusObj = {
	1: { title: "Pending", color: "info" },
	2: { title: "InProgress", color: "orange-darken-2" },
	3: { title: "Completed", color: "success" },
	4: { title: "Failed", color: "error" },
	5: { title: "Cancelled", color: "warning" },
	6: { title: "TimedOut", color: "error" },
};
// 任务类型： 1-快任务，2-慢任务
let taskTypeData = [
	{ id: 1, zh: "快任务", en: "Fast Task" },
	{ id: 2, zh: "慢任务", en: "Slow Task" },
];

// 根据语言动态计算headers
const computedHeaders = computed(() => {
	return headers.map(item => ({
		...item,
		title: item[userStore.getLanguage] || item.key, // 默认回退到key
	}));
});

// 生命周期钩子
onMounted(() => {
	window.addEventListener("resize", getHeight);
	getHeight();
});

onBeforeUnmount(() => {
	window.removeEventListener("resize", getHeight);
});

// 根据窗口高度动态计算表格的高度
const getHeight = () => {
	// 计算表格高度，窗口高度减去340像素
	height.value = `${window.innerHeight - 360}px`;
};

// 处理查看任务详情的点击事件
const handleView = item => {
	// 显示任务详情
	optype.value = 2;
	// 将当前任务项赋值给表单数据
	detailRef.value.getAnalysisTask(item.toolId, item.id);
};

const handleOpenUpdate = item => {
	optype.value = 3;
	nextTick(() => {
		if (analysisRecordUpdateRef.value) analysisRecordUpdateRef.value.InitForm(item.toolId, item.id);
	});
};

const handlerConfirm = () => {
	if (actionStr.value == "Start") {
		startTask(form.value.id).then(res => {
			if (res.code == 200) {
				isDialogVisible.value = false;
				onLoad({ page: pageTable.value.currentPage, itemsPerPage: pageTable.value.pageSize });
			}
		});
	}
	if (actionStr.value == "Delete") {
		remove(form.value.id).then(res => {
			if (res.code == 200) {
				isDialogVisible.value = false;
				onLoad({ page: pageTable.value.currentPage, itemsPerPage: pageTable.value.pageSize });
			}
		});
	}
	if (actionStr.value == "Pause") {
		pauseTask(form.value.id).then(res => {
			if (res.code == 200) {
				isDialogVisible.value = false;
				onLoad({ page: pageTable.value.currentPage, itemsPerPage: pageTable.value.pageSize });
			}
		});
	}
};

// 删除、提交、取消
const handleOpenActions = (type, item) => {
	// 根据不同的action执行不同操作
	actionStr.value = type;
	// 将当前任务项赋值给表单数据
	form.value = item;
	isDialogVisible.value = true;
};

const editAfterRefreshTable = val => {
	if (val) {
		onLoad({ page: pageTable.value.currentPage, itemsPerPage: pageTable.value.pageSize });
	}
	optype.value = 1;
};
// 关闭任务详情页面
const closeDetail = () => {
	// 隐藏任务详情
	optype.value = 1;
};

// 搜索函数
const searchChange = () => {
	pageTable.value.currentPage = 1;
	pageTable.value.total = 0;
	onLoad({ page: pageTable.value.currentPage, itemsPerPage: pageTable.value.pageSize });
};
// 清空函数
const searchReset = () => {
	query.value = {};
	pageTable.value.currentPage = 1;
	pageTable.value.total = 0;
	onLoad({ page: pageTable.value.currentPage, itemsPerPage: pageTable.value.pageSize });
};

// 加载表格数据
const onLoad = ({ page, itemsPerPage }) => {
	// 开始加载数据，显示加载状态
	loading.value = true;
	nextTick(() => {
		let params = {};
		if (query.value.dateRange) {
			let arr = query.value.dateRange.split("to");
			params.createTimeBegin = arr[0];
			params.createTimeEnd = arr[1];
		}
		getPage(page, itemsPerPage, Object.assign(params, query.value))
			.then(res => {
				if (res.code == 200) {
					let arrData = res.data;

					arrData.records.forEach(item => {
						// if (!item.executionTimeZh || item.executionTimeZh === null) item.executionTimeZh = "-";
						// if (!item.executionTimeEn || item.executionTimeEn === null) item.executionTimeEn = "-";
						let typeobj = taskTypeData.find(e => e.id == item.taskType);
						item.taskTypeZh = typeobj.zh;
						item.taskTypeEn = typeobj.en;

						let statusObj = resolveStatusObj[item.status];
						item.statusColor = statusObj.color;
						item.statusTitle = statusObj.title;
						addDynamicMessages(item, setLocaleMessage);
					});
					data.value = arrData.records;
					pageTable.value.total = arrData.total;
				}
				loading.value = false;
			})
			.catch(() => {
				loading.value = false;
			});
	});
};
const navigateToView = row => {
	navigateTo("/personalCenter/analysisRecordInfo/1915313526454984705-1916318444024283138", { target: "_blank" });
};
</script>
<template>
	<div>
		<VRow v-show="optype === 1">
			<VCol cols="12">
				<VCard>
					<VCardItem>
						<!-- 👉 Title -->
						<VCardTitle>{{ t("analysisRecord.AnalysisRecord") }}</VCardTitle>
					</VCardItem>

					<VCardText>
						<VRow>
							<VCol cols="12" sm="6" md="3">
								<VTextField v-model="query.taskName" :label="t('analysisRecord.TaskName')" clearable></VTextField>
							</VCol>
							<VCol cols="12" sm="6" md="3">
								<VTextField v-model="query.taskId" :label="t('analysisRecord.TaskID')" clearable></VTextField>
							</VCol>
							<VCol cols="12" sm="6" md="3">
								<VSelect
									v-model="query.status"
									:placeholder="t('personalCenter.SelectPlaceholder')"
									:items="taskStatusData"
									item-value="id"
									:item-title="userStore.getLanguage"
									:label="t('analysisRecord.TaskStatus')"
									clearable
								/>
							</VCol>
							<VCol cols="12" sm="6" md="3">
								<AppDateTimePicker
									v-model="query.dateRange"
									:label="t('analysisRecord.DateRange')"
									:placeholder="t('personalCenter.SelectPlaceholder')"
									:config="{
										mode: 'range',
										conjunction: ' - ', // 修改连接符为横线
									}"
								>
									<template #input="{ value }">
										{{ value[0] }} - {{ value[1] }}
										<!-- 直接显示横线分隔 -->
									</template>
								</AppDateTimePicker>
							</VCol>
						</VRow>
					</VCardText>

					<VCardText class="d-flex flex-wrap gap-4">
						<VSpacer />

						<div class="d-flex gap-x-4">
							<!-- 👉 Export button -->
							<VBtn class="action-btn" @click="searchChange">
								{{ t("personalCenter.Search") }}
							</VBtn>
							<VBtn class="ml-sm-2" @click="searchReset" variant="outlined">
								{{ t("personalCenter.Clear") }}
							</VBtn>
						</div>
					</VCardText>
					<VCardText>
						<VDataTableServer
							fixed-header
							v-model:items-per-page="pageTable.pageSize"
							v-model:page="pageTable.currentPage"
							:items-per-page-options="pageTable.options"
							:items-length="pageTable.total"
							:headers="computedHeaders"
							:items="data"
							:loading="loading"
							item-value="id"
							@update:options="onLoad"
						>
							<!-- 序号列 -->
							<template v-slot:item.index="{ index }">
								{{ (pageTable.currentPage - 1) * pageTable.pageSize + index + 1 }}
							</template>
							<!-- 任务类型-->
							<template v-slot:item.taskType="{ item }">
								{{ t(`taskType_${item.id}`) }}
							</template>
							<!--              任务耗时-->
							<template v-slot:item.executionTime="{ item }">
								{{ t(`executionTime_${item.id}`) || "-" }}
							</template>

							<!-- 答复状态列 -->
							<template v-slot:item.status="{ item }">
								<VBtn variant="text" :color="item.statusColor">
									{{ t("analysisRecord." + item.statusTitle) }}
								</VBtn>
							</template>
							<!-- 操作列 -->
							<template #item.actions="{ item }">
								<v-menu>
									<template v-slot:activator="{ props }">
										<VBtn icon="ri-more-2-line" variant="text" v-bind="props"></VBtn>
									</template>

									<VList>
										<!--										<VListItem @click="navigateTo(`/analysisRecordInfo/${item.toolId}-${item.id}`)">-->
										<!--										<VListItem @click="navigateTo(`/personalCenter/analysisRecordInfo/${item.toolId}-${item.id}`)">-->
										<!--											<VListItemTitle>-->
										<!--												<VBtn prepend-icon="ri-eye-line" variant="text">{{ t("personalCenter.View") }}</VBtn>-->
										<!--											</VListItemTitle>-->
										<!--										</VListItem>-->

										<VListItem @click="handleView(item)">
											<!-- 查看-->
											<VListItemTitle>
												<VBtn prepend-icon="ri-eye-line" variant="text">{{ t("personalCenter.View") }}</VBtn>
											</VListItemTitle>
										</VListItem>
										<!-- 删除-->
										<VListItem @click="handleOpenActions('Delete', item)">
											<VListItemTitle>
												<VBtn prepend-icon="ri-delete-bin-7-line" variant="text">{{ t("personalCenter.Delete") }}</VBtn>
											</VListItemTitle>
										</VListItem>
										<!-- 提交-->
										<VListItem v-show="item.status == 5" @click="handleOpenActions('Start', item)">
											<VListItemTitle>
												<VBtn prepend-icon="ri-play-line" variant="text">{{ t("personalCenter.Start") }}</VBtn>
											</VListItemTitle>
										</VListItem>
										<!--  暂停-->
										<VListItem v-show="item.status == 1" @click="handleOpenActions('Pause', item)">
											<VListItemTitle>
												<VBtn prepend-icon="ri-pause-line" variant="text">{{ t("personalCenter.Pause") }}</VBtn>
											</VListItemTitle>
										</VListItem>
										<VListItem v-show="item.status == 5" @click="handleOpenUpdate(item)">
											<VListItemTitle>
												<VBtn prepend-icon="ri-edit-line" variant="text">{{ t("personalCenter.Edit") }}</VBtn>
											</VListItemTitle>
										</VListItem>
									</VList>
								</v-menu>
							</template>

							<!-- Pagination -->
							<template #bottom>
								<VDivider />
								<VCardText class="pt-2">
									<div class="d-flex flex-wrap justify-end gap-y-2 mt-2">
										<div class="d-flex align-center mr-5">{{ `${t("total-header")}${pageTable.total}${t("total-footer")}` }}</div>
										<VSelect
											v-model="pageTable.pageSize"
											:items="pageTable.options"
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
				</VCard>
			</VCol>
		</VRow>
		<!--  详情-->
		<Info v-show="optype == 2" ref="detailRef" @closeDetail="closeDetail"></Info>
		<AnalysisRecordUpdate v-if="optype == 3" ref="analysisRecordUpdateRef" @editAfterRefreshTable="editAfterRefreshTable"></AnalysisRecordUpdate>
		<!--  确认弹窗-->
		<VDialog v-model="isDialogVisible" width="500">
			<template #activator="{ props }"> </template>
			<VCard :title="t('personalCenter.' + actionStr)">
				<VCardText> {{ t("analysisRecord." + actionStr + "Tip") }} </VCardText>
				<VCardActions>
					<VSpacer />
					<VBtn @click="handlerConfirm"> {{ t("personalCenter.Confirm") }} </VBtn>
					<VBtn @click="isDialogVisible = false"> {{ t("personalCenter.Cancel") }}</VBtn>
				</VCardActions>
			</VCard>
		</VDialog>
	</div>
</template>
<style lang="scss" scoped>
// 可以添加自定义样式
.v-data-table-server {
	.v-chip {
		text-transform: capitalize;
	}
}
.v-table .v-table__wrapper > table > tbody > tr:not(:last-child) > td {
	color: #34495e;
}
</style>
