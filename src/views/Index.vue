<template>
	<div id="main-container" class="main-container">
		<TheNavbar></TheNavbar>
		<div class="content px-3 px-md-0 py-3 py-md-5">
			<div class="row">
				<div class="col-12 col-md-7">
					<router-view></router-view>
				</div>
				<div class="col-12 col-md-5 d-none d-md-block">
					<Sidebar></Sidebar>
				</div>
				<div class="d-md-none">
					<SidebarSm></SidebarSm>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Template',
	components: {
		TheNavbar: () => import('@layout/TheNavbar.vue'),
		Sidebar: () => import('@components/Sidebar.vue'),
		SidebarSm: () => import('@components/SidebarSm.vue')
	},
	data() {
		return {};
	}
};
</script>

<style lang="scss" scoped>
	.content {
		margin-top: $navbar-height;
		margin-bottom: $navbar-height;
		@include window-width;
	}
</style>
