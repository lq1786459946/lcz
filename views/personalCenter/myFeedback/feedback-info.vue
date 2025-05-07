<script setup>
import { VideoPlayer } from "@videojs-player/vue";
import "video.js/dist/video-js.css";
import { useI18n } from "vue-i18n";
import { getDetail } from "@/api/personalCenter/myFeedback/index.js";
const userStore = useUserStore();
const { t } = useI18n();
const { setLocaleMessage } = useI18n({
	useScope: "global",
});

const emit = defineEmits(["close"]);
let form = ref({});
const back = () => {
	emit("close");
};
const resolveStatus = ref({
	1: t("myFeedback.FeedbackInProgress"),
	2: t("myFeedback.ReplyReceived"),
});
const openDetail = item => {
	nextTick(() => {
		getDetail(item.id).then(res => {
			let temObj = res.data;
			temObj.feedbackTypeZh = item.feedbackTypeZh;
			temObj.feedbackTypeEn = item.feedbackTypeEn;
			temObj.issueTypeZh = item.issueTypeZh;
			temObj.issueTypeEn = item.issueTypeEn;
			temObj.responseStatusZh = item.responseStatusZh;
			temObj.responseStatusEn = item.responseStatusEn;
			addDynamicMessages(temObj, setLocaleMessage);
			if (temObj.otherFjList && temObj.otherFjList.length) {
				temObj.otherFjListUrl = temObj.otherFjList[0].link;
			}
			form.value = temObj;
		});
	});
};
defineExpose({
	openDetail,
});
</script>

<template>
	<VCard>
		<VCardItem>
			<!-- 👉 Title -->
			<VCardTitle class="d-flex flex-wrap gap-4">
				<span>
					{{ t("myFeedback.ProblemFeedback") }}
				</span>
				<VSpacer />
				<VBtn color="primary" @click="back">
					<v-icon icon="ri-arrow-go-back-line" class="mr-2"></v-icon>
					{{ t("personalCenter.Back") }}
				</VBtn>
			</VCardTitle>
		</VCardItem>

		<VCardText>
			<!-- 👉 Form -->

			<div class="d-flex mb-7">
				<h4>{{ t("myFeedback.FeedbackInfo") }}</h4>
			</div>
			<VRow class="justify-lg-space-between">
				<!-- 反馈时间 -->
				<VCol cols="6" md="2"
					><span class="font-weight-medium">{{ t("myFeedback.FeedbackTime") }}:</span>
				</VCol>
				<VCol cols="6" md="10">{{ form.createTime }}</VCol>
				<!-- 反馈状态 -->
				<VCol cols="6" md="2">
					<span class="font-weight-medium"> {{ t("myFeedback.FeedbackStatus") }}:</span>
				</VCol>
				<VCol cols="6" md="10">
					{{ resolveStatus[form.responseStatus] }}
				</VCol>
				<!-- 反馈类型 -->
				<VCol cols="6" md="2" class="font-weight-medium">{{ t("myFeedback.FeedbackType") }}:</VCol>
				<VCol cols="6" md="10">{{ t(`feedbackType_${form.id}`) }}</VCol>
				<!-- 反馈事项 -->
				<VCol cols="6" md="2" class="font-weight-medium">{{ t("myFeedback.IssueType") }}: </VCol>
				<VCol cols="6" md="10">{{ t(`issueType_${form.id}`) }}</VCol>

				<!-- 分析类型 -->
				<VCol cols="6" md="2" class="font-weight-medium">{{ t("myFeedback.AnalysisType") }}: </VCol>
				<VCol cols="6" md="10">
					<!--          {{ t(`analysisTypeName_${form.id}`)  }}-->
					<span v-show="userStore.getLanguage == 'zh'">{{ form.analysisTypeNameZh }}</span>
					<span v-show="userStore.getLanguage == 'en'">{{ form.analysisTypeNameEn }}</span>
				</VCol>

				<!-- 分析任务 -->
				<VCol cols="6" md="2" class="font-weight-medium">{{ t("myFeedback.AnalysisTask") }}: </VCol>
				<VCol cols="6" md="10">{{ form.analysisTaskName }}</VCol>
				<!-- 问题描述 -->
				<VCol cols="12" md="2" class="font-weight-medium">{{ t("myFeedback.IssueContent") }}:</VCol>
				<VCol cols="12" md="10"> {{ form.issueContent }}</VCol>

				<!-- 相关图片 -->
				<VCol cols="12" md="2" class="font-weight-medium">{{ t("myFeedback.ImageFileId") }}: </VCol>
				<VCol cols="12" md="10">
					<VRow v-show="form.imageFjList">
						<VCol cols="6" md="3" v-for="swiperImg in form.imageFjList" :key="swiperImg.in">
							<!--							<VImg :aspect-ratio="1" max-height="280" :src="swiperImg.link" alt="" />-->

							<VMenu location="bottom start" origin="bottom start" transition="scale-transition">
								<template v-slot:activator="{ props }">
									<VImg v-bind="props" link :src="swiperImg.link" alt="" />
								</template>
								<VCard width="800">
									<VImg :src="swiperImg.link" alt="" />
								</VCard>
							</VMenu>
						</VCol>
					</VRow>
				</VCol>

				<!-- 附加附件 -->
				<VCol cols="12" md="2" class="font-weight-medium">{{ t("myFeedback.OtherFileId") }}: </VCol>
				<VCol cols="12" md="10">
					<div v-show="form?.otherFjListUrl" class="mt-2">
						<VideoPlayer
							ref="videoPlayer"
							:src="form.otherFjListUrl"
							:height="$vuetify.display.mdAndUp ? 440 : 250"
							controls
							plays-inline
							class="w-100 rounded w-800"
						/>
					</div>
				</VCol>
			</VRow>
			<VDivider class="mb-5 mt-5" />
			<div class="d-flex mb-7">
				<h4>{{ t("myFeedback.ReplyInfo") }}</h4>
			</div>
			<VRow>
				<!-- 问题描述 -->
				<VCol cols="12" md="2" class="font-weight-medium">{{ t("myFeedback.ReplyDescription") }}:</VCol>
				<VCol cols="12" md="10"> {{ form.responseContent }}</VCol>
				<VCol cols="12" md="2" class="font-weight-medium">{{ t("myFeedback.ReplyImage") }}:</VCol>
				<VCol cols="12" md="10">
					<VRow>
						<VCol cols="6" md="3" v-for="swiperImg in form.responseFjList" :key="swiperImg.in">
							<VMenu location="bottom start" origin="bottom start" transition="scale-transition">
								<template v-slot:activator="{ props }">
									<VImg :src="swiperImg.link" alt="" />
								</template>
								<VCard width="800">
									<VImg :src="swiperImg.link" alt="" />
								</VCard>
							</VMenu>
						</VCol>
					</VRow>
				</VCol>
			</VRow>
		</VCardText>
	</VCard>
</template>
<style scoped>
.w-800 {
	max-width: 800px;
}
</style>
