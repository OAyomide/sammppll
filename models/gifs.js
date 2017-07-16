var fb_page_token = process.env.FB_ACCESS_TOKEN;
var URL = process.env.SERVER_URL;
var request = require('request');
exports.carBought = function carBought(recipientId){
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment:{
                type:"image",
                payload: {
                    url: "https://media.giphy.com/media/10l91Jwn7ahKGA/giphy.gif"
                }
            }
        }
    }
    callSendAPI(messageData);
}


exports.confirmScandalGif = function confirmScandalGif(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: URL+"/images/surprise.gif"
                }
            }
        }
    }
  callSendAPI(messageData);
}

exports.partyGif = function party(recipientId){
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment:{
                type:"image",
                payload: {
                    url: "http://quotesblog.net/wp-content/uploads/2015/05/party-gifs-hell-yeah.gif"
                }
            }
        }
    }
    callSendAPI(messageData);
}


exports.davidoSelectedGif = function davidoSelect (recipientId) {
    
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: URL+"/images/congrats.gif"
                }
            }
        }
    } 
  callSendAPI(messageData);
}

exports.davidoHangoutWithMeekMill = function davidoHangoutWithMeek(recipientId) {
    
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: "https://www.google.com.ng/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwj3tsy2747VAhWLblAKHWDnCe4QjRwIBw&url=http%3A%2F%2Ftooxclusive.com%2Fdownload-mp3%2Fvideo-davido-fans-mi-ft-meek-mill-b-t-s-photos%2F&psig=AFQjCNGU6lKSWE3KaRpTKVeFxFYKYUKBng&ust=1500331176765258"
                }
            }
        }
    } 
  callSendAPI(messageData);
}


exports.jewelryBought = function jewelryBought(recipientId) {
        var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: "https://media.giphy.com/media/e6bq6Xih5SzZK/giphy.gif"
                }
            }
        }
    } 
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