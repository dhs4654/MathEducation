const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  return new Promise((resolve, reject) => {
    // 添加用户信息到集合 users 
    db.collection('users').add({
      data: {
        _id: openid,
        _openid: openid,
        isActive: true,
        phone: event.phone,
        name: event.name,
        address: event.address,
        nickName: event.nickName,
        img: event.img,
        identity: {
          type: 'user'
        }
      }
    }).then(res => {
      resolve({
        success: true
      })
    }).catch(e => {
      console.error(e)
      resolve({
        success: false
      })
    })
  })
}