<template>
	<div class="rounded-card card mb-3">
		<div class="card-header bg-transparent border-bottom">
			<span class="browser-icon bg-danger rounded-circle d-inline-block me-2"></span>
			<span class="browser-icon bg-secondary rounded-circle d-inline-block me-2"></span>
			<span class="browser-icon bg-success rounded-circle d-inline-block"></span>
		</div>
		<div class="card-body">
			<div class="d-flex justify-content-center py-4" v-if="isLoading">
				<div class="spinner-border" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
			<p class="text-black-50 text-center py-3" v-else>{{ message }}</p>
		</div>
	</div>
</template>

<script>
export default {
	name: 'CardDefault',
	props: {
		isLoading: {
			type: Boolean,
			default: false
		},
		message: {
			type: String,
			default: '目前尚無動態，新增一則貼文吧！'
		}
	},
	data() {
		return {};
	}
};
</script>

<style lang="scss" scoped>
	.browser-icon {
		width: 9px;
		height: 9px;
		border: 1px solid $gray-700;
	}
</style>
