<script setup>
import { getCurrentMember } from "@/api/personalCenter/rightsInformation";
import { bindAccount, getEmailCode, getPhoneCode, setPassword } from "@/api/user/index.js";
import UserProfileHeader from "@/pages/personalCenter/components/UserProfileHeader.vue";
const { $phonePrefix } = useNuxtApp();
const isCurrentPasswordVisible = ref(false);
const isNewPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const userStore = useUserStore();
const { t } = useI18n();
const { locale } = useI18n({ useScope: "global" });
const form = ref({});
const phoneLoading = ref(false); // 手机号保存加载状态
const emailLoading = ref(false); // 邮箱保存加载状态
const passwordLoading = ref(false); // 密码保存加载状态
const phoneForm = ref({
	phonePrefix: "+86",
	newPhone: "",
	code: "",
});

const emailForm = ref({
	newEmail: "",
	code: "",
});

const passwordForm = ref({
	currentPassword: "",
	newPassword: "",
	confirmPassword: "",
});

const errors = ref({
	newPhone: undefined,
	code: undefined,
	newEmail: undefined,
	emailCode: undefined,
	currentPassword: undefined,
	newPassword: undefined,
	confirmPassword: undefined,
});
const codeLoading = ref(false); // 验证码加载状态
const countdown = ref(0); // 倒计时

const emailCodeLoading = ref(false); // 验证码加载状态
const emailCountdown = ref(0); // 倒计时
const passwordRequirements = ["home.length", "home.characterTypes", "home.specialChars"];

const getMemberInfo = () => {
	nextTick(() => {
		getCurrentMember().then(res => {
			form.value = res.data;
		});
	});
};
getMemberInfo();

watch(locale, () => {
	if (errors.value.newPhone) {
		validatePhoneForm();
	}
	if (errors.value.code) {
		validateCodeForm();
	}
	if (errors.value.newEmail) {
		validateEmailForm();
	}
	if (errors.value.emailCode) {
		validateEmailCodeForm();
	}
	if (errors.value.newPassword) {
		validatePasswordForm();
	}
	if (errors.value.confirmPassword) {
		validateConfirmPasswordForm();
	}
});

// 手机号校验
const validatePhoneForm = () => {
	console.log(form.value.phoneNumber == `${phoneForm.value.phonePrefix}${phoneForm.value.newPhone}`);

	if (phoneForm.value.newPhone.length != 0) {
		if (typeof validatePhoneNumber(phoneForm.value.phonePrefix, phoneForm.value.newPhone) == "string") {
			errors.value.newPhone = t(validatePhoneNumber(phoneForm.value.phonePrefix, phoneForm.value.newPhone));
			return false;
		} else if (form.value.phoneNumber == `${phoneForm.value.phonePrefix}${phoneForm.value.newPhone}`) {
			errors.value.newPhone = t("login.The new phone number cannot be the same as the original phone number");
		} else {
			errors.value.newPhone = undefined;
			return true;
		}
	} else {
		errors.value.newPhone = t("login.Please enter your phone number");
		return false;
	}
};

// 验证码校验
const validateCodeForm = () => {
	if (phoneForm.value.code.length != 0) {
		errors.value.code = undefined;
		return true;
	} else {
		errors.value.code = t("login.Please enter your verification code");
		return false;
	}
};

// 获取验证码
const getVerificationCodeApi = () => {
	codeLoading.value = true;
	let phone = `${phoneForm.value.phonePrefix} ${phoneForm.value.newPhone}`;
	getPhoneCode(phone, "BIND_ACCOUNT")
		.then(res => {
			codeLoading.value = false;
			// 开始倒计时
			countdown.value = 60;
			const timer = setInterval(() => {
				countdown.value--;
				if (countdown.value <= 0) {
					clearInterval(timer);
				}
			}, 1000);
		})
		.catch(error => {
			codeLoading.value = false;
		});
};
const getVerificationCode = () => {
	if (validatePhoneForm()) {
		if (countdown.value > 0) return;
		// 调用获取验证码接口
		getVerificationCodeApi();
	}
};

// 重置手机号
const hResetPhone = () => {
	phoneForm.value.phonePrefix = "+86";
	phoneForm.value.newPhone = "";
	phoneForm.value.code = "";
	errors.value.newPhone = undefined;
	errors.value.code = undefined;
};

