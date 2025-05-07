<script setup>
import { getLevelBenefit, getListConfiguration } from "@/api/front-pages";
const { t } = useI18n();
const { setLocaleMessage } = useI18n({
	useScope: "global",
});
const contact = ref({
	phone: [],
	email: [],
	wechat: [],
});
const appList = ref([]);

const menus = ref([]);

// 获取应用列表
const getAppList = () => {
	nextTick(() => {
		getListConfiguration({ moduleType: 5 }).then(res => {
			let data = res.data;
			appList.value = data;
			appList.value.forEach(item => {
				addDynamicMessages(item, setLocaleMessage);
			});
		});
	});
};
getAppList();

// 获取会员列表
const getMemberList = () => {
	nextTick(() => {
		getLevelBenefit().then(res => {
			let data = res.data;
			menus.value = data;
			menus.value.forEach(item => {
				addDynamicMessages(item, setLocaleMessage);
			});
		});
	});
};
getMemberList();

// 获取客服设置
const getContact = () => {
	nextTick(() => {
		getListConfiguration({ moduleType: 7 }).then(res => {
			let data = res.data;
			data.forEach(dataItem => {
				if (dataItem.serviceType == 1) {
					contact.value.phone.push(dataItem);
				} else if (dataItem.serviceType == 2) {
					contact.value.wechat.push(dataItem);
				} else if (dataItem.serviceType == 3) {
					contact.value.email.push(dataItem);
				}
			});
		});
	});
};
getContact();
const columnCount = computed(() => {
	const count = Math.ceil(appList.value.length / 6); // 每6个为一列
	return Math.min(count, 4); // 最多显示4列
});
const columnAPPCount = computed(() => {
	const count = Math.ceil(appList.value.length / 4); // 每6个为一列
	return Math.min(count, 2); // 最多显示4列
});

const hToApp = item => {
	navigateTo(`/analysisTool/${item.associationId}`);
};
</script>

<template>
	<div class="footer">
		<VSheet class="footer-top pt-15" theme="dark">
			<VContainer>
				<VRow>
					<VCol cols="12" md="5">
						<div class="footer-links">
							<div class="footer-heading mb-6">{{ t("home.Popular applications") }}</div>
							<div class="d-flex">
								<ul class="app-list" :style="{ columnCount: $vuetify.display.lgAndUp ? columnCount : columnAPPCount }">
									<li v-for="(item, index) in appList" :key="index" class="app-item">
										<NuxtLink class="footer-text text-no-wrap" @click="hToApp(item)">
											<div class="app-item-content">
												<div>{{ t(`toolName_${item.id}`) }}</div>
												<template v-if="item.isNew">
													<VChip color="primary" variant="elevated" size="small" class="ms-2"> New </VChip>
												</template>
											</div>
										</NuxtLink>
									</li>
								</ul>
							</div>
						</div>
					</VCol>
					<!-- 👉 Pages  -->
					<VCol md="2" sm="4" xs="6">
						<div class="footer-links">
							<div class="footer-heading mb-6">{{ t("home.Member Benefits") }}</div>
							<div class="d-flex">
								<ul class="app-list">
									<li v-for="(item, index) in menus" :key="index" class="app-item">
										<NuxtLink class="footer-text text-no-wrap" :to="{ name: 'front-pages-pricing' }">
											<div class="app-item-content">
												<div>{{ t(`memLevels_${item.id}`) }}</div>
												<template v-if="item.isNew">
													<VChip color="primary" variant="elevated" size="small" class="ms-2"> New </VChip>
												</template>
											</div>
										</NuxtLink>
									</li>
								</ul>
							</div>
						</div>
					</VCol>

					<!-- 👉 Products -->
					<VCol md="4" sm="4" xs="6">
						<div class="footer-links">
							<div class="footer-heading mb-6">{{ t("home.Customer Service") }}</div>
							<div class="d-flex">
								<ul class="app-list">
									<li class="app-item" v-for="(item, idx) in contact.phone" :key="item.id">
										<div class="footer-text text-no-wrap">
											<div class="d-flex app-item-content-noHover">
												<div style="width: 5rem">
													<span v-if="idx == 0">{{ t("home.Contact") }}：</span>
												</div>
												<div style="margin-right: 1rem">{{ item.service }}</div>
											</div>
										</div>
									</li>
									<li class="app-item" v-for="(item, idx) in contact.email" :key="item.id">
										<div class="footer-text text-no-wrap">
											<div class="d-flex app-item-content-noHover">
												<div style="width: 5rem">
													<span v-if="idx == 0">{{ t("home.Service email") }}：</span>
												</div>
												<div style="margin-right: 1rem">{{ item.service }}</div>
											</div>
										</div>
									</li>
									<li class="app-item">
										<div class="footer-text text-no-wrap">
											<div class="app-item-content-noHover">
												<div>{{ t("home.WeChat customer service") }}：</div>
											</div>
											<div class="app-item-content-noHover">
												<img
													v-for="item in contact.wechat"
													:key="item.id"
													style="width: 5rem; height: 5rem; margin-right: 1rem"
													:src="item.serviceFile[0].link"
													alt=""
												/>
											</div>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</VCol>
				</VRow>
			</VContainer>
		</VSheet>

		<div class="footer-line w-100">
			<VContainer>
				<div style="padding: 1rem"></div>
			</VContainer>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.footer-top {
	background: url("@images/front-pages/backgrounds/footer-bg.png") lightgray 50% / cover no-repeat;
}

.footer-heading {
	color: rgba(255, 255, 255, var(--v-high-emphasis-opacity));
	font-weight: 500;
}

.footer-text {
	color: rgba(255, 255, 255, var(--v-medium-emphasis-opacity));
}

.footer-title {
	color: rgba(255, 255, 255, var(--v-high-emphasis-opacity));
	font-size: 1.25rem;
	font-weight: 600;
	letter-spacing: 0.15px;
	line-height: 1.5rem;
}

.footer-line {
	background: #1b2323;
	color: rgba(255, 255, 255, var(--v-medium-emphasis-opacity));
	font-size: 13px;
	line-height: 20px;
}

.footer {
	color: rgba(255, 255, 255, 70%);
}

.footer-links {
	.footer-text:hover {
		color: #fff;
	}
}

.app-list {
	width: 100%;
	column-gap: 0.5rem; // 设置列间距
	list-style: none;
	padding: 0;
	margin: 0;
}

.app-item {
}

.app-item-content {
	// display: flex;
	// align-items: center;
	padding: 0.5rem;
	border-radius: 4px;
	transition: background-color 0.3s ease;
	cursor: pointer;
	&:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}
	div {
		width: 100%;
		white-space: nowrap; /* 防止文字换行 */
		overflow: hidden; /* 超出部分隐藏 */
		text-overflow: ellipsis; /* 超出部分显示省略号 */
	}
}
.app-item-content-noHover {
	display: flex;
	align-items: center;
	padding: 0.5rem;
	border-radius: 4px;
}
</style>

<style lang="scss">
.footer {
	@media (min-width: 600px) and (max-width: 960px) {
		.v-container {
			padding-inline: 2rem !important;
		}
	}
}

.footer-form {
	@media (min-width: 1280px) {
		max-inline-size: 400px;
	}
}
</style>
