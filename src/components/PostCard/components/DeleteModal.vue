<template>
	<div class="modal fade" id="modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header border-bottom-1">
					<h3 class="modal-title" id="exampleModalLabel">提醒</h3>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body text-danger text-center py-4">
					刪除後將無法復原，您是否確定刪除貼文？
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">取消</button>
					<button type="button" class="btn btn-primary btn-sm" @click="deletePost()">確定</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'DeleteModal',
	props: {
		deleteId: {
			type: [ String, Number ],
			require: true
		},
		deleteModal: {
			type: Object
		}
	},
	data() {
		return {};
	},
	computed: {
		...mapState({
			token: state => state.token
		})
	},
	methods: {
		deletePost() {
			const config = {
				method: 'DELETE',
				url: `${process.env.VUE_APP_APIPATH}/api/v1/post/${this.deleteId}`,
				headers: {
					authorization: `Bearer ${this.token}`
				}
			};
			this.$http(config)
				.then(response => {
					this.deleteModal.hide();
					this.$emit('delete');
				})
				.catch(error => {
					console.log(error);
				});
		}
	}
};
</script>

<style lang="scss" scoped></style>
