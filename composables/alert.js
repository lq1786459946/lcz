/**
 * type: primary(主题色),success(绿色),secondary(灰色),info(蓝色),warning(警告),error(红色)
 **/
export const alert = (type = "primary", msg = "操作成功！", icon = "ri-checkbox-circle-line") => {
	const parent = document.createElement("div");
	parent.className = `v-alert v-theme--light bg-${type} v-alert--density-default v-alert--variant-flat`;
	const span = document.createElement("span");
	span.className = "v-alert__underlay";
	const prepend = document.createElement("div");
	prepend.className = "v-alert__prepend";
	const i = document.createElement("i");
	i.className = `${icon} v-icon notranslate v-theme--light`;
	i.style = "font-size: 18px;margin-right:5px";
	i.setAttribute("aria-hidden", "true");
	i.setAttribute("density", "default");
	prepend.appendChild(i);
	const content = document.createElement("div");
	content.className = "v-alert__content";
	content.innerHTML = msg;
	parent.appendChild(span);
	parent.appendChild(i);
	parent.appendChild(content);
	document.body.appendChild(parent);
	// 获取元素宽度
	const elementWidth = parent.offsetWidth;
	// 获取屏幕宽度
	const screenWidth = window.innerWidth;
	// 计算元素新的左偏移量
	const newLeftOffset = (screenWidth - elementWidth) / 2;
	// 设置元素的左偏移量
	parent.style.left = newLeftOffset + "px";
	setTimeout(() => {
		document.body.removeChild(parent);
	}, 2000);
};
