<script setup>
import { getEmailCode, register } from "@/api/user/index.js";
import form_darkBg from "@/assets/images/login/form_darkBg.png";
import form_lightBg from "@/assets/images/login/form_lightBg.png";

import { validateEmail, validatePassword, validateUsername } from "@/@core/utils/validators";
import login_darkBg from "@/assets/images/login/login_darkBg.png";
import login_lightBg from "@/assets/images/login/login_linghtBg.png";
import PrivacyPolicy from "@/components/PrivacyPolicy.vue";
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
// 定义定时器
const countdownTologin = ref(5); // 初始值为5秒
const isPasswordVisible = ref(false);
const confirmisPasswordVisible = ref(false);
const errors = ref({
	email: undefined,
	code: undefined,
	username: undefined,
	password: undefined,
	confirmPassword: undefined,
});
const refVForm = ref(); // 邮箱表单
const loginForm = ref({
	email: "",
	code: "",
	username: "",
	password: "",
	confirmPassword: "",
	privacyPolicies: false,
});
const isDialogVisible = ref(false);
const codeLoading = ref(false); // 验证码加载状态
const isLoading = ref(false); // 注册按钮加载状态

watch(locale, () => {
	if (errors.value.email) {
		validateEmailForm();
	}
	if (errors.value.code) {
		validateCodeForm();
	}
	if (errors.value.password) {
		validatePasswordForm();
	}
	if (errors.value.username) {
		validateUsernameForm();
	}
	if (errors.value.confirmPassword) {
		validateConfirmPasswordForm();
	}
});
// 邮箱校验
const validateEmailForm = () => {
	if (loginForm.value.email.length != 0) {
		if (typeof validateEmail(loginForm.value.email) == "string") {
			errors.value.email = t(validateEmail(loginForm.value.email));
			return false;
		} else {
			errors.value.email = undefined;
			return true;
		}
	} else {
		errors.value.email = t("login.Please enter your email address");
		return false;
	}
};
// 验证码校验
const validateCodeForm = () => {
	if (loginForm.value.code.length != 0) {
		errors.value.code = undefined;
		return true;
	} else {
		errors.value.code = t("login.Please enter your verification code");
		return false;
	}
};
// 用户名校验
const validateUsernameForm = () => {
	if (loginForm.value.username.length != 0) {
		if (typeof validateUsername(loginForm.value.username) == "string") {
			errors.value.username = t(validateUsername(loginForm.value.username));
			return false;
		} else {
			errors.value.username = undefined;
			return true;
		}
	} else {
		errors.value.username = t("login.Please enter your username");
		return false;
	}
};
// 密码校验
const validatePasswordForm = () => {
	if (loginForm.value.password.length != 0) {
		if (typeof validatePassword(loginForm.value.password) == "string") {
			errors.value.password = t(validatePassword(loginForm.value.password));
			return false;
		} else {
			errors.value.password = undefined;
			return true;
		}
	} else {
		errors.value.password = t("login.Please enter your password");
		return false;
	}
};
// 确认密码校验
const validateConfirmPasswordForm = () => {
	if (loginForm.value.confirmPassword.length != 0) {
		if (loginForm.value.password !== loginForm.value.confirmPassword) {
			errors.value.confirmPassword = t("login.PasswordsDoNotMatch");
			return false;
		} else {
			errors.value.confirmPassword = undefined;
			return true;
		}
	} else {
		errors.value.confirmPassword = t("login.Please enter your password again");
		return false;
	}
};
// 获取验证码
const getVerificationCodeApi = () => {
	codeLoading.value = true;
	getEmailCode(loginForm.value.email, "REGISTER").then(res => {
		codeLoading.value = false;
		// 开始倒计时
		countdown.value = 60;
		const timer = setInterval(() => {
			countdown.value--;
			if (countdown.value <= 0) {
				clearInterval(timer);
			}
		}, 1000);
	});
};
const getVerificationCode = () => {
	if (validateEmailForm()) {
		if (countdown.value > 0) return;
		// 调用获取验证码接口
		getVerificationCodeApi();
	}
};

// 邮箱注册
const onSubmit = () => {
	validateEmailForm();
	validateCodeForm();
	validatePasswordForm();
	validateUsernameForm();
	validateConfirmPasswordForm();
	if (validateEmailForm() && validateCodeForm() && validatePasswordForm() && validateUsernameForm() && validateConfirmPasswordForm()) {
		isLoading.value = true;
		register(
			loginForm.value.email,
			loginForm.value.code,
			loginForm.value.username,
			loginForm.value.password,
			loginForm.value.confirmPassword,
		).then(res => {
			isLoading.value = false;
			isDialogVisible.value = true;
			startCountdown();
		});
	}
};

// 隐私政策&用户协议
const privacyPolicy = ref(null);
const handelPolicy = type => {
	privacyPolicy.value.init(type);
};

// 启动倒计时
const startCountdown = () => {
	const timer = setInterval(() => {
		if (countdownTologin.value > 0) {
			countdownTologin.value--;
		} else {
			clearInterval(timer); // 倒计时结束，清除定时器
			isDialogVisible.value = false;
			navigateTo("/login", { replace: true }); // 跳转到登录页面
		}
	}, 1000); // 每秒更新一次
};
// 组件挂载时启动倒计时
// startCountdown();

