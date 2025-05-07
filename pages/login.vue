<script setup>
import { getPhoneCode, getToken } from "@/api/user/index.js";
import form_darkBg from "@/assets/images/login/form_darkBg.png";
import form_lightBg from "@/assets/images/login/form_lightBg.png";

import { validatePhoneNumber } from "@/@core/utils/validators";
import login_darkBg from "@/assets/images/login/login_darkBg.png";
import login_lightBg from "@/assets/images/login/login_linghtBg.png";
import PrivacyPolicy from "@/components/PrivacyPolicy.vue";
import SlideToUnlock from "@/components/SlideToUnlock.vue";
import NavBarI18n from "@core/components/I18n.vue";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import { useI18n } from "vue-i18n"; // 假设使用 vue-i18n
import { useTheme } from "vuetify";
import { VForm } from "vuetify/components/VForm";
definePageMeta({
	layout: "blank",
	unauthenticatedOnly: true,
});

const theme = useTheme();
const isDark = ref(theme.name);
const { $phonePrefix, $timeZonePrefixEn, $timeZonePrefixZh } = useNuxtApp();
const { locale } = useI18n({ useScope: "global" });
// 定义背景图片的计算属性
const form_BgUrl = computed(() => {
	if (isDark.value === "dark") return form_darkBg;
	else return form_lightBg;
});
// 定义背景图片的计算属性
const login_BgUrl = computed(() => {
	if (isDark.value === "dark") return login_darkBg;
	else return login_lightBg;
});
const { t } = useI18n();
// 获取 store 实例
const userStore = useUserStore();
// 定义倒计时变量
const countdown = ref(0);
const isPasswordVisible = ref(false);
const errors = ref({
	email: undefined,
	password: undefined,
	phone: undefined,
});
const refVForm = ref(); // 邮箱表单
const refVPhoneForm = ref(); // 手机号表单
const loginForm = ref({
	phonePrefix: "+86",
	timeZone: "",
	//租户ID
	username: userStore.getSavedUsername,
	password: decrypt(userStore.getSavedPassword),
	phone: "",
	code: "",
	//账号类型
	grant_type: "password",
	loginType: 1,
	//验证码的值
	rememberMe: userStore.getRememberMe,
	privacyPolicies: false,
});

const phoneCodeLoading = ref(false);
const loginEmailLoading = ref(false);
const loginPhoneLoading = ref(false);

const tabs = ref([
	{ icon: "mdi-account", title: "Email Login" },
	{ icon: "mdi-lock", title: "Mobile Login" },
]);
const userTab = ref("Email Login");
const isSlideVerified = ref(false); // 用于记录滑动验证是否通过
const isValid = ref(false); // 用于记录表单是否有效
watch(userTab, () => {
	isSlideVerified.value = false; // 切换 tab 时重置验证状态
});

const handleSlideVerify = result => {
	if (result.state) {
		isSlideVerified.value = true; // 验证通过时设置为 true
	} else {
		isSlideVerified.value = false; // 验证失败时设置为 false
	}
};

// 时区处理

watch(locale, () => {
	timgZone();
	if (errors.value.phone) {
		validatePhoneForm();
	}
});

const timezoneList = computed(() => {
	if (locale.value == "zh") {
		return $timeZonePrefixZh;
	} else {
		return $timeZonePrefixEn;
	}
});
const ianaTimezone = ref(""); // 存储 IANA 时区
const matchedTimezone = ref(""); // 存储匹配的时区描述

