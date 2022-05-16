import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@store';

Vue.use(VueRouter);

const routes = [
	{
		name: 'Login',
		path: '/login',
		component: () => import('@/views/Login/Index'),
		meta: { requiresAuth: false }
	},
	{
		path: '/',
		component: () => import('@/views/Index'),
		meta: { requiresAuth: true },
		children: [
			{
				name: 'Home',
				path: '/',
				component: () => import('@/views/Home')
			},
			{
				name: 'Following',
				path: '/following',
				component: () => import('@/views/Following')
			},
			{
				name: 'Account',
				path: '/account',
				component: () => import('@/views/Account/Index')
			},
			{
				name: 'Post',
				path: '/post',
				component: () => import('@/views/Post')
			},
			{
				name: 'ThumbsUp',
				path: '/thumbs-up',
				component: () => import('@/views/ThumbsUp')
			},
			{
				name: 'PersonalPage',
				path: '/personal-page/:name',
				component: () => import('@/views/PersonalPage')
			}
		]
	}
];

const router = new VueRouter({
	mode: 'history',
	routes
});

// 路由跳轉前
router.beforeEach(async (to, from, next) => {
	try {
		// 判斷是否登入
		const isLogin = store.state.token;
		// 判斷是否需要驗證
		const isMatched = to.matched.some(record => record.meta.requiresAuth);
		if (!isLogin && isMatched) {
			next({ name: 'Login' });
		} else {
			next();
		}
	} catch (error) {
		next({ name: 'Login' });
	}
});

export default router;
