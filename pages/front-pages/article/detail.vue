<script setup>
import { cancelLike, getDetail, getLikeCount, getListConfiguration, like } from "@/api/front-pages";
import Contact from "@/views/front-pages/front-page-contact.vue";
import Footer from "@/views/front-pages/front-page-footer.vue";
import Navbar from "@/views/front-pages/front-page-navbar.vue";

const { t } = useI18n();
const { locale, setLocaleMessage } = useI18n({
	useScope: "global",
});
const userStore = useUserStore();
const id = ref(userStore.getIndustryId);
definePageMeta({
	layout: "blank",
	public: true,
});
const breadCrumbItems = ref([
	{
		title: "home.home",
		to: { name: "front-pages-help-center" },
	},
	{ title: "home.Industry" },
]);
const keyWords = ref("");
const articleData = ref();
const teamData = ref([]);
const isLoading = ref(true); // 添加加载状态

const getIndustryDetail = ids => {
	isLoading.value = true;
	nextTick(() => {
		getDetail({ id: ids, moduleType: 3 }).then(res => {
			articleData.value = res.data;
			isLoading.value = false; // 数据加载完成后关闭加载状态
			breadCrumbItems.value[2] = { title: `title_${articleData.value.id}` };
		});
	});
};

const getLike = ids => {
	getLikeCount({ id: ids, moduleType: 3 }).then(res => {
		articleData.value.likeCount = res.data.likeCount;
		articleData.value.alreadyLiked = res.data.alreadyLiked;
	});
};

// 监听 id 变化，自动获取详情
watch(
	id,
	newId => {
		isLoading.value = true;
		getIndustryDetail(newId);
	},
	{ immediate: true },
);

const getIndustry = (title = "") => {
	nextTick(() => {
		let obj = { moduleType: 3, allData: 1 };
		if (locale.value == "zh") {
			obj.titleZh = title;
		} else {
			obj.titleEn = title;
		}
		getListConfiguration(obj).then(res => {
			let data = res.data;
			teamData.value = data;
			teamData.value.forEach(item => {
				addDynamicMessages(item, setLocaleMessage);
			});
		});
	});
};

getIndustry();

// 搜索列表
const handleSearch = () => {
	getIndustry(keyWords.value);
};
// 点击列表项时更新路由和内容
const handleItemClick = itemId => {
	id.value = itemId; // 更新路由参数
	userStore.setIndustryId(itemId); // 更新路由参数
};

// 点赞 || 取消点赞
const handelLike = () => {
	const isLoggedIn = userStore.getToken || useCookie("token").value;
	if (!isLoggedIn) {
		alert("warning", t("home.pleaseLogin"));
		setTimeout(() => {
			userStore.setRedirectRoute("/front-pages/article/detail");
			navigateTo("/login");
		}, 1500);
		return false;
	}

	// 新增请求锁
	if (articleData.value.isLiking) return;

	articleData.value.isLiking = true; // 加锁
	if (articleData.value.alreadyLiked == 1) {
		cancelLike(articleData.value.id).finally(() => {
			articleData.value.isLiking = false; // 解锁
			getLike(articleData.value.id);
		});
	} else {
		like(articleData.value.id).finally(() => {
			articleData.value.isLiking = false; // 解锁
			getLike(articleData.value.id);
		});
	}
};
</script>

