exports.sendText = function sendTextMessage (recipientId, messageText){
  var messageData = {
    recipient : {
      id: recipientId
    },
    message:{
      text: messageText
    }
  };
  callSendAPI(messageData);
}