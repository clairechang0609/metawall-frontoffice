<template>
	<div class="post-wrap d-flex flex-column">
		<Loading :active.sync="isLoading"></Loading>
		<div class="row">
			<div class="col-12 col-md-7">
				<h3 class="title py-3 border bg-white text-center mb-4">張貼動態</h3>
				<div class="rounded-card card">
					<div class="card-body p-4">
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
							<img :src="imagePreview" class="w-100">
						</div>
						<div v-if="errorMessage" class="text-danger text-center d-block mt-3">
							<small>{{ errorMessage }}</small>
						</div>
						<div class="submit-btn-wrap mx-auto">
							<button type="button" class="btn btn-secondary w-100 mt-3" :disabled="!info.content"
								@click="submitPost()">
								送出貼文
							</button>
						</div>
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
import { mapState } from 'vuex';
const ws = new WebSocket('wss://peaceful-citadel-43202.herokuapp.com/websockets');

export default {
	name: 'Post',
	components: {
		Sidebar: () => import('../components/Sidebar.vue'),
		SidebarSm: () => import('../components/SidebarSm.vue')
	},
	data() {
		return {
			info: {
				content: '', // 貼文內容
				image: ''
			},
			imagePreview: '', // 圖片預覽
			errorMessage: '', // 錯誤訊息
			isLoading: false
		};
	},
	computed: {
		...mapState({
			token: state => state.token
		})
	},
	mounted() {
		ws.onopen = () => console.log('WebSocket 服務已連接');
		ws.onclose = () => console.log('WebSocket 伺服器關閉');
	},
	methods: {
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
					url: `${process.env.VUE_APP_APIPATH}/files`,
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
		uploadPost() {
			return new Promise((resolve, reject) => {
				const config = {
					method: 'POST',
					url: `${process.env.VUE_APP_APIPATH}/posts`,
					headers: {
						authorization: `Bearer ${this.token}`
					},
					data: this.info
				};
				this.$http(config)
					.then(response => {
						this.$router.push({ name: 'Home' });
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
				if (this.imagePreview) {
					await this.uploadFile(); // 先上傳圖片
				}
				const response = await this.uploadPost(); // 接著上傳po文
				await ws.send(JSON.stringify(response)); // 更新貼文
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
	.post-wrap {
		.title {
			box-shadow: -5px 5px 0 -2px white, -5px 5px 0 0px $black;
		}
		.submit-btn-wrap {
			width: 320px;
		}
	}
</style>
