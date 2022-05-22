<template>
	<div class="text-center" @keyup.enter="submitLogin()">
        <h2 class="mb-4">到元宇宙展開全新社交圈</h2>
		<form class="mb-4 pt-2">
			<div class="mb-3 w-100">
				<input type="email" class="form-control rounded-0" placeholder="Email" v-model="info.email">
			</div>
			<div class="mb-3 w-100">
				<input type="password" class="form-control rounded-0" placeholder="密碼" v-model="info.password">
			</div>
		</form>
        <small v-if="errorMessage" class="text-danger d-block mb-3">{{ errorMessage }}</small>
        <button type="button" class="btn btn-primary w-100" @click="submitLogin()" :disabled="!formIsFinished">登入</button>
	</div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
	name: 'NavLogin',
	data() {
		return {
			info: {
				email: '', // 帳號
				password: '' // 密碼
			},
			errorMessage: ''
		};
	},
	computed: {
		formIsFinished() {
			return this.info.email && this.info.password;
		}
	},
	mounted() {},
	methods: {
		...mapMutations([ 'setInfo', 'setToken' ]),
		submitLogin() {
			return new Promise((resolve, reject) => {
				const config = {
					method: 'POST',
					url: `${process.env.VUE_APP_APIPATH}/api/v1/users/login`,
					data: this.info
				};
				this.$http(config)
					.then(response => {
						const data = response.data.data;
						this.setToken(data.token);
						this.setInfo(data.profile);
						this.$router.push({ name: 'Home' });
					})
					.catch(error => {
						if (error.response) {
							this.errorMessage = error.response.data.message;
						}
					});
			});
		}
	}
};
</script>

<style lang="scss" scoped></style>
