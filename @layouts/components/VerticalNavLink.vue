<script setup>
import { NuxtLink } from "#components";

import { layoutConfig } from "@layouts";
import { useLayoutConfigStore } from "@layouts/stores/config";
import { getComputedNavLinkToProp, getDynamicI18nProps, isNavLinkActive } from "@layouts/utils";

const props = defineProps({
	item: {
		type: null,
		required: true,
	},
});
const route = useRoute();
const configStore = useLayoutConfigStore();
const hideTitleAndBadge = configStore.isVerticalNavMini();
</script>

<template>
	<li class="nav-link" :class="{ disabled: item.disable }">
		<Component
			:is="item.to ? NuxtLink : 'a'"
			v-bind="getComputedNavLinkToProp(item)"
			:class="{ 'router-link-active router-link-exact-active': isNavLinkActive(item, route) }"
		>
			<Component
				:is="layoutConfig.app.iconRenderer || 'div'"
				v-bind="item.icon || layoutConfig.verticalNav.defaultNavItemIconProps"
				class="nav-item-icon"
				style="font-size: 1.4rem"
			/>
			<TransitionGroup name="transition-slide-x">
				<!-- 👉 Title -->
				<Component
					:is="layoutConfig.app.i18n.enable ? 'i18n-t' : 'span'"
					v-show="!hideTitleAndBadge"
					key="title"
					class="nav-item-title"
					v-bind="getDynamicI18nProps(item.title, 'span')"
				>
					{{ item.title }}
				</Component>
			</TransitionGroup>
		</Component>
	</li>
</template>

<style lang="scss">
.layout-vertical-nav {
	.nav-link a {
		display: flex;
		align-items: center;
	}
}
</style>
