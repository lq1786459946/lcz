export const getPage = (current, size, params) => {
	return getApi("/sciapi/api/toolFavorites/page", {
		method: "post",
		params: {
			...params,
			current,
			size,
		},
	});
};

export const getToolTypes = params => {
	return getApi("/sciapi/api/toolFavorites/getToolTypes", {
		method: "post",
		params: {
			...params,
		},
	});
};
export const save = body => {
	return getApi("/sciapi/api/toolFavorites/save", {
		method: "post",
		body,
	});
};

export const remove = ids => {
	return getApi("/sciapi/api/toolFavorites/delete", {
		method: "post",
		params: {
			ids,
		},
	});
};
