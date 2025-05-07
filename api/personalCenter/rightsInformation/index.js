import { getApi } from "@/composables/api.js";

export const getCurrentMember = params => {
	// return getApi("/sciapi/api/member/getCurrentMember", {
	// 	method: "post",
	// 	params: {
	// 		...params,
	// 	},
	// });
	return getApi("/sciapi/api/member/getCurrentMember", {
		method: "post",
		params: {
			...params,
		},
	});
};
export const getMemberBenifitsPage = (current, size) => {
	// return getApi("/sciapi/api/member/getMemberBenifitsPage", {
	// 	method: "post",
	// 	params: {
	// 		current,
	// 		size,
	// 	},
	// });
	return getApi("/sciapi/api/member/getMemberBenifitsPage", {
		method: "post",
		params: {
			current,
			size,
		},
	});
};
