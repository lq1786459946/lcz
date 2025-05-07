<script setup>
import { getEmailCode, getPhoneCode, resetPassword } from "@/api/user/index.js";
import form_darkBg from "@/assets/images/login/form_darkBg.png";
import form_lightBg from "@/assets/images/login/form_lightBg.png";

import { validateEmail, validatePassword } from "@/@core/utils/validators";
import login_darkBg from "@/assets/images/login/login_darkBg.png";
import login_lightBg from "@/assets/images/login/login_linghtBg.png";
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
const { $phonePrefix } = useNuxtApp();

// 获取 store 实例
const userStore = useUserStore();
// 定义倒计时变量
const countdown = ref(0);
const phoneCountdown = ref(0);
// 邮箱的密码是否可见
const isEmailPasswordVisible = ref(false);
// 手机的密码是否可见;
const isPhonePasswordVisible = ref(false);
// 邮箱的新密码是否可见
const isEmailNewPasswordVisible = ref(false);
// 手机的新密码是否可见;
const isPhoneNewPasswordVisible = ref(false);

const emailErrors = ref({
	email: undefined,
	code: undefined,
	username: undefined,
	password: undefined,
	newPassword: undefined,
});

const phoneErrors = ref({
	phone: undefined,
	code: undefined,
	username: undefined,
	password: undefined,
	newPassword: undefined,
});
const refVForm = ref(); // 邮箱表单
const emailForm = ref({
	email: "",
	code: "",
	password: "",
	newPassword: "",
});

const phoneForm = ref({
	phone: "",
	code: "",
	password: "",
	newPassword: "",
	phonePrefix: "+86",
});
const emailCodeLoading = ref(false);
const emailLoading = ref(false);

const phoneCodeLoading = ref(false);
const phoneLoading = ref(false);

const tabs = ref([{ title: "Email Retrieval" }, { title: "Mobile Retrieval" }]);
const userTab = ref("Email retrieval");
// 时区处理
watch(locale, () => {
	if (userTab.value == 0) {
		if (emailErrors.value.email) {
			validateEmailForm();
		}
		if (emailErrors.value.code) {
			validateCodeForm();
		}
		if (emailErrors.value.password) {
			validatePasswordForm();
		}
		if (emailErrors.value.newPassword) {
			validatenewPasswordForm();
		}
	} else {
		if (phoneErrors.value.phone) {
			validatePhoneForm();
		}
		if (phoneErrors.value.code) {
			validatePhoneCodeForm();
		}
		if (phoneErrors.value.password) {
			validatePhonePasswordForm();
		}
		if (phoneErrors.value.newPassword) {
			validatePhonenewPasswordForm();
		}
	}
});
// 邮箱校验
const validateEmailForm = () => {
	if (emailForm.value.email.length != 0) {
		if (typeof validateEmail(emailForm.value.email) == "string") {
			emailErrors.value.email = t(validateEmail(emailForm.value.email));
			return false;
		} else {
			emailErrors.value.email = undefined;
			return true;
		}
	} else {
		emailErrors.value.email = t("login.Please enter your email address");
		return false;
	}
};
// 验证码校验
const validateCodeForm = () => {
	if (emailForm.value.code.length != 0) {
		emailErrors.value.code = undefined;
		return true;
	} else {
		emailErrors.value.code = t("login.Please enter your verification code");
		return false;
	}
};
// 密码校验
const validatePasswordForm = () => {
	if (emailForm.value.password.length != 0) {
		if (typeof validatePassword(emailForm.value.password) == "string") {
			emailErrors.value.password = t(validatePassword(emailForm.value.password));
			return false;
		} else {
			emailErrors.value.password = undefined;
			return true;
		}
	} else {
		emailErrors.value.password = t("login.Please enter your password");
		return false;
	}
};
// 确认密码校验
const validatenewPasswordForm = () => {
	if (emailForm.value.newPassword.length != 0) {
		if (emailForm.value.password !== emailForm.value.newPassword) {
			emailErrors.value.newPassword = t("login.PasswordsDoNotMatch");
			return false;
		} else {
			emailErrors.value.newPassword = undefined;
			return true;
		}
	} else {
		emailErrors.value.newPassword = t("login.Please enter your password again");
		return false;
	}
};

// 手机号校验
const validatePhoneForm = () => {
	if (phoneForm.value.phone.length != 0) {
		if (typeof validatePhoneNumber(phoneForm.value.phonePrefix, phoneForm.value.phone) == "string") {
			phoneErrors.value.phone = t(validatePhoneNumber(phoneForm.value.phonePrefix, phoneForm.value.phone));
			return false;
		} else {
			phoneErrors.value.phone = undefined;
			return true;
		}
	} else {
		phoneErrors.value.phone = t("login.Please enter your phone number");
		return false;
	}
};

// 手机验证码校验
const validatePhoneCodeForm = () => {
	if (phoneForm.value.code.length != 0) {
		phoneErrors.value.code = undefined;
		return true;
	} else {
		phoneErrors.value.code = t("login.Please enter your verification code");
		return false;
	}
};

