<script setup>
import { validatePhoneNumber } from "@/@core/utils/validators";
import { uploadVFileInput } from "@/api/fileUpload";
import { orderConfigDetail, orderCorporateTransfer, orderPage } from "@/api/orderManagement";
import PrivacyPolicy from "@/components/PrivacyPolicy.vue";
import AlipayIcon from "@images/pages/AliPayIcon.png";
import CorporateIcon from "@images/pages/CorporatePaymentIcon.png";
import InternationalIcon from "@images/pages/InternationalPaymentIcon.png";
import WechatIcon from "@images/pages/WechatPayIcon.png";

const { $phonePrefix } = useNuxtApp();
const PrivacyPolicyRef = ref(null);

definePageMeta({ ssr: false });

const { t } = useI18n();
const tt = str => t("orderManagement." + str);
const userStore = useUserStore();

// 本地搜索参数
const loading = ref(false);

const tableData = ref([]);
const formData = ref({}); // 详情数据
const wtDetails = ref({}); // 汇款信息

const corporateForm = ref({
	enterpriseName: "",
	phone: "",
	paymentReceipt: "",
}); // 对公转账填写表单

const selectedFile = ref(null);
const lastFiles = ref(null);
const uploadFileFlag = ref(false);
const isFileClear = ref(false);

const fileRules = ref([
	file => {
		if (file.length == 0) return tt("PaymentReceiptIsRequired");

		return file.length >= 1 || file[0].size <= 2 * 1024 * 1024 || tt("FileSizeMustNotExceed");
	},
	file => {
		return ["image/jpeg", "image/png"].includes(file[0].type) || tt("SupportedFormats");
	},
]);

const pageTable = ref({
	total: 0,
	currentPage: 1,
	pageSize: 10,
	options: [10, 20, 25, 50, 100],
});

// dialog
const isDetail = shallowRef(true);

const headers = [
	{ title: "订单号", key: "orderNo" },
	{ title: "下单时间", key: "createTime" },
	{ title: "支付时间", key: "payTime" },
	{ title: "订单类型", key: "productType" },
	{ title: "等级", key: "productName" },
	{ title: "订单状态", key: "status" },
	{ title: "订单金额（元）", key: "amountTotal" },
	{ title: "操作", key: "actions" },
];

const enterpriseNameRules = [
	value => {
		if (value) return true;

		return tt("FullCompanyNameIsRequired");
	},
];

