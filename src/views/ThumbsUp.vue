<template>
	<div class="thumbs-up-wrap d-flex flex-column">
		<div class="row">
			<div class="col-12 col-md-7">
				<h3 class="title py-3 border bg-white text-center mb-4">我按讚的貼文</h3>
				<div class="rounded-card card mb-3" v-if="posts.length === 0 || isLoading">
					<div class="card-header bg-transparent border-bottom">
						<span class="browser-icon bg-danger rounded-circle d-inline-block me-2"></span>
						<span class="browser-icon bg-secondary rounded-circle d-inline-block me-2"></span>
						<span class="browser-icon bg-success rounded-circle d-inline-block"></span>
					</div>
					<div class="card-body">
						<div class="d-flex justify-content-center py-1" v-if="isLoading">
							<div class="spinner-border" role="status">
								<span class="visually-hidden">Loading...</span>
							</div>
						</div>
						<p class="text-black-50 text-center py-1" v-else>目前尚無按讚貼文</p>
					</div>
				</div>
				<template v-else>
					<div class="rounded-card card mb-3" v-for="post in posts" :key="post.id">
						<div class="card-body d-flex align-items-center">
							<img :src="post.user.photo" class="photo border rounded-circle" v-if="post.user.photo">
							<div class="photo rounded-circle border d-flex align-items-center justify-content-center" v-else>
								<i class="bi bi-person fs-5"></i>
							</div>
							<div class="d-flex flex-column ms-3">
								<router-link :to="{ name: 'PersonalPage', params: { name: post.user.name } }" class="fw-bold">
									{{ post.user.name }}
								</router-link>
								<small class="text-black-50">{{ getDate(post.createdAt) }}</small>
							</div>
							<div class="d-flex align-items-center ms-auto me-3">
								<a href="#" class="d-flex flex-column align-items-center me-4" @click.prevent="toggleLike(post._id)">
									<i class="bi bi-hand-thumbs-up text-primary fs-5"></i>
									<small class="text-black fw-bold">取消</small>
								</a>
								<!-- TODO: -->
								<router-link :to="{ name: 'PersonalPage', params: { name: post.user.name } }" class="d-flex flex-column align-items-center">
									<i class="bi bi-arrow-right-circle text-black fs-5"></i>
									<small class="text-black fw-bold">查看</small>
								</router-link>
							</div>
						</div>
					</div>
				</template>
			</div>
			<div class="col-12 col-md-5 d-none d-md-block">
				<Sidebar></Sidebar>
			</div>
			<div class="d-md-none">
				<SidebarSm></SidebarSm>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'ThumbsUp',
	components: {
		Sidebar: () => import('../components/Sidebar.vue'),
		SidebarSm: () => import('../components/SidebarSm.vue')
	},
	data() {
		return {
			posts: [],
			isLoading: false
		};
	},
	computed: {
		...mapState({
			token: state => state.token
		})
	},
	mounted() {
		this.getPosts();
	},
	methods: {
		getDate(createdAt) { // 取得本地時間
			const date = new Date(createdAt).toLocaleDateString();
			const time = new Date(createdAt).toTimeString().split(' ')[0];
			return `${date} ${time}`;
		},
		getPosts() {
			this.isLoading = true;
			const config = {
				method: 'GET',
				url: `${process.env.VUE_APP_APIPATH}/api/v1/posts/likes`,
				headers: {
					authorization: `Bearer ${this.token}`
				}
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
		toggleLike(id) {
			const config = {
				method: 'PATCH',
				url: `${process.env.VUE_APP_APIPATH}/api/v1/posts/likes/${id}`,
				headers: {
					authorization: `Bearer ${this.token}`
				}
			};
			this.$http(config)
				.then(response => {
					this.getPosts();
				})
				.catch(error => {
					console.log(error);
				});
		}
	}
};
</script>

<style lang="scss" scoped>
	.thumbs-up-wrap {
		.title {
			box-shadow: -5px 5px 0 -2px white, -5px 5px 0 0px $black;
		}
		.photo {
			width: 50px;
			height: 50px;
			background-color: #E2EDFA;
		}
		small {
			font-size: 12px;
		}
		.message-card {
			background-color: rgba($gray-300, 0.3);
		}
		.browser-icon {
			width: 9px;
			height: 9px;
			border: 1px solid $gray-700;
		}
	}
</style>
