export const getPage = (current, size, params) => {
	return getApi("/sciapi/api/tools/allToolsPage", {
		method: "post",
		params: {
			...params,
			current,
			size,
		},
	});
};