const phoneRules = [
	value => {
		if (value) {
			if (typeof corporateForm.value.phonePrefix == "string") {
				if (typeof validatePhoneNumber(corporateForm.value.phonePrefix, value) == "string") {
					return t(validatePhoneNumber(corporateForm.value.phonePrefix, value));
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

// 订单状态
const resolveStatus = status => {
	const statusMap = new Map([
		[0, { text: t("orderManagement.PendingPayment"), color: "warning" }],
		[1, { text: t("orderManagement.Paid"), color: "success" }],
		[2, { text: t("orderManagement.Expired") }], // 无color时可不定义
		[3, { text: t("orderManagement.PaymentConfirming"), color: "info" }],
		[4, { text: t("orderManagement.PaymentFailed"), color: "error" }],
	]);

	return statusMap.get(status);
};

// 订单类型
const resolveProductType = productType => {
	if (productType == 1) {
		return "会员升级";
	} else {
		return "";
	}
};

// 支付方式
const resolvePaymentMethod = PaymentMethod => {
	const PaymentMethodMap = new Map([
		[1, { text: tt("WeChatPay"), icon: WechatIcon }],
		[2, { text: tt("Alipay"), icon: AlipayIcon }], // 无color时可不定义
		[3, { text: tt("InternationalPayment"), icon: InternationalIcon }],
		[4, { text: tt("CorporatePayment"), icon: CorporateIcon }],
	]);

	return PaymentMethodMap.get(PaymentMethod);
};

const onLoad = () => {
	loading.value = true;
	nextTick(() => {
		let userInfo = userStore.getUserData;
		orderPage(pageTable.value.currentPage, pageTable.value.pageSize, { userId: userInfo.user_id }).then(res => {
			tableData.value = res.data.records;
			pageTable.value.total = res.data.total;
			loading.value = false;
		});
	});
};

const openView = item => {
	selectedFile.value = null;
	uploadFileFlag.value = false;
	isFileClear.value = false;

	formData.value = item;
	if (formData.value.status == 0) {
		orderConfigDetail().then(res => {
			wtDetails.value = res.data;
		});
	}
	corporateForm.value.phonePrefix = "+86";
	isDetail.value = !isDetail.value;
};

const back = () => {
	formData.value = {};
	corporateForm.value = {};
	isDetail.value = !isDetail.value;
};

// 对公支付提交
const submitCorporatePayment = async e => {
	const results = await e;
	if (results.valid) {
		let userInfo = userStore.getUserData;
		corporateForm.value = Object.assign(corporateForm.value, {
			orderNo: formData.value.orderNo,
			amountTotal: formData.value.amountTotal,
			amountCurrency: formData.value.amountCurrency,
			id: formData.value.id,
			createTime: formData.value.createTime,
			payChannel: 4,
			userId: userInfo.user_id,
		});

		orderCorporateTransfer(Object.assign(corporateForm.value, { phone: corporateForm.value.phonePrefix + " " + corporateForm.value.phone })).then(
			res => {
				if (res.code == 200) {
					corporateForm.value = {};
					formData.value = {};
					isDetail.value = !isDetail.value;
					alert("success", tt("SubmissionSuccessful"));
				} else {
					alert("error", tt("SubmissionFailed"));
				}
			},
		);
	}
};

const handelPolicy = () => {
	PrivacyPolicyRef.value.init(3);
};

// 创建订单
// const sub = () => {
// 	const userInfo = userStore.getUserData;

// 	orderSubmit({
// 		status: 0, // 支付状态
// 		orderNo: "100026", // 订单号
// 		// userId: userInfo.value.user_id,
// 		userId: userInfo.user_id,
// 		amountTotal: "14220.01", // 订单金额
// 		amountCurrency: 2, // 金额类型 （1：CNY 2：USD）
// 		payTime: "2025-04-17 13:13:13", // 支付时间
// 		effectiveTime: "2025-04-17 13:13:13", // 生效时间
// 		payChannel: null, // 支付方式 （1：微信 2：支付包 3：信用卡 4:对公支付）
// 		productType: 1, // 订单类型 （1：会员升级）
// 		productPrice: "14220.01", // 商品价格
// 		productName: "专业会员", // 商品名称
// 		productId: "10244", // 商品ID
// 		productDay: 10, //
// 		payExpirationTime: "2025-05-17 00:00:00", // 到期时间
// 		enterpriseName: null,
// 		phone: null,
// 		paymentReceipt: null, // 付款回执 附件ID
// 	}).then(res => {
// 		if (res.data.code == 200) {
// 			ElMessage.success("提交成功");
// 		} else {
// 			ElMessage.error("提交成功");
// 		}
// 	});
// };

// 附件上传 数据监听
watch(selectedFile, file => {
	/*
        判断是否有上次变更记录并判断本次变更是否为空 --> 修改selectedFile为上次文件并触发监听，通过修改 uploadFileFlage 状态判断是否执行文件上传
        判断是否为清空按钮点击
    */
	if (!isFileClear.value) {
		if (lastFiles.value && !file) {
			selectedFile.value = lastFiles.value;
			uploadFileFlag.value = true;
		}

		if (uploadFileFlag.value) {
			uploadFileFlag.value = false;

			return;
		}
	} else {
		isFileClear.value = false;
	}
	const formData = new FormData();

	formData.append("file", file);
	uploadVFileInput(file).then(res => {
		if (res.code == 200) {
			corporateForm.value.paymentReceipt = res.data.attachId;
			lastFiles.value = file;
		} else {
			corporateForm.value.paymentReceipt = null;
		}
	});
});

const clearFile = e => {
	isFileClear.value = true;
};
</script>

<template>
	<VCard class="md-4" flat>
		<VCardText>
			<VDataTableServer
				v-if="isDetail"
				v-model:items-per-page="pageTable.pageSize"
				v-model:page="pageTable.currentPage"
				:headers="headers"
				:loading="loading"
				:items="tableData"
				:hide-default-footer="false"
				:items-per-page-options="pageTable.options"
				:items-length="pageTable.total"
				@update:options="onLoad"
			>
				<template #header.orderNo> {{ tt("OrderNumber") }}</template>
				<template #header.createTime> {{ tt("OrderTime") }}</template>
				<template #header.payTime> {{ tt("PaymentTime") }}</template>
				<template #header.productType> {{ tt("OrderType") }}</template>
				<template #header.productName> {{ tt("MemberLevel") }}</template>
				<template #header.status> {{ tt("OrderStatus") }}</template>
				<template #header.amountTotal> {{ tt("OrderAmount") }}</template>
				<template #header.actions> {{ tt("Actions") }}</template>

				<template #loading>
					<v-skeleton-loader type="table-row@10" />
				</template>

				<!-- 订单类型 -->
				<template #item.productType="{ item }">{{ resolveProductType(item.productType) }}</template>
				<template #item.status="{ item }"><VChip v-bind="resolveStatus(item.status)" size="small" /></template>

				<!-- 订单状态 -->

				<template #item.amountTotal="{ item }"> {{ item.amountCurrency == 1 ? `¥${item.amountTotal} CNY` : `$${item.amountTotal} USD` }} </template>

				<template #item.actions="{ item }">
					<IconBtn size="small" @click="openView(item)">
						<VIcon icon="ri-eye-line" />
					</IconBtn>
					<!-- <button @click="sub">创建订单</button> -->
					<!-- <VBtn color="info" variant="text" @click="openView(item)">{{ tt("View") }}</VBtn> -->
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
			</VDataTableServer>

			<div v-if="!isDetail">
				<!-- 订单信息 -->
				<div class="d-flex align-center justify-md-space-between">
					<h2>{{ tt("OrderInformation") }}</h2>
					<IconBtn class="align-self-end" @click="back">
						<VIcon :size="20" icon="ri-close-line" />
					</IconBtn>
				</div>
				<VDivider class="mb-5 mt-5" />
				<VList class="card-list mb-10">
					<VListItem>
						<VListItemTitle class="text-sm">
							<span class="font-weight-medium">{{ tt("OrderNumber") }} :</span>
							<span class="text-body-1"> {{ formData.orderNo }} </span>
						</VListItemTitle>
					</VListItem>

					<VListItem>
						<VListItemTitle class="text-sm">
							<span class="font-weight-medium">{{ tt("OrderType") }} :</span>
							<span class="text-body-1"> {{ resolveProductType(formData.productType) }} </span>
						</VListItemTitle>
					</VListItem>

					<VListItem>
						<VListItemTitle class="text-sm">
							<span class="font-weight-medium">{{ tt("MemberLevel") }} :</span>
							<span class="text-body-1"> {{ formData.productName }} </span>
						</VListItemTitle>
					</VListItem>

					<VListItem>
						<VListItemTitle class="text-sm">
							<span class="font-weight-medium">{{ tt("OrderTime") }} :</span>
							<span class="text-body-1"> {{ formData.createTime }} </span>
						</VListItemTitle>
					</VListItem>
				</VList>

				<!-- 支付信息 -->
				<div class="d-flex">
					<h2 style="margin-right: 1.25rem">{{ tt("PaymentInformation") }}</h2>
					<VChip v-bind="resolveStatus(formData.status)" size="small" />
				</div>
				<VDivider class="mb-5 mt-5" />

				<!-- 支付信息 -->
				<div>
					<!-- 待支付 -->
					<VList v-if="formData.status == 0" class="card-list">
						<VListItem>
							<VListItemTitle class="text-sm">
								<span class="font-weight-medium">{{ tt("PaymentMethod") }} :</span>
								<VRow class="mt-3">
									<!-- 付款方式 -->
									<VCol md="7" cols="12">
										<v-radio-group v-model="formData.payChannel">
											<VRow>
												<VCol md="6" cols="12">
													<!-- 微信 -->
													<v-radio class="border-sm rounded-lg" :label="tt('WeChatPay')" value="1">
														<template #label>
															<div class="d-flex align-center" style="padding-top: 10px; padding-bottom: 10px">
																<!-- 图片部分 -->
																<img
																	:src="WechatIcon"
																	style="
																		width: 3.5rem;
																		height: 3.5rem;
																		border-radius: 0.5rem;
																		margin-right: 0.75rem;
																	"
																/>

																<!-- 文字描述 -->
																<div class="text-h6">{{ tt("WeChatPay") }}</div>
															</div>
														</template>
													</v-radio>
												</VCol>

												<VCol md="6" cols="12">
													<!-- 支付宝 -->
													<v-radio class="border-sm rounded-lg" :label="tt('Alipay')" value="2">
														<template #label>
															<div class="d-flex align-center" style="padding-top: 10px; padding-bottom: 10px">
																<!-- 图片部分 -->
																<img
																	:src="AlipayIcon"
																	style="
																		width: 3.5rem;
																		height: 3.5rem;
																		border-radius: 0.5rem;
																		margin-right: 0.75rem;
																	"
																/>

																<!-- 文字描述 -->
																<div class="text-h6">{{ tt("Alipay") }}</div>
															</div>
														</template>
													</v-radio>
												</VCol>

												<VCol md="6" cols="12">
													<!-- 境外 -->
													<v-radio class="border-sm rounded-lg" :label="tt('InternationalPayment')" value="3">
														<template #label>
															<div class="d-flex align-center" style="padding-top: 10px; padding-bottom: 10px">
																<!-- 图片部分 -->
																<img
																	:src="InternationalIcon"
																	style="
																		width: 3.5rem;
																		height: 3.5rem;
																		border-radius: 0.5rem;
																		margin-right: 0.75rem;
																	"
																/>

																<!-- 文字描述 -->
																<div class="text-h6">{{ tt("InternationalPayment") }}</div>
															</div>
														</template>
													</v-radio>
												</VCol>

												<VCol md="6" cols="12">
													<!-- 对公 -->
													<v-radio class="border-sm rounded-lg" :label="tt('CorporatePayment')" value="4">
														<template #label>
															<div class="d-flex align-center" style="padding-top: 10px; padding-bottom: 10px">
																<!-- 图片部分 -->
																<img
																	:src="CorporateIcon"
																	style="
																		width: 3.5rem;
																		height: 3.5rem;
																		border-radius: 0.5rem;
																		margin-right: 0.75rem;
																	"
																/>

																<!-- 文字描述 -->
																<div class="text-h6">{{ tt("CorporatePayment") }}</div>
															</div>
														</template>
													</v-radio>
												</VCol>
											</VRow>
										</v-radio-group>
									</VCol>

									<!-- 支付二维码 && 汇款信息 -->
									<VCol md="5" cols="12">
										<div class="d-flex align-center" style="height: 100%">
											<VDivider class="me-4" vertical />
											<div style="height: 100%; width: 100%">
												<img v-if="formData.payChannel != 4" src="" alt="" />
												<h3 v-else-if="formData.payChannel == 4">{{ tt("WireTransferDetails") }}</h3>
												<VList v-if="formData.payChannel == 4" density="compact">
													<!-- 企业全称 -->
													<VListItem>
														<span> {{ tt("FullCompanyName") }}： </span>
														<span class="text-body-1" style="white-space: normal; overflow: hidden">{{
															wtDetails.enterpriseName
														}}</span>
													</VListItem>

													<!-- 银行账户 -->
													<VListItem>
														<span> {{ tt("BankAccount") }}： </span>
														<span class="text-body-1" style="white-space: normal; overflow: hidden">{{
															wtDetails.bankAccount
														}}</span>
													</VListItem>

													<!-- 开户行 -->
													<VListItem>
														<span> {{ tt("BankName") }}： </span>
														<span class="text-body-1" style="white-space: normal; overflow: hidden">{{
															wtDetails.bankName
														}}</span>
													</VListItem>

													<!-- 转账备注 -->
													<VListItem>
														<span> {{ tt("PaymentReference") }}： </span>
														<span class="text-body-1" style="white-space: normal; overflow: hidden">{{
															wtDetails.remark
														}}</span>
													</VListItem>

													<!-- 转账金额 -->
													<VListItem>
														<span> {{ tt("TransferAmount") }}： </span>
														<span class="text-body-1" style="white-space: normal; overflow: hidden">
															{{ formData.amountCurrency == 1 ? `¥${formData.amountTotal} CNY` : `$${formData.amountTotal} USD` }}
														</span>
													</VListItem>
												</VList>
											</div>
										</div>
									</VCol>
								</VRow>
							</VListItemTitle>
						</VListItem>
					</VList>

					<!-- 已支付 -->
					<div v-if="formData.status == 1">
						<VList v-if="formData.payChannel != 4" class="card-list">
							<!-- 支付时间 -->
							<VListItem>
								<VListItemTitle class="text-sm">
									<span class="font-weight-medium">{{ tt("PaymentTime") }} :</span>
									<span class="text-body-1"> {{ formData.payTime }} </span>
								</VListItemTitle>
							</VListItem>

							<!-- 付款方式 -->
							<VListItem>
								<VListItemTitle class="text-sm">
									<div class="d-flex align-center">
										<span class="font-weight-medium">{{ tt("PaymentMethod") }} :</span>
										<span class="text-body-1">
											<div class="d-flex align-center">
												<!-- <VImg :src="resolvePaymentMethod(formData.payChannel).icon" /> -->
												<VImg src="" />
												<span>{{ resolvePaymentMethod(formData.payChannel).text }}</span>
											</div>
										</span>
									</div>
								</VListItemTitle>
							</VListItem>

							<!-- 付款方 -->
							<VListItem>
								<VListItemTitle class="text-sm">
									<span class="font-weight-medium">{{ tt("Payer") }} :</span>
									<span class="text-body-1"> {{ formData.phone }} </span>
								</VListItemTitle>
							</VListItem>

							<!-- 支付金额 -->
							<VListItem>
								<VListItemTitle class="text-sm">
									<span class="font-weight-medium">{{ tt("PaymentAmount") }} :</span>
									<span class="text-body-1"> {{ formData.amountTotal }} </span>
								</VListItemTitle>
							</VListItem>
						</VList>

						<!-- 对公支付 -->
						<VList v-else class="card-list">
							<!-- 支付时间 -->
							<VListItem>
								<VListItemTitle class="text-sm">
									<span class="font-weight-medium">{{ tt("PaymentTime") }} :</span>
									<span class="text-body-1"> {{ formData.payTime }} </span>
								</VListItemTitle>
							</VListItem>

							<!-- 付款方式 -->
							<VListItem>
								<VListItemTitle class="text-sm">
									<div class="d-flex align-center">
										<span class="font-weight-medium">{{ tt("PaymentMethod") }} :</span>
										<span class="text-body-1">
											<div class="d-flex align-center">
												<VImg :width="80" :src="resolvePaymentMethod(formData.payChannel).icon" />
												<span>{{ resolvePaymentMethod(formData.payChannel).text }}</span>
											</div>
										</span>
									</div>
								</VListItemTitle>
							</VListItem>

							<!-- 付款方 -->
							<VListItem>
								<VListItemTitle class="text-sm">
									<span class="font-weight-medium">{{ tt("Payer") }} :</span>
									<span class="text-body-1"> {{ formData.phone }} </span>
								</VListItemTitle>
							</VListItem>

							<!-- 企业全称 -->
							<VListItem>
								<VListItemTitle class="text-sm">
									<span class="font-weight-medium">{{ tt("FullCompanyName") }} :</span>
									<span class="text-body-1"> {{ formData.enterpriseName }} </span>
								</VListItemTitle>
							</VListItem>

							<!-- 付款回执 -->
							<VListItem>
								<VListItemTitle class="text-sm">
									<span class="font-weight-medium">{{ tt("PaymentReceipt") }} :</span>
									<span class="text-body-1">
										<VImg
											v-if="formData.paymentReceiptFile && formData.paymentReceiptFile.length >= 1"
											:src="formData.paymentReceiptFile[0].link"
											:max-width="200"
										/>
										<span v-else> - </span>
									</span>
								</VListItemTitle>
							</VListItem>
						</VList>
					</div>

					<!-- 支付确认中 -->
					<div v-if="formData.status == 3">
						<VList v-if="formData.payChannel != 4" class="card-list">
							<!-- 支付时间 -->
							<VListItem>
								<VListItemTitle class="text-sm">
									<span class="font-weight-medium">{{ tt("PaymentTime") }} :</span>
									<span class="text-body-1" style="white-space: normal; overflow: hidden"> {{ formData.payTime }} </span>
								</VListItemTitle>
							</VListItem>

							<!-- 付款方式 -->
							<VListItem>
								<VListItemTitle class="text-sm">
									<div class="d-flex align-center">
										<span class="font-weight-medium">{{ tt("PaymentMethod") }} :</span>
										<span class="text-body-1">
											<div class="d-flex align-center">
												<img
													:src="resolvePaymentMethod(formData.payChannel).icon"
													style="width: 3.5rem; height: 3.5rem; border-radius: 0.5rem; margin-right: 0.75rem"
												/>
												<span>{{ resolvePaymentMethod(formData.payChannel).text }}</span>
											</div>
										</span>
									</div>
								</VListItemTitle>
							</VListItem>

							<!-- 付款方 -->
							<VListItem>
								<VListItemTitle class="text-sm">
									<span class="font-weight-medium">{{ tt("Payer") }} :</span>
									<span class="text-body-1" style="white-space: normal; overflow: hidden"> {{ formData.phone }} </span>
								</VListItemTitle>
							</VListItem>

							<!-- 支付金额 -->
							<VListItem>
								<VListItemTitle class="text-sm">
									<span class="font-weight-medium">{{ tt("PaymentAmount") }} :</span>
									<span class="text-body-1" style="white-space: normal; overflow: hidden"> {{ formData.amountTotal }} </span>
								</VListItemTitle>
							</VListItem>
						</VList>

						<!-- 对公支付 -->
						<VList v-else class="card-list">
							<!-- 支付时间 -->
							<VListItem>
								<VListItemTitle class="text-sm">
									<span class="font-weight-medium">{{ tt("PaymentTime") }} :</span>
									<span class="text-body-1" style="white-space: normal; overflow: hidden"> {{ formData.payTime }} </span>
								</VListItemTitle>
							</VListItem>

							<!-- 付款方式 -->
							<VListItem>
								<VListItemTitle class="text-sm">
									<div class="d-flex align-center">
										<span class="font-weight-medium">{{ tt("PaymentMethod") }} :</span>
										<span class="text-body-1">
											<div class="d-flex align-center">
												<img
													style="width: 2.7rem; height: 2.7rem; border-radius: 0.5rem; margin-right: 0.75rem"
													:src="resolvePaymentMethod(formData.payChannel).icon"
												/>
												<span>{{ resolvePaymentMethod(formData.payChannel).text }}</span>
											</div>
										</span>
									</div>
								</VListItemTitle>
							</VListItem>

							<!-- 付款方 -->
							<VListItem>
								<VListItemTitle class="text-sm">
									<span class="font-weight-medium">{{ tt("Payer") }} :</span>
									<span class="text-body-1" style="white-space: normal; overflow: hidden"> {{ formData.phone }} </span>
								</VListItemTitle>
							</VListItem>

							<!-- 企业全称 -->
							<VListItem>
								<VListItemTitle class="text-sm">
									<span class="font-weight-medium">{{ tt("FullCompanyName") }} :</span>
									<span class="text-body-1" style="white-space: normal; overflow: hidden"> {{ formData.enterpriseName }} </span>
								</VListItemTitle>
							</VListItem>

							<!-- 付款回执 -->
							<VListItem>
								<VListItemTitle class="text-sm">
									<span class="font-weight-medium">{{ tt("PaymentReceipt") }} :</span>
									<span class="text-body-1">
										<VImg
											v-if="formData.paymentReceiptFile && formData.paymentReceiptFile.length >= 1"
											:src="formData.paymentReceiptFile[0].link"
											:max-width="200"
										/>
										<span v-else> - </span>
									</span>
								</VListItemTitle>
							</VListItem>
						</VList>
					</div>

					<!-- 支付失败 或 支付失效 -->
					<VList v-if="formData.status == 4 || formData.status == 2" class="card-list">
						<!-- 支付时间 -->
						<VListItem>
							<VListItemTitle class="text-sm">
								<span class="font-weight-medium">{{ tt("PaymentTime") }} :</span>
								<span class="text-body-1"> - </span>
							</VListItemTitle>
						</VListItem>

						<!-- 付款方式 -->
						<VListItem>
							<VListItemTitle class="text-sm">
								<div class="d-flex align-center">
									<span class="font-weight-medium">{{ tt("PaymentMethod") }} :</span>
									<span class="text-body-1"> - </span>
								</div>
							</VListItemTitle>
						</VListItem>

						<!-- 付款方 -->
						<VListItem>
							<VListItemTitle class="text-sm">
								<span class="font-weight-medium">{{ tt("Payer") }} :</span>
								<span class="text-body-1"> - </span>
							</VListItemTitle>
						</VListItem>
					</VList>
				</div>

				<div v-if="formData.status == 0 && formData.payChannel == 4">
					<VDivider class="mb-5 mt-5" />

					<div v-if="formData.payChannel == 4" class="d-flex justify-center">
						<div style="border-radius: 1rem; padding: 0.3rem 1rem 0.3rem 1rem; font-size: 13px; background-color: #fee2e3; color: #ff4c51">
							{{ tt("AfterSelectingCorporateTransfer") }}
						</div>
					</div>

					<VForm @submit.prevent="submitCorporatePayment">
						<VRow class="mt-5 mb-4">
							<!-- 公司全称 -->
							<VCol md="6" cols="12">
								<v-text-field
									v-model="corporateForm.enterpriseName"
									:label="tt('FullCompanyName')"
									density="compact"
									:rules="enterpriseNameRules"
                                    :counter="50" 
                                    :maxlength="50"
									required
								/>
							</VCol>

							<!-- 联系电话 -->
							<VCol md="6" cols="12">
								<v-text-field v-model="corporateForm.phone" :label="tt('Phone')" density="compact" :rules="phoneRules" required>
									<template #prepend>
										<v-select v-model="corporateForm.phonePrefix" :items="$phonePrefix" />
									</template>
								</v-text-field>
							</VCol>
							<VCol md="12" cols="12">
								<v-file-input
									v-model="selectedFile"
									accept=".png, .jpg, image/png, image/jpeg"
									color="deep-purple-accent-4"
									:label="tt('PaymentReceipt')"
									:rules="fileRules"
									@click:clear="clearFile"
								>
									<template #selection="{ fileNames }">
										<template v-for="fileName in fileNames" :key="fileName">
											<v-chip class="me-2" color="deep-purple-accent-4" size="small" label>
												{{ fileName }}
											</v-chip>
										</template>
									</template>
								</v-file-input>
							</VCol>
						</VRow>

						<VRow class="d-flex justify-end">
							<VCol md="9" cols="12">
								<div class="mt-4 d-flex" style="justify-content: flex-end; flex-wrap: wrap; width: 100%" @click.stop>
									{{ tt("AfterSuccessfulPayment") }}
									{{ tt("comma") }}
									{{ tt("YouCanRequestAnInvoiceOnTheOrderPage") }}
									<NuxtLink class="text-primary" style="cursor: pointer" @click.stop="handelPolicy">
										{{ tt("InvoiceInstructions") }}
									</NuxtLink>
								</div>
							</VCol>

							<VCol md="3" cols="12">
								<VBtn class="mt-2" type="submit" block>
									{{ tt("Submit") }}
								</VBtn>
							</VCol>
						</VRow>
					</VForm>
				</div>
			</div>
		</VCardText>
	</VCard>

	<PrivacyPolicy ref="PrivacyPolicyRef" />
</template>

<style lang="scss" scoped>
.font-weight-medium {
	margin-right: 0.75rem;
}
</style>
