/**
 * 判断系统
 * @returns {boolean}
 */
export function os():boolean {
  const userAgent = navigator.userAgent.toLowerCase()
  if (
    userAgent.indexOf('iphone') > -1 ||
    userAgent.indexOf('ipad') > -1 ||
    userAgent.indexOf('mac') > -1
  ) {
    return true
  }
  return false
}