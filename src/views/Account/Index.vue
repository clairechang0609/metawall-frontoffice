<template>
	<div class="account-wrap">
		<h3 class="title py-3 border bg-white text-center mb-4">修改個人資料</h3>
		<ul class="ms-2 nav nav-tabs border-0" id="myTab" role="tablist">
			<li class="nav-item">
				<button type="button" class="nav-link border px-4" @click="tab = 'edit-name'"
					:class="{ 'active': tab === 'edit-name' }">暱稱修改</button>
			</li>
			<li class="nav-item">
				<button type="button" class="nav-link border px-4" @click="tab = 'edit-password'"
					:class="{ 'active': tab === 'edit-password' }">重設密碼</button>
			</li>
		</ul>
		<div class="tab-content rounded-card card">
			<!-- 暱稱修改 -->
			<div id="edit-name" v-if="tab === 'edit-name'">
				<EditProfile></EditProfile>
			</div>
			<!-- 重設密碼 -->
			<div id="edit-password" v-if="tab === 'edit-password'">
				<EditPassword></EditPassword>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Account',
	components: {
		EditProfile: () => import('./components/EditProfile.vue'),
		EditPassword: () => import('./components/EditPassword.vue')
	},
	data() {
		return {
			tab: 'edit-name'
		};
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
	.account-wrap {
		.title {
			box-shadow: -5px 5px 0 -2px white, -5px 5px 0 0px $black;
		}
		.nav-link {
			background-color: white;
			color: $black;
			&.active {
				background-color: $black;
				color: white;
			}
		}
	}
</style>
