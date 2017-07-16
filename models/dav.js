var request = require('request');
var fb_page_token = process.env.FB_ACCESS_TOKEN;
var URL = process.env.SERVER_URL;
var core_2 = require('./corefunct');
 exports.buyStuff = function buyStuffs(recipientId){
   core_2.sendText(recipientId,"Buy yourself any of the below to celebrate your recent success");
  var messageData ={
    recipient:{
      id:recipientId
    },message:{
        attachment:{
            type: "template",
            payload:{
                template_type:"generic",
                elements:[
                    {
                        image_url:URL + '/images/mustang.jpg',
                        title: "Buy yourself a Mustang",
                        subtitle: "Ford GT 2018",
                        buttons:[{
                          type: "postback",
                          payload: "buy_car",
                          title: "Buy car"
                        }
                        ]
                      },{
                         image_url:URL+"/images/mansion.jpg",
                        title: "Lekki Mansion",
                        subtitle: "Buy a Mansion at Lekki",
                        buttons:[{
                          type:"postback",
                          payload: "buy_house",
                          title: "Buy Mansion"
                        }
                        ]
                      },{
                         image_url: URL+"/images/jesuspieces.jpg",
                        title: "A Jesus piece encrusted with Diamonds",
                        subtitle: "Customized 18 karat Jesus pieces",
                        buttons:[{
                          type:"postback",
                          payload: "buy_chain",
                          title: "Buy chain"
                        }
                        ]
                      }, {
                         image_url: URL+"/images/sneakers.jpg",
                        title: "Gold lined OVO sneaker",
                        subtitle: "Customized 18 karat Jesus pieces",
                        buttons:[{
                          type:"postback",
                          payload: "buy_sneaker",
                          title: "Buy Sneaker"
                        }
                        ]
                      }, {
                         image_url: URL+"/images/batmobile.jpg",
                        title: "A supercharged batmobile",
                        subtitle: "specially customized for you.",
                        buttons:[{
                          type:"postback",
                          payload: "buy_mobile",
                          title: "Buy Batmobile"
                        }
                        ]
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