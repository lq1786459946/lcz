<template>
	<Loading v-if="type == 'subscribeResult' && !executionTime" :time="time" :visible="isLoading"></Loading>
	<VTextarea v-if="type == 'subscribe' && !executionTime" id="sse-textarea" :model-value="message" readonly></VTextarea>
</template>

<script setup>
import { defineEmits, defineProps, onUnmounted, ref } from "vue";
let message = ref("");
// 定义组件的 props
const props = defineProps({
	// SSE 服务器地址，必填项
	url: {
		type: String,
		required: false,
	},
	type: {
		type: String,
		required: false,
	},
	executionTime: {
		type: String,
		required: false,
	},
	time: {
		type: Number,
		default: false,
	},
	// 自定义事件类型，默认为 message
	eventType: {
		type: String,
		default: "message",
	},
	// 是否自动重连，默认为 true
	withCredentials: {
		type: Boolean,
		default: false,
	},
});
// 定义组件的事件
const emits = defineEmits(["message", "error", "open"]);
const isLoading = ref(true);
// 创建 EventSource 实例
const eventSource = ref(null);

// 初始化 SSE 连接
const initSse = () => {
	try {
		console.log(props.type, "props.type");

		isLoading.value = true;
		message.value = "";
		eventSource.value = new EventSource(props.url, {
			withCredentials: props.withCredentials,
		});
		console.log(eventSource.value, "eventSource.value");
		eventSource.value.onmessage = event => {
			console.log("收到消息内容是:", event.data, props.type);
			if (event.data == '{"status":"completed"}') {
				isLoading.value = false;
				emits("message");
				eventSource.value.close();
			}
			if (props.type == "subscribe") {
				// 累加消息数据，使用换行符分隔
				message.value += "\n" + event.data;
				nextTick(() => {
					// 使用 document.getElementById 获取 DOM 元素
					const textareaElement = document.getElementById("sse-textarea");
					if (textareaElement) {
						textareaElement.scrollTop = textareaElement.scrollHeight;
					}
				});
			}
		};

		eventSource.value.onerror = error => {
			eventSource.value.close();
		};
	} catch (error) {
		emits("error", error);
		reconnect();
	}
};

// 初始化 SSE 连接
// initSse();
// 重新连接函数
const reconnect = () => {
	clearTimeout(reconnectTimeout.value);
	reconnectTimeout.value = setTimeout(() => {
		console.log("尝试重新连接 SSE...");
		initSse();
	}, 5000); // 5 秒后尝试重新连接
};
// 组件卸载时关闭 SSE 连接
onUnmounted(() => {
	if (eventSource.value) {
		eventSource.value.close();
	}
});
defineExpose({
	initSse,
});
</script>

<style scoped>
/* 可以根据需要添加样式 */
</style>