const toLogin = () => {
	isDialogVisible.value = false;
	navigateTo("/login", { replace: true }); // 跳转到登录页面
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
			<NavBarI18n class="z-I18n" :languages="themeConfig.app.i18n.langConfig" />
			<div flat class="mt-12 mt-sm-0 pa-4">
				<VCardText>
					<h4 class="text-h4 mb-1">{{ t("login.Welcome") }} 🚀</h4>
					<p class="mb-0">{{ t("login.Register your account") }} !</p>
				</VCardText>
				<VCardText :style="{ width: $vuetify.display.lgAndUp ? '28rem' : 'auto' }">
					<div>
						<VForm ref="refVForm" @submit.prevent="onSubmit">
							<VRow>
								<!-- email -->
								<VCol cols="12">
									<VTextField
										v-model="loginForm.email"
										:label="t('login.Email')"
										placeholder="johndoe@email.com"
										type="email"
										:error-messages="errors.email"
										@blur="validateEmailForm"
									></VTextField>
								</VCol>
								<!-- 验证码 -->
								<VCol cols="12">
									<VTextField
										v-model="loginForm.code"
										:label="t('login.VerificationCode')"
										placeholder=""
										:error-messages="errors.code"
										@blur="validateCodeForm"
									>
										<template v-slot:append>
											<VBtn
												block
												:loading="codeLoading"
												style="height: 100%"
												:disabled="countdown > 0 || loginForm.email.length == 0"
												@click.stop="getVerificationCode"
											>
												{{ countdown > 0 ? `${countdown}s ${t("login.Retry")}` : t("login.GetVerificationCode") }}
											</VBtn>
										</template>
									</VTextField>
								</VCol>
								<!-- 用户名 -->
								<VCol cols="12">
									<VTextField
										v-model="loginForm.username"
										:error-messages="errors.username"
										:label="t('login.Username')"
										placeholder="Johndoe"
										@blur="validateUsernameForm"
									/>
								</VCol>
								<!-- 密码 -->
								<VCol cols="12">
									<VTextField
										v-model="loginForm.password"
										:label="t('login.Password')"
										placeholder="············"
										:type="isPasswordVisible ? 'text' : 'password'"
										:append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
										@click:append-inner="isPasswordVisible = !isPasswordVisible"
										:error-messages="errors.password"
										@blur="validatePasswordForm"
									/>
								</VCol>
								<VCol cols="12">
									<VTextField
										v-model="loginForm.confirmPassword"
										:label="t('login.confirmPassword')"
										placeholder="············"
										:type="confirmisPasswordVisible ? 'text' : 'password'"
										:append-inner-icon="confirmisPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
										@click:append-inner="confirmisPasswordVisible = !confirmisPasswordVisible"
										:error-messages="errors.confirmPassword"
										@blur="validateConfirmPasswordForm"
									/>
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
									<VBtn
										block
										type="submit"
										:isLoading="isLoading"
										:disabled="loginForm.privacyPolicies ? false : true"
										:class="{ 'v-btn--disabled': loginForm.privacyPolicies ? false : true }"
									>
										{{ t("login.Sign up") }}
									</VBtn>
								</VCol>
								<!-- create account -->
								<VCol cols="12">
									<div class="text-center text-base">
										<span class="d-inline-block">{{ t("login.Already have an account") }}?</span>
										<NuxtLink class="text-primary d-inline-block" :to="{ name: 'login' }">{{
											t("login.Sign in instead")
										}}</NuxtLink>
									</div>
								</VCol>
							</VRow>
						</VForm>
					</div>
				</VCardText>
			</div>
		</VCol>
	</VRow>
	<PrivacyPolicy ref="privacyPolicy"></PrivacyPolicy>
	<VDialog
		:persistent="true"
		:no-close-on-esc="true"
		v-model="isDialogVisible"
		:width="$vuetify.display.smAndDown ? 'auto' : 650"
		@update:modelValue="handleDialogChange"
	>
		<VCard>
			<VCardText class="mt-5">
				<div class="success_box">
					<img class="icon_success" src="../assets/images/login/success.png" alt="" />
					<div class="text">{{ t("login.You have successfully registered") }}</div>
					<div class="account_box">
						<p class="userName">{{ t("login.Username") }}：{{ loginForm.username }}</p>
						<p style="width: 1.5rem"></p>
						<p class="email">{{ t("login.Email") }}：{{ loginForm.email }}</p>
					</div>
				</div>
			</VCardText>
			<VCardText class="btn_box">
				<VBtn block :loading="codeLoading" @click.stop="toLogin"> {{ t("login.Return to login") }} </VBtn>
			</VCardText>
			<VCardText class="text-center">
				<span class="time">{{ countdownTologin }}</span
				>{{ t("login.Automatically jump in seconds") }}
			</VCardText>
		</VCard>
	</VDialog>
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

.success_box {
	width: 100%;
	// height: 10rem;
	border-bottom: 1px solid rgba(229, 229, 231, 0.7);
	text-align: center;
	font-size: 2rem;
	font-weight: 700;
	padding: 1rem 0;
	box-sizing: border-box;
	.icon_success {
		width: 5rem;
		height: 5rem;
	}
	.text {
		height: 6rem;
		line-height: 6rem;
	}
	.account_box {
		display: flex;
		font-weight: 400;
		font-size: 1rem;
		align-items: center;
		justify-content: center;
		margin: auto;
	}
}
.btn_box {
	padding: 0 12rem 1.8rem 12rem !important;
}
.time {
	color: rgb(var(--v-theme-primary)) !important;
	font-size: 1.2rem;
	margin-right: 0.3rem;
}
</style>
