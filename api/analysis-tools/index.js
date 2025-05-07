export const toolTreeList = () => {
	return getApi("/sciapi/api/tools/leftSidebar", {
		method: "post",
	});
};
// 生物-分析工具-工具配置参数列表
export const parameterList = params => {
	return getApi("/sciapi/api/tools/parameterList", {
		method: "post",
		params,
	});
};
// 应用案例详情
export const caseDetail = params => {
	return getApi("/sciapi/api/tools/caseDetail", {
		method: "post",
		params,
	});
};
// 工具说明详情
export const descriptionDetail = params => {
	return getApi("/sciapi/api/tools/descriptionDetail", {
		method: "post",
		params,
	});
};
// seo配置详情
export const seoDetail = params => {
	return getApi("/sciapi/api/tools/seoDetail", {
		method: "post",
		params,
	});
};
// 下一步分析工具列表
export const selectNextTools = params => {
	return getApi("/sciapi/task/selectNextTools", {
		method: "post",
		params,
	});
};
// 生物医学_分析任务-提交(新建任务)
export const analysisTaskSubmit = body => {
	return getApi("/sciapi/api/analysisTask/submit", {
		method: "post",
		body,
	});
};
// 生物医学_分析任务-详情
export const analysisTaskDetail = params => {
	return getApi("/sciapi/api/analysisTask/detail", {
		method: "post",
		params,
	});
};
// 生物医学_分析任务-微调
export const submitFineTuning = body => {
	return getApi("/sciapi/api/analysisTask/submit/fineTuning", {
		method: "post",
		body,
	});
};
// 生物-分析工具详情
export const toolDetail = params => {
	return getApi("/sciapi/api/tools/toolDetail", {
		method: "post",
		params,
	});
};
// 后台提交(新建任务)
export const submitBackend = body => {
	return getApi("/sciapi/api/analysisTask/submit/backend", {
		method: "post",
		body,
	});
};
// 生物医学_分析任务-后台微调
export const fineTuningBackend = params => {
	return getApi("/sciapi/api/analysisTask/submit/fineTuning/backend", {
		method: "post",
		params,
	});
};
