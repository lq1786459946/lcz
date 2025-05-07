<script setup>
import { validatePhoneNumber } from "@/@core/utils/validators";
import { invoicePage, invoiceSave, orderList } from "@/api/invoiceApplication";

const { $phonePrefix } = useNuxtApp();
const { t } = useI18n();
const tt = str => t("invoiceApplication." + str);
const isDetail = shallowRef(false);
const loading = shallowRef(false);
const dialog = shallowRef(false);

const pageTable = ref({
	total: 0,
	currentPage: 1,
	pageSize: 10,
	options: [10, 20, 25, 50, 100],
});

const tableData = ref([]);
const dialogTableData = ref([]);

const formData = ref({
	orderNo: "",
	amountTotal: "",
	titleType: null, // 抬头类型
	invoiceType: null,
	content: "技术服务费",
	format: "PDF",
	title: "",
	taxId: "",
	address: "",
	phone: "",
	bankName: "",
	bankAccount: "",
	email: "",
	msgPhone: "",
});

const headers = ref([
	{ title: "订单号", key: "orderNo" },
	{ title: "购买商品", key: "productName" },
	{ title: "发票内容", key: "content" },
	{ title: "发票抬头", key: "title" },
	{ title: "发票金额", key: "amountTotal" },
	{ title: "申请时间", key: "createTime" },
	{ title: "发票状态", key: "status" },
	{ title: "操作", key: "actions" },
]);

const dialogTbaleHeaders = ref([
	{ title: "订单号", key: "orderNo" },
	{ title: "付费金额", key: "amountTotal" },
	{ title: "购买商品", key: "productName" },
	{ title: "消费时间", key: "payTime" },
]);

const dialogTbaleLoading = ref(false);

const requestInvoice = () => {
	orderList().then(res => {
		dialogTableData.value = res.data;

		formData.value.RegisteredPhonePrefix = "+86";
		formData.value.phonePrefix = "+86";
		isDetail.value = !isDetail.value;
	});
};

const onLoad = () => {
	loading.value = true;
	nextTick(() => {
		invoicePage(pageTable.value.currentPage, pageTable.value.pageSize, {}).then(res => {
			tableData.value = res.data.records;
			pageTable.value.total = res.data.total;
			loading.value = false;
		});
	});
};

// 抬头类型校验
const titleTypeRules = [
	value => {
		if (value) return true;

		return tt("HeaderTypeIsRequired");
	},
];

// 发票类型校验
const invoiceTypeRules = [
	value => {
		if (value) return true;

		return tt("InvoiceTypeIsRequired");
	},
];

const titleRules = [
	value => {
		if (value) return true;

		return tt("InvoiceTitleIsRequired");
	},
];

const taxIdRules = [
	value => {
		if (value) return true;

		return tt("TaxIDIsRequired");
	},
];

const emailRules = [v => !!v || tt("EmailIsRequired"), v => /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(v) || tt("PleaseEnterAValidEmailAddress")];

const msgPhoneRules = [
	value => {
		validatePhoneNumber();
		if (value) {
			if (typeof formData.value.phonePrefix == "string") {
				if (typeof validatePhoneNumber(formData.value.phonePrefix, value) == "string") {
					return t(validatePhoneNumber(formData.value.phonePrefix, value));
				} else {
					return true;
				}
			} else {
				return tt("SelectCountryRegionCode");
			}
		} else {
			return tt("PhoneIsRequired");
		}
	},
];

const phoneRules = [
	value => {
		validatePhoneNumber();
		if (!value) return true;
		if (typeof formData.value.RegisteredPhonePrefix == "string") {
			if (typeof validatePhoneNumber(formData.value.RegisteredPhonePrefix, value) == "string") {
				return t(validatePhoneNumber(formData.value.RegisteredPhonePrefix, value));
			} else {
				return true;
			}
		} else {
			return tt("SelectCountryRegionCode");
		}
	},
];

// 打开订单选择
const openOrder = () => {
	dialog.value = !dialog.value;
};

// 选择订单
const handleRowClick = (event, { item }) => {
	dialog.value = !dialog.value;
	formData.value.amountCurrency = item.amountCurrency;
	formData.value.amountTotal = item.amountTotal;
	formData.value.orderNo = item.orderNo;
};

// 提交按钮
const submit = async e => {
	const results = await e;

	if (results.valid) {
		let params = { phone: formData.value.RegisteredPhonePrefix + " " + formData.value.phone };
		if (formData.value.msgPhone && formData.value.msgPhone != "") params.msgPhone = formData.value.phonePrefix + " " + formData.value.msgPhone;
		invoiceSave({ ...formData.value, ...params }).then(res => {
			if (res.code == 200) {
				alert("success", tt("SubmissionSuccessful"));
				isDetail.value = !isDetail.value;
				formData.value = {};
			} else {
				alert("success", tt("SubmissionFailed"));
			}
		});
	}
};

