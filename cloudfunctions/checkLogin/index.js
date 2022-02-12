/**
 * 获取用户的登录状态
 * 参数： 无
 * 返回： object 
 *       如果用户已登录，对象 包含为 true 的 isActive 字段，
 *       以及用户信息字段；
 *       如果用户未登录，对象仅包含为 false 的 isActive 字段。
 */
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const userRes = await db.collection('users')
      .where({
        _openid: openid
      }).limit(1).field({
        isActive: true,
        phone: true,
        name: true,
        address: true,
        identity: true,
        nickName: true,
        img: true
      }).get()

    if (userRes.data.length) {
      let ret = userRes.data[0]
      ret.isActive = true
      return ret
    } else return {
      isActive: false
    }
  } catch (e) {
    console.error(e)
    return {
      isActive: false,
      err: e
    }
  }
}