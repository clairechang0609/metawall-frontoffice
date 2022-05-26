<template>
	<div class="following-wrap">
		<h3 class="title py-3 border bg-white text-center mb-4">追蹤名單</h3>
		<CardDefault :is-loading="isLoading" :message="'目前尚無追蹤名單'" v-if="following?.length === 0"></CardDefault>
		<div class="rounded-card card mb-3" v-for="data in following" :key="data.user._id">
			<div class="card-body d-flex align-items-center">
				<img :src="data.user.photo" class="photo border rounded-circle flex-shrink-0" v-if="data.user.photo">
				<div class="photo rounded-circle border d-flex align-items-center justify-content-center flex-shrink-0" v-else>
					<i class="bi bi-person fs-5"></i>
				</div>
				<div class="d-flex flex-column w-100 ms-3">
					<router-link :to="{ name: 'PersonalPage', params: { id: data.user._id } }" class="fw-bold">
						{{ data.user.name }}
					</router-link>
					<div class="d-flex align-items-center justify-content-between">
						<small class="text-black-50">您已追蹤 {{ getDays(data.createdAt) }} 天！</small>
						<small class="ms-auto">追蹤時間：{{ getDate(data.createdAt) }}</small>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import CardDefault from '@/components/CardDefault.vue';

export default {
	name: 'Following',
	components: {
		CardDefault
	},
	data() {
		return {
			following: [],
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
		getFollowing() {
			this.isLoading = true;
			const config = {
				method: 'GET',
				url: `${process.env.VUE_APP_APIPATH}/api/v1/user/following`,
				headers: {
					authorization: `Bearer ${this.token}`
				}
			};
			this.$http(config)
				.then(response => {
					this.following = response.data.data;
					this.isLoading = false;
				})
				.catch(error => {
					this.isLoading = false;
					console.log(error);
				});
		},
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
