<template>
	<div class="card-body p-4 d-flex flex-column align-items-center">
		<form>
			<div class="mb-3">
				<label for="password" class="form-label">輸入新密碼</label>
				<input type="password" class="form-control rounded-0" id="password" placeholder="請輸入新密碼"
					v-model="info.password">
			</div>
			<div class="mb-3">
				<label for="confirm_password" class="form-label">再次輸入</label>
				<input type="password" class="form-control rounded-0" id="confirm_password" placeholder="再次輸入輸入新密碼"
					v-model="info.confirmPassword">
			</div>
			<div v-if="errorMessage" class="text-danger text-center d-block mt-3">
				{{ errorMessage }}
			</div>
			<button type="button" class="btn btn-secondary w-100 mt-3" :disabled="!isFinished || isLoading"
				@click="submit()">
				<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="isLoading"></span>
				重設密碼
			</button>
		</form>
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
	name: 'EditPassword',
	data() {
		return {
			info: {
				password: '',
				confirmPassword: ''
			},
			errorMessage: '',
			isLoading: false
		};
	},
	computed: {
		...mapState({
			token: state => state.token
		}),
		isFinished() {
			return this.info.password && this.info.confirmPassword;
		}
	},
	mounted() {},
	methods: {
		...mapMutations([ 'setToken' ]),
		submit() {
			this.isLoading = true;
			const config = {
				method: 'PATCH',
				url: `${process.env.VUE_APP_APIPATH}/api/v1/users/update_password`,
				headers: {
					authorization: `Bearer ${this.token}`
				},
				data: this.info
			};
			this.$http(config)
				.then(response => {
					this.setToken(response.data.data.token);
					Object.assign(this.$data, this.$options.data());
				})
				.catch(error => {
					this.errorMessage = error.response.data.message;
					this.isLoading = false;
				});
		}
	}
};
</script>

<style lang="scss" scoped>
	form {
		width: 320px;
	}
</style>
