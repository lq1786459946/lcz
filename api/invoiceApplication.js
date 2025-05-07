export const invoicePage = (current, size, params) => {
	return getApi("/sciapi/api/invoice/page", {
		method: "post",
		params: {
			...params,
			current,
			size,
		},
	});
};

export const orderList = () => {
	return getApi("/sciapi/api/invoice/orderInfo/list", {
		method: "post",
	});
};

export const invoiceSave = body => {
	return getApi("/sciapi/api/invoice/save", {
		method: "post",
		body,
	});
};