const phoneSubmit = () => {
	validatePhoneForm();
	validateCodeForm();
	if (validatePhoneForm() && validateCodeForm()) {
		// 调用绑定手机号接口
		phoneLoading.value = true;
		let phone = `${phoneForm.value.phonePrefix} ${phoneForm.value.newPhone}`;
		bindAccount("", phone, phoneForm.value.code)
			.then(res => {
				if (form.value.phoneNumber == null || form.value.phoneNumber == "") {
					alert("primary", t("home.Bind successfully"));
				} else {
					alert("primary", t("home.Change successfully"));
				}
				getMemberInfo();
				hResetPhone();
				phoneLoading.value = false;
			})
			.catch(error => {
				phoneLoading.value = false;
			});
	}
};

// 邮箱校验
const validateEmailForm = () => {
	if (emailForm.value.newEmail.length != 0) {
		if (typeof validateEmail(emailForm.value.newEmail) == "string") {
			errors.value.newEmail = t(validateEmail(emailForm.value.newEmail));
			return false;
		} else if (form.value.email == emailForm.value.newEmail) {
			errors.value.newEmail = t("login.The new email cannot be the same as the original email");
		} else {
			errors.value.newEmail = undefined;
			return true;
		}
	} else {
		errors.value.newEmail = t("login.Please enter your email address");
		return false;
	}
};
// 邮箱验证码校验
const validateEmailCodeForm = () => {
	if (emailForm.value.code.length != 0) {
		errors.value.emailCode = undefined;
		return true;
	} else {
		errors.value.emailCode = t("login.Please enter your verification code");
		return false;
	}
};

// 获取邮箱验证码
const getVerificationEmailCodeApi = () => {
	emailCodeLoading.value = true;
	getEmailCode(emailForm.value.newEmail, "BIND_ACCOUNT")
		.then(res => {
			emailCodeLoading.value = false;
			// 开始倒计时
			emailCountdown.value = 60;
			const timer = setInterval(() => {
				emailCountdown.value--;
				if (emailCountdown.value <= 0) {
					clearInterval(timer);
				}
			}, 1000);
		})
		.catch(error => {
			emailCodeLoading.value = false;
		});
};

const getVerificationEmialCode = () => {
	if (validateEmailForm()) {
		if (emailCountdown.value > 0) return;
		// 调用获取验证码接口
		getVerificationEmailCodeApi();
	}
};

// 重置邮箱
const hResetEmail = () => {
	emailForm.value.newEmail = "";
	emailForm.value.code = "";
	errors.value.newEmail = undefined;
	errors.value.emailCode = undefined;
};
// 邮箱提交
const emailSubmit = () => {
	validateEmailForm();
	validateEmailCodeForm();
	if (validateEmailForm() && validateEmailCodeForm()) {
		// 调用绑定邮箱接口
		emailLoading.value = true;
		bindAccount(emailForm.value.newEmail, "", emailForm.value.code)
			.then(res => {
				if (form.value.email == null || form.value.email == "") {
					alert("primary", t("home.Bind successfully"));
				} else {
					alert("primary", t("home.Change successfully"));
				}
				getMemberInfo();
				hResetEmail();
				emailLoading.value = false;
			})
			.catch(error => {
				emailLoading.value = false;
			});
	}
};

// 重置密码
const hResetPassword = () => {
	passwordForm.value.currentPassword = "";
	passwordForm.value.newPassword = "";
	passwordForm.value.confirmPassword = "";
	errors.value.currentPassword = undefined;
	errors.value.newPassword = undefined;
	errors.value.confirmPassword = undefined;
};

// 当前密码校验
// const validateCurrentPasswordForm = () => {
// 	if (passwordForm.value.currentPassword.length == 0) {
// 	} else {
// 		errors.value.currentPassword = undefined;
// 		return true;
// 	}
// };

