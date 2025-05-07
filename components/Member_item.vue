<script setup>
import { getLevelBenefit } from "@/api/front-pages";
import major_VIP from "@images/home/major_VIP.png";
import Regular_VIP from "@images/home/Regular_VIP.png";
import senior_VIP from "@images/home/senior_VIP.png";
import supreme_VIP from "@images/home/supreme_VIP.png";
import { useTheme } from "vuetify";
const userStore = useUserStore();
const theme = useTheme();
const isDark = ref(theme.global.name.value === "dark");
const { t } = useI18n();
const isLoading = ref(true); // 新增加载状态
const props = defineProps({
	type: {
		type: Number,
		required: true,
		default: 0,
	},
});
const { locale, setLocaleMessage } = useI18n({
	useScope: "global",
});

// 监听主题变化
watch(
	() => theme.global.name.value,
	newTheme => {
		isDark.value = newTheme === "dark";
	},
	{ immediate: true },
);

const memberList = ref([]);
const convertMemProfileToArray = memProfile => {
	if (!memProfile) {
		return [];
	}
	return memProfile.split("\n").map(item => {
		// 去除序号和点号
		return item.replace(/^\d+\./, "").trim();
	});
};
const getMemberList = () => {
	nextTick(() => {
		getLevelBenefit().then(res => {
			let data = res.data;
			memberList.value = data;
			memberList.value.forEach((item, index) => {
				addDynamicMessages(item, setLocaleMessage);
				// item.features = convertMemProfileToArray(item.memProfile);
				item.current = false;
				if (index == 0) {
					item.icon = Regular_VIP;
					item.color = "linear-gradient(90deg, #E4E8F2 0%, #DADFE7 100%) 1";
					item.bgcColor = "linear-gradient(90deg, #E4E8F2 0%, #DADFE7 100%)";
					item.textColor = "#000";
				} else if (index == 1) {
					item.icon = senior_VIP;
					item.color = "linear-gradient( 90deg, #B3D5EF 0%, #6E93CE 100%) 1";
					item.bgcColor = "linear-gradient( 90deg, #B3D5EF 0%, #6E93CE 100%)";
					item.textColor = "#172A54";
				} else if (index == 2) {
					item.icon = major_VIP;
					item.color = "linear-gradient( 90deg, #EAD7C4 0%, #C49B84 100%) 1";
					item.bgcColor = "linear-gradient( 90deg, #EAD7C4 0%, #C49B84 100%)";
					item.textColor = "#543217";
				} else if (index == 3) {
					item.icon = supreme_VIP;
					item.color = " linear-gradient( 90deg, #4C4E5A 0%, #232424 100%) 1";
					item.bgcColor = " linear-gradient( 90deg, #4C4E5A 0%, #232424 100%)";
					item.textColor = "#EECCAA";
				}
			});
			isLoading.value = false; // 数据加载完成，更新加载状态
		});
	});
};
getMemberList();
const handelBuy = (plan, index, locale) => {
	// 在这里处理购买逻辑，例如跳转到支付页面或执行其他操作
	// 假设我们有一个路由对象，可以使用 navigateTo 方法跳转到支付页面
	// 检查用户是否已登录
	if (index == 0) {
		navigateTo("/analysisTools/All", { replace: true });
	} else {
		const isLoggedIn = userStore.getToken || useCookie("token").value || false;
		if (!isLoggedIn) {
			userStore.setRedirectRoute(`/front-pages/payment?timeType=${props.type}&type=${locale}&id=${plan.id}`);
			return navigateTo("/login");
		} else {
			navigateTo({ name: "front-pages-payment", query: { timeType: props.type, type: locale, id: plan.id } });
		}
	}
};
</script>
<template>
	<!-- 骨架屏 -->
	<div :class="{ hidden: !isLoading }">
		<VRow>
			<VCol cols="12" sm="12" md="3" v-for="i in 4" :key="i">
				<VCard border flat :class="isDark ? 'shadow_box_dark' : 'shadow_box'" style="border-radius: 0.6rem">
					<VCardText class="pa-lg-8 text-no-wrap" style="border-top: 2rem solid">
						<div class="d-flex flex-column gap-y-8">
							<div class="d-flex flex-column gap-y-3">
								<h4 class="text-h4 text-center d-flex align-center">
									<!-- 根据 isDark 动态添加类名 -->
									<div :class="['skeleton-icon', 'shimmer', { 'dark-theme': isDark }]"></div>
									<div class="skeleton-title shimmer" :class="{ 'dark-theme': isDark }"></div>
								</h4>
								<div class="d-flex align-center gap-x-3" style="height: 3rem">
									<div class="d-flex">
										<h5 class="skeleton-price shimmer" :class="{ 'dark-theme': isDark }"></h5>
									</div>
									<div class="skeleton-period shimmer" :class="{ 'dark-theme': isDark }"></div>
								</div>
							</div>

							<div class="d-flex flex-column" style="height: 17rem">
								<VList class="card-list">
									<VListItem v-for="j in 5" :key="j">
										<h5 class="skeleton-feature shimmer" :class="{ 'dark-theme': isDark }"></h5>
									</VListItem>
								</VList>
							</div>
							<VDivider class="my-4" />

							<VBtn block class="skeleton-button shimmer"></VBtn>
						</div>
					</VCardText>
				</VCard>
			</VCol>
		</VRow>
	</div>
	<!-- 实际内容 -->
	<div :class="{ hidden: isLoading }">
		<VRow>
			<VCol cols="12" sm="12" md="3" v-for="(plan, index) in memberList" :key="index">
				<VCard border flat :class="isDark ? 'shadow_box_dark' : 'shadow_box'" style="border-radius: 0.6rem">
					<VCardText class="pa-lg-8 text-no-wrap" style="border-top: 2rem solid" :style="{ 'border-image': plan.color }">
						<div class="d-flex flex-column gap-y-8">
							<div class="d-flex flex-column gap-y-3">
								<h4 class="text-h4 text-center d-flex align-center">
									<img class="vip_icon" :src="plan.icon" />
									{{ t(`memLevels_${plan.id}`) }}
								</h4>
								<div class="d-flex align-center gap-x-3" style="height: 3rem">
									<div class="d-flex">
										<h5 class="text-h5" style="margin-block-start: 0.35rem">{{ t("home.money") }}</h5>
										<!-- 月度的人民币 -->
										<div class="plan-price-text" v-if="locale == 'zh' && props.type == 0">
											{{ plan?.memberLevelMaintenance?.monthlyPriceCny }}
										</div>
										<!-- 月度的美元 -->
										<div class="plan-price-text" v-if="locale == 'en' && props.type == 0">
											{{ plan?.memberLevelMaintenance?.monthlyPriceUsd }}
										</div>
										<!-- 年度的人民币 -->
										<div class="plan-price-text" v-if="locale == 'zh' && props.type == 1">
											{{ plan?.memberLevelMaintenance?.yearPriceCny }}
										</div>
										<!-- 年度的美元 -->
										<div class="plan-price-text" v-if="locale == 'en' && props.type == 1">
											{{ plan?.memberLevelMaintenance?.yearPriceUsd }}
										</div>
									</div>
									<div>
										<div
											class="text-body-1 font-weight-medium text-high-emphasis"
											style="margin-top: 1.3rem"
											v-if="plan?.memberLevelMaintenance"
										>
											{{ props.type == 0 ? t("home.Per month") : t("home.Per year") }}
										</div>
									</div>
								</div>
							</div>

							<div class="d-flex flex-column" style="height: 17rem">
								<VList class="card-list">
									<VListItem
										v-for="(item, i) in convertMemProfileToArray(locale == 'zh' ? plan.memProfileZh : plan.memProfileEn)"
										:key="i"
									>
										<h5 class="text-body-1 d-flex" style="white-space: normal">
											<img
												style="width: 1.2rem; height: 1.2rem; margin-top: 0.1rem; margin-right: 1rem; align-self: flex-start"
												src="../assets/images/home/success.png"
												alt=""
											/>
											<span>{{ item }}</span>
										</h5>
									</VListItem>
								</VList>
							</div>
							<VDivider class="my-4" />

							<VBtn
								block
								:style="{ background: plan.bgcColor + ' !important', color: plan.textColor + ' !important' }"
								@click="handelBuy(plan, index, locale)"
							>
								{{ index == 0 ? t("home.Try") : t("home.Buy") }}
							</VBtn>
						</div>
					</VCardText>
				</VCard>
			</VCol>
		</VRow>
	</div>
