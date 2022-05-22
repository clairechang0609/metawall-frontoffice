<template>
	<div class="wrong-page d-flex flex-column align-items-center justify-content-center vh-100">
    <h3 class="code text-primary">404</h3>
		<h5 class="text-black-50">找不到頁面，請返回首頁</h5>
		<router-link :to="{ name: 'Home' }" class="btn btn-primary text-decoration-none mt-4">
			回首頁
		</router-link>
	</div>
</template>

<script>
export default {
	data() {
		return {};
	}
};
</script>

<style lang="scss" scoped>
	.code {
		font-size: 72px;
	}
	.btn {
		width: 200px;
	}
</style>