// 3. 计算UTC偏移量显示格式
const timezoneOffset = computed(() => {
	if (!ianaTimezone.value) return "";
	try {
		// 创建一个日期对象
		const date = new Date();
		// 获取时区偏移量(分钟)
		const offset = -date.getTimezoneOffset();
		// 转换为 +/-HH:MM 格式
		const sign = offset >= 0 ? "+" : "-";
		const absOffset = Math.abs(offset);
		const hours = Math.floor(absOffset / 60)
			.toString()
			.padStart(2, "0");
		const minutes = (absOffset % 60).toString().padStart(2, "0");
		return `UTC${sign}${hours}:${minutes}`;
	} catch (e) {
		return "无法确定偏移量";
	}
});
// 2. 匹配时区方法
const matchTimezone = () => {
	if (!ianaTimezone.value) {
		matchedTimezone.value = "";
		return;
	}
	try {
		// 获取偏移量字符串（如 "+08:00"）
		const offset = timezoneOffset.value.replace("UTC", "");
		// 处理 UTC±00:00 的特殊情况
		let searchString = "";
		if (locale.value == "zh") {
			searchString = offset === "+00:00" ? "（UTC±00:00）" : `（UTC${offset}）`;
		} else {
			searchString = offset === "+00:00" ? "(UTC±00:00)" : `(UTC${offset})`;
		}
		// 在列表中查找匹配项
		const matched = timezoneList.value.find(item => {
			if (item.includes(searchString)) {
				return item;
			}
		});
		matchedTimezone.value = matched || "未找到匹配的时区描述";
		loginForm.value.timeZone = matchedTimezone.value;
		console.log(loginForm.value.timeZone);
	} catch (e) {
		matchedTimezone.value = "时区匹配失败";
	}
};

// 1. 获取当前时区获取存储的时区信息
const getTimezone = () => {
	if (userStore.getTimeZone) {
		ianaTimezone.value = userStore.getTimeZone;
		loginForm.value.timeZone = ianaTimezone.value;
	} else {
		ianaTimezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
		matchTimezone();
	}
};
getTimezone();

// const extractUTCOffset = timeZoneStr => {
// 	const regex = /（UTC[+-]\d{2}:\d{2}）|\(UTC[+-]\d{2}:\d{2}\)/;
// 	const match = timeZoneStr.match(regex);
// 	if (match) {
// 		// 去除括号
// 		return match[0].replace(/[（）()]/g, "");
// 	}
// 	return null;
// };
// 检测语言切换时区语言
const timgZone = () => {
	// 提取当前时区的 UTC 偏移量
	const currentOffset = extractUTCOffset(loginForm.value.timeZone);
	if (currentOffset) {
		// 生成新语言下的搜索字符串
		let newSearchString = "";
		if (locale.value === "zh") {
			newSearchString = currentOffset === "UTC+00:00" ? "（UTC±00:00）" : `（${currentOffset}）`;
		} else {
			newSearchString = currentOffset === "UTC+00:00" ? "(UTC±00:00)" : `(${currentOffset})`;
		}
		// 在新语言的时区列表中查找匹配项
		const newMatched = timezoneList.value.find(item => item.includes(newSearchString));
		if (newMatched) {
			loginForm.value.timeZone = newMatched;
		}
	}
};

timgZone();

// 获取验证码
const getVerificationCodeApi = () => {
	phoneCodeLoading.value = true;
	const phone = `${loginForm.value.phonePrefix} ${loginForm.value.phone}`;
	getPhoneCode(phone, "LOGIN")
		.then(res => {
			// 开始倒计时
			phoneCodeLoading.value = false;
			countdown.value = 60;
			const timer = setInterval(() => {
				countdown.value--;
				if (countdown.value <= 0) {
					clearInterval(timer);
				}
			}, 1000);
		})
		.catch(error => {
			phoneCodeLoading.value = false;
		});
};

// 手机号校验
const validatePhoneForm = () => {
	if (loginForm.value.phone.length != 0) {
		if (typeof validatePhoneNumber(loginForm.value.phonePrefix, loginForm.value.phone) == "string") {
			errors.value.phone = t(validatePhoneNumber(loginForm.value.phonePrefix, loginForm.value.phone));
			return false;
		} else {
			errors.value.phone = undefined;
			return true;
		}
	} else {
		errors.value.phone = t("login.Please enter your phone number");
		return false;
	}
};
const getVerificationCode = () => {
	validatePhoneForm();
	if (validatePhoneForm()) {
		if (countdown.value > 0) return;
		// 调用获取验证码接口
		getVerificationCodeApi();
	}
};

// 邮箱登录
const onSubmit = () => {
	loginEmailLoading.value = true;
	getToken(loginForm.value.username, encrypt(loginForm.value.password), "", "", extractUTCOffset(loginForm.value.timeZone))
		.then(res => {
			if (loginForm.value.rememberMe) {
				userStore.saveLoginCredentials(loginForm.value.username, encrypt(loginForm.value.password));
				userStore.setRememberMe(loginForm.value.rememberMe);
			} else {
				userStore.clearLoginCredentials();
			}
			loginEmailLoading.value = false;
			login(res);
		})
		.catch(error => {
			loginEmailLoading.value = false;
		});
};

