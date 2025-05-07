export const getPage = (current, size, params) => {
	return getApi("/sciapi/api/analysisTask/page", {
		method: "post",
		params: {
			...params,
			current,
			size,
		},
	});
};

export const getDetail = id => {
	return getApi("/sciapi/api/analysisTask/detail", {
		method: "post",
		params: {
			id,
		},
	});
};

export const update = body => {
	return getApi("/sciapi/api/analysisTask/update", {
		method: "post",
		body,
	});
};

export const remove = ids => {
	return getApi("/sciapi/api/analysisTask/delete", {
		method: "post",
		params: {
			ids,
		},
	});
};

export const pauseTask = id => {
	return getApi("/sciapi/api/analysisTask/pauseTask", {
		method: "post",
		params: {
			id,
		},
	});
};

export const startTask = id => {
	return getApi("/sciapi/api/analysisTask/startTask", {
		method: "post",
		params: {
			id,
		},
	});
};
export const exportExcel = params => {
	return getApi("/sciapi/api/analysisTask/exportExcel", {
		method: "post",
		responseType: "blob",
		params: {
			...params,
		},
	});
};
