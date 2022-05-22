<template>
	<div class="following-wrap">
		<h3 class="title py-3 border bg-white text-center mb-4">追蹤名單</h3>
		<div class="rounded-card card mb-3" v-if="data.length === 0 || isLoading">
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
				<p class="text-black-50 text-center py-1" v-else>目前尚無追蹤名單</p>
			</div>
		</div>
		<div class="rounded-card card mb-3" v-for="item in data" :key="item.id">
			<div class="card-body d-flex align-items-center">
				<img :src="item.following.photo" class="photo border rounded-circle" v-if="item.following.photo">
				<div class="photo rounded-circle border d-flex align-items-center justify-content-center" v-else>
					<i class="bi bi-person fs-5"></i>
				</div>
				<div class="d-flex flex-column ms-3">
					<router-link :to="{ name: 'PersonalPage', params: { id: item.following._id } }" class="fw-bold">
						{{ item.following.name }}
					</router-link>
					<small class="text-black-50">您已追蹤 {{ getDays(item.createdAt) }} 天！</small>
				</div>
				<small class="ms-auto">追蹤時間：{{ getDate(item.createdAt) }}</small>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'Following',
	data() {
		return {
			data: [],
			isLoading: false
		};
	},
	computed: {
		...mapState({
			token: state => state.token
		})
	},
	mounted() {
		this.getFollowing();
	},
	methods: {
		getDate(createdAt) { // 取得本地時間
			const date = new Date(createdAt).toLocaleDateString();
			const time = new Date(createdAt).toTimeString().split(' ')[0];
			return `${date} ${time}`;
		},
		getDays(createdAt) {
			const followDate = new Date(createdAt);
			const currentDate = new Date();
			const duration = new Date(currentDate.getTime() - followDate.getTime());
			return duration.getUTCDate() - 1;
		},
		getFollowing() {
			this.isLoading = true;
			const config = {
				method: 'GET',
				url: `${process.env.VUE_APP_APIPATH}/api/v1/follows`,
				headers: {
					authorization: `Bearer ${this.token}`
				}
			};
			this.$http(config)
				.then(response => {
					this.data = response.data.data;
					this.isLoading = false;
				})
				.catch(error => {
					console.log(error); // TODO:
					this.isLoading = false;
				});
		}
	}
};
</script>

<style lang="scss" scoped>
	.following-wrap {
		.title {
			box-shadow: -5px 5px 0 -2px white, -5px 5px 0 0px $black;
		}
		.photo {
			width: 50px;
			height: 50px;
			background-color: #E2EDFA;
		}
	}
</style>
