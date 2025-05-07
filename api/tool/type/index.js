export const getToolsTypelist = params => {
	return getApi("/sciapi/api/tools/type/treeList", {
		method: "post",
		params: {
			...params,
		},
	});
};

export const getTaskList = params => {
	return getApi("/sciapi/api/analysisTask/list", {
		method: "post",
		params: {
			...params,
		},
	});
};

export const getTreeToolList = () => {
	return getApi("/sciapi/api/tools/type/treeToolList", {
		method: "post",
	});
};
