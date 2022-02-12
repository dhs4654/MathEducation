/**
 * 云函数搜索用户
 * 参数： name: 用户姓名
 *        phone: 电话
 *                    
 * 返回： object 
 *        成功：{success: 1, user: 用户信息}
 *        失败：{success: 0}
 */

const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  if (!('name' in event && 'phone' in event)) {
    return {
      success: false
    }
  }

  try {
    const {
      name,
      phone
    } = event

    res = await db.collection('users').where({
      name,
      phone
    }).limit(1).field({
      name: true,
      nickName: true,
      phone: true,
      identity: true,
    }).get()

    if (res.data.length) {
      return {
        success: true,
        user: res.data[0]
      }
    } else {
      return {
        success: false
      }
    }
  } catch (e) {
    console.error(e)
    return {
      success: false
    }
  }
}