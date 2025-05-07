export const getListConfiguration = params => {
	return getApi("/sciapi/api/homepageConfig/list", {
		method: "post",
		params: {
			...params,
		},
	});
};

export const getPageConfiguration = (current, size, params) => {
	return getApi("/sciapi/api/homepageConfig/page", {
		method: "post",
		params: {
			current,
			size,
			...params,
		},
	});
};

export const getDetail = params => {
	return getApi("/sciapi/api/homepageConfig/detail", {
		method: "post",
		params: {
			...params,
		},
	});
};
// 获取点赞数量
export const getLikeCount = params => {
	return getApi("/sciapi/api/homepageConfig/getLikeCount", {
		method: "post",
		params: {
			...params,
		},
	});
};

// 点赞
export const like = id => {
	return getApi("/sciapi/api/homepageConfig/update/like", {
		method: "post",
		params: {
			id,
		},
	});
};
// 取消点赞
export const cancelLike = id => {
	return getApi("/sciapi/api/homepageConfig/update/cancelLike", {
		method: "post",
		params: {
			id,
		},
	});
};

// 获取权益列表
export const getLevelBenefit = params => {
	return getApi("/sciapi/api/member/levelBenefit/list", {
		method: "post",
		params: {
			...params,
		},
	});
};

// 获取工具列表
export const getToolList = params => {
	return getApi("/sciapi/api/member/levelBenefit/list/tool", {
		method: "post",
		params: {
			...params,
		},
	});
};
