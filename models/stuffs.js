var request = require('request');
var fb_page_token = process.env.FB_ACCESS_TOKEN;
exports.quickButtons = function quickButtons(recipientId){
  var messageData = {
    recipient: {
      id: recipientId
    },
    message:{
    text:"Quick action",
    quick_replies:[
      {
        content_type:"text",
        title:"Announcement",
        payload:"emergency"
      },
      {
        content_type:"text",
        title:"Download latest sermon",
        payload:"download"
      },
      {
        content_type:"text",
        title:"New sermon",
        payload:"sermon"
      }
    ]
  }
}
callSendAPI(messageData);
}


exports.morningGreetings = function morningGreeting(recipient) {
    var responseArray = [
        'Hey there!'
    ]
}


function callSendAPI (messageData){
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: fb_page_token
    },
    method: 'POST',
    json: messageData
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;
      console.log('Successfully sent generic message with id %s to recipient %s', messageId, recipientId);
    }
    else {
      console.error('Unable to send message.');
      console.error(response);
      console.error(error);
    }
  });
}