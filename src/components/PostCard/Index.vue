<template>
	<div class="rounded-card card mb-3">
		<div class="card-header bg-transparent pt-3 border-0">
			<div class="d-flex align-items-center">
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
				<!-- 編輯貼文 -->
				<div class="dropdown ms-auto align-self-start" v-if="hasAuth(post.user._id)">
					<button type="button" class="edit-btn border-0 rounded-circle"
						id="edit-btn" data-bs-toggle="dropdown" aria-expanded="false">
						<i class="bi bi-three-dots"></i>
					</button>
					<ul class="dropdown-menu dropdown-menu-end rounded-0 border-dark p-0" aria-labelledby="edit-btn">
						<li><a class="dropdown-item text-center border-bottom" href="#" @click.prevent="checkEditPost(post._id)">編輯貼文</a></li>
						<li><a class="dropdown-item text-center" href="#" @click.prevent="checkDeletePost(post._id)">刪除貼文</a></li>
					</ul>
				</div>
			</div>
		</div>
		<div class="card-body">
			<p v-html="showContent(post.content)" class="mb-3"></p>
			<img :src="post.image" class="w-100 mb-3 border rounded" v-if="post.image">
			<a href="#" class="text-decoration-none text-primary" @click.prevent="toggleLike()" v-if="post?.likes.length">
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
					<input type="text" class="form-control rounded-0" placeholder="留言..." v-model="content" @keyup.enter="sendComment()">
					<button class="btn btn-primary shadow-none rounded-0 px-4" type="button" @click="sendComment()">
						留言
					</button>
				</div>
			</div>
			<!-- 用戶回覆 -->
			<ul v-if="post?.comments?.length > 0" class="mt-3">
				<li v-for="comment in post.comments" :key="comment._id" class="mb-3">
					<div class="comment-card card border-0">
						<div class="card-body">
							<div class="d-flex">
								<img :src="comment.user.photo" class="photo border rounded-circle flex-shrink-0" v-if="comment.user.photo">
								<div class="photo rounded-circle border d-flex align-items-center justify-content-center flex-shrink-0" v-else>
									<i class="bi bi-person fs-5"></i>
								</div>
								<div class="w-100 d-flex flex-column ms-3 pt-2">
									<router-link :to="{ name: 'PersonalPage', params: { id: comment.user._id } }" class="fw-bold">
										{{ comment.user.name }}
									</router-link>
									<small class="text-black-50">{{ getDate(comment.createdAt) }}</small>
									<div class="w-100 d-flex align-items-end mt-2">
										<p v-html="showContent(comment.content)" class="me-3"></p>
										<div class="flex-shrink-0 ms-auto">
											<a href="#" class="text-decoration-none text-primary" @click.prevent="toggleCommentLike(comment._id)" v-if="comment?.likes.length">
												<i class="bi bi-hand-thumbs-up fs-6"></i>
												{{ comment.likes.length }}
											</a>
											<a href="#" class="text-decoration-none text-black-50" @click.prevent="toggleCommentLike(comment._id)" v-else>
												<i class="bi bi-hand-thumbs-up fs-6"></i>
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<DeletePost ref="deleteModal" :delete-modal="deleteModal" :delete-id="deleteId"
			@delete="deletePost"></DeletePost>
		<EditPost ref="editModal" :id="editId" :edit-modal="editModal" @edit-post="editPost"></EditPost>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { Modal } from 'bootstrap';
import DeletePost from './components/DeleteModal';
import EditPost from './components/EditModal';

export default {
	name: 'PostCard',
	components: {
		DeletePost,
		EditPost
	},
	props: {
		post: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			content: '', // 留言內容
			deleteModal: {},
			deleteId: '',
			editModal: {},
			editId: ''
		};
	},
	computed: {
		...mapState({
			token: state => state.token,
			info: state => state.info
		})
	},
	mounted() {
		this.deleteModal = new Modal(this.$refs.deleteModal.$el);
		this.editModal = new Modal(this.$refs.editModal.$el);
	},
	methods: {
		hasAuth(id) { // 是否有編輯權限
			return id === this.info._id;
		},
		showContent(content) { // 顯示貼文內容
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
				url: `${process.env.VUE_APP_APIPATH}/api/v1/post/${this.post._id}/likes`,
				headers: {
					authorization: `Bearer ${this.token}`
				}
			};
			this.$http(config)
				.then(response => {
					this.$emit('edit-post-likes', response.data.data);
				})
				.catch(error => {
					console.log(error);
				});
		},
		toggleCommentLike(id) {
			const config = {
				method: 'PATCH',
				url: `${process.env.VUE_APP_APIPATH}/api/v1/comment/${id}/likes`,
				headers: {
					authorization: `Bearer ${this.token}`
				}
			};
			this.$http(config)
				.then(response => {
					this.$emit('edit-comment-likes', response.data.data);
				})
				.catch(error => {
					console.log(error);
				});
		},
		sendComment() { // 留言
			if (!this.content) {
				return false;
			}
			const config = {
				method: 'POST',
				url: `${process.env.VUE_APP_APIPATH}/api/v1/post/${this.post._id}/comment`,
				headers: {
					authorization: `Bearer ${this.token}`
				},
				data: {
					content: this.content
				}
			};
			this.$http(config)
				.then(response => {
					this.content = '';
					this.$emit('add-comment', response.data.data);
				})
				.catch(error => {
					console.log(error);
				});
		},
		checkEditPost(postId) { // 編輯貼文
			this.editId = postId;
			this.editModal.show();
		},
		checkDeletePost(postId) { // 刪除貼文
			this.deleteId = postId;
			this.deleteModal.show();
		},
		deletePost() {
			this.$emit('edit-post');
			this.deleteId = '';
		},
		editPost() {
			this.$emit('edit-post');
			this.editId = '';
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
	.comment-card {
		background-color: rgba($gray-300, 0.5);
	}
	.edit-btn {
		width: 28px;
		height: 28px;
		color: $gray-600;
		background-color: transparent;
		&:hover {
			background-color: rgba($gray-300, 0.75);
		}
	}
	.dropdown-menu {
		min-width: 100px;
	}
	.dropdown-item {
		font-size: 14px;
		&:hover, &:active {
			text-decoration: none;
			background-color: $gray-300;
			color: $black;
		}
	}
</style>
