<template>
	<div class="thumbs-up-wrap">
		<h3 class="title py-3 border bg-white text-center mb-4">我按讚的貼文</h3>
		<CardDefault :is-loading="isLoading" :message="'目前尚無按讚貼文'" v-if="posts?.length === 0"></CardDefault>
		<template v-else>
			<div class="rounded-card card mb-3" v-for="post in posts" :key="post.id">
				<div class="card-body d-flex align-items-center">
					<img :src="post.user.photo" class="photo border rounded-circle" v-if="post.user.photo">
					<div class="photo rounded-circle border d-flex align-items-center justify-content-center" v-else>
						<i class="bi bi-person fs-5"></i>
					</div>
					<div class="d-flex flex-column ms-3">
						<router-link :to="{ name: 'PersonalPage', params: { id: post.user._id } }" class="fw-bold">
							{{ post.user.name }}
						</router-link>
						<small class="text-black-50">{{ getDate(post.createdAt) }}</small>
					</div>
					<div class="d-flex align-items-center ms-auto me-3">
						<a href="#" class="d-flex flex-column align-items-center me-4" @click.prevent="toggleLike(post._id)">
							<i class="bi bi-hand-thumbs-up text-primary fs-5"></i>
							<small class="text-black fw-bold">取消</small>
						</a>
						<a href="#" class="d-flex flex-column align-items-center" @click.prevent="checkPost(post._id)">
							<i class="bi bi-arrow-right-circle text-black fs-5"></i>
							<small class="text-black fw-bold">查看</small>
						</a>
					</div>
				</div>
			</div>
		</template>
		<PostModal :id="postId" ref="modal" @edit-post="getPosts()"></PostModal>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { Modal } from 'bootstrap';
import PostModal from './components/Modal.vue';
import CardDefault from '@/components/CardDefault.vue';

export default {
	name: 'ThumbsUp',
	components: {
		PostModal,
		CardDefault
	},
	data() {
		return {
			posts: [],
			isLoading: false,
			postId: '',
			modal: ''
		};
	},
	computed: {
		...mapState({
			token: state => state.token
		})
	},
	mounted() {
		this.getPosts();
		this.modal = new Modal(this.$refs.modal.$el);
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
				url: `${process.env.VUE_APP_APIPATH}/api/v1/user/likes`,
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
				url: `${process.env.VUE_APP_APIPATH}/api/v1/post/${id}/likes`,
				headers: {
					authorization: `Bearer ${this.token}`
				}
			};
			this.$http(config)
				.then(response => {
					const index = this.posts.findIndex(item => item._id === id);
					this.posts.splice(index, 1);
				})
				.catch(error => {
					console.log(error);
				});
		},
		checkPost(id) {
			this.postId = id;
			this.modal.show();
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
	}
</style>
