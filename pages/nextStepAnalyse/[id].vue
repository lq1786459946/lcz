<script setup>
import { selectNextTools } from "@/api/analysis-tools";
import { addDynamicMessages } from "@/composables/i18n-global";
import sectionTitleIcon from "@images/pages/section-title-icon.png";
const userStore = useUserStore();
const { setLocaleMessage } = useI18n({
	useScope: "global",
});
// 使用 useI18n 函数获取 t 函数，用于翻译文本
const { t } = useI18n();
const router = useRoute();
let data = ref([]);
const height = ref("");
let loading = ref(false);
const idString = router.params.id;
const parts = idString.split("-");
const firstPart = parts[0];
const secondPart = parts[1];
const typeWeb = router.query.type;
const getSelectNextTools = () => {
	loading.value = true;
	nextTick(() => {
		selectNextTools({ toolId: firstPart }).then(res => {
			console.log(res.data, "res.data");

			for (let item of res.data) {
				item.logo = item.toolLogoFileList && item.toolLogoFileList.length ? item.toolLogoFileList[0].link : sectionTitleIcon;
				addDynamicMessages(item, setLocaleMessage);
			}
			data.value = res.data;
			loading.value = false;
		});
	});
};
getSelectNextTools();
onMounted(() => {
	height.value = window.innerHeight - window.innerHeight / 9 + "px";
});
</script>

<template>
	<VCard :style="{ height: height, overflowY: 'auto' }">
		<VCardText>
			<VProgressLinear :active="loading" :indeterminate="loading" indeterminate color="primary" />
			<VRow v-show="data.length" class="pl-5 pr-5">
				<VCol v-for="(item, ind) in data" :key="ind" sm="4" cols="12" md="4">
					<VCard @click="navigateTo(`/analysisTool/${item.id}-${secondPart}?type=${typeWeb}`, { replace: true })">
						<VRow :gutter="0" class="ma-0">
							<VCol cols="12" md="5" class="ma-auto">
								<VImg class="ma-auto" width="130" height="130" :src="item.logo" />
							</VCol>
							<VDivider :vertical="$vuetify.display.mdAndUp" />
							<VCol cols="12" md="7" class="pa-0">
								<VCardItem>
									<VCardTitle>{{ t(`toolName_${item.id}`) }}</VCardTitle>
								</VCardItem>
								<VCardText>
									<div class="three-line-ellipsis">
										{{ t(`toolDescription_${item.id}`) }}
									</div>
								</VCardText>
							</VCol>
						</VRow>
					</VCard>
				</VCol>
			</VRow>
		</VCardText></VCard
	>
</template>
<style lang="scss" scoped>
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
