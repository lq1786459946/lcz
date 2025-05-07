export const getToken = (email, password, phone, code, timeZone) => {
	return getApi("/sciapi/sci/oauth/token", {
		method: "post",
		headers: {
			"Time-Zone": timeZone,
		},
		params: {
			email,
			password,
			phone,
			code,
			grant_type: "sci_web",
		},
	});
};

export const refresh_token = () => {
	const userStore = useUserStore();
	return getApi("/sciapi/sci/oauth/token", {
		method: "post",
		params: {
			refresh_token: userStore.getRefreshToken,
			grant_type: "sci_web_refresh_token",
		},
	});
};

// 获取手机号验证码
export const getPhoneCode = (phone, codeType) => {
	return getApi("/sciapi/sci/sendSmsValidate", {
		method: "post",
		params: {
			phone,
			codeType,
		},
	});
};

// 获取邮箱验证码
export const getEmailCode = (email, codeType) => {
	return getApi("/sciapi/sci/sendEmailValidate", {
		method: "post",
		params: {
			email,
			codeType,
		},
	});
};

// 邮箱验注册
export const register = (email, code, nick, password, confirmPassword) => {
	return getApi("/sciapi/sci/register", {
		method: "post",
		params: {
			email,
			code,
			nick,
			password,
			confirmPassword,
		},
	});
};

// 重置密码
export const resetPassword = (email, phone, code, password, confirmPassword) => {
	return getApi("/sciapi/sci/resetPassword", {
		method: "post",
		params: {
			email,
			phone,
			code,
			password,
			confirmPassword,
		},
	});
};

// 修改绑定
export const bindAccount = (bindEmail, bindPhone, code) => {
	return getApi("/sciapi/sci/bindAccount", {
		method: "post",
		params: {
			bindEmail,
			bindPhone,
			code,
		},
	});
};

// 设置修改密码
export const setPassword = (oldPassword, password, confirmPassword) => {
	return getApi("/sciapi/sci/setPassword", {
		method: "post",
		params: {
			oldPassword,
			password,
			confirmPassword,
		},
	});
};
