<script setup>
import { validatePhoneNumber } from "@/@core/utils/validators";
import { levelBenefitDetail, orderConfigDetail, orderCorporateTransfer, orderInfoDetail, orderSubmit } from "@/api/orderManagement";
import AlipayIcon from "@images/pages/AliPayIcon.png";
import CorporateIcon from "@images/pages/CorporatePaymentIcon.png";
import InternationalIcon from "@images/pages/InternationalPaymentIcon.png";
import WechatIcon from "@images/pages/WechatPayIcon.png";

const route = useRoute();
const userStore = useUserStore();

// const { $phonePrefix } = useNuxtApp();

const { t } = useI18n();
const tt = str => t("orderManagement." + str);

// const userStore = useUserStore();

let formData = ref({});
const wtDetails = ref({}); // 汇款信息

const corporateForm = ref({
	enterpriseName: "",
	phone: "",
	paymentReceipt: "",
}); // 对公转账填写表单

const selectedFile = ref(null);

const fileRules = ref([
	file => {
		if (file.length == 0) return tt("PaymentReceiptIsRequired");

		return file.length >= 1 || file[0].size <= 2 * 1024 * 1024 || tt("FileSizeMustNotExceed");
	},
	file => {
		return ["image/jpeg", "image/png"].includes(file[0].type) || tt("SupportedFormats");
	},
]);

const files = ref([]);

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

// 订单类型
const resolveProductType = productType => {
	if (productType == 1) {
		return "会员升级";
	} else {
		return "";
	}
};

const back = () => {
	navigateTo("/personalCenter/orderManagement");
};

let userInfo = userStore.getUserData;
const { timeType, type, id } = route.query;

console.log(route, "route");
function formatDate(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 初始化数据及创建订单
levelBenefitDetail(id).then(res => {
	let data = res.data;
	const now = new Date();

	now.setTime(now.getTime() + 60 * 60 * 1000);
	corporateForm.value.phonePrefix = "+86";

	const params = {
		status: 0,
		orderNo: new Date().getTime(), // 订单号
		userId: userInfo.user_id,
		amountTotal:
			type == "zh"
				? timeType == 0
					? data.memberLevelMaintenance?.monthlyPriceCny || "11"
					: data.memberLevelMaintenance?.yearPriceCny || "11"
				: timeType == 0
					? data.memberLevelMaintenance?.monthlyPriceUsd || "11"
					: data.memberLevelMaintenance?.yearPriceUsd || "11", // 订单金额
		amountCurrency: type == "zh" ? 1 : 2, // 金额类型 （1：CNY 2：USD）
		payTime: null, // 支付时间
		effectiveTime: null, // 生效时间
		payChannel: null, // 支付方式 （1：微信 2：支付包 3：信用卡 4:对公支付）
		productType: 1, // 订单类型 （1：会员升级）
		productPrice:
			type == "zh"
				? timeType == 0
					? data.memberLevelMaintenance?.monthlyPriceCny || ""
					: data.memberLevelMaintenance?.yearPriceCny || ""
				: timeType == 0
					? data.memberLevelMaintenance?.monthlyPriceUsd || ""
					: data.memberLevelMaintenance?.yearPriceUsd || "", // 商品价格
		productName: type == "zh" ? data.memLevelsZh : data.memLevelsEn, // 商品名称
		productId: data.id, // 商品ID
		productDay: 10, //
		payExpirationTime: formatDate(now), // 到期时间
		enterpriseName: null,
		phone: null,
		paymentReceipt: null, // 付款回执 附件ID
	};

	orderSubmit(params).then(res => {
		orderInfoDetail(params.orderNo).then(res => {
			formData.value = res.data;
		});
	});
});

// 获取企业信息
orderConfigDetail().then(res => {
	wtDetails.value = res.data;
});

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

const resolvePaymentMethod = PaymentMethod => {
	const PaymentMethodMap = new Map([
		[1, { text: tt("WeChatPay"), icon: WechatIcon }],
		[2, { text: tt("Alipay"), icon: AlipayIcon }], // 无color时可不定义
		[3, { text: tt("InternationalPayment"), icon: InternationalIcon }],
		[4, { text: tt("CorporatePayment"), icon: CorporateIcon }],
	]);

	return PaymentMethodMap.get(PaymentMethod);
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

		orderCorporateTransfer({ ...corporateForm.value, ...{ phone: corporateForm.value.phonePrefix + " " + corporateForm.value.phone } }).then(
			res => {
				if (res.code == 200) {
					corporateForm.value = {};
					formData.value = {};
					alert("success", tt("SubmissionSuccessful"));
					navigateTo("/personalCenter/orderManagement");
				} else {
					alert("error", tt("SubmissionFailed"));
				}
			},
		);
	}
};
</script>

