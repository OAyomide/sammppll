var fb_page_token = process.env.FB_ACCESS_TOKEN;
var URL = process.env.SERVER_URL
exports.init = function init (recipientId){
    var messageData = {
        recipient: {
            id: recipientId
        }, message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "list",
                    elements: [
                        {
                            title: "Select a celebrity you want",
                            subtitle: "Available celebrities",
                            image_url: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Gentleman-Video-Shoot-January-2014-BellaNaija-027-402x600.jpg"
                        }, {
                            title: "Davido",
                            subtitle: "Artiste",
                            image_url: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Gentleman-Video-Shoot-January-2014-BellaNaija-027-402x600.jpg",
                            buttons: [{
                                type: "postback",
                                title: "Select",
                                payload: "davido_select"
                            }]
                        }, {
                            title: "Wizkid",
                            subtitle: "Artiste",
                            image_url: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Gentleman-Video-Shoot-January-2014-BellaNaija-027-402x600.jpg",
                            buttons: [{
                                type: "postback",
                                title: "Select",
                                payload: "wizkid_select"
                            }]
                        }, {
                            title: "Tiwa Savage",
                            image_url: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Gentleman-Video-Shoot-January-2014-BellaNaija-027-402x600.jpg",
                            subtitle: "Artiste",
                            buttons: [{
                                type: "postback",
                                title: "Select",
                                payload: "tiwa_select"
                            }]
                        }
                    ]
                }
            }
        }
    };
   callSendAPI(messageData);
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