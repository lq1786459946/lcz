import { getApi } from "@/composables/api.js";

export const updateMemberInfo = params => {
	// return getApi("/sciapi/api/member/updateMemberInfo", {
	// 	method: "post",
	// 	body: params,
	// });
	return getApi("/sciapi/api/member/updateMemberInfo", {
		method: "post",
		body: params,
	});
};
