/**
 * 云函数删除表的数据
 * 若要清空某个表，请在云函数云端调试中带上removeAll参数触发此函数
 * 
 * 参数： table: string 表名
 *        _id:  string 要删除记录的_id
 *        (选填)removeAll: '我确定要删除表中所有数据' 则删除整个表的所有数据
 *
 * 返回： object 
 *        成功：{success: 1}
 *        失败：{success: 0}
 */

const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  if (event.removeAll === '我确定要删除表中所有数据'){
    const _ = db.command
    return await db.collection(event.table)
    .where({
      _id: _.exists(true)
    })
    .remove()
  }

  return new Promise((resolve, reject) => {
    db.collection(event.table).doc(event._id)
      .remove()
      .then(res => {
        resolve({
          success: 1
        })
      })
      .catch(e => {
        console.error(e)
        reject({
          success: 0
        })
      })
  })
}