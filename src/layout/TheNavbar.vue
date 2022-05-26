<template>
	<nav class="navbar fixed-top px-3 bg-white border-bottom">
		<div class="navbar-content d-flex align-items-center justify-content-between w-100 h-100">
			<h1 class="logo text-dark">
				<router-link :to="{ name: 'Home' }" class="text-black text-decoration-none">
					MetaWall
				</router-link>
			</h1>
			<div class="nav-item dropdown">
				<div class="nav-link dropdown-toggle d-flex align-items-center pe-0"
					id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
					<img :src="info.photo" alt="head" class="head d-block me-2 border rounded-circle" v-if="info.photo">
					<div class="head rounded-circle border me-2 d-flex align-items-center justify-content-center flex-shrink-0 text-black" v-else>
						<i class="bi bi-person fs-6"></i>
					</div>
					<a href="#" class="border-bottom p-0 fw-bold text-black text-decoration-none">{{ info.name }}</a>
				</div>
				<ul class="dropdown-menu dropdown-menu-end rounded-0 p-0 text-center" aria-labelledby="navbarDropdown">
					<li v-if="info._id">
						<router-link :to="{ name: 'PersonalPage', params: { id: info._id } }" class="dropdown-item text-decoration-none py-2 border-bottom">
							我的貼文牆
						</router-link>
					</li>
					<li>
						<router-link :to="{ name: 'Account' }" class="dropdown-item text-decoration-none py-2 border-bottom">
							修改個人資料
						</router-link>
					</li>
					<li>
						<button type="button" class="dropdown-item text-decoration-none py-2" @click="logout()">
							登出
						</button>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
	name: 'Navbar',
	data() {
		return {};
	},
	computed: {
		...mapState({
			info: state => state.info
		})
	},
	mounted() {
	},
	methods: {
		...mapMutations([ 'setInfo', 'setToken' ]),
		logout() {
			this.setToken();
			this.$router.push({ name: 'Login' });
		}
	}
};
</script>

<style lang="scss" scoped>
	.navbar {
		height: $navbar-height;
		.navbar-content {
			@include window-width;
		}
		.nav-link {
			&::after {
				display: none
			}
			.head {
				width: 30px;
				height: 30px;
				background-color: #E2EDFA;
			}
		}
		.logo {
			@include metawall-logo;
			font-size: 26px;
		}
		.dropdown-menu {
			@include custom-border;
			box-shadow: 5px 5px 0 -2px white, 5px 5px 0 0px $black;
			.dropdown-item {
				&:hover, &:active {
					background-color: $gray-300;
					color: $black;
				}
			}
		}
	}
</style>
