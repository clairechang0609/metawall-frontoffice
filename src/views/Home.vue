<template>
	<div class="home-wrap d-flex flex-column">
		<Loading :active.sync="isLoading"></Loading>
		<div class="row">
			<div class="col-12 col-md-7">
				<!-- 搜尋欄 -->
				<div class="row mb-3">
					<div class="col-4">
						<select name="type" class="form-control form-select rounded-0" v-model="search.type"
							@change="getPosts()">
							<option value="">請選擇</option>
							<option value="date">最新貼文</option>
						</select>
					</div>
					<div class="col-8">
						<div class="input-group">
							<input type="text" class="form-control rounded-0" placeholder="搜尋貼文" v-model="search.keyword">
							<button class="btn btn-primary shadow-none rounded-0 px-3 py-0 fs-5" type="button" @click="getPosts()">
								<i class="bi bi-search"></i>
							</button>
						</div>
					</div>
				</div>
				<!-- 貼文 -->
				<template v-if="posts.length === 0">
					<div class="rounded-card card">
						<div class="card-header bg-transparent border-bottom">
							<span class="browser-icon bg-danger rounded-circle d-inline-block me-2"></span>
							<span class="browser-icon bg-secondary rounded-circle d-inline-block me-2"></span>
							<span class="browser-icon bg-success rounded-circle d-inline-block"></span>
						</div>
						<div class="card-body">
							<p class="text-black-50 text-center py-3">目前尚無動態，新增一則貼文吧！</p>
						</div>
					</div>
				</template>
				<template v-else>
					<div class="rounded-card card mb-3" v-for="post in posts" :key="post.id">
						<div class="card-header bg-transparent pt-3 border-0">
							<div class="d-flex align-items-center">
								<img :src="getUserPhotoUrl(post.headshot)" class="headshot">
								<div class="d-flex flex-column ms-3">
									<a href="#" class="fw-bold">{{ post.name }}</a>
									<small class="text-black-50">{{ getDate(post.createdAt) }}</small>
								</div>
							</div>
						</div>
						<div class="card-body">
							<p v-html="post.content" class="mb-3"></p>
							<img :src="getImageUrl(post.picture)" class="w-100 mb-3">
							<!-- <a href="#" class="text-decoration-none" v-if="post.thumbs_up > 0">
								<i class="bi bi-hand-thumbs-up text-primary fs-5"></i>
								{{ post.thumbs_up }}
							</a>
							<a href="#" class="text-decoration-none text-black-50" v-else>
								<i class="bi bi-hand-thumbs-up fs-5"></i>
								成為第一個按讚的朋友
							</a>
							<div class="d-flex align-items-center mt-3">
								<img src="~@/assets/img/user-head.png" class="headshot me-2">
								<div class="input-group">
									<input type="text" class="form-control rounded-0" placeholder="留言..." aria-describedby="search">
									<button class="btn btn-primary shadow-none rounded-0 px-4" type="button">
										留言
									</button>
								</div>
							</div> -->
							<!-- 用戶回覆 -->
							<!-- <ul v-if="post.messages.length > 0" class="mt-3">
								<li v-for="message in post.messages" :key="message.id" class="mb-3">
									<div class="message-card card border-0">
										<div class="card-body">
											<div class="d-flex">
												<img :src="getPictureUrl(message.headshot)" class="headshot">
												<div class="d-flex flex-column ms-3 pt-2">
													<a href="#" class="fw-bold">{{ message.name }}</a>
													<small class="text-black-50">{{ message.date }}</small>
													<p v-html="message.content" class="mt-2"></p>
												</div>
											</div>
										</div>
									</div>
								</li>
							</ul> -->
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

export default {
	name: 'Home',
	components: {
		Sidebar: () => import('../components/Sidebar.vue'),
		SidebarSm: () => import('../components/SidebarSm.vue')
	},
	data() {
		return {
			posts: [],
			search: {
				type: '', // 搜尋類別
				keyword: '' // 關鍵字
			},
			isLoading: false
		};
	},
	mounted() {
		this.getPosts();
	},
	methods: {
		getPosts() {
			this.isLoading = true;
			const url = 'https://guarded-sea-58117.herokuapp.com/posts';
			// 取得搜尋 query 字串
			const searchQuery = new URLSearchParams(this.search).toString();
			fetch(`${url}?${searchQuery}`, {
				method: 'GET',
				params: this.search
			})
				.then(response => {
					return response.json();
				})
				.then(json => {
					this.posts = json.data;
					this.isLoading = false;
				})
				.catch(error => {
					console.log(error);
					this.isLoading = false;
				});
		},
		getDate(createdAt) {
			const date = createdAt.split('T');
			const time = date[1].split('.')[0];
			return `${date[0]} ${time}`;
		},
		getUserPhotoUrl(path) {
			return require('@/assets/img/user-head.png');
		},
		getImageUrl(path) {
			return require('@/assets/img/post-picture.png');
		}
	}
};
</script>

<style lang="scss" scoped>
	.home-wrap {
		.headshot {
			width: 50px;
			height: 50px;
		}
		small {
			font-size: 12px;
		}
		.browser-icon {
			width: 9px;
			height: 9px;
			border: 1px solid $gray-700;
		}
		.sidebar-card {
			.link:hover {
				.info-icon {
					background-color: $primary;
					color: white;
				}
			}
			.info-icon {
				width: 50px;
				height: 50px;
				background-color: #E2EDFA;
			}
		}
		.message-card {
			background-color: rgba($gray-300, 0.3);
		}
	}
</style>
