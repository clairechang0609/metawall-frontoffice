<template>
	<div class="post-wrap">
		<h3 class="title py-3 border bg-white text-center mb-4">查看貼文</h3>
		<div v-if="post">
			<PostCard :post="post" @edit-post-likes="getPost" @edit-comment-likes="getPost"
				@add-comment="getPost" @edit-post="getPost"></PostCard>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import PostCard from '@/components/PostCard/Index';

export default {
	name: 'Post',
	components: {
		PostCard
	},
	data() {
		return {
			post: ''
		};
	},
	computed: {
		...mapState({
			token: state => state.token
		})
	},
	mounted() {
		this.getPost();
	},
	methods: {
		getPost() {
			const config = {
				method: 'GET',
				url: `${process.env.VUE_APP_APIPATH}/api/v1/post/${this.$route.params.id}`,
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
		}
	}
};
</script>

<style lang="scss" scoped>
	.post-wrap {
		.title {
			box-shadow: -5px 5px 0 -2px white, -5px 5px 0 0px $black;
		}
		.submit-btn-wrap {
			width: 320px;
		}
	}
</style>
