<script setup>
import { getListConfiguration } from "@/api/front-pages";
const isDialogVisible = ref(false);
const policyData = ref([]);
const init = type => {
	console.log("typetype", type);
	isDialogVisible.value = true;
	getPrivacyPolicy(type);
};
const CloseDialog = () => {
	isDialogVisible.value = false;
};
const { t } = useI18n();
const { locale, setLocaleMessage } = useI18n({
	useScope: "global",
});
const handleDialogChange = () => {};

// 获取操作实例数据
const getPrivacyPolicy = type => {
	nextTick(() => {
		getListConfiguration({ moduleType: 8, useType: type }).then(res => {
			let data = res.data;
			policyData.value = data;
			console.log(policyData.value);

			policyData.value.forEach(item => {
				addDynamicMessages(item, setLocaleMessage);
			});
		});
	});
};

defineExpose({
	init,
});
</script>

<template>
	<VDialog v-model="isDialogVisible" :width="$vuetify.display.smAndDown ? 'auto' : 900" @update:modelValue="handleDialogChange">
		<DialogCloseBtn variant="text" size="default" @click="isDialogVisible = false" />
		<VCard>
			<VCardText class="mt-5" :style="{ height: $vuetify.display.smAndDown ? '40rem' : '48rem' }">
				<div v-if="policyData && policyData.length != 0">
					<div class="title mb-5 text-center" :class="$vuetify.display.smAndDown ? 'text-h5' : 'text-h3'">
						{{ t(`title_${policyData[0].id}`) }}
					</div>
					<div
						class="content"
						:style="{ height: $vuetify.display.smAndDown ? '35rem' : '42.5rem' }"
						v-html="decodeURIComponent(t(`content_${policyData[0].id}`))"
					></div>
				</div>
			</VCardText>
		</VCard>
	</VDialog>
</template>

<style lang="scss">
.content {
	height: 44rem;
	overflow-y: auto;
	border: 0.1rem solid #d1cfd4;
	border-radius: 1rem;
	padding: 0.4rem 1rem;
	box-sizing: border-box;
}
</style>