// 手机密码校验
const validatePhonePasswordForm = () => {
	if (phoneForm.value.password.length != 0) {
		if (typeof validatePassword(phoneForm.value.password) == "string") {
			phoneErrors.value.password = t(validatePassword(phoneForm.value.password));
			return false;
		} else {
			phoneErrors.value.password = undefined;
			return true;
		}
	} else {
		phoneErrors.value.password = t("login.Please enter your password");
		return false;
	}
};
// 手机新密码校验
const validatePhonenewPasswordForm = () => {
	if (phoneForm.value.newPassword.length != 0) {
		if (phoneForm.value.password !== phoneForm.value.newPassword) {
			phoneErrors.value.newPassword = t("login.PasswordsDoNotMatch");
			return false;
		} else {
			phoneErrors.value.newPassword = undefined;
			return true;
		}
	} else {
		phoneErrors.value.newPassword = t("login.Please enter your password again");
		return false;
	}
};

// 获取邮箱验证码
const getVerificationCodeApi = () => {
	emailCodeLoading.value = true;
	getEmailCode(emailForm.value.email, "FORGOT_PWD")
		.then(res => {
			// 开始倒计时
			emailCodeLoading.value = false;
			countdown.value = 60;
			const timer = setInterval(() => {
				countdown.value--;
				if (countdown.value <= 0) {
					clearInterval(timer);
				}
			}, 1000);
		})
		.catch(err => {
			emailCodeLoading.value = false;
		});
};
const getVerificationCode = () => {
	if (validateEmailForm()) {
		if (countdown.value > 0) return;
		// 调用获取验证码接口
		getVerificationCodeApi();
	}
};

// 获取手机号验证码
const getVerificationPhoneCodeApi = () => {
	phoneCodeLoading.value = true;
	const phone = `${phoneForm.value.phonePrefix} ${phoneForm.value.phone}`;
	getPhoneCode(phone, "FORGOT_PWD")
		.then(res => {
			// 开始倒计时
			phoneCodeLoading.value = false;
			phoneCountdown.value = 60;
			const timer = setInterval(() => {
				phoneCountdown.value--;
				if (phoneCountdown.value <= 0) {
					clearInterval(timer);
				}
			}, 1000);
		})
		.catch(err => {
			phoneCodeLoading.value = false;
		});
};
const getVerificationPhoneCode = () => {
	if (validatePhoneForm()) {
		if (phoneCountdown.value > 0) return;
		// 调用获取验证码接口
		getVerificationPhoneCodeApi();
	}
};

// 邮箱找回
const onEmailSubmit = () => {
	validateEmailForm();
	validateCodeForm();
	validatePasswordForm();
	validatenewPasswordForm();
	if (validateEmailForm() && validateCodeForm() && validatePasswordForm() && validatenewPasswordForm()) {
		emailLoading.value = true;
		resetPassword(emailForm.value.email, "", emailForm.value.code, emailForm.value.password, emailForm.value.newPassword)
			.then(res => {
				alert("primary", t("login.updatePassword"));
				emailLoading.value = false;
				setTimeout(() => {
					navigateTo("/login", { replace: true });
				}, 2000);
			})
			.catch(err => {
				emailLoading.value = false;
			});
	}
};

