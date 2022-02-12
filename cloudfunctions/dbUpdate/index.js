/**
 * 云函数update数据库
 * 参数： table:  数据库表名称
 *        _id:  记录的_id
 *        formData: 更新的数据 或 数据库命令的参数 如 {name: '新名称', type: '新类型'}
 * 
 *        (path视下方不同模式选填)
 *        path: 更新字段的路径字符串 如 'foodList.1' 'foodList.1.food'
 *        若不附带此参数则路径为记录的根目录
 *        
 *        模式：
 *        (可选)set: any 
 *                    带有该参数时将执行数据库set命令
 *                    无path参数时替换_id对应记录为formData
 *                    有path参数时替换_id对应记录path下的数据为formData
 *        (可选)pull: any  (删除数组元素)
 *                    带有该参数时将执行数据库pull命令
 *                    删除path参数连接的数组的某(些)项
 *                    formData为项匹配条件
 *                    相当于 [path]: _.pull(formData)
 *        (可选)remove: any 
 *                    带有该参数时将执行数据库remove命令，
 *                    对path参数连接的数组字段进行remove操作
 *                    相当于 [path]: _.remove()
 *      
 *                    
 * 返回： object 
 *        成功：{success: ture, res: 数据库操作的返回值}
 *        失败：{success: false}
 */

const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  return new Promise((resolve, reject) => {
    const table = event.table
    const _id = event._id
    const formData = event.formData
    const path = event.path
    const _ = db.command

    // 之后考虑针对openid判断所属商店管理员身份
    // const wxContext = cloud.getWXContext()
    // const openid = wxContext.OPENID

    var pro
    if ('push' in event) {
      pro = db.collection(table).doc(_id).update({
        data: {
          [path]: _.push(formData)
        }
      })
    } else if ('pull' in event) {
      pro = db.collection(table).doc(_id).update({
        data: {
          [path]: _.pull(formData)
        }
      })
    } else if ('set' in event) {
      //保证没有_id
      if ('_id' in formData) {
        delete formData._id
      }
      if ('path' in event) {
        pro = db.collection(table).doc(_id).update({
          data: {
            [path]: _.set(formData)
          }
        })
      } else {
        pro = db.collection(table).doc(_id).set({
          data: formData
        })
      }
    } else if ('remove' in event) {
      pro = db.collection(table).doc(_id).update({
        data: {
          [path]: _.remove()
        }
      })
    } else {
      if ('path' in event) {
        pro = db.collection(table).doc(_id).update({
          data: {
            [path]: formData
          }
        })
      } else {
        pro = db.collection(table).doc(_id).update({
          data: formData
        })
      }
    }

    pro.then(res => {
        resolve({
          success: true,
          res: res
        })
      })
      .catch(e => {
        console.error(e)
        resolve({
          success: false
        })
      })
  })
}