</template>

<style lang="scss">
.hidden {
	display: none;
}
.card-list {
	--v-card-list-gap: 12px;
}

.pricing-plans {
	margin-block: 5.25rem;
}
.shadow_box {
	box-shadow: 0rem 0rem 0.5rem 0rem #d7e6ee !important;
}
.shadow_box_dark {
	box-shadow: 0rem 0rem 0.5rem 0rem #0b1d27 !important;
}

.skeleton-icon {
	width: 30px;
	height: 30px;
	border-radius: 50%;
	// 浅色主题样式
	background-color: #eee;
}

.dark-theme {
	// 深色主题样式，可根据需求调整颜色
	background-color: #333 !important;
}

.skeleton-title {
	width: 100px;
	height: 20px;
	background-color: #eee;
	margin-left: 10px;
}

.skeleton-price {
	width: 80px;
	height: 25px;
	background-color: #eee;
}

.skeleton-period {
	width: 60px;
	height: 15px;
	background-color: #eee;
}

.skeleton-feature {
	width: 150px;
	height: 15px;
	background-color: #eee;
}

.skeleton-button {
	width: 100%;
	height: 40px;
	background-color: #eee;
}

.shimmer {
	position: relative;
	background-color: #f0f0f0;
	overflow: hidden;
}

.shimmer::after {
	content: "";
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	transform: translateX(-100%);
	background-image: linear-gradient(
		90deg,
		rgba(255, 255, 255, 0) 0,
		rgba(255, 255, 255, 0.2) 20%,
		rgba(255, 255, 255, 0.5) 60%,
		rgba(255, 255, 255, 0)
	);
	animation: shimmer 2s infinite;
}

@keyframes shimmer {
	100% {
		transform: translateX(100%);
	}
}
</style>

<style lang="scss" scoped>
.plan-price-text {
	color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
	font-size: 2.5rem;
	font-weight: 500;
	line-height: 3.5rem;
}
</style>
