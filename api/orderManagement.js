// 订单分页
export const orderPage = (current, size, params) => {
	return getApi("/sciapi/api/order/orderInfo/page", {
		method: "post",
		params: {
			...params,
			current,
			size,
		},
	});
};

// 订单详情
export const orderConfigDetail = () => {
	return getApi("/sciapi/api/invoice/detail/invoicingConfig", {
		method: "post",
		params: {},
	});
};

export const orderInfoDetail = orderNo => {
	return getApi("/sciapi/order/orderInfo/detail", {
		method: "post",
		params: { orderNo },
		headers: {
			"Blade-Requested-With": "BladeHttpRequest",
		},
	});
};

// 对公支付
export const orderCorporateTransfer = body => {
	return getApi("/sciapi/api/order/orderInfo/corporateTransfer", {
		method: "post",
		body,
	});
};

export const orderSubmit = body => {
	return getApi("/sciapi/order/orderInfo/submitOrder", {
		method: "post",
		body,
		headers: {
			"Blade-Requested-With": "BladeHttpRequest",
		},
	});
};

export const levelBenefitDetail = id => {
	return getApi("/sciapi/api/member/levelBenefit/detail", {
		method: "post",
		params: { id },
	});
};
