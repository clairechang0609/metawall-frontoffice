<template>
	<div class="rounded-card card mb-3" v-if="isLoading || isEmpty">
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
			<p class="text-black-50 text-center py-3" v-else>目前尚無動態，新增一則貼文吧！</p>
		</div>
	</div>
	<div class="rounded-card card mb-3" v-else>
		<div class="card-header bg-transparent pt-3 border-0">
			<div class="d-flex align-items-center">
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
			</div>
		</div>
		<div class="card-body">
			<p v-html="showContent(post.content)" class="mb-3"></p>
			<img :src="post.image" class="w-100 mb-3 border rounded" v-if="post.image">
			<a href="#" class="text-decoration-none text-primary" @click.prevent="toggleLike()" v-if="post.likes.length">
				<i class="bi bi-hand-thumbs-up fs-5"></i>
				{{ post.likes.length }}
			</a>
			<a href="#" class="text-decoration-none text-black-50" @click.prevent="toggleLike()" v-else>
				<i class="bi bi-hand-thumbs-up fs-5"></i>
				成為第一個按讚的朋友
			</a>
			<div class="d-flex align-items-center mt-3">
				<img :src="info.photo" class="photo me-2 border rounded-circle flex-shrink-0" v-if="info.photo">
				<div class="photo rounded-circle border me-2 d-flex align-items-center justify-content-center flex-shrink-0" v-else>
					<i class="bi bi-person fs-5"></i>
				</div>
				<div class="input-group">
					<input type="text" class="form-control rounded-0" placeholder="留言..." aria-describedby="search">
					<button class="btn btn-primary shadow-none rounded-0 px-4" type="button">
						留言
					</button>
				</div>
			</div>
			<!-- 用戶回覆 -->
			<!-- <ul v-if="post.messages.length > 0" class="mt-3">
				<li v-for="message in post.messages" :key="message.id" class="mb-3">
					<div class="message-card card border-0">
						<div class="card-body">
							<div class="d-flex">
								<img :src="getPictureUrl(message.photo)" class="photo">
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

<script>
import { mapState } from 'vuex';

export default {
	name: 'PostCard',
	props: {
		post: {
			type: Object,
			required: true
		},
		isEmpty: {
			type: Boolean,
			require: true
		},
		isLoading: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {};
	},
	computed: {
		...mapState({
			token: state => state.token,
			info: state => state.info
		})
	},
	methods: {
		showContent(content) {
			return content.replace(/\n/i, '</br>');
		},
		getDate(createdAt) { // 取得本地時間
			const date = new Date(createdAt).toLocaleDateString();
			const time = new Date(createdAt).toTimeString().split(' ')[0];
			return `${date} ${time}`;
		},
		toggleLike() {
			const config = {
				method: 'PATCH',
				url: `${process.env.VUE_APP_APIPATH}/api/v1/posts/likes/${this.post._id}`,
				headers: {
					authorization: `Bearer ${this.token}`
				}
			};
			this.$http(config)
				.then(response => {
					this.$emit('update-post');
				})
				.catch(error => {
					console.log(error);
				});
		}
	}
};
</script>

<style lang="scss" scoped>
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
</style>
