<template>
	<div class="modal fade" id="modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header border-bottom-1">
					<h3 class="modal-title" id="exampleModalLabel">編輯貼文</h3>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body bg-light">
					<div class="mb-3">
						<label for="content" class="form-label">貼文內容</label>
						<textarea class="form-control rounded-0" rows="3" id="content" placeholder="輸入您的貼文內容"
							v-model="info.content"></textarea>
					</div>
					<div class="mb-3">
						<label for="upload-file" class="btn form-label bg-black text-white shadow-none py-1 mb-0">上傳圖片</label>
						<input class="form-control d-none" type="file" id="upload-file" accept="image/png, image/jpeg"
							ref="upload-file" @change="getPreviewFile()">
					</div>
					<div class="image-wrap border rounded overflow-hidden" v-show="imagePreview">
						<a href="#" class="delete-btn bg-white border rounded-circle d-flex align-items-center justify-content-center"
							@click.prevent="deleteImage()">
							<i class="bi bi-x-lg"></i>
						</a>
						<img :src="imagePreview" class="w-100">
					</div>
					<div v-if="errorMessage" class="text-danger text-center d-block mt-3">
						<small>{{ errorMessage }}</small>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">取消</button>
					<button type="button" class="btn btn-primary btn-sm" @click="submitPost()">送出編輯</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'EditPost',
	props: {
		id: {
			type: [ String, Number ],
			require: true
		},
		editModal: {
			type: Object
		}
	},
	data() {
		return {
			info: {},
			imagePreview: '',
			errorMessage: ''
		};
	},
	watch: {
		id(val) {
			if (!val) {
				this.info = '';
			} else {
				this.getPost();
			}
		}
	},
	computed: {
		...mapState({
			token: state => state.token
		})
	},
	methods: {
		getPost() {
			const config = {
				method: 'GET',
				url: `${process.env.VUE_APP_APIPATH}/api/v1/post/${this.id}`,
				headers: {
					authorization: `Bearer ${this.token}`
				}
			};
			this.$http(config)
				.then(response => {
					this.info = {
						content: response.data.data.content,
						image: response.data.data.image
					};
					this.imagePreview = response.data.data.image;
				})
				.catch(error => {
					console.log(error);
				});
		},
		deleteImage() {
			this.info.image = '';
			this.imagePreview = '';
		},
		getPreviewFile() { // 預覽圖片
			const input = this.$refs['upload-file'];
			this.imagePreview = URL.createObjectURL(input.files[0]);
		},
		uploadFile() { // 上傳檔案到 aws s3
			return new Promise((resolve, reject) => {
				const input = this.$refs['upload-file'];
				const data = new FormData();
				data.append('image', input.files[0]);
				input.files = new DataTransfer().files; // 清空 input，避免重複選同一檔案無法觸發 change 事件

				const config = {
					method: 'POST',
					url: `${process.env.VUE_APP_APIPATH}/api/v1/file`,
					headers: {
						authorization: `Bearer ${this.token}`
					},
					data: data
				};
				this.$http(config)
					.then(response => {
						this.info.image = response.data.data;
						resolve();
					})
					.catch(error => {
						reject(error.response.data.message);
					});
			});
		},
		editPost() {
			return new Promise((resolve, reject) => {
				const config = {
					method: 'PATCH',
					url: `${process.env.VUE_APP_APIPATH}/api/v1/post/${this.id}`,
					headers: {
						authorization: `Bearer ${this.token}`
					},
					data: this.info
				};
				this.$http(config)
					.then(response => {
						resolve(response.data.data);
					})
					.catch(error => {
						reject(error.response.data.message);
					});
			});
		},
		async submitPost() {
			try {
				this.isLoading = true;
				if (this.imagePreview && this.imagePreview !== this.info.image) {
					await this.uploadFile(); // 先上傳圖片
				}
				await this.editPost(); // 接著編輯貼文
				this.editModal.hide();
				this.$emit('edit-post');
				this.isLoading = false;
			} catch (error) {
				this.errorMessage = error;
				this.isLoading = false;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
	.image-wrap {
		position: relative;
		.delete-btn {
			position: absolute;
			right: 5px;
			top: 5px;
			width: 25px;
			height: 25px;
		}
	}
</style>
