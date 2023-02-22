import env from "./env";

//请求地址
let baseUrl = "";
let api_key = ""
switch (env) {
  case 'dev':
    baseUrl = "http://129.226.90.195:3000" //外测
	api_key = 'eoJKTi3A47iVdh3a8VFQs8DghBigPRXh2TPEHmaH'
    break;
  case 'pred':
    baseUrl = "http://129.226.90.195:3000" //预发布
	api_key = 'eoJKTi3A47iVdh3a8VFQs8DghBigPRXh2TPEHmaH'
    break;
  case 'pro':
    baseUrl = "http://129.226.90.195:3000" //正式服
	api_key = 'eoJKTi3A47iVdh3a8VFQs8DghBigPRXh2TPEHmaH'
    break;
}



/**
 * 统一请求
 * @param {string} url  请求地址
 * @param {any} data  请求数据
 * @param {UniNamespace.RequestOptions.method} method  请求方法
 * @param {string} contentType 请求头附带的类型
 */
const request = <T>(url:string, data:any, method: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | undefined,contentType = 'application/json;charset=utf-8'):Promise<T> => {
  return new Promise<T>((resolve, reject) => {
	  let apiUrl = ''
	  // #ifdef  H5
		apiUrl = `${url}?api_key=${api_key}`
	   // #endif
	    // #ifdef  MP-WEIXIN
	   apiUrl = `${baseUrl}${url}?api_key=${api_key}`
	    // #endif
    uni.request({
      url: apiUrl,
      data: data,
      method: method,
      header: {
        'content-type': contentType
      },
      success: function (res) {
        console.log('请求成功',res.data)
		
		const data:T= res.data
		resolve(data)
      },
      fail: function (err) {
		console.log('请求失败',err)
        reject(err)
      }
    })
  })
}


/**
 * post 请求
 * @param {string} url 请求地址
 * @param {object} data 请求数据
 * @param {string} contentType 请求头附带的类型 默认 application/json;charset=utf-8
 */
const post = <T>(url:string, data:any, contentType?) => {
  return new Promise<T>((resolve, reject) => {
    request<T>(url, data, "POST",contentType).then(res => resolve(res)).catch(err => reject(err))
  })
}

export  {
  request,
  post,
  baseUrl,
}