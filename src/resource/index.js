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
		const actions = defaultsdeep({}, Resource.defaultActions, configActions);
		for (let action in actions) {
			res[action] = (params, data, config) => {
				let _action = Object.assign({}, actions[action]);
				_action.url = mixParams(_action.url || this.url, params);
				if (['put', 'post', 'patch'].includes((_action.method).toLowerCase())) {
					_action.data = data;
				} else {
					config = data;
				}
				return axios.request(Object.assign({}, _action, config));
			};
		}
		return res;
	}

	// get(params, config) {
	// 	return axios.get(mixParams(this.url, params), config);
	// }
	//
	// save(params, data, config) {
	// 	return axios.post(mixParams(this.url, params), data, config);
	// }
	//
	// query(params, config) {
	// 	return axios.get(mixParams(this.url, params), config);
	// }
	//
	// remove(params, config) {
	// 	return axios.delete(mixParams(this.url, params), config);
	// }
	//
	// delete(params, config) {
	// 	return axios.delete(mixParams(this.url, params), config);
	// }
	//
	// update(params, data, config) {
	// 	return axios.put(mixParams(this.url, params), data, config)
	// }
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
