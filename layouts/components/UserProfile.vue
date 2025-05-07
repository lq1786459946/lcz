<script setup>
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
const userData = useCookie("userData");
const { t } = useI18n();
async function logout() {
	const userStore = useUserStore();
	userStore.logout(); // 调用退出登录的方法
	userStore.clearRedirectRoute(); // 调用退出登录的方法
}

const userProfileList = [
	{ type: "divider" },
	{
		type: "navItem",
		icon: "ri-user-line",
		title: "home.userInfo",
		to: {
			name: "personalCenter-userInfo",
		},
	},
	{
		type: "navItem",
		icon: "ri-function-line",
		title: "home.RightsInformation",
		to: {
			name: "personalCenter-rightsInformation",
		},
	},
	{
		type: "navItem",
		icon: "ri-settings-4-line",
		title: "home.Settings",
		to: {
			name: "personalCenter-changePassword",
		},
	},
	{ type: "divider" },
];
</script>

<template>
	<VBadge v-if="userData" dot bordered location="bottom right" offset-x="3" offset-y="3" color="success">
		<VAvatar
			class="cursor-pointer"
			size="38"
			:color="!(userData && userData.avatar) ? 'primary' : undefined"
			:variant="!(userData && userData.avatar) ? 'tonal' : undefined"
		>
			<VImg v-if="userData && userData.avatar" :src="userData.avatar" />
			<VIcon v-else icon="ri-user-line" />
			<!-- SECTION Menu -->
			<VMenu activator="parent" width="230" location="bottom end" offset="15px">
				<VList>
					<VListItem>
						<div class="d-flex gap-2 align-center">
							<VListItemAction>
								<VBadge dot location="bottom right" offset-x="3" offset-y="3" color="success">
									<VAvatar
										:color="!(userData && userData.avatar) ? 'primary' : undefined"
										:variant="!(userData && userData.avatar) ? 'tonal' : undefined"
									>
										<VImg v-if="userData && userData.avatar" :src="userData.avatar" />
										<VIcon v-else icon="ri-user-line" />
									</VAvatar>
								</VBadge>
							</VListItemAction>
							{{ userData.nick_name || userData.phone }}
							<div>
								<h6 class="text-h6 font-weight-medium">
									{{ userData.fullName || userData.username }}
								</h6>
								<VListItemSubtitle class="text-capitalize text-disabled">
									{{ userData.role }}
								</VListItemSubtitle>
							</div>
						</div>
					</VListItem>

					<PerfectScrollbar :options="{ wheelPropagation: false }">
						<template v-for="item in userProfileList" :key="item.title">
							<VListItem v-if="item.type === 'navItem'" :to="item.to">
								<template #prepend>
									<VIcon :icon="item.icon" size="22" />
								</template>

								<VListItemTitle>{{ t(item.title) }}</VListItemTitle>

								<template v-if="item.badgeProps" #append>
									<VBadge inline v-bind="item.badgeProps" />
								</template>
							</VListItem>

							<VDivider v-else class="my-1" />
						</template>

						<VListItem>
							<VBtn block color="error" size="small" append-icon="ri-logout-box-r-line" @click="logout">{{ t("home.Lougout") }}</VBtn>
						</VListItem>
					</PerfectScrollbar>
				</VList>
			</VMenu>
			<!-- !SECTION -->
		</VAvatar>
	</VBadge>
</template>
