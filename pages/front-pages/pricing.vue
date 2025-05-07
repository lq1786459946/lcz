<script setup>
import { getLevelBenefit, getToolList } from "@/api/front-pages";
import Member_item from "@/components/Member_item.vue";
import Contact from "@/views/front-pages/front-page-contact.vue";
import Footer from "@/views/front-pages/front-page-footer.vue";
import Navbar from "@/views/front-pages/front-page-navbar.vue";
import major_VIP from "@images/home/major_VIP.png";
import Regular_VIP from "@images/home/Regular_VIP.png";
import senior_VIP from "@images/home/senior_VIP.png";
import supreme_VIP from "@images/home/supreme_VIP.png";
import poseFs10 from "@images/pages/pose-fs-10.png";
const { t } = useI18n();
const { locale, setLocaleMessage } = useI18n({
	useScope: "global",
});
definePageMeta({
	layout: "blank",
	public: true,
});
const userTab = ref("Monthly");
const tabs = ref([{ title: "Monthly" }, { title: "Year" }]);

const toolList = ref([]);
const memberList = ref([]);

const handelBuy = (plan, index) => {
	// 在这里处理购买逻辑，例如跳转到支付页面或执行其他操作
	// 假设我们有一个路由对象，可以使用 navigateTo 方法跳转到支付页面
	// 检查用户是否已登录
	if (index == 0) {
		navigateTo("/analysisTools/All", { replace: true });
	} else {
		const isLoggedIn = userStore.getToken || useCookie("token").value;
		if (!isLoggedIn) {
			userStore.setRedirectRoute("/front-pages/payment");
			return navigateTo("/login");
		} else {
			navigateTo({ name: "front-pages-payment" });
		}
	}
};