<template>
	<div class="bg-surface help-center-article">
		<!-- 👉 Navbar  -->
		<Navbar />
		<!-- 👉 联系我们 -->
		<Contact />
		<!-- 👉 Content -->
		<VContainer style="min-height: 100vh">
			<div class="d-flex gap-6 flex-lg-row flex-column article-detail-top">
				<!-- loding -->
				<div v-if="isLoading" class="d-flex align-center justify-center article-detail" style="height: 80vh">
					<VProgressCircular indeterminate color="primary" />
				</div>
				<!-- 详情 -->
				<div v-if="!isLoading && articleData?.id" class="article-detail">
					<VBreadcrumbs class="px-0 py-2 flex-wrap" :items="breadCrumbItems">
						<template #item="{ item, index }">
							<div class="d-flex align-center">
								<div
									class="text-body-1"
									:class="index === breadCrumbItems.length - 1 ? 'text-high-emphasis' : 'text-medium-emphasis'"
								>
									{{ t(item.title) }}
								</div>
							</div>
						</template>
					</VBreadcrumbs>
					<div>
						<h4 class="text-h4 mb-2">
							{{ t(`title_${articleData?.id}`) }}
						</h4>
						<div class="d-flex align-center justify-sm-space-between flex-wrap">
							<div class="d-flex">
								<div class="text-body-1 d-flex align-center" style="margin-right: 1.5rem">
									<img
										@click="!articleData?.isLiking && handelLike()"
										:disabled="articleData?.isLiking"
										v-if="articleData?.alreadyLiked == 1"
										class="like"
										src="../../../assets/images/home/like.png"
										alt=""
									/>
									<img
										@click="!articleData?.isLiking && handelLike()"
										:disabled="articleData?.isLiking"
										v-if="articleData?.alreadyLiked == 0"
										class="like"
										src="../../../assets/images/home/notLiked.png"
										alt=""
									/>
									{{ articleData?.likeCount }}
								</div>
								<div class="text-body-1 d-flex align-center">
									<!-- ri-eye-line -->
									<VIcon icon="ri-eye-line" size="22" style="margin-right: 0.3rem" />
									{{ articleData?.browseCount }}
								</div>
							</div>
							<div class="box"></div>
							<div class="text-body-1 publishTime">发布时间：{{ articleData?.publishTime }}</div>
						</div>
					</div>

					<VDivider class="my-6" />
					<div class="mb-6 rich-text-container" v-html="decodeURIComponent(t(`content_${articleData?.id}`))" />
				</div>
				<!-- 右侧列表 -->
				<div class="article-list">
					<VTextField
						prepend-inner-icon="ri-search-line"
						v-model="keyWords"
						:placeholder="t('home.Search')"
						class="pt-2 mb-6"
						@keyup.enter="handleSearch()"
					/>

					<div>
						<!-- 👉 Article List  -->
						<h5 class="text-h5 px-4 py-2 mb-4 rounded" style="background: rgba(var(--v-theme-on-surface), var(--v-hover-opacity))">
							{{ t("home.MoreIndustryNews") }}
						</h5>

						<VList class="card-list">
							<VListItem v-for="(item, index) in teamData" :key="index" link>
								<template #append>
									<VIcon size="20" icon="ri-arrow-right-s-line" color="disabled" />
								</template>

								<VListItemTitle @click="handleItemClick(item?.id)" :class="id == item.id ? 'active' : ''">
									{{ t(`title_${item?.id}`) }}
								</VListItemTitle>
							</VListItem>
						</VList>
					</div>
				</div>
			</div>
		</VContainer>

		<!-- 👉 Footer  -->
		<Footer />
	</div>
</template>

<style lang="scss" scoped>
.card-list {
	--v-card-list-gap: 1rem;
}
.like {
	cursor: pointer;
	width: 26px;
	height: 26px;
	margin-right: 0.3rem;
}
.active {
	color: rgb(var(--v-theme-primary));
}
.help-center-article {
	@media (min-width: 600px) and (max-width: 960px) {
		.v-container {
			padding-inline: 2rem !important;
		}
	}
}

.article-detail {
	width: 100%;
	@media (min-width: 961px) {
		width: 80%;
	}
}

.article-list {
	width: 100%;
	@media (min-width: 961px) {
		width: 20%;
	}
}

.publishTime {
	width: 100%;
	@media (min-width: 961px) {
		width: auto;
	}
}

.article-detail-top {
	margin-block: 5rem;

	@media (min-width: 961px) {
		margin-block: 6.25rem 5.25rem;
	}
}

:deep(.rich-text-container) img {
	width: 100% !important;
	/* 保持图片的宽高比 */
	height: auto !important;
}
</style>