// 下载发票
const downloadInvoice = item => {
	let invoiceFiles = item.invoiceFiles;
	if (item.load) return;
	if (invoiceFiles && invoiceFiles.length >= 1) {
		item.load = true;

		// 通过fetch绕过CORS 缺点是没有进度条 😂
		$fetch(invoiceFiles[0].link).then(blob => {
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");

			link.href = url;
			link.download = invoiceFiles[0].originalName || "发票附件.pdf";
			link.click();
			URL.revokeObjectURL(url); // 释放内存
			item.load = null;
		});
	}
};

// 返回按钮
const back = () => {
	isDetail.value = !isDetail.value;
};
</script>

<template>
	<VCard>
		<VCardText v-if="!isDetail" class="d-flex flex-wrap gap-4">
			<div class="d-flex gap-x-4">
				<VBtn color="primary" prepend-icon="ri-add-line" @click="requestInvoice"> {{ tt("RequestInvoice") }} </VBtn>
			</div>
		</VCardText>
		<VCardText>
			<VDataTable
				v-if="!isDetail"
				v-model:items-per-page="pageTable.pageSize"
				v-model:page="pageTable.currentPage"
				:headers="headers"
				:loading="loading"
				:items="tableData"
				:hide-default-footer="false"
				fixed-header
				:items-per-page-options="pageTable.options"
				:items-length="pageTable.total"
				@update:options="onLoad"
			>
				<template #header.orderNo> {{ tt("OrderNumber") }}</template>
				<template #header.productName> {{ tt("PurchasedItems") }}</template>
				<template #header.content> {{ tt("InvoiceContent") }}</template>
				<template #header.title> {{ tt("InvoiceTitle") }}</template>
				<template #header.amountTotal> {{ tt("InvoiceAmount") }}</template>
				<template #header.createTime> {{ tt("ApplicationTime") }}</template>
				<template #header.status> {{ tt("InvoiceStatus") }}</template>
				<template #header.actions> {{ tt("Actions") }}</template>

				<template #loading>
					<v-skeleton-loader type="table-row@10" />
				</template>

				<template #item.amountTotal="{ item }">
					{{ item.amountCurrency == 1 ? `¥${item.amountTotal} CN` : `$${item.amountTotal} US` }}
				</template>

				<template #item.status="{ item }">
					<div>{{ item.status == 1 ? tt("InvoiceIssued") : tt("ProcessingInvoice") }}</div>
				</template>

				<template #item.actions="{ item }">
					<VBtn variant="text" :loading="!!item.load" :disabled="item.status != 1" @click="downloadInvoice(item)">
						{{ tt("DownloadInvoice") }}
					</VBtn>
				</template>

				<!-- 分页 -->
				<template #bottom>
					<VDivider />
					<VCardText class="pt-2">
						<div class="d-flex flex-wrap justify-end gap-y-2 mt-2">
							<VSelect
								v-model="pageTable.pageSize"
								:items="pageTable.options"
								label=""
								style="max-inline-size: 6rem; min-inline-size: 4rem; margin-right: 1rem"
							/>
							<VPagination
								v-model="pageTable.currentPage"
								:total-visible="$vuetify.display.smAndDown ? 2 : 3"
								:length="Math.ceil(pageTable.total / pageTable.pageSize)"
							/>
						</div>
					</VCardText>
				</template>
			</VDataTable>

			<div v-if="isDetail">
				<VCardText>
					<v-form @submit.prevent="submit">
						<div class="d-flex align-center justify-md-space-between">
							<h2>{{ tt("OrderInformation") }}</h2>
							<IconBtn class="align-self-end" @click="back">
								<VIcon :size="20" icon="ri-close-line" />
							</IconBtn>
						</div>
						<VDivider class="mb-5 mt-3" />

						<VList class="card-list mb-10">
							<VListItem>
								<div class="d-flex align-center">
									<span class="font-weight-medium">
										<span style="color: red; width: 0.9375rem; display: inline-block">* </span>
										<span style="font-weight: 600">{{ tt("OrderNumber") }} : </span>
									</span>

									<div class="d-flex align-center" style="flex: 1">
										<span style="flex: 8">{{ formData.orderNo || "-" }}</span>
										<div style="flex: 16">
											<VBtn size="small" @click="openOrder">{{ tt("SelectOrder") }}</VBtn>
										</div>
									</div>
								</div>
							</VListItem>

							<VListItem>
								<span class="font-weight-medium">
									<span style="color: red; width: 0.9375rem; display: inline-block">* </span>
									<span style="font-weight: 600">{{ tt("OrderAmount") }} : </span>
								</span>

								<span>{{
									formData.amountTotal
										? formData.amountCurrency == 1
											? `¥${formData.amountTotal} CNY`
											: `$${item.amountTotal} USD`
										: "-"
								}}</span>
							</VListItem>
						</VList>

						<VRow>
							<!-- 分割线 -->
							<VCol md="12" cols="12">
								<div class="d-flex align-center justify-md-space-between">
									<h2>{{ tt("InvoiceInformation") }}</h2>
								</div>
								<VDivider class="mt-3" />
							</VCol>

							<!-- 抬头类型 -->
							<VCol md="6" cols="12">
								<VSelect
									v-model="formData.titleType"
									:label="tt('HeaderType')"
									:rules="titleTypeRules"
									:items="[
										{ title: tt('BusinessEntity'), value: '0' },
										{ title: tt('IndividualNonBusiness'), value: '1' },
									]"
									clearable
									clear-icon="ri-close-line"
								/>
							</VCol>

							<!-- 发票类型 -->
							<VCol md="6" cols="12">
								<VSelect
									v-model="formData.invoiceType"
									:label="tt('InvoiceType')"
									:items="[
										{ title: tt('StandardInvoice'), value: '0' },
										{ title: tt('SpecializedInvoice'), value: '1' },
									]"
									:rules="invoiceTypeRules"
									clearable
									clear-icon="ri-close-line"
								/>
							</VCol>

							<!-- 发票抬头 -->
							<VCol md="6" cols="12">
								<v-text-field
									v-model="formData.title"
									:label="tt('InvoiceTitle')"
									:counter="20"
									:maxlength="20"
									:rules="titleRules"
									required
								/>
							</VCol>

							<!-- 纳税人识别号 -->
							<VCol md="6" cols="12">
								<v-text-field
									v-model="formData.taxId"
									:label="tt('TaxID')"
									:counter="20"
									:maxlength="20"
									:rules="taxIdRules"
									required
								/>
							</VCol>

							<!-- 发票内容 -->
							<VCol md="6" cols="12">
								<v-text-field
									v-model="formData.content"
									:label="tt('InvoiceContent')"
									disabled
									:counter="20"
									:maxlength="20"
									required
								/>
							</VCol>

							<!-- 发票格式 -->
							<VCol md="6" cols="12">
								<v-text-field
									v-model="formData.format"
									:label="tt('InvoiceFormat')"
									disabled
									:counter="20"
									:maxlength="20"
									required
								/>
							</VCol>

							<template v-if="formData.titleType == 0">
								<VCol md="12" cols="12">
									<VLabel>{{ tt("MoreInfoOptional") }}</VLabel>
								</VCol>

								<!-- 注册地址 -->
								<VCol md="6" cols="12">
									<v-text-field v-model="formData.address" :label="tt('RegisteredAddress')" :counter="50" :maxlength="50" />
								</VCol>

								<!-- 注册电话 -->
								<VCol md="6" cols="12">
									<v-text-field
										v-model="formData.phone"
										:label="tt('RegisteredPhone')"
										:counter="20"
										:maxlength="20"
										:rules="phoneRules"
									>
										<template #prepend>
											<v-select v-model="formData.RegisteredPhonePrefix" :items="$phonePrefix" />
										</template>
									</v-text-field>
								</VCol>

								<!-- 开户行 -->
								<VCol md="6" cols="12">
									<v-text-field v-model="formData.bankName" :label="tt('BankName')" :counter="50" :maxlength="50" />
								</VCol>

								<!-- 账号 -->
								<VCol md="6" cols="12">
									<v-text-field v-model="formData.bankAccount" :label="tt('AccountNumber')" :counter="20" :maxlength="20" />
								</VCol>
							</template>
							<!-- 分割线 -->
							<VCol md="12" cols="12">
								<div class="d-flex align-center justify-md-space-between">
									<h2>{{ tt("RecipientDetails") }}</h2>
								</div>
								<VDivider class="mt-3" />
							</VCol>

							<!-- 邮箱地址 -->
							<VCol md="6" cols="12">
								<v-text-field
									v-model="formData.email"
									:label="tt('Email')"
									:counter="50"
									:maxlength="50"
									:rules="emailRules"
									required
								/>
							</VCol>

							<!-- 短信通知 -->
							<VCol md="6" cols="12">
								<v-text-field
									v-model="formData.msgPhone"
									:label="tt('SMSNotification')"
									:counter="20"
									:maxlength="20"
									:rules="msgPhoneRules"
									required
								>
									<template #prepend>
										<v-select v-model="formData.phonePrefix" :items="$phonePrefix" />
									</template>
								</v-text-field>
							</VCol>
						</VRow>

						<!-- ====================================================================================================== -->
						<VDivider class="mt-5 mb-4" />
						<VRow class="d-flex justify-end">
							<VCol md="3" cols="12">
								<VBtn class="mt-2" :disabled="!(formData.amountTotal || formData.orderNo)" type="submit" block>
									{{ tt("Submit") }}
								</VBtn>
							</VCol>
						</VRow>
					</v-form>
				</VCardText>
			</div>
		</VCardText>
	</VCard>

	<v-dialog v-model="dialog" max-width="600">
		<v-card prepend-icon="mdi-account" :title="tt('SelectOrder')">
			<VDataTable
				density="compact"
				height="400"
				:headers="dialogTbaleHeaders"
				:loading="dialogTbaleLoading"
				:items="dialogTableData"
				hide-default-footer
				@click:row="handleRowClick"
			/>
		</v-card>
	</v-dialog>
</template>

<style lang="scss" scoped>
#weqeere {
	display: block;
}
</style>