const onPhoneSubmit = () => {
	validatePhoneForm();
	validatePhoneCodeForm();
	validatePhonePasswordForm();
	validatePhonenewPasswordForm();
	if (validatePhoneForm() && validatePhoneCodeForm() && validatePhonePasswordForm() && validatePhonenewPasswordForm()) {
		phoneLoading.value = true;
		const phone = `${phoneForm.value.phonePrefix} ${phoneForm.value.phone}`;
		resetPassword("", phone, phoneForm.value.code, phoneForm.value.password, phoneForm.value.newPassword)
			.then(res => {
				alert("primary", t("login.updatePassword"));
				phoneLoading.value = false;
				setTimeout(() => {
					navigateTo("/login", { replace: true });
				}, 2000);
			})
			.catch(err => {
				phoneLoading.value = false;
			});
	}
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
					<h4 class="text-h4 mb-1">{{ t("login.Forgot Password") }} 🔒</h4>
				</VCardText>
				<VCardText>
					<VTabs v-model="userTab" fixed-tabs class="custom-underlined-tabs">
						<VTab v-for="tab in tabs" :key="tab.title">
							<span>{{ t(`login.${tab.title}`) }}</span>
						</VTab>
					</VTabs>
				</VCardText>
				<VCardText :style="{ width: $vuetify.display.lgAndUp ? '28rem' : 'auto' }">
					<div v-if="userTab == 0">
						<VForm ref="refVForm" @submit.prevent="onEmailSubmit">
							<VRow>
								<!-- email -->
								<VCol cols="12">
									<VTextField
										v-model="emailForm.email"
										:label="t('login.Email')"
										placeholder="johndoe@email.com"
										type="email"
										:error-messages="emailErrors.email"
										@blur="validateEmailForm"
									></VTextField>
								</VCol>
								<!-- 验证码 -->
								<VCol cols="12">
									<VTextField
										v-model="emailForm.code"
										:label="t('login.VerificationCode')"
										placeholder=""
										:error-messages="emailErrors.code"
										@blur="validateCodeForm"
									>
										<template v-slot:append>
											<VBtn
												block
												:loading="emailCodeLoading"
												style="height: 100%"
												:disabled="countdown > 0 || emailForm.email.length == 0"
												@click.stop="getVerificationCode"
											>
												{{ countdown > 0 ? `${countdown}s ${t("login.Retry")}` : t("login.GetVerificationCode") }}
											</VBtn>
										</template>
									</VTextField>
								</VCol>
								<!-- 密码 -->
								<VCol cols="12">
									<VTextField
										v-model="emailForm.password"
										:label="t('login.Password')"
										placeholder="············"
										:type="isEmailPasswordVisible ? 'text' : 'password'"
										:append-inner-icon="isEmailPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
										@click:append-inner="isEmailPasswordVisible = !isEmailPasswordVisible"
										:error-messages="emailErrors.password"
										@blur="validatePasswordForm"
									/>
								</VCol>
								<VCol cols="12">
									<VTextField
										v-model="emailForm.newPassword"
										:label="t('login.newPassword')"
										placeholder="············"
										:type="isPhonePasswordVisible ? 'text' : 'password'"
										:append-inner-icon="isPhonePasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
										@click:append-inner="isPhonePasswordVisible = !isPhonePasswordVisible"
										:error-messages="emailErrors.newPassword"
										@blur="validatenewPasswordForm"
									/>
									<div class="d-flex align-center my-3 gap-2"></div>

									<VBtn block type="submit" :loading="emailLoading">
										{{ t("login.confirm") }}
									</VBtn>
								</VCol>
							</VRow>
						</VForm>
					</div>
					<div v-if="userTab == 1">
						<VForm ref="refVForm" @submit.prevent="onPhoneSubmit">
							<VRow>
								<!-- email -->
								<VCol cols="12">
									<VTextField
										v-model="phoneForm.phone"
										:label="t('login.phone')"
										placeholder=""
										:error-messages="phoneErrors.phone"
										@blur="validatePhoneForm"
									>
										<template v-slot:prepend>
											<v-select v-model="phoneForm.phonePrefix" :items="$phonePrefix"></v-select>
										</template>
									</VTextField>
								</VCol>
								<!-- 验证码 -->
								<VCol cols="12">
									<VTextField
										v-model="phoneForm.code"
										:label="t('login.VerificationCode')"
										placeholder=""
										:error-messages="phoneErrors.code"
										@blur="validatePhoneCodeForm"
									>
										<template v-slot:append>
											<VBtn
												block
												:loading="phoneCodeLoading"
												style="height: 100%"
												:disabled="phoneCountdown > 0 || phoneForm.phone.length == 0"
												@click.stop="getVerificationPhoneCode"
											>
												{{ phoneCountdown > 0 ? `${phoneCountdown}s ${t("login.Retry")}` : t("login.GetVerificationCode") }}
											</VBtn>
										</template>
									</VTextField>
								</VCol>
								<!-- 密码 -->
								<VCol cols="12">
									<VTextField
										v-model="phoneForm.password"
										:label="t('login.Password')"
										placeholder="············"
										:type="isEmailNewPasswordVisible ? 'text' : 'password'"
										:append-inner-icon="isEmailNewPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
										@click:append-inner="isEmailNewPasswordVisible = !isEmailNewPasswordVisible"
										:error-messages="phoneErrors.password"
										@blur="validatePhonePasswordForm"
									/>
								</VCol>
								<VCol cols="12">
									<VTextField
										v-model="phoneForm.newPassword"
										:label="t('login.newPassword')"
										placeholder="············"
										:type="isPhoneNewPasswordVisible ? 'text' : 'password'"
										:append-inner-icon="isPhoneNewPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
										@click:append-inner="isPhoneNewPasswordVisible = !isPhoneNewPasswordVisible"
										:error-messages="phoneErrors.newPassword"
										@blur="validatePhonenewPasswordForm"
									/>
									<div class="d-flex align-center my-3 gap-2"></div>
									<VBtn block type="submit" :loading="phoneLoading">
										{{ t("login.confirm") }}
									</VBtn>
								</VCol>
							</VRow>
						</VForm>
					</div>
					<!-- create account -->
					<VCol cols="12">
						<div class="text-center text-base">
							<NuxtLink class="d-flex align-center justify-center text-primary d-inline-block" :to="{ name: 'login' }"
								><VIcon icon="ri-arrow-left-s-line"></VIcon>{{ t("login.back to login") }}</NuxtLink
							>
						</div>
					</VCol>
				</VCardText>
			</div>
		</VCol>
	</VRow>
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
