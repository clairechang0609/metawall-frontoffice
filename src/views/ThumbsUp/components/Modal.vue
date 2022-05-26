<template>
	<div class="modal fade" id="modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header border-bottom-1">
					<h3 class="modal-title" id="exampleModalLabel">查看貼文</h3>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body" v-if="post">
					<PostCard :post="post" @edit-post-likes="editPost" @edit-comment-likes="getPost"
						@add-comment="getPost"></PostCard>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import PostCard from '@components/PostCard.vue';

export default {
	name: 'PostModal',
	components: {
		PostCard
	},
	props: {
		id: {
			type: [ String, Number ],
			require: true
		}
	},
	data() {
		return {
			post: ''
		};
	},
	watch: {
		id(val) {
			if (!val) {
				this.post = '';
			} else {
				this.getPost();
			}
		}
	},
	computed: {
		...mapState({
			token: state => state.token
		})
	},
	methods: {
		getPost() {
			const config = {
				method: 'GET',
				url: `${process.env.VUE_APP_APIPATH}/api/v1/post/${this.id}`,
				headers: {
					authorization: `Bearer ${this.token}`
				}
			};
			this.$http(config)
				.then(response => {
					this.post = response.data.data;
				})
				.catch(error => {
					console.log(error);
				});
		},
		editPost() {
			this.getPost();
			this.$emit('edit-post');
		}
	}
};
</script>

<style lang="scss" scoped>
	.modal-body {
		background-color: #EFECE7;
	}
</style>
