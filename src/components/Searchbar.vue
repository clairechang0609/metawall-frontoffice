<template>
	<div class="row mb-3">
		<div class="col-4">
			<select name="type" class="form-control form-select rounded-0" v-model="search.sort" @change="getPosts()">
				<option value="desc">最新貼文</option>
				<option value="asc">最舊貼文</option>
			</select>
		</div>
		<div class="col-8">
			<div class="input-group">
				<input type="text" class="form-control rounded-0" placeholder="搜尋貼文"
					v-model="search.keyword" @keyup.enter="getPosts()">
				<button class="btn btn-primary shadow-none rounded-0 px-3 py-0 fs-5" type="button" @click="getPosts()">
					<i class="bi bi-search"></i>
				</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Home',
	data() {
		return {
			search: {
				sort: 'desc', // 排序(預設降冪)
				keyword: '' // 關鍵字
			}
		};
	},
	mounted() {
		this.startSearch();
	},
	methods: {
		startSearch() {
			this.$emit('search', this.search);
		}
	}
};
</script>

<style lang="scss" scoped></style>
