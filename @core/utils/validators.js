import { isEmpty, isEmptyArray, isNullOrUndefined } from "./helpers";
export const requiredValidator = value => {
	const userStore = useUserStore();
	const lang = userStore.getLanguage; //
	const errorMessages = {
		zh: "此字段为必填项",
		en: "This field is required",
	};
	if (isNullOrUndefined(value) || isEmptyArray(value) || value === false) return errorMessages[lang] || errorMessages.zh; // 若语言不存在，默认英文
	return !!String(value).trim().length || errorMessages[lang] || errorMessages.en;
};

// 👉 Email Validator
export const emailValidator = value => {
	if (isEmpty(value)) return true;
	const re = /^(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*|".+")@(?:\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]|(?:[a-z\-\d]+\.)+[a-z]{2,})$/i;
	if (Array.isArray(value)) return value.every(val => re.test(String(val))) || "The Email field must be a valid email";

	return re.test(String(value)) || "The Email field must be a valid email";
};

// 👉 Password Validator
export const passwordValidator = password => {
	const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;
	const validPassword = regExp.test(password);

	return validPassword || "Field must contain at least one uppercase, lowercase, special character and digit with min 8 chars";
};

// 👉 Confirm Password Validator
export const confirmedValidator = (value, target) => value === target || "The Confirm Password field confirmation does not match";

// 👉 Between Validator
export const betweenValidator = (value, min, max) => {
	const valueAsNumber = Number(value);

	return (Number(min) <= valueAsNumber && Number(max) >= valueAsNumber) || `Enter number between ${min} and ${max}`;
};

// 👉 Integer Validator
export const integerValidator = value => {
	if (isEmpty(value)) return true;
	if (Array.isArray(value)) return value.every(val => /^-?\d+$/.test(String(val))) || "This field must be an integer";

	return /^-?\d+$/.test(String(value)) || "This field must be an integer";
};

// 👉 Regex Validator
export const regexValidator = (value, regex) => {
	if (isEmpty(value)) return true;
	let regeX = regex;
	if (typeof regeX === "string") regeX = new RegExp(regeX);
	if (Array.isArray(value)) return value.every(val => regexValidator(val, regeX));

	return regeX.test(String(value)) || "The Regex field format is invalid";
};

// 👉 Alpha Validator
export const alphaValidator = value => {
	if (isEmpty(value)) return true;

	return /^[A-Z]*$/i.test(String(value)) || "The Alpha field may only contain alphabetic characters";
};

// 👉 URL Validator
export const urlValidator = value => {
	if (isEmpty(value)) return true;
	const re = /^https?:\/\/[^\s$.?#].\S*$/;

	return re.test(String(value)) || "URL is invalid";
};

// 👉 Length Validator
export const lengthValidator = (value, length) => {
	if (isEmpty(value)) return true;

	return String(value).length === length || `The Min Character field must be at least ${length} characters`;
};

// 👉 Alpha-dash Validator
export const alphaDashValidator = value => {
	if (isEmpty(value)) return true;
	const valueAsString = String(value);

	return /^[\w-]*$/.test(valueAsString) || "All Character are not valid";
};

// 手机号校验函数
export const validatePhoneNumber = (phonePrefix, phoneNumber) => {
	const phoneRules = {
		"+86": /^1[3-9]\d{9}$/, // 中国大陆
		"+1": /^[2-9]\d{9}$/, // 美国/加拿大
		"+44": /^7[0-9]{9}$/, // 英国
		"+61": /^4\d{8}$/, // 澳大利亚
		"+81": /^[789]0\d{8}$/, // 日本
		"+82": /^1[0-9]{8,9}$/, // 韩国
		"+49": /^1[5-7]\d{9}$/, // 德国
		"+33": /^[67]\d{8}$/, // 法国
		"+7": /^[3489]\d{9}$/, // 俄罗斯
		"+91": /^[6789]\d{9}$/, // 印度
		"+55": /^[1-9]{2}9[0-9]{8}$/, // 巴西
		"+65": /^[89]\d{7}$/, // 新加坡
		"+852": /^[569]\d{7}$/, // 香港
		"+886": /^[9]\d{8}$/, // 台湾
		"+853": /^6\d{7}$/, // 澳门
		"+39": /^3\d{8,9}$/, // 意大利
		"+34": /^[67]\d{8}$/, // 西班牙
		"+31": /^6\d{8}$/, // 荷兰
		"+41": /^7[5-9]\d{7}$/, // 瑞士
	};
	// 如果区号不在规则中，返回错误信息
	if (!phoneRules[phonePrefix]) {
		return "login.InvalidPhonePrefix";
	}
	// 如果手机号不符合规则，返回错误信息
	if (!phoneRules[phonePrefix].test(phoneNumber)) {
		return "login.The current phone number format is incorrect";
	}
	// 校验通过返回true
	return true;
};

// 邮箱校验函数
export const validateEmail = email => {
	// 检测域名部分是否包含非法字符
	const domain = email.split("@")[1];
	const invalidChars = /[。，；：！？（）【】{}|、]/; // 添加更多非法字符
	if (invalidChars.test(domain)) {
		return "login.InvalidEmailFormat";
	}
	// 检测是否包含中文
	const hasChinese = /[\u4e00-\u9fa5]/.test(email);
	if (hasChinese) {
		return "login.InvalidEmailFormat";
	}
	// 邮箱格式校验
	const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	if (!regex.test(email)) {
		return "login.InvalidEmailFormat";
	}

	return true;
};

// 👉 密码校验函数
export const validatePassword = password => {
	// 长度校验
	if (password.length < 8 || password.length > 16) {
		return "login.passwordLengthError";
		// 密码长度必须在8到16个字符之间;
	}
	// 字符类型校验
	const hasLetter = /[a-zA-Z]/.test(password);
	const hasNumber = /\d/.test(password);
	const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

	// 至少包含两种类型
	const typeCount = [hasLetter, hasNumber, hasSpecialChar].filter(Boolean).length;
	if (typeCount < 2) {
		return "login.passwordTypeError";
		// 密码必须包含字母、数字和特殊字符中的至少两种
	}
	return true;
};

// 👉 用户名校验函数
export const validateUsername = username => {
	// 长度校验
	if (username.length < 2 || username.length > 20) {
		return "login.usernameLengthError";
	}
	// 字符类型校验
	const validChars = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/;
	if (!validChars.test(username)) {
		return "login.usernameInvalidChars";
	}

	return true;
};