const onPhoneSubmit = () => {
	loginPhoneLoading.value = true;
	const phone = `${loginForm.value.phonePrefix} ${loginForm.value.phone}`;
	getToken("", "", phone, loginForm.value.code, extractUTCOffset(loginForm.value.timeZone))
		.then(res => {
			loginPhoneLoading.value = false;
			login(res);
		})
		.catch(error => {
			loginPhoneLoading.value = false;
		});
};
const login = res => {
	userStore.setUserInfo(res);
	userStore.setTimeZone(loginForm.value.timeZone);
	const redirectRoute = userStore.redirectRoute || "/analysisTools/All";
	navigateTo(redirectRoute ? redirectRoute : "/analysisTools/All", { replace: true });
	setTimeout(() => {
		userStore.clearRedirectRoute();
	}, 1000);
};

// 隐私政策&用户协议
const privacyPolicy = ref(null);

const handelPolicy = type => {
	console.log(type, privacyPolicy.value);
	privacyPolicy.value.init(type);
};
</script>
<template>
	<NuxtLink to="/">
		<div class="auth-logo d-flex align-center gap-x-3">
			<VNodeRenderer :nodes="themeConfig.app.logo" />
			<VNodeRenderer :nodes="themeConfig.app.titleLogo" />
		</div>
	</NuxtLink>

	<VRow no-gutters class="auth-wrapper" :style="{ backgroundImage: `url(${login_BgUrl})` }">
		<VCol md="8" class="d-none d-md-flex position-relative"></VCol>
		<VCol cols="12" md="4" class="auth-card-v2 d-flex align-center justify-center" :style="{ backgroundImage: `url(${form_BgUrl})` }">
			<!-- 语言切换 -->
			<div class="d-I18n">
				<NavBarI18n :languages="themeConfig.app.i18n.langConfig" />
				<VSelect
					style="margin-left: 2rem"
					v-model="loginForm.timeZone"
					label=""
					placeholder=""
					:items="timezoneList"
					:class="['no-border-select']"
				/>
			</div>
			<div flat class="mt-12 mt-sm-0 pa-4">
				<VCardText>
					<h4 class="text-h4 mb-1">
						{{ t("login.Welcome") }}
						👋🏻
					</h4>
					<p class="mb-0">
						<!-- Please sign-in to your account and start the adventure -->
					</p>
				</VCardText>
				<VCardText>
					<VTabs v-model="userTab" fixed-tabs class="custom-underlined-tabs">
						<VTab v-for="tab in tabs" :key="tab.title">
							<span>{{ t(`login.${tab.title}`) }}</span>
						</VTab>
					</VTabs>
				</VCardText>
				<VCardText :style="{ width: $vuetify.display.lgAndUp ? '28rem' : 'auto' }">
					<!-- 邮箱登录 -->
					<div v-if="userTab == 0">
						<VForm ref="refVForm" @submit.prevent="onSubmit">
							<VRow>
								<!-- email -->
								<VCol cols="12">
									<VTextField
										v-model="loginForm.username"
										:label="t('login.Email')"
										placeholder="johndoe@email.com"
										type="email"
										:error-messages="errors.email"
									></VTextField>
								</VCol>
								<!-- password -->
								<VCol cols="12">
									<VTextField
										v-model="loginForm.password"
										:label="t('login.Password')"
										placeholder="············"
										:type="isPasswordVisible ? 'text' : 'password'"
										:error-messages="errors.password"
										:append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
										@click:append-inner="isPasswordVisible = !isPasswordVisible"
									></VTextField>

									<div class="d-flex align-center flex-wrap justify-space-between my-3 gap-2">
										<VCheckbox v-model="loginForm.rememberMe" :label="t('login.Rememberme')"></VCheckbox>
										<NuxtLink class="text-primary" :to="{ name: 'forgot-password' }">
											{{ t("login.ForgotPassword") }}
											?
										</NuxtLink>
									</div>
									<SlideToUnlock @change="handleSlideVerify"></SlideToUnlock>
									<VBtn
										block
										type="submit"
										:loading="loginEmailLoading"
										:disabled="isSlideVerified && loginForm.username.length != 0 && loginForm.password.length ? false : true"
										:class="{ 'v-btn--disabled': !isSlideVerified }"
									>
										{{ t("login.Login") }}
									</VBtn>
								</VCol>
								<!-- create account -->
								<VCol cols="12" class="text-center text-base">
									<span>
										{{ t("login.Newonourplatform") }}
										?
									</span>
									<NuxtLink class="text-primary d-inline-block" :to="{ name: 'register' }">
										{{ t("login.Createanaccount") }}
									</NuxtLink>
								</VCol>
							</VRow>
						</VForm>
					</div>
					<!-- 手机号登录 -->
					<div v-if="userTab == 1">
						<VForm ref="refVPhoneForm" @submit.prevent="onPhoneSubmit">
							<VRow>
								<!-- phone -->
								<VCol cols="12">
									<VTextField
										v-model="loginForm.phone"
										:label="t('login.phone')"
										placeholder=""
										:error-messages="errors.phone"
										@blur="validatePhoneForm"
									>
										<template v-slot:prepend>
											<v-select v-model="loginForm.phonePrefix" :items="$phonePrefix"></v-select>
										</template>
									</VTextField>
								</VCol>
								<!-- 验证码 -->
								<VCol cols="12">
									<VTextField v-model="loginForm.code" :label="t('login.VerificationCode')" placeholder="">
										<template v-slot:append>
											<VBtn
												block
												:loading="phoneCodeLoading"
												style="height: 100%"
												:disabled="countdown > 0 || loginForm.phone.length == 0"
												@click="getVerificationCode"
											>
												{{ countdown > 0 ? `${countdown}s ${t("login.Retry")}` : t("login.GetVerificationCode") }}
											</VBtn>
										</template>
									</VTextField>
									<!-- <div class="validate">
										<span v-if="isValid">{{ t("login.The current phone number format is incorrect") }}</span>
									</div> -->
									<div class="d-flex align-center my-3 gap-2">
										<div style="width: 7%"><VCheckbox v-model="loginForm.privacyPolicies"> </VCheckbox></div>
										<div style="display: flex; flex-wrap: wrap; width: 93%" @click.stop>
											{{ t("login.CheckAgree") }}
											<NuxtLink class="text-primary" style="cursor: pointer" @click.stop="handelPolicy(4)">
												{{ t("login.UserAgreement") }}
											</NuxtLink>
											{{ t("login.And") }}
											<NuxtLink class="text-primary" style="cursor: pointer" @click.stop="handelPolicy(5)">
												{{ t("login.PrivacyPolicy") }}
											</NuxtLink>
										</div>
									</div>
									<SlideToUnlock @change="handleSlideVerify"></SlideToUnlock>
									<VBtn
										block
										type="submit"
										:loading="loginPhoneLoading"
										:disabled="
											isSlideVerified && loginForm.privacyPolicies && loginForm.phone.length && loginForm.code.length != 0
												? false
												: true
										"
										:class="{ 'v-btn--disabled': isSlideVerified && loginForm.privacyPolicies ? false : true }"
									>
										{{ t("login.Login") }}
									</VBtn>
								</VCol>
								<!-- create account -->
								<VCol cols="12" class="text-center text-base">
									<span>
										{{ t("login.Newonourplatform") }}
										?
									</span>
									<NuxtLink class="text-primary d-inline-block" :to="{ name: 'register' }">
										{{ t("login.Createanaccount") }}
									</NuxtLink>
								</VCol>
							</VRow>
						</VForm>
					</div>
				</VCardText>
			</div>
		</VCol>
	</VRow>
	<PrivacyPolicy ref="privacyPolicy"></PrivacyPolicy>
</template>

<style lang="scss" scoped>
@use "@core/scss/template/pages/page-auth.scss";
.validate {
	color: #ff4c51;
	margin-top: 0.6rem;
	font-size: 0.85rem;
	padding-left: 1rem;
	box-sizing: border-box;
	height: 1.2rem;
}
.no-border-select {
	:deep(.v-field__outline) {
		border: none !important;
	}
}
.auth-logo {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

@media (max-width: 600px) {
	.auth-logo {
		position: absolute;
		top: 12% !important;
		left: 50% !important;
		transform: translateX(-50%) !important;
	}
	.d-I18n {
		width: 100% !important;
		padding: 0.2rem 1rem 0.2rem 1.5rem !important;
		:deep(.v-field__outline) {
			border: 1px solid transparent !important;
		}
	}
}
</style>
