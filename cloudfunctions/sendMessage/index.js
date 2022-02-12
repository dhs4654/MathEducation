const cloud = require('wx-server-sdk')
var openid
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

//返回14位字符串日期20210102030405
function getStrDate(date, format = false) {
  let year = date.getFullYear()
  let month = (date.getMonth() + 1).toString().padStart(2, '0')
  let day = date.getDate().toString().padStart(2, '0')
  let hour = date.getHours().toString().padStart(2, '0')
  let min = date.getMinutes().toString().padStart(2, '0')
  let sec = date.getSeconds().toString().padStart(2, '0')
  if (format) {
    return year + '年' + month + '月' + day + '日 ' + hour + ':' + min + ':' + sec
  } else {
    return year + month + day + hour + min + sec
  }
}

function sendOrderCancelMessage(order, endDate, reason, note = null) {
  //发送订单取消订阅消息
  endDate = new Date(endDate)
  cloud.openapi.subscribeMessage.send({
    "touser": openid,
    "page": '/subpackages/order/pages/record/recordDetail?outTradeNo=' + order.orderInfo.outTradeNo,
    "lang": 'zh_CN',
    "data": {
      "thing1": {
        "value": order.goodsInfo.shopInfo.name
      },
      "thing2": {
        "value": reason
      },
      "character_string4": {
        "value": order.orderInfo.outTradeNo
      },
      "thing8": {
        "value": note === null ? '无' : note
      },
      "time3": {
        "value": getStrDate(endDate, true)
      }
    },
    "templateId": 'Q_EQhMx9pJeohoPN3oln0_ZIAqGDj_yJyilqOnwkYfY',
    "miniprogramState": 'trial'
  })
}

function sendOrderAcceptMessage(order, endDate) {
  //发送订单已受理订阅消息
  endDate = new Date(endDate)
  cloud.openapi.subscribeMessage.send({
    "touser": openid,
    "page": '/subpackages/order/pages/record/recordDetail?outTradeNo=' + order.orderInfo.outTradeNo,
    "lang": 'zh_CN',
    "data": {
      "thing3": {
        "value": order.goodsInfo.shopInfo.name
      },
      "character_string1": {
        "value": order.orderInfo.outTradeNo
      },
      "time4": {
        "value": getStrDate(endDate, true)
      }
    },
    "templateId": 'EOEOyGE1Fzxu26ciatAHZ20fJgjV8m2yM5fa1TbNKwU',
    "miniprogramState": 'trial'
  })
}

function sendOrderNotGetMessage(order) {
  //发送订单待取餐订阅消息
  cloud.openapi.subscribeMessage.send({
    "touser": openid,
    "page": '/subpackages/order/pages/record/recordDetail?outTradeNo=' + order.orderInfo.outTradeNo,
    "lang": 'zh_CN',
    "data": {
      "thing1": {
        "value": '您的订单已送至取餐点，请及时取餐'
      },
      "thing2": {
        "value": order.getFoodInfo.place
      },
      "character_string10": {
        "value": order.orderInfo.outTradeNo
      },
      "character_string17": {
        "value": order.userInfo.phone.slice(-4)
      },
    },
    "templateId": 'jPQAKJ_VRCc6FP-wBCJiJQxDA7Mhl9KmM2rmx7PiXBU',
    "miniprogramState": 'trial'
  })
}

function sendFeedbackResultMessage(content, result, reply, endDate) {
  //发送反馈处理结果订阅消息
  endDate = new Date(endDate)
  cloud.openapi.subscribeMessage.send({
    "touser": openid,
    "page": '/subpackages/order/pages/record/record',
    "lang": 'zh_CN',
    "data": {
      "thing2": {
        "value": content
      },
      "thing3": {
        "value": result
      },
      "thing4": {
        "value": reply
      },
      "date1": {
        "value": getStrDate(endDate, true)
      }
    },
    "templateId": 'tVCBMu_fvNP7JrFAWTNhnElMKeS3GG-Fg7q2KI7IZdM',
    "miniprogramState": 'trial'
  })
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  openid = wxContext.OPENID

  const type = event.type
  if ('endDate' in event) {
    console.log(event.endDate)
  }


  if (type === 'orderCancel') {
    sendOrderCancelMessage(event.order, event.endDate, event.reason, 'note' in event ? event.note : null)
  } else if (type === 'orderAccept') {
    sendOrderAcceptMessage(event.order, event.endDate)
  } else if (type === 'orderNotGet') {
    sendOrderNotGetMessage(event.order)
  } else if (type === 'feedbackResult') {
    sendFeedbackResultMessage(event.content, event.result, event.reply, event.endDate)
  }
}