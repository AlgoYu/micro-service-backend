import { apiUrl } from '@/global/Global.js';
import Axios from 'axios';
import Store from '@/store/index.js';
import Router from "@/router/index.js";

// 携带Cookie
Axios.defaults.withCredentials = true;
// 默认URL
Axios.defaults.baseURL = apiUrl;

// 封装的请求
export async function request(method, url, data, callback) {
	// 构建信息
	let info = {
		method: method,
		url: url,
		headers: {
			'Content-Type': 'application/json',
			'Authorization': Store.state.accessToken
		},
		timeout: 1000
	};
	// 判断数据加在URL还是Body
	if (method === 'get' || method === 'delete') {
		info.params = data;
	} else {
		info.data = data;
	}
	// 请求
	Axios(info).then((res) => {
		// 如果已经Token过期则请求刷新Token
		if(res.data.code == 401){
			info.method = 'post';
			info.url = '/oauth/token';
			info.data = {
				'client_id': 'management',
				'client_secret': 'E10ADC3949BA59ABBE56E057F20F883E',
				'grant_type': 'refresh_token',
				'refreshToken': Store.state.refreshToken
			}
			// 转换数据拼接在URI
			info.transformRequest = [
				function (data) {
					// Do whatever you want to transform the data
					let ret = "";
					for (let it in data) {
						ret +=
							encodeURIComponent(it) +
							"=" +
							encodeURIComponent(data[it]) +
							"&";
					}
					return ret;
				},
			],
			info.headers = {
				"Content-Type": "application/x-www-form-urlencoded",
			};
			Axios(info).then((res)=>{
				// 如果请求成功 刷新Token后再次请求
				if(res.data.success){
					Store.commit("updateToken", res.data.data);
					request(method, url, data, callback);
				}else{
					// 请求失败则跳转到登录界面
					Router.push({
						path: "/Login"
					});
				}
			}).catch((err)=>{
				// 请求失败则跳转到登录界面
				Router.push({
					path: "/Login"
				});
			});
			return;
		}
		// 如果权限不足
		if(res.data.code == 403){

		}
		// 如果请求成功有回调函数
		if (callback != null) {
			callback(res.data);
		}
	// 网络请求失败处理
	}).catch((err) => {
		// 请求失败则跳转到登录界面
		Router.push({
			path: "/Login"
		});
	})
}