import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import router from '@/router';

Vue.use(Vuex);

function initialState() {
	return {
		token: '',
		info: {} // 會員資訊
	};
}

const store = new Vuex.Store({
	plugins: [ createPersistedState({
		key: 'metawall',
		storage: window.localStorage,
		reducer(state) {
			return {
				token: state.token,
				info: state.info
			};
		}
	}) ],
	state: initialState, // 資料庫
	getters: {}, // 類似 computed(不能直接改變 state)
	mutations: { // 用來改變 state
		setInfo(state, response) { // 取得會員資訊
			state.info = response;
		},
		setToken(state, token) { // 取得 token
			state.token = token;
		},
		resetState(state) {
			router.push({ name: 'Login' });
			Object.assign(state, initialState());
		}
	},
	actions: {} // 非同步事件只能寫在 actions(不能直接改變 state)
});

export default store;
