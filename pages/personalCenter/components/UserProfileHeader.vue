<script setup>
import { getCurrentMember } from "@/api/personalCenter/rightsInformation";
import backgroundImg from "@/assets/images/personalCenter/background.png";
import { addDynamicMessages } from "@/composables/i18n-global.js";
import { nextTick, ref } from "vue";
import { useTheme } from "vuetify";
const { t } = useI18n();
let form = ref({});
const theme = useTheme();
const isDark = ref(theme.name);
// 获取用户信息
// 确保在setup函数中调用useI18n
const { setLocaleMessage } = useI18n({
	useScope: "global",
});
const getMemberInfo = () => {
	// nextTick(() => {
	getCurrentMember().then(res => {
		console.log(res, "vue res");
		form.value = res.data;
		addDynamicMessages(form.value, setLocaleMessage);
	});
	// });
};
getMemberInfo();
defineExpose({
	getMemberInfo,
});
</script>

<template>
	<VCard v-if="form">
		<div class="position-relative">
			<VImg :src="backgroundImg" min-height="125" max-height="250" cover />
			<div class="mask" v-if="isDark == 'dark'"></div>
		</div>
		<VCardText class="d-flex align-bottom flex-sm-row flex-column justify-center gap-x-6">
			<div class="d-flex h-0 z-index-999">
				<VAvatar rounded size="130" class="user-profile-avatar mx-auto">
					<VImg :src="form.avatar" height="120" width="120" />
				</VAvatar>
			</div>
			<div class="user-profile-info w-100 mt-16 pt-6 pt-sm-0 mt-sm-0">
				<h4 class="text-h4 text-center text-sm-start mb-2">{{ form.nick || form.phoneNumber }}</h4>
				<div class="d-flex align-center justify-center justify-sm-space-between flex-wrap gap-4">
					<div class="d-flex flex-wrap justify-sm-start flex-grow-1 gap-6">
						<div class="d-flex align-center gap-x-2">
							<VIcon size="24" icon="ri-vip-diamond-line" />
							<div class="text-body-1 font-weight-medium">
								{{ t("rightsInformation.MembershipType") }}:{{ t(`benifitName_${form.id}`) }}
								<span v-show="form.benifitEndTime">{{ `(${form.benifitEndTime}${t("rightsInformation.MemberEndDate")})` }}</span>
							</div>
						</div>

						<div class="d-flex align-center gap-x-2">
							<VIcon size="24" icon="ri-calendar-schedule-line" />
							<div class="text-body-1 font-weight-medium">{{ t("rightsInformation.RegistrationDate") }}: {{ form.createTime }}</div>
						</div>
						<div class="d-flex align-center gap-x-2">
							<VIcon size="24" icon="ri-git-repository-commits-line" />
							<div class="text-body-1 font-weight-medium">
								{{ t("rightsInformation.RegistrationMethod") }}:{{
									form.registerType == 1
										? `${t("rightsInformation.Phone")}(${form.phoneNumber})`
										: `${t("rightsInformation.Email")}(${form.email})`
								}}
							</div>
						</div>
					</div>
				</div>
			</div>
		</VCardText>
	</VCard>
</template>

<style lang="scss">
.z-index-999 {
	z-index: 999;
}
.user-profile-avatar {
	border: 5px solid rgb(var(--v-theme-surface));
	background-color: rgb(var(--v-theme-surface)) !important;
	inset-block-start: -3rem;

	.v-img__img {
		border-radius: 0.375rem;
	}
}
.mask {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 999;
	width: 100%;
	height: 100%;
	background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7));
}
</style>
