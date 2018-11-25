/**
 *
 * @authors Gary.zhou (Gary.zhou@verystar.cn)
 * @date    2017-02-28 11:32:14
 * @description api lists
 */
const API_LISTS = [
	{
		interval: 1500, // 接口重试间隔时间
		retryTimes: 3, // 接口重试次数
		name: 'feAuth', // 函数名
		// apiName: '/user/checkOpenid', // 后端定义的接口名称
		apiName: '/xxx/xxx/token', // 后端定义的接口名称
		method: 'GET', // 请求method
		// 请求参数
		params: {
			// post 参数数组
			'get': [
				{
					param: 'code', // 后端定义的参数名称
					isNeed: 1	// 是否为必传 1 -- 必传 / 0 -- 可选
				}
			]
		},
		/**
		 * [resSchema 前端数据模型]
		 */
		resSchema: {
			title: 'authModel',
			description: 'auth FE model',
			type: 'object',
			properties: {
				ticket: {
					type: 'other',
					serverName: 'token'
				},
				userId: {
					type: 'other',
					serverName: 'uuid'
				}
			}
		}
	}
];

module.exports = API_LISTS;