<template>
	<!-- eslint-disable vue/attribute-hyphenation -->

	<div class="payment-page">
		<!-- 👉 Payment card  -->
		<VContainer>
			<VCard width="100%">
				<VCardText>
					<div>
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
									<span class="text-body-1"> {{ resolveProductType(formData?.productType) }} </span>
								</VListItemTitle>
							</VListItem>

							<VListItem>
								<VListItemTitle class="text-sm">
									<span class="font-weight-medium">{{ tt("MemberLevel") }} :</span>
									<span class="text-body-1"> {{ formData?.productName }} </span>
								</VListItemTitle>
							</VListItem>

							<VListItem>
								<VListItemTitle class="text-sm">
									<span class="font-weight-medium">{{ tt("OrderTime") }} :</span>
									<span class="text-body-1"> {{ formData?.createTime }} </span>
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
										<VRow>
											<!-- 付款方式 -->
											<VCol md="7" cols="12">
												<v-radio-group v-model="formData.payChannel" class="mt-5">
													<VRow>
														<VCol md="6" cols="12">
															<!-- 微信 -->
															<v-radio class="border-sm rounded-lg" style="" :label="tt('WeChatPay')" value="1">
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
													<VDivider class="mr-4" vertical />
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
																	{{ formData.amountCurrency == 1 ? "CN¥" : "US$" }} {{ formData.amountTotal }}
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
						</div>

						<div v-if="formData.status == 0 && formData.payChannel == 4">
							<VDivider class="mb-5 mt-5" />

							<div v-if="formData.payChannel == 4" class="d-flex justify-center">
								<div
									style="
										border-radius: 1rem;
										padding: 0.3rem 1rem 0.3rem 1rem;
										font-size: 13px;
										background-color: #fee2e3;
										color: #ff4c51;
									"
								>
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
										<v-text-field
											v-model="corporateForm.phone"
											:label="tt('Phone')"
											density="compact"
											:rules="phoneRules"
											required
										>
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
										>
											<template #selection="{ fileNames }">
												<template v-for="(fileName, index) in fileNames" :key="fileName">
													<v-chip v-if="index < 2" class="me-2" color="deep-purple-accent-4" size="small" label>
														{{ fileName }}
													</v-chip>

													<span v-else-if="index === 2" class="text-overline text-grey-darken-3 mx-2">
														+{{ files.length - 2 }} File(s)
													</span>
												</template>
											</template>
										</v-file-input>
									</VCol>
								</VRow>

								<VRow class="d-flex justify-end">
									<VCol md="7" cols="12">
										<div class="mt-4 d-flex" style="justify-content: flex-end; flex-wrap: wrap; width: 100%" @click.stop>
											{{ tt("AfterSuccessfulPayment") }}
											{{ tt("comma") }}
											{{ tt("YouCanRequestAnInvoiceOnTheOrderPage") }}
											<NuxtLink class="text-primary ml-2" style="cursor: pointer" @click.stop="">
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
		</VContainer>
	</div>
</template>

<style lang="scss" scoped>
.footer {
	position: static !important;
	inline-size: 100%;
	inset-block-end: 0;
}

.payment-card {
	margin-block: 9.25rem 5.25rem;
}

.payment-page {
	@media (min-width: 600px) and (max-width: 90%) {
		.v-container {
			padding-inline: 2rem !important;
		}
	}
}
</style>

<style lang="scss">
.payment-card {
	.custom-radio {
		.v-radio {
			margin-block-start: 0 !important;
		}
	}
}
</style>
