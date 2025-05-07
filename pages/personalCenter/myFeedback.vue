<script setup>
// 详情
import FeedbackInfo from "../../views/personalCenter/myFeedback/feedback-info.vue";
// 新增
import FeedbackAdd from "../../views/personalCenter/myFeedback/feedback-add.vue";
import { getPage, getDictionary } from "@/api/personalCenter/myFeedback/index.js";
import { useI18n } from "vue-i18n";
const userStore = useUserStore();
const { t } = useI18n();

// 确保在setup函数中调用useI18n
const { setLocaleMessage } = useI18n({
	useScope: "global",
});

let form = ref({});
let openType = ref(1);
let addFeedbackRef = ref(null);
let infoFeedbackRef = ref(null);

// 表格配置
const loading = ref(false);
const height = ref("700px");
const pageTable = ref({
	total: 0,
	currentPage: 1,
	pageSize: 10,
	options: [10, 20, 25, 50, 100],
});

// 表头配置
let headers = [
	{ title: "反馈时间", key: "createTime", zh: "反馈时间", en: "Submission Time", sortable: false, minWidth: 200, width: 200, align: "center" },
	{ title: "反馈类型", key: "feedbackType", zh: "反馈类型", en: "Feedback Type", sortable: false, minWidth: 120, width: 120, align: "center" },
	{ title: "反馈事项", key: "issueType", zh: "反馈事项", en: "Feedback Item", sortable: false, width: 240, align: "center" },
	{ title: "问题描述", key: "issueContent", zh: "问题描述", en: "Issue Description", minWidth: 300, sortable: false },
	{ title: "答复状态", key: "responseStatus", zh: "答复状态", en: "Response Status", sortable: false, minWidth: 120, width: 120, align: "center" },
	{ title: "操作", key: "actions", zh: "操作", en: "Action", sortable: false, minWidth: 120, width: 120, align: "center" },
];
// 表格数据
let data = ref([]);
const resolveStatus = status => {
	const responseStatusMap = new Map([
		[1, { text: t("myFeedback.FeedbackInProgress"), color: "#FF8000" }],
		[2, { text: t("myFeedback.ReplyReceived"), color: "#0BA70B" }],
	]);
	return responseStatusMap.get(status);
};

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

const getFeekTypeDictionary = async () => {
	const res = await getDictionary({ code: "feedback_type" });
	return res.data;
};

// 使用方式
const feedbackTypeData = await getFeekTypeDictionary();

const refreshChange = () => {
	openType.value = 1;
	pageTable.value.currentPage = 1;
	onLoad({ page: pageTable.value.currentPage, itemsPerPage: pageTable.value.pageSize });
};

let color = ["#002AE3", "#E35300", "#56CA04", "#FF4B51"];
const onLoad = ({ page, itemsPerPage }) => {
	// 开始加载数据，显示加载状态
	loading.value = true;
	let params = {
		memberId: userStore.getUserData.user_id,
	};
	nextTick(() => {
		getPage(page, itemsPerPage, params)
			.then(res => {
				let arrData = res.data;
				for (let item of arrData.records) {
					let feedbackType = feedbackTypeData.find(e => e.dictKey == item.feedbackType);
					item.feedbackTypeZh = feedbackType.dictValue;
					item.feedbackTypeEn = feedbackType.remark;
					item.feedbackTypeColor = color[item.feedbackType] || "#E35300";

					let issueType = feedbackTypeData.find(e => e.dictKey == item.issueType);
					item.issueTypeZh = issueType.dictValue;
					item.issueTypeEn = issueType.remark;

					item.responseStatusName = item.responseStatus == 1 ? "FeedbackInProgress" : "ReplyReceived";
					item.responseStatusColor = item.responseStatus == 1 ? "#FF8000" : "#0BA70B";

					addDynamicMessages(item, setLocaleMessage);
				}
				data.value = arrData.records;
				pageTable.value.total = arrData.total;
				loading.value = false;
			})
			.catch(() => {
				loading.value = false;
			});
	});
};

// 根据窗口高度动态计算表格高度
const getHeight = () => {
	height.value = `${window.innerHeight - 340}px`;
};

// 查看反馈详情
const handleView = item => {
	openType.value = 2;
	infoFeedbackRef.value.openDetail(item);

	// getDetail(item.id).then(res => {
	// 	let temObj = res.data;
	// 	temObj.feedbackTypeZh = item.feedbackTypeZh;
	// 	temObj.feedbackTypeEn = item.feedbackTypeEn;
	//
	// 	temObj.issueTypeZh = item.issueTypeZh;
	// 	temObj.issueTypeEn = item.issueTypeEn;
	//
	// 	temObj.responseStatusZh = item.responseStatusZh;
	// 	temObj.responseStatusEn = item.responseStatusEn;
	// 	temObj.color = item.color;
	// 	addDynamicMessages(temObj, setLocaleMessage);
	// 	form.value = temObj;
	// 	infoFeedbackRef.value.openDetail(temObj);
	// 	openType.value = 2;
	// });
};

// 添加反馈
const handleAdd = () => {
	addFeedbackRef.value.InitForm();
};
const close = () => {
	openType.value = 1;
};
</script>

<template>
	<VCard v-show="openType === 1">
		<VCardItem>
			<!-- 👉 Title -->
			<VCardTitle class="d-flex flex-wrap gap-4">
				<span>
					{{ t("myFeedback.MyFeedback") }}
				</span>
				<VSpacer />
				<VBtn color="primary" @click="handleAdd">
					<v-icon icon="ri-edit-2-line" class="mr-2"></v-icon>
					{{ t("myFeedback.Feedback") }}
				</VBtn>
			</VCardTitle>
		</VCardItem>
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
				<!-- 反馈类型列 -->
				<template v-slot:item.feedbackType="{ item }">
					<VBtn variant="text" :color="item.feedbackTypeColor"> {{ t(`feedbackType_${item.id}`) }}</VBtn>
				</template>
				<!--反馈事项-->
				<template v-slot:item.issueType="{ item }"> {{ t(`issueType_${item.id}`) }}</template>

				<!-- 答复状态列 -->
				<template v-slot:item.responseStatus="{ item }">
					<VChip :key="item.id" :text="t('myFeedback.' + item.responseStatusName)" :color="item.responseStatusColor"> </VChip>
				</template>

				<!-- 操作列 -->
				<template v-slot:item.actions="{ item }">
					<div class="d-flex justify-center">
						<VBtn variant="text" size="big" color="primary" @click="handleView(item)">
							<VIcon icon="ri-eye-line"></VIcon>
						</VBtn>
					</div>
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
	<FeedbackInfo v-show="openType === 2" :form="form" ref="infoFeedbackRef" @close="close"></FeedbackInfo>
	<FeedbackAdd ref="addFeedbackRef" @refreshChange="refreshChange"></FeedbackAdd>
</template>

<style scoped></style>
