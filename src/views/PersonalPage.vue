<template>
	<div class="personal-wrap">
		<div class="personal-card card mb-4 overflow-hidden">
			<div class="card-header d-flex align-items-center p-0 border-bottom-0">
				<div class="border-end">
					<img class="photo" :src="info.photo" v-if="info.photo">
					<div class="photo d-flex align-items-center justify-content-center" v-else>
						<i class="bi bi-person fs-3"></i>
					</div>
				</div>
				<div class="ms-3">
					<h6 class="fw-bold">{{ info.name }}</h6>
					<small>{{ info.followers }} 人追蹤</small>
				</div>
				<template v-if="!isSelf">
					<button type="button" class="btn btn-secondary ms-auto me-3 py-1"
						@click="toggleFollow('POST')" v-if="!info.isFollow">
						追蹤
					</button>
					<button type="button" class="btn btn-light ms-auto me-3 py-1"
						@click="toggleFollow('DELETE')" v-else>
						取消追蹤
					</button>
				</template>
			</div>
		</div>
		<!-- 搜尋欄 -->
		<Searchbar @search="getUserPosts"></Searchbar>
		<!-- 貼文 -->
		<CardDefault :is-loading="isLoading" :message="'該用戶尚無貼文'" v-if="posts?.length === 0"></CardDefault>
		<template v-else>
			<PostCard v-for="post in posts" :key="post.id" :post="post"
				@edit-post-likes="editLikes" @edit-comment-likes="editCommentLikes"
				@add-comment="addComment" @edit-post="getUserPosts"></PostCard>
		</template>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import Searchbar from '@/components/Searchbar.vue';
import PostCard from '@/components/PostCard/Index';
import CardDefault from '@/components/CardDefault.vue';

export default {
	name: 'PersonalPage',
	components: {
		Searchbar,
		PostCard,
		CardDefault
	},
	data() {
		return {
			info: {},
			posts: [],
			isLoading: false,
			search: {}
		};
	},
	watch: {
		'$route.params.id'(val) {
			Object.assign(this.$data, this.$options.data());
			if (val) {
				this.getUserInfo();
				this.getUserPosts();
			}
		}
	},
	computed: {
		...mapState({
			token: state => state.token,
			personalInfo: state => state.info
		}),
		isSelf() {
			return this.$route.params.id === this.personalInfo._id;
		}
	},
	mounted() {
		this.getUserInfo();
	},
	methods: {
		getUserInfo() {
			const config = {
				method: 'GET',
				url: `${process.env.VUE_APP_APIPATH}/api/v1/user/profile/${this.$route.params.id}`,
				headers: {
					authorization: `Bearer ${this.token}`
				}
			};
			this.$http(config)
				.then(response => {
					this.info = response.data.data;
				})
				.catch(error => {
					console.log(error); // TODO:
				});
		},
		getUserPosts(search = this.search) {
			this.search = search;
			this.isLoading = true;
			const config = {
				method: 'GET',
				url: `${process.env.VUE_APP_APIPATH}/api/v1/posts/user/${this.$route.params.id}`,
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
					console.log(error); // TODO:
					this.isLoading = false;
				});
		},
		getDate(createdAt) { // 取得本地時間
			const date = new Date(createdAt).toLocaleDateString();
			const time = new Date(createdAt).toTimeString().split(' ')[0];
			return `${date} ${time}`;
		},
		showContent(content) {
			return content.replace(/\n/i, '</br>');
		},
		toggleFollow(method) {
			const config = {
				method: method,
				url: `${process.env.VUE_APP_APIPATH}/api/v1/user/${this.$route.params.id}/follow`,
				headers: {
					authorization: `Bearer ${this.token}`
				}
			};
			this.$http(config)
				.then(response => {
					this.getUserInfo();
				})
				.catch(error => {
					console.log(error);
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

<style lang="scss" scoped>
	.personal-wrap {
		.personal-card {
			box-shadow: -5px 5px 0 -2px white, -5px 5px 0 0px $black;
		}
		.photo {
			width: 80px;
			height: 80px;
			background-color: #E2EDFA;
		}
	}
</style>
