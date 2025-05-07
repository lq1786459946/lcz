<script setup>
import { getListConfiguration } from "@/api/front-pages";
import email from "@images/svg/email.svg?raw";
import feedback from "@images/svg/feedback.svg?raw";
import phone from "@images/svg/phone.svg?raw";
import wechat from "@images/svg/wechat.svg?raw";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { useTheme } from "vuetify";
import FeedbackAdd from "../personalCenter/myFeedback/feedback-add.vue";
const theme = useTheme();
const { t } = useI18n();
// 确保在setup函数中调用useI18n
const { locale, setLocaleMessage } = useI18n({
	useScope: "global",
});
const isDark = ref(theme.name);
const formRef = ref(null);
const list = ref([
	{
		name: "home.WeChat",
		isHover: false,
		icon: h("div", { innerHTML: processSvgCopy(wechat), style: "line-height:0; color: rgb(var(--v-global-theme-primary))" }),
		serviceType: 2,
		data: [],
	},
	{
		name: "home.Phone",
		isHover: false,
		icon: h("div", { innerHTML: processSvgCopy(phone), style: "line-height:0; color: rgb(var(--v-global-theme-primary))" }),
		serviceType: 1,
		data: [],
	},
	{
		name: "login.Email",
		isHover: false,
		icon: h("div", { innerHTML: processSvgCopy(email), style: "line-height:0; color: rgb(var(--v-global-theme-primary))" }),
		serviceType: 3,
		data: [],
	},
	{
		name: "home.feedback",
		isHover: false,
		icon: h("div", { innerHTML: processSvgCopy(feedback), style: "line-height:0; color: rgb(var(--v-global-theme-primary))" }),
	},
]);

// 获取客服设置
const getContact = () => {
	nextTick(() => {
		getListConfiguration({ moduleType: 7 }).then(res => {
			let data = res.data;
			data.forEach(dataItem => {
				addDynamicMessages(dataItem, setLocaleMessage);
				list.value.forEach(listItem => {
					if (listItem.serviceType === dataItem.serviceType) {
						listItem.data.push(dataItem);
					}
				});
			});
		});
	});
};
getContact();

// 处理鼠标进入事件
const handleMouseEnter = index => {
	list.value.forEach((item, i) => {
		if (i != 3) {
			item.isHover = i === index;
		}
	});
};
// 鼠标离开事件
const handleMouseLeave = index => {
	list.value[index].isHover = false;
};
const handleDialogChange = isOpen => {
	if (isOpen) {
		formRef.value.InitForm();
	}
};

const handelClick = index => {
	if (index == 3) {
		formRef.value.InitForm();
	}
};
</script>

<template>
	<!-- $vuetify.display.smAndUp -->
	<div class="contact" :class="[isDark == 'dark' ? 'shadow_box_dark' : 'shadow_box', $vuetify.display.smAndUp ? '' : 'hidden']">
		<div
			class="item"
			v-for="(i, index) in list"
			:key="index"
			@mouseenter="handleMouseEnter(index)"
			@mouseleave="handleMouseLeave(index)"
			@click="handelClick(index)"
		>
			<VNodeRenderer :nodes="i.icon" />
			<div style="width: 100%">{{ t(i.name) }}</div>
			<div v-if="i.isHover" class="hover_box" :class="isDark == 'dark' ? 'shadow_box_dark' : 'shadow_box'">
				<div class="triangle"></div>
				<div class="hover_content" :class="i.serviceType == 2 ? 'd-flex' : ''">
					<div v-for="(item, idx) in i.data" :key="item.id">
						<!-- 热线 -->
						<div v-if="item.serviceType == 1" class="d-flex">
							<div style="width: 4rem" v-if="locale == 'zh'">{{ t("home.Service Hotline") }}：</div>
							<div style="width: 7rem" v-if="locale == 'en'">{{ t("home.Service Hotline") }}：</div>
							<div>{{ item.service }}</div>
						</div>
						<!-- 公众号 -->
						<div v-if="item.serviceType == 2" :style="{ marginRight: idx + 1 == i.data.length ? '0' : '1rem' }">
							<img style="width: 7rem; height: 7rem" :src="item.serviceFile[0].link" alt="" />
							<div class="title" style="width: 7rem">{{ t(`title_${item.id}`) }}</div>
						</div>

						<!-- 邮箱 -->
						<div v-if="item.serviceType == 3" class="d-flex">
							<div style="width: 3rem">{{ t("login.Email") }}：</div>
							<div>{{ item.service }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<FeedbackAdd ref="formRef"></FeedbackAdd>
</template>

<style lang="scss" scoped>
.hidden {
	display: none;
}
.contact {
	width: 4.167rem;
	height: 18.5rem;
	background-color: rgb(var(--v-theme-surface));
	position: fixed;
	right: 1.5rem;
	top: 38%;
	z-index: 99999;
	.item {
		width: 100%;
		height: 25%;
		cursor: pointer;
		text-align: center;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		padding: 0.4rem 0;
		font-size: 0.8rem;
		&:hover {
			background-color: rgba(var(--v-theme-primary), 0.2);
		}
		.triangle {
			position: absolute;
			right: -0.7rem;
			top: 50%;
			transform: translateY(-50%);
			width: 0;
			height: 0;
			border-top: 0.5rem solid transparent;
			border-bottom: 0.5rem solid transparent;
			border-left: 0.8rem solid rgb(var(--v-theme-surface)); // 使用主题颜色
		}
		position: relative;
		.hover_box {
			padding: 0.8rem;
			box-sizing: border-box;
			position: absolute;
			right: 120%;
			border-radius: 0.5rem;
			top: 50%;
			transform: translateY(-50%);
			background-color: rgb(var(--v-theme-surface));
			animation: fadeIn 0.3s ease-in-out;
		}
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}
:deep(svg) {
	width: 2rem !important;
	height: 2rem !important;
}
.shadow_box {
	box-shadow: 0rem 0rem 0.5rem 0rem #d7e6ee !important;
}
.shadow_box_dark {
	box-shadow: 0rem 0rem 0.5rem 0rem #0b1d27 !important;
}
</style>
