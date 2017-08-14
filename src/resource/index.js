import axios from 'axios';
import defaultsdeep from 'lodash.defaultsdeep';

function mixParams(url, params) {
	let copyParams = Object.assign({}, params);
	let _url = url.replace(/(\/\:([^/:?&]+))/g, ($0, $1) => {
		const key = $1.slice(2, $1.length);
		delete copyParams[key];
		return params && params[key] ? `/${params[key]}` : '';
	});

	_url.includes('?') ? _url = `${_url}&` : _url = `${_url}?`;

	for (let key in copyParams) {
		_url += `${key}=${copyParams[key]}&`;
	}

	_url = copyParams.length === 0 ? _url : _url.slice(0, -1);

	return _url;
}

export class Resource {
	constructor(url, configActions) {
		this.url = url;
		const res = {};
		// 深拷贝
		const actions = defaultsdeep({}, configActions, Resource.defaultActions);
		for (let action in actions) {
			res[action] = (params, data, config) => {
				let _action = Object.assign({}, actions[action]);
				_action.url = mixParams(_action.url || this.url, params);
				if (['put', 'post', 'patch'].includes((_action.method).toLowerCase())) {
					_action.data = data;
				} else {
					config = data;
				}
				// config 中的 url, params 和 data 应该如何处理?
				// 将 _action 中的 data 去 merge config 中的 data
				// url 以 action 为主, 也就是会覆盖掉 config 中的 url
				// params 会追加到 _action.url 后面
				return axios.request(defaultsdeep({}, _action, config));
			};
		}
		return res;
	}
}

Resource.defaultActions = {
	get: {
		method: 'get'
	},
	save: {
		method: 'post'
	},
	query: {
		method: 'get'
	},
	remove: {
		method: 'delete'
	},
	update: {
		method: 'put'
	}
};