// 密码校验
const validatePasswordForm = () => {
	if (passwordForm.value.newPassword.length != 0) {
		if (typeof validatePassword(passwordForm.value.newPassword) == "string") {
			errors.value.newPassword = t(validatePassword(passwordForm.value.newPassword));
			return false;
		} else {
			errors.value.newPassword = undefined;
			return true;
		}
	} else {
		errors.value.newPassword = t("login.Please enter your password");
		return false;
	}
};
// 确认密码校验
const validateConfirmPasswordForm = () => {
	if (passwordForm.value.confirmPassword.length != 0) {
		if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
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

// 设置密码提交
const passwordSubmit = () => {
	validatePasswordForm();
	validateConfirmPasswordForm();
	if (validatePasswordForm() && validateConfirmPasswordForm()) {
		// 调用修改密码接口
		passwordLoading.value = true;
		let oldPassword = "";
		if (form.value.password != null && form.value.password != "") {
			oldPassword = encrypt(form.value.password);
		}

		setPassword(oldPassword, passwordForm.value.newPassword, passwordForm.value.confirmPassword)
			.then(res => {
				if (form.value.password == null || form.value.password == "") {
					alert("primary", t("home.Setting successful, now redirecting to login page"));
				} else {
					alert("primary", t("home.Change successful, now redirecting to login page"));
				}
				passwordLoading.value = false;
				setTimeout(() => {
					userStore.logout();
				}, 2000);
			})
			.catch(error => {
				passwordLoading.value = false;
			});
	}
};
</script>

<template>
	<UserProfileHeader ref="headerRef" class="mb-5" />
	<VRow>
		<!-- SECTION: Change Phone -->
		<VCol cols="12">
			<VCard>
				<VCardItem class="pb-6">
					<VCardTitle v-if="form.phoneNumber">{{ t("home.Change Phone") }}</VCardTitle>
					<VCardTitle v-else>{{ t("home.Setting Phone") }}</VCardTitle>
				</VCardItem>
				<VForm @submit.prevent="phoneSubmit">
					<VCardText class="pt-0">
						<!-- 👉 Current Password -->
						<VRow v-if="form.phoneNumber">
							<VCol cols="12" md="6">
								<!-- 👉 current password -->
								<VTextField v-model="form.phoneNumber" autocomplete="on" :label="t('login.phone')" :disabled="true" placeholder="" />
							</VCol>
						</VRow>

						<!-- 👉 New Phone -->
						<VRow>
							<VCol cols="12" md="6">
								<!-- 👉 new Phone -->
								<VTextField
									v-model="phoneForm.newPhone"
									:label="form.phoneNumber ? t('home.New Phone') : t('login.phone')"
									autocomplete="on"
									placeholder=""
									:error-messages="errors.newPhone"
									@blur="validatePhoneForm"
								>
									<template v-slot:prepend>
										<v-select v-model="phoneForm.phonePrefix" :items="$phonePrefix"></v-select>
									</template>
								</VTextField>
							</VCol>

							<VCol cols="12" md="6">
								<!-- 👉 confirm password -->
								<!-- 验证码 -->
								<VTextField
									v-model="phoneForm.code"
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
											:disabled="countdown > 0 || phoneForm.newPhone.length == 0"
											@click.stop="getVerificationCode"
										>
											{{ countdown > 0 ? `${countdown}s ${t("login.Retry")}` : t("login.GetVerificationCode") }}
										</VBtn>
									</template>
								</VTextField>
							</VCol>
						</VRow>
					</VCardText>
					<!-- 👉 Password Requirements -->
					<VCardText>
						<!-- 👉 Action Buttons -->
						<div class="d-flex flex-wrap gap-4">
							<VBtn type="submit" :loading="phoneLoading">{{ form.phoneNumber ? t("home.Save changes") : t("home.Save") }}</VBtn>
							<VBtn color="secondary" variant="outlined" @click="hResetPhone"> {{ t("home.Reset") }} </VBtn>
						</div>
					</VCardText>
				</VForm>
			</VCard>
		</VCol>

		<!-- SECTION: Change Email -->
		<VCol cols="12">
			<VCard>
				<VCardItem class="pb-6">
					<VCardTitle v-if="form.email">{{ t("home.Change Email") }}</VCardTitle>
					<VCardTitle v-else>{{ t("home.Setting Email") }}</VCardTitle>
				</VCardItem>
				<VForm @submit.prevent="emailSubmit">
					<VCardText class="pt-0">
						<!-- 👉 Current Password -->
						<VRow v-if="form.email">
							<VCol cols="12" md="6">
								<VTextField v-model="form.email" autocomplete="on" :label="t('login.Email')" :disabled="true" placeholder="" />
							</VCol>
						</VRow>

						<VRow>
							<VCol cols="12" md="6">
								<VTextField
									v-model="emailForm.newEmail"
									:label="form.email ? t('home.New Email') : t('login.Email')"
									autocomplete="on"
									placeholder=""
									:error-messages="errors.newEmail"
									@blur="validateEmailForm"
								>
								</VTextField>
							</VCol>

							<VCol cols="12" md="6">
								<VTextField
									v-model="emailForm.code"
									:label="t('login.VerificationCode')"
									placeholder=""
									:error-messages="errors.emailCode"
									@blur="validateEmailCodeForm"
								>
									<template v-slot:append>
										<VBtn
											block
											:loading="emailCodeLoading"
											style="height: 100%"
											:disabled="countdown > 0 || emailForm.newEmail == ''"
											@click.stop="getVerificationEmialCode"
										>
											{{ emailCountdown > 0 ? `${emailCountdown}s ${t("login.Retry")}` : t("login.GetVerificationCode") }}
										</VBtn>
									</template>
								</VTextField>
							</VCol>
						</VRow>
					</VCardText>
					<!-- 👉 Password Requirements -->
					<VCardText>
						<!-- 👉 Action Buttons -->
						<div class="d-flex flex-wrap gap-4">
							<VBtn type="submit" :loading="emailLoading">{{ form.email ? t("home.Save changes") : t("home.Save") }}</VBtn>
							<VBtn color="secondary" variant="outlined" @click="hResetEmail"> {{ t("home.Reset") }} </VBtn>
						</div>
					</VCardText>
				</VForm>
			</VCard>
		</VCol>
		<!-- SECTION: Change Password -->
		<VCol cols="12">
			<VCard>
				<VCardItem class="pb-6">
					<VCardTitle v-if="form.password != null">{{ t("home.Change Password") }}</VCardTitle>
					<VCardTitle v-else>{{ t("home.Setting Password") }}</VCardTitle>
				</VCardItem>
				<VForm @submit.prevent="passwordSubmit">
					<VCardText class="pt-0">
						<!-- 👉 Current Password -->
						<VRow v-if="form.password != null">
							<VCol cols="12" md="6">
								<!-- 👉 current password -->
								<VTextField
									v-model="passwordForm.currentPassword"
									:type="isCurrentPasswordVisible ? 'text' : 'password'"
									:append-inner-icon="isCurrentPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
									autocomplete="on"
									:label="t('home.Current Password')"
									placeholder="············"
									@click:append-inner="isCurrentPasswordVisible = !isCurrentPasswordVisible"
								/>
							</VCol>
						</VRow>

						<!-- 👉 New Password -->
						<VRow>
							<VCol cols="12" md="6">
								<!-- 👉 new password -->
								<VTextField
									v-model="passwordForm.newPassword"
									:type="isNewPasswordVisible ? 'text' : 'password'"
									:append-inner-icon="isNewPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
									:label="form.password ? t('home.New Password') : t('login.Password')"
									autocomplete="on"
									placeholder="············"
									@click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
									:error-messages="errors.newPassword"
									@blur="validatePasswordForm"
								/>
							</VCol>

							<VCol cols="12" md="6">
								<!-- 👉 confirm password -->
								<VTextField
									v-model="passwordForm.confirmPassword"
									:type="isConfirmPasswordVisible ? 'text' : 'password'"
									:append-inner-icon="isConfirmPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
									autocomplete="on"
									:label="t('home.Confirm Password')"
									placeholder="············"
									@click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
									@blur="validateConfirmPasswordForm"
									:error-messages="errors.confirmPassword"
								/>
							</VCol>
						</VRow>
					</VCardText>

					<!-- 👉 Password Requirements -->
					<VCardText>
						<h6 class="text-h6 text-medium-emphasis mt-1">{{ t("home.Password Requirements") }}:</h6>
						<VList>
							<VListItem v-for="(item, index) in passwordRequirements" :key="index" class="px-0">
								<template #prepend>
									<VIcon size="8" icon="ri-circle-fill" color="rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity))" />
								</template>
								<VListItemTitle class="text-medium-emphasis text-wrap">
									{{ t(item) }}
								</VListItemTitle>
							</VListItem>
						</VList>

						<!-- 👉 Action Buttons -->
						<div class="d-flex flex-wrap gap-4">
							<VBtn type="submit" :loading="passwordLoading">{{ form.password ? t("home.Save changes") : t("home.Save") }}</VBtn>
							<VBtn color="secondary" variant="outlined" @click="hResetPassword"> {{ t("home.Reset") }} </VBtn>
						</div>
					</VCardText>
				</VForm>
			</VCard>
		</VCol>
		<!-- !SECTION -->
	</VRow>
</template>
