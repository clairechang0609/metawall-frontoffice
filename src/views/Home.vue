<template>
	<div class="home-wrap">
		<!-- 搜尋欄 -->
		<div class="row mb-3">
			<div class="col-4">
				<select name="type" class="form-control form-select rounded-0" v-model="search.sort" @change="getPosts()">
					<option value="desc">最新貼文</option>
					<option value="asc">最舊貼文</option>
				</select>
			</div>
			<div class="col-8">
				<div class="input-group">
					<input type="text" class="form-control rounded-0" placeholder="搜尋貼文"
						v-model="search.keyword" @keyup.enter="getPosts()">
					<button class="btn btn-primary shadow-none rounded-0 px-3 py-0 fs-5" type="button" @click="getPosts()">
						<i class="bi bi-search"></i>
					</button>
				</div>
			</div>
		</div>
		<!-- 貼文 -->
		<CardDefault :is-loading="isLoading" v-if="posts?.length === 0"></CardDefault>
		<template v-else>
			<PostCard v-for="post in posts" :key="post.id" :post="post"
				@edit-post-likes="editLikes" @edit-comment-likes="editCommentLikes"
				@add-comment="addComment"></PostCard>
		</template>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import PostCard from '@/components/PostCard.vue';
import CardDefault from '@/components/CardDefault.vue';
// const ws = new WebSocket('wss://peaceful-citadel-43202.herokuapp.com/websockets');

export default {
	name: 'Home',
	components: {
		PostCard,
		CardDefault
	},
	data() {
		return {
			posts: [],
			search: {
				sort: 'desc', // 排序(預設降冪)
				keyword: '' // 關鍵字
			},
			isLoading: false
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

		this.getPosts();
	},
	methods: {
		getPosts() {
			this.isLoading = true;
			const config = {
				method: 'GET',
				url: `${process.env.VUE_APP_APIPATH}/api/v1/posts`,
				headers: {
					authorization: `Bearer ${this.token}`
				},
				params: this.search
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
