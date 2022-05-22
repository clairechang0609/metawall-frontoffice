<template>
	<div @keyup.enter="submitSignup()">
		<h2 class="text-center mb-4">註冊</h2>
		<form class="mb-4 pt-2">
			<div class="mb-3 w-100">
				<input type="name" class="form-control rounded-0" placeholder="暱稱" v-model="info.name" @input.stop autofocus>
			</div>
			<div class="mb-3 w-100">
				<input type="email" class="form-control rounded-0" placeholder="Email" v-model="info.email">
				<small v-if="errorMessage.email" class="text-danger d-block mt-1">{{ errorMessage.email }}</small>
			</div>
			<div class="mb-3 w-100">
				<input type="password" class="form-control rounded-0" placeholder="密碼" v-model="info.password">
			</div>
			<div class="mb-3 w-100">
				<input type="password" class="form-control rounded-0" placeholder="確認密碼" v-model="info.confirmPassword">
			</div>
		</form>
		<small v-if="errorMessage" class="text-danger text-center d-block mt-2 mb-3">{{ errorMessage }}</small>
        <button type="button" class="btn btn-primary w-100" @click="submitSignup()" :disabled="!formIsFinished">註冊</button>
	</div>
</template>

<script>
export default {
	name: 'NavSignUp',
	data() {
		return {
			info: {
				name: '', // 暱稱
				email: '', // 帳號
				password: '', // 密碼
				confirmPassword: '' // 確認密碼
			},
			errorMessage: ''
		};
	},
	computed: {
		formIsFinished() {
			return this.info.email && this.info.name && this.info.password && this.info.confirmPassword;
		}
	},
	mounted() {},
	methods: {
		submitSignup() {
			const config = {
				method: 'POST',
				url: `${process.env.VUE_APP_APIPATH}/api/v1/users/register`,
				data: this.info
			};
			this.$http(config)
				.then(response => {
					this.$emit('current_page', 'login');
				})
				.catch(error => {
					if (error.response) {
						this.errorMessage = error.response.data.message;
					}
				});
		}
	}
};
</script>

<style lang="scss" scoped></style>
