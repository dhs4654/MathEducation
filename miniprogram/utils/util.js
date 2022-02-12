/**
 * 函数名：showLoading
 * 功能：wx.showLoading封装
 * 参数： title
 * 返回： promise对象
 */
function showLoading(title) {
  return wx.showLoading({
    title: title,
    mask: true
  })
}
module.exports.showLoading = showLoading


/**
 * 函数名：showLoading
 * 功能：wx.hideLoading封装
 * 参数： 无
 * 返回： promise对象
 */
function hideLoading() {
  return wx.hideLoading()
}
module.exports.hideLoading = hideLoading


/**
 * 函数名：showToast
 * 功能：wx.showToast封装
 * 参数： title, icon='none', duration=1000
 * 返回： promise对象
 */
function showToast(title, icon = 'none', duration = 1000){
  return wx.showToast({
    title: title,
    icon: icon,
    duration: duration,
    mask: true
  })
}
module.exports.showToast = showToast