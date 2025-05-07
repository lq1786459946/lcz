export const getPage = (current, size, params) => {
	return getApi("/sciapi/api/feedback/page", {
		method: "post",
		params: {
			...params,
			current,
			size,
		},
	});
};

export const getList = params => {
	return getApi("/sciapi/api/feedback/list", {
		method: "post",
		params: {
			...params,
		},
	});
};

export const save = body => {
	return getApi("/sciapi/api/feedback/save", {
		method: "post",
		body,
	});
};

export const getDetail = id => {
	return getApi("/sciapi/api/feedback/detail", {
		method: "post",
		params: {
			id,
		},
	});
};

export const getDictionaryTree = params => {
	return getApi("/sciapi/api/dict-biz/dictionary-tree", {
		method: "get",
		params,
	});
};
export const getDictionary = params => {
	return getApi("/sciapi/api/dict-biz/dictionary", {
		method: "get",
		params,
	});
};