const getMemberList = () => {
	nextTick(() => {
		getLevelBenefit().then(res => {
			let data = res.data;
			memberList.value = data;
			memberList.value.forEach((item, index) => {
				addDynamicMessages(item, setLocaleMessage);
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
		});
	});
};
getMemberList();

const getTool = () => {
	nextTick(() => {
		getToolList().then(res => {
			let data = res.data;
			toolList.value = data;
			toolList.value.forEach((item, index) => {
				addDynamicMessages(item, setLocaleMessage);
			});
		});
	});
};
getTool();
</script>

<template>
	<div class="pricing-page">
		<Navbar />
		<!-- 👉 联系我们 -->
		<Contact />
		<VCard class="pricing-card">
			<!-- 👉 App Pricing components -->
			<VContainer>
				<div class="pricing-section">
					<div class="text-center">
						<h3 class="text-h1 pricing-title">{{ t("home.Membership Service") }}</h3>
					</div>
					<div class="pricing-plans d-flex flex-column gap-12">
						<VTabs v-model="userTab" class="custom-underlined-tabs">
							<VTab v-for="tab in tabs" :key="tab.title">
								<span>{{ t(`home.${tab.title}`) }}</span>
							</VTab>
						</VTabs>
						<Member_item :type="userTab"></Member_item>
					</div>
				</div>
			</VContainer>

			<!-- 👉 Free trial Banner -->
			<div class="page-pricing-free-trial-banner-bg">
				<VContainer>
					<div class="d-flex align-center flex-md-row flex-column position-relative">
						<div class="text-center text-md-start py-10 px-10 px-sm-0">
							<h4 class="text-h4 text-primary mb-2">{{ t("home.Member Profile") }}</h4>
							<p class="text-body-1">
								· {{ t("home.Introduction one") }}
								<br />
								· {{ t("home.Introduction two") }}
							</p>
						</div>
						<div class="free-trial-illustrator">
							<VImg :src="poseFs10" :width="230" />
						</div>
					</div>
				</VContainer>
			</div>

			<!-- 👉 Plans -->
			<VContainer>
				<div class="pricing-section">
					<div class="text-center pb-6">
						<h4 class="text-h2 mb-2">{{ t("home.Version comparison") }}</h4>
					</div>
					<!-- 👉 Features & Tables -->
					<VTable class="text-no-wrap border rounded pricing-table">
						<!-- 👉 Table head -->
						<thead>
							<tr>
								<th scope="col" class="py-4"></th>
								<th v-for="plan in memberList" :key="plan" scope="col" class="text-center py-4">
									<div class="position-relative" style="">
										<div class="vip_box">
											<img class="vip_icon" :src="plan.icon" />
											{{ t(`memLevels_${plan.id}`) }}
										</div>
										<VAvatar
											v-if="plan === 'PRO'"
											rounded="lg"
											color="primary"
											size="18"
											class="position-absolute ms-2"
											style="inset-block-start: -0.25rem"
										>
											<VIcon icon="ri-star-s-fill" size="14" />
										</VAvatar>
									</div>
									<div class="text-body-2">
										<!-- 月度的人民币 -->
										<div class="plan-price-text" v-if="locale == 'zh' && userTab == 0">
											{{ plan?.memberLevelMaintenance?.monthlyPriceCny }}&nbsp;&nbsp;{{
												userTab == 0 ? t("home.Per month") : t("home.Per year")
											}}
										</div>
										<!-- 月度的美元 -->
										<div class="plan-price-text" v-if="locale == 'en' && userTab == 0">
											{{ plan?.memberLevelMaintenance?.monthlyPriceUsd }}&nbsp;&nbsp;{{
												userTab == 0 ? t("home.Per month") : t("home.Per year")
											}}
										</div>
										<!-- 年度的人民币 -->
										<div class="plan-price-text" v-if="locale == 'zh' && userTab == 1">
											{{ plan?.memberLevelMaintenance?.yearPriceCny }}&nbsp;&nbsp;{{
												userTab == 0 ? t("home.Per month") : t("home.Per year")
											}}
										</div>
										<!-- 年度的美元 -->
										<div class="plan-price-text" v-if="locale == 'en' && userTab == 1">
											{{ plan?.memberLevelMaintenance?.yearPriceUsd }}
											&nbsp;&nbsp;
											{{ userTab == 0 ? t("home.Per month") : t("home.Per year") }}
										</div>
									</div>
								</th>
							</tr>
						</thead>
						<!-- 👉 Table Body -->
						<tbody>
							<tr v-for="(feature, index) in toolList" :key="index">
								<td class="text-high-emphasis" style="width: 14rem !important">
									{{ t(`toolName_${feature.id}`) }}
								</td>
								<td class="text-center">
									<!-- v-if="!feature.ordinary" -->
									<VIcon
										:style="{ color: !feature.member1 ? '#ff4b51' : '#56ca04' }"
										size="20"
										:icon="feature.member1 ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'"
									/>
									<!-- <VChip v-if="feature.ordinary" color="primary" size="small">Add-On-Available</VChip> -->
								</td>
								<td class="text-center">
									<!-- v-if="!feature.senior" -->
									<VIcon
										:style="{ color: !feature.member2 ? '#ff4b51' : '#56ca04' }"
										size="20"
										:icon="feature.member2 ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'"
									/>
								</td>
								<td class="text-center">
									<VIcon
										:style="{ color: !feature.member3 ? '#ff4b51' : '#56ca04' }"
										size="20"
										:icon="feature.member3 ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'"
									/>
								</td>
								<td class="text-center">
									<VIcon
										:style="{ color: !feature.member4 ? '#ff4b51' : '#56ca04' }"
										size="20"
										:icon="feature.member4 ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'"
									/>
								</td>
							</tr>
						</tbody>
						<!-- 👉 Table footer -->
						<tfoot>
							<tr>
								<td class="py-4" />
								<td class="text-center py-4" v-for="(plan, index) in memberList" :key="index">
									<VBtn
										:style="{ background: plan.bgcColor + ' !important', color: plan.textColor + ' !important' }"
										style="padding: 0 1.9rem !important"
										@click="handelBuy(plan, index)"
									>
										{{ index == 0 ? t("home.Try") : t("home.Buy") }}
									</VBtn>
								</td>
							</tr>
						</tfoot>
					</VTable>
				</div>
			</VContainer>
			<Footer />
		</VCard>
	</div>
</template>

<style lang="scss" scoped>
.pricing-section {
	padding-block: 5.25rem !important;
	padding-inline: 0 !important;
}

.page-pricing-free-trial-banner-bg {
	/* stylelint-disable-next-line color-function-notation */
	background-color: rgba(221, 225, 234, 0.5);
}

.pricing-card {
	background: url("../../assets/images/home/memberBg.png") no-repeat;
	padding-block-start: 4rem !important;
}

.pricing-plans {
	padding: 2rem;
	background: url("../../assets/images/home/member.png") no-repeat 100% 100%;
	border-radius: 1.5rem;
	@media (max-width: 959px) {
		background: none; // 小屏幕时不显示背景图片
	}
}

.pricing-table-title {
	color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
	font-size: 2rem;
	font-weight: 500;
	line-height: 2.625rem;
}
.vip_box {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1rem;
	.vip_icon {
		width: 2rem !important;
		height: 2rem !important;
	}
}
.custom-underlined-tabs {
	.v-tab {
		color: #818181 !important;
	}
	.v-tab--selected {
		color: white !important;
	}
}

@media screen and (min-width: 960px) {
	.free-trial-illustrator {
		position: absolute;
		inset-block-end: -1rem !important;
		inset-inline-end: 5%;
	}
}

@media screen and (max-width: 959px) {
	.free-trial-illustrator {
		position: relative;
		inset-block-end: -1rem !important;
	}
}

.text-high-emphasis {
	white-space: nowrap; /* 禁止文本换行 */
	overflow: hidden; /* 隐藏超出容器的内容 */
	text-overflow: ellipsis;
}

.pricing-table {
	--v-table-header-color: rgb(var(--v-theme-surface));

	&.v-table {
		.v-table__wrapper {
			table {
				thead {
					tr {
						th {
							border-block-end: 1px solid rgba(var(--v-theme-on-surface), var(--v-border-opacity)) !important;
						}
					}
				}

				tbody {
					tr:nth-child(even) {
						background: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
					}
				}
			}
		}
	}
}

.pricing-page {
	@media (min-width: 600px) and (max-width: 960px) {
		.v-container {
			padding-inline: 2rem !important;
		}
	}
}
</style>
