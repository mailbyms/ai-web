/**
 * 判断系统
 * @returns {boolean}
 */
export function os():boolean {  
  switch (uni.getSystemInfoSync().platform) {
  	case 'android':
  		return false
  	case 'ios':
  		return true
  }
}