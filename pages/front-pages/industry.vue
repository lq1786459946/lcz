<script setup>
import { getPageConfiguration } from "@/api/front-pages";
import Contact from "@/views/front-pages/front-page-contact.vue";
import Footer from "@/views/front-pages/front-page-footer.vue";
import Navbar from "@/views/front-pages/front-page-navbar.vue";
import { useI18n } from "vue-i18n";
const userStore = useUserStore();
const { t } = useI18n();
// 确保在setup函数中调用useI18n
const { setLocaleMessage } = useI18n({
	useScope: "global",
});
definePageMeta({
	layout: "blank",
	public: true,
});

const pageTable = ref({
	pageSize: 10,
	currentPage: 1,
	total: 0,
	options: [10, 20, 50, 100],
	sortBy: [""],
	sortDesc: [false],
});

const footerProps = ref({
	itemsPerPageText: "每页显示",
	pageText: "{0}-{1} 共 {2} 条",
	itemsPerPageOptions: pageTable.value.options,
	showFirstLastPage: true,
	firstIcon: "mdi-arrow-collapse-left",
	lastIcon: "mdi-arrow-collapse-right",
	prevIcon: "mdi-chevron-left",
	nextIcon: "mdi-chevron-right",
});
// 表头配置
const loading = ref(false);
let headers = [
	{ title: "标题", key: "title", zh: "标题", en: "Title", sortable: false, minWidth: 120 },
	{ title: "发布时间", key: "publishTime", zh: "发布时间", en: "Publish Time", sortable: false, minWidth: 200, width: 200, align: "center" },
	{ title: "操作", key: "actions", zh: "操作", en: "Action", sortable: false, minWidth: 120, width: 120, align: "center" },
];

// 表格数据
const teamData = ref([]);

// 根据语言动态计算headers
const computedHeaders = computed(() => {
	return headers.map(item => ({
		...item,
		title: item[userStore.getLanguage] || item.key, // 默认回退到key
	}));
});

const onLoad = page => {
	loading.value = true;
	nextTick(() => {
		getPageConfiguration(page.page, page.itemsPerPage, { moduleType: 3 })
			.then(res => {
				let data = res.data;
				teamData.value = data.records;
				pageTable.value.total = data.total;
				teamData.value.forEach(item => {
					addDynamicMessages(item, setLocaleMessage);
				});

				loading.value = false;
			})
			.catch(error => {
				loading.value = false;
			});
	});
};

/**
 * 处理查看反馈详情的函数
 * @param {Object} item - 要查看的反馈项
 */
const handleView = item => {
	// 存储setIndustryId
	userStore.setIndustryId(item.id);
};
</script>

<template>
	<!-- eslint-disable vue/attribute-hyphenation -->

	<div class="payment-page">
		<!-- 👉 Navbar -->
		<Navbar />
		<!-- 👉 联系我们 -->
		<Contact />
		<!-- 👉 Payment card  -->
		<VContainer>
			<div class="d-flex justify-center align-center payment-card">
				<VCard width="100%">
					<VCardText class="pa-8" :class="$vuetify.display.smAndDown ? 'pb-5' : 'pe-5'">
						<VDataTableServer
							:loading-text="t('home.Loading')"
							fixed-header
							v-model:items-per-page="pageTable.pageSize"
							v-model:page="pageTable.currentPage"
							:items-per-page-options="pageTable.options"
							:footer-props="footerProps"
							:items-length="pageTable.total"
							:headers="computedHeaders"
							:items="teamData"
							:loading="loading"
							item-value="id"
							@update:options="onLoad"
						>
							<!-- 标题列 -->
							<template v-slot:item.title="{ item }">
								<span>{{ t(`title_${item.id}`) }}</span>
							</template>
							<!-- 操作列 -->
							<template v-slot:item.actions="{ item }">
								<div class="d-flex justify-center">
									<VBtn variant="text" size="small" color="primary" @click="handleView(item)">
										{{ t("personalCenter.View") }}
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
											:items="[5, 10, 25, 50, 100]"
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
			</div>
		</VContainer>

		<!-- 👉 Footer -->
		<Footer />
	</div>
</template>

<style lang="scss" scoped>
.footer {
	position: static !important;
	inline-size: 100%;
	inset-block-end: 0;
}

.payment-card {
	margin-block: 9.25rem 5.25rem;
}

.payment-page {
	@media (min-width: 600px) and (max-width: 960px) {
		.v-container {
			padding-inline: 2rem !important;
		}
	}
}
</style>

<style lang="scss">
.payment-card {
	.custom-radio {
		.v-radio {
			margin-block-start: 0 !important;
		}
	}
}
</style>
