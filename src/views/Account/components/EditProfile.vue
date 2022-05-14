<template>
	<div class="card-body p-4 d-flex flex-column align-items-center">
		<img :src="photoPreview" class="photo d-block mb-3 border rounded-circle" v-if="photoPreview">
		<div class="photo rounded-circle border d-flex align-items-center justify-content-center mb-3" v-else>
			<i class="bi bi-person fs-1"></i>
		</div>
		<div class="mb-3">
			<label for="upload-file" class="btn form-label bg-black text-white shadow-none py-1 mb-0">編輯大頭照</label>
			<input class="form-control d-none" type="file" id="upload-file" accept="image/png, image/jpeg"
				ref="upload-file" @change="getPreviewFile()">
		</div>
		<form class="mt-3">
			<div class="mb-3">
				<label for="name" class="form-label">暱稱</label>
				<input type="text" class="form-control rounded-0" id="name" placeholder="請輸入暱稱"
					v-model="info.name">
			</div>
			<div class="mb-3">
				<label for="gender" class="form-label">性別</label>
				<div>
					<div class="form-check form-check-inline">
						<input class="form-check-input" type="radio" id="female" value="female" v-model="info.gender">
						<label class="form-check-label" for="female">女性</label>
					</div>
					<div class="form-check form-check-inline">
						<input class="form-check-input" type="radio" id="male" value="male" v-model="info.gender">
						<label class="form-check-label" for="male">男性</label>
					</div>
				</div>
			</div>
			<div v-if="errorMessage" class="text-danger text-center d-block mt-3">
				{{ errorMessage }}
			</div>
			<button type="button" class="btn btn-secondary w-100 mt-3" @click="submit()" :disabled="isLoading">
				<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="isLoading"></span>
				送出更新
			</button>
		</form>
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
	name: 'EditProfile',
	data() {
		return {
			info: {
				name: '',
				photo: '',
				gender: ''
			},
			photoPreview: '', // 預覽大頭貼
			isUpdatePhoto: false, // 是否更新大頭貼
			errorMessage: '',
			isLoading: false
		};
	},
	computed: {
		...mapState({
			token: state => state.token
		})
	},
	mounted() {
		this.getProfile();
	},
	methods: {
		...mapMutations([ 'setInfo' ]),
		getProfile() {
			const config = {
				method: 'GET',
				url: `${process.env.VUE_APP_APIPATH}/users/profile`,
				headers: {
					authorization: `Bearer ${this.token}`
				}
			};
			this.$http(config)
				.then(response => {
					this.setProfile(response.data.data);
				})
				.catch(error => {
					console.log(error); // TODO:
				});
		},
		setProfile(response) {
			const { name, photo, gender } = response;
			this.info = { name, photo, gender };
			this.photoPreview = photo;
		},
		getPreviewFile() { // 預覽圖片
			const input = this.$refs['upload-file'];
			this.photoPreview = URL.createObjectURL(input.files[0]);
			this.isUpdatePhoto = true;
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
						resolve(response.data.data);
					})
					.catch(error => {
						reject(error.response.data.message);
					});
			});
		},
		updateProfile() {
			return new Promise((resolve, reject) => {
				const config = {
					method: 'PATCH',
					url: `${process.env.VUE_APP_APIPATH}/users/profile`,
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
		async submit() {
			try {
				this.isLoading = true;
				if (this.isUpdatePhoto) {
					const photo = await this.uploadFile(); // 先上傳圖片
					this.info.photo = photo;
				}
				const response = await this.updateProfile(); // 更新個人資訊
				this.setProfile(response);
				this.setInfo({ // 更新 vuex
					_id: response._id,
					name: response.name,
					photo: response.photo
				});
				this.errorMessage = '';
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
	form {
		width: 320px;
	}
	.photo {
		width: 105px;
		height: 105px;
		background-color: #E2EDFA;
	}
</style>
