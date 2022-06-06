<template>
	<div class="home-wrap">
		<!-- 搜尋欄 -->
		<Searchbar @search="getPosts"></Searchbar>
		<!-- 貼文 -->
		<CardDefault :is-loading="isLoading" v-if="posts?.length === 0"></CardDefault>
		<template v-else>
			<PostCard v-for="post in posts" :key="post.id" :post="post"
				@edit-post-likes="editLikes" @edit-comment-likes="editCommentLikes"
				@add-comment="addComment" @edit-post="getPosts"></PostCard>
		</template>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import Searchbar from '@/components/Searchbar.vue';
import PostCard from '@/components/PostCard/Index';
import CardDefault from '@/components/CardDefault.vue';
// const ws = new WebSocket('wss://peaceful-citadel-43202.herokuapp.com/websockets');

export default {
	name: 'Home',
	components: {
		Searchbar,
		PostCard,
		CardDefault
	},
	data() {
		return {
			posts: [],
			isLoading: false,
			search: {}
		};
	},
	computed: {
		...mapState({
			token: state => state.token
		})
	},
	mounted() {
		// ws.onopen = () => console.log('WebSocket 服務已連接');
		// ws.onclose = () => console.log('WebSocket 伺服器關閉');
		// ws.onmessage = message => {
		// 	if (typeof message.data === 'object') {
		// 		this.getPosts();
		// 	}
		// };
	},
	methods: {
		getPosts(search = this.search) {
			this.search = search;
			this.isLoading = true;
			const config = {
				method: 'GET',
				url: `${process.env.VUE_APP_APIPATH}/api/v1/posts`,
				headers: {
					authorization: `Bearer ${this.token}`
				},
				params: search
			};
			this.$http(config)
				.then(response => {
					this.posts = response.data.data;
					this.isLoading = false;
				})
				.catch(error => {
					console.log(error);
					this.isLoading = false;
				});
		},
		editLikes(post) {
			const findPost = this.posts.find(item => item._id === post._id);
			findPost.likes = post.likes;
		},
		editCommentLikes(comment) {
			const findPost = this.posts.find(item => item._id === comment.post);
			const findComment = findPost.comments.find(item => item._id === comment._id);
			findComment.likes = comment.likes;
		},
		addComment(post) {
			const findPost = this.posts.find(item => item._id === post._id);
			findPost.comments = post.comments;
		}
	}
};
</script>

<style lang="scss" scoped></style>
