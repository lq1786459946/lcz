<script setup>
import { validateUsername } from "@/@core/utils/validators";
import { uploadVFileInput } from "@/api/fileUpload.js";
import { getCurrentMember } from "@/api/personalCenter/rightsInformation/index.js";
import { updateMemberInfo } from "@/api/personalCenter/userInfo";
import UserProfileHeader from "@/pages/personalCenter/components/UserProfileHeader.vue";
import { nextTick } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const userData = useCookie("userData");
let success = ref(false);
const headerRef = ref();
const userStore = useUserStore();
const { locale } = useI18n({ useScope: "global" });
const getMemberInfo = () => {
	// nextTick(() => {
	getCurrentMember().then(res => {
		oldForm.value = { ...res.data };
		form.value = { ...res.data };
	});
	// });
};
getMemberInfo();
let form = ref({
	id: "",
	avatar: "",
	nick: "",
	region: null,
	identity: null,
	institution: null,
	major: null,
	professionalTitle: null,
});
const nickErrorMsg = ref("");
// 用户名校验
const validateUsernameForm = () => {
	if (form.value.nick && form.value.nick.length != 0) {
		if (typeof validateUsername(form.value.nick) == "string") {
			nickErrorMsg.value = t(validateUsername(form.value.nick));
			return false;
		} else {
			nickErrorMsg.value = undefined;
			return true;
		}
	} else {
		nickErrorMsg.value = t("userInfo.NicknameRule");
		return false;
	}
};
let oldForm = ref({});

const resetForm = () => {
	form.value = { ...oldForm.value };
};
const refInputEl = ref();
const changeAvatar = file => {
	const { files } = file.target;
	if (!files || files.length === 0) return;
	if (files[0].size / 1024 / 1024 > 2) {
		alert("warning", t("userInfo.FileTip"), "ri-error-warning-line");
	} else {
		uploadVFileInput(files[0]).then(res => {
			form.value.avatar = res.data.link;
		});
	}
	refInputEl.value.value = "";
};

// reset avatar image
const resetAvatar = () => {
	form.value.avatar = oldForm.value.avatar;
};
// 保存信息
const submit = params => {
	validateUsernameForm();
	if (validateUsernameForm()) {
		updateMemberInfo(form.value).then(
			res => {
				alert("primary", t("userInfo.OperationSuccessful"));
				oldForm.value = { ...form.value };
				let { getMemberInfo } = headerRef.value;
				getMemberInfo();
				let userData = { ...userStore.getUserData };
				userData.avatar = form.value.avatar;
				userData.nick_name = form.value.nick;
				userStore.setUserInfo(userData);
			},
			error => {
				console.log(error, "error");
			},
		);
	}
};

// 切换语言更换提示信息
let formRef = ref();
watch(locale, () => {
	validateUsernameForm();
});
</script>
<template>
	<div>
		<UserProfileHeader ref="headerRef" class="mb-5" />
		<VCard title="用户信息">
			<VCardText>
				<div class="d-flex mb-10">
					<!-- 👉 Avatar -->
					<VAvatar
						rounded
						size="100"
						class="me-6 mb-4"
						:color="!(form && form.avatar) ? 'primary' : undefined"
						:variant="!(form && form.avatar) ? 'tonal' : undefined"
					>
						<VImg :src="form.avatar" />
					</VAvatar>

					<!-- 👉 Upload Photo -->
					<form class="d-flex flex-column justify-center gap-4">
						<div class="d-flex flex-wrap gap-4">
							<VBtn color="primary" @click="refInputEl?.click()">
								<VIcon icon="ri-upload-cloud-line" class="d-sm-none" />
								<span class="d-none d-sm-block">{{ t("userInfo.UpdatePhoto") }}</span>
							</VBtn>
							<input ref="refInputEl" type="file" name="file" accept=".png,.jpg" hidden @input="changeAvatar" />
							<VBtn type="reset" color="error" variant="outlined" @click="resetAvatar">
								<span class="d-none d-sm-block">{{ t("userInfo.Reset") }}</span>
								<VIcon icon="ri-refresh-line" class="d-sm-none" />
							</VBtn>
						</div>
						<p class="text-body-1 mb-0">{{ t("userInfo.Tip") }}</p>
					</form>
				</div>

				<!-- 👉 Form -->
				<VForm @submit.prevent="submit" ref="formRef">
					<VRow>
						<!-- 昵称 -->
						<VCol cols="12" md="6">
							<VTextField
								counter
								maxlength="20"
								v-model="form.nick"
								:error-messages="nickErrorMsg"
								@blur="validateUsernameForm"
								:label="t('userInfo.Nickname')"
								:placeholder="t('userInfo.NicknamePlaceholder')"
							/>
						</VCol>
						<!-- 国家 -->
						<VCol cols="12" md="6">
							<VTextField
								v-model="form.region"
								counter
								maxlength="30"
								:label="t('userInfo.Country')"
								:placeholder="t('userInfo.CountryPlaceholder')"
							/>
						</VCol>
						<!-- 👉 身份类型 -->
						<VCol cols="12" md="6">
							<VTextField
								counter
								maxlength="30"
								v-model="form.identity"
								:label="t('userInfo.IdentityType')"
								:placeholder="t('userInfo.IdentityTypePlaceholder')"
							/>
						</VCol>

						<!--  单位学校 -->
						<VCol cols="12" md="6">
							<VTextField
								v-model="form.institution"
								counter
								maxlength="30"
								:label="t('userInfo.Unit')"
								:placeholder="t('userInfo.UnitPlaceholder')"
							/>
						</VCol>

						<!--  专业 -->
						<VCol cols="12" md="6">
							<VTextField
								v-model="form.major"
								counter
								maxlength="30"
								:label="t('userInfo.Major')"
								:placeholder="t('userInfo.MajorPlaceholder')"
							/>
						</VCol>

						<!--  职称 -->
						<VCol cols="12" md="6">
							<VTextField
								counter
								maxlength="30"
								v-model="form.professionalTitle"
								:label="t('userInfo.ProfessionalTitle')"
								:placeholder="t('userInfo.ProfessionalPlaceholder')"
							/>
						</VCol>
						<!-- 👉 Form Actions -->
						<VCol cols="12" class="d-flex flex-wrap gap-4">
							<VBtn type="submit">{{ t("userInfo.Save") }}</VBtn>
							<VBtn color="secondary" variant="outlined" type="reset" @click.prevent="resetForm">{{ t("userInfo.Reset") }}</VBtn>
						</VCol>
					</VRow>
				</VForm>
			</VCardText>
		</VCard>
	</div>
</template>
