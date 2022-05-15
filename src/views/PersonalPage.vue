<template>
	<div class="personal-wrap d-flex flex-column">
		<Loading :active.sync="isLoading"></Loading>
		<div class="row">
			<div class="col-12 col-md-7">
				<div class="personal-card card mb-4 overflow-hidden">
					<div class="card-header d-flex align-items-center p-0 border-bottom-0">
						<div class="border-end">
							<img class="photo" :src="info.photo" v-if="info.photo">
							<div class="photo d-flex align-items-center justify-content-center" v-else>
								<i class="bi bi-person fs-3"></i>
							</div>
						</div>
						<div class="ms-3">
							<h6>{{ info.name }}</h6>
							<!-- <small>{{ info.follower }} 人追蹤</small> -->
						</div>
						<!-- <template v-if="is_follow">
							<button type="button" class="btn btn-secondary ms-auto me-3 py-1" @click="is_follow = !is_follow">
								追蹤
							</button>
						</template>
						<template v-else>
							<button type="button" class="btn btn-light ms-auto me-3 py-1" @click="is_follow = !is_follow">
								取消追蹤
							</button>
						</template> -->
					</div>
				</div>
				<!-- 搜尋欄 -->
				<div class="row mb-3">
					<div class="col-4">
						<select name="type" class="form-control form-select rounded-0" v-model="search.sort" @change="getUserPosts()">
							<option value="desc">最新貼文</option>
							<option value="asc">最舊貼文</option>
						</select>
					</div>
					<div class="col-8">
						<div class="input-group">
							<input type="text" class="form-control rounded-0" placeholder="搜尋貼文" v-model="search.keyword" @keyup.enter="getUserPosts()">
							<button class="btn btn-primary shadow-none rounded-0 px-3 py-0 fs-5" type="button" @click="getUserPosts()">
								<i class="bi bi-search"></i>
							</button>
						</div>
					</div>
				</div>
				<!-- 貼文 -->
				<div class="rounded-card card mb-3" v-for="post in posts" :key="post.id">
					<div class="card-header bg-transparent pt-3 border-0">
						<div class="d-flex align-items-center">
							<img :src="post.user.photo" class="headshot rounded-circle border" v-if="post.user.photo">
							<div class="headshot rounded-circle border d-flex align-items-center justify-content-center" v-else>
								<i class="bi bi-person fs-5"></i>
							</div>
							<div class="d-flex flex-column ms-3">
								<router-link :to="{ name: 'PersonalPage', params: { name: post.user.name } }" class="fw-bold">
									{{ post.user.name }}
								</router-link>
								<small class="text-black-50">{{ getDate(post.createdAt) }}</small>
							</div>
						</div>
					</div>
					<div class="card-body">
						<p v-html="showContent(post.content)" class="mb-3"></p>
						<img :src="post.image" class="w-100 mb-3 border rounded" v-if="post.image">
					</div>
				</div>
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
	name: 'PersonalPage',
	components: {
		Sidebar: () => import('../components/Sidebar.vue'),
		SidebarSm: () => import('../components/SidebarSm.vue')
	},
	data() {
		return {
			info: {
				name: '',
				photo: ''
			},
			search: {
				sort: 'desc', // 排序(預設降冪)
				keyword: '' // 關鍵字
			},
			posts: [],
			isLoading: false
		};
	},
	watch: {
		'$route.params.name'() {
			Object.assign(this.$data, this.$options.data());
			this.getUserInfo();
			this.getUserPosts();
		}
	},
	mounted() {
		this.getUserInfo();
		this.getUserPosts();
	},
	methods: {
		getUserInfo() {
			const config = {
				method: 'GET',
				url: `${process.env.VUE_APP_APIPATH}/api/v1/users/profile/${this.$route.params.name}`
			};
			this.$http(config)
				.then(response => {
					this.info = response.data.data;
				})
				.catch(error => {
					console.log(error); // TODO:
				});
		},
		getUserPosts() {
			this.isLoading = true;
			const config = {
				method: 'GET',
				url: `${process.env.VUE_APP_APIPATH}/api/v1/posts`,
				params: {
					...this.search,
					name: this.$route.params.name
				}
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
		.headshot {
			width: 50px;
			height: 50px;
			background-color: #E2EDFA;
		}
	}
</style>
