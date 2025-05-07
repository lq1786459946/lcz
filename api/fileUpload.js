import { Base64 } from "js-base64";
export const uploadVFileInput = file => {
	const formData = new FormData();
	formData.append("file", file);
	return $fetch("/sciapi/blade-resource/oss/endpoint/put-file-attach", {
		method: "post",
		body: formData,
		onRequest({ options }) {
			// 可在此处添加修改请求选项的逻辑
			let token;
			if (import.meta.client) token = useCookie("token");
			options.headers = Object.assign(options.headers ? options.headers : {}, {
				"Blade-Requested-With": "BladeHttpRequest",
				Authorization: `Basic ${Base64.encode(`saber:saber_secret`)}`,
				"Tenant-id": "000000",
			});
			if (token.value) {
				options.headers["Blade-Auth"] = `Bearer ${token.value}`;
			}
		},
	});
};
