/**
 * 云函数删除云储存文件
 * 参数： fileIDs:  云文件ID构成的数组，长度最大为50
 * 返回：对象 fileList{
 *    fileID	string	云文件 ID
 *    status	number	状态码，0 为成功
 *    errMsg	string	成功为 ok，失败为失败原因
 * }
 */
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const fileIDs = event.fileIDs
  const result = await cloud.deleteFile({
    fileList: fileIDs,
  })
  return result.fileList
}