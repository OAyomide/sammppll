var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var schedule = require('node-schedule');
var port = process.env.PORT || 9000;

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.get('/', function(req, res){
  res.send('This is a node web app');
})

app.get('/webhook/', function(req, res){
  if (req.query['hub.verify_token']==="sample_verify") {
    res.send(req.query['hub.challenge'])
  }
  res.send('No access')
});

app.post('/webhook', function(req, res){
  var data = req.body;
  if (data.object === 'page') {
    data.entry.forEach(function(entry){
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      entry.messaging.forEach(function(event){
        if (event.message) {
          receivedMessage(event);
        }
        else if (event.postback) {
          console.log('Webhook received unknown event: ', event);
          receivedPostback(event);
        }
      });
    });
    res.sendStatus(200);
  };
});

function receivedMessage(event){
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log('Received message for user %d and page %d with message: ',
        senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;
  var messsageText = message.text;
  var messageAttachments = message.attachments;


if (messsageText){
  switch (messageText) {
    case 'Buttons':
    quickButtons(senderID);
      break;
    case 'sermon':
      sendAudioMessage(senderID);
      break;
    case 'generic':
      sendGenericMessage(senderID);
      break;
    default:
      sendTextMessage(senderID);
  }
}
  else if (messageAttachments) {
    sendTextMessage(senderID, 'I cannot understand images and multimedia yet.')
  }
}


function sendChurch(recipientId){
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
                        image_url: "http://bloximages.chicago2.vip.townnews.com/tucson.com/content/tncms/assets/v3/editorial/5/ba/5ba33114-c437-50ae-8da2-a5dba111d89f/589e8794f0838.image.jpg?resize=1200%2C846",
                        title: "New sermon of the week",
                        subtitle: "Sunday 14 March 2017",
                        buttons:[{
                          type:"element_share"
                        }
                        ]
                    },{
                      image_url: "http://www.lifefellowship.org/Service-Times-POST.jpg",
                        title: "Announcement",
                        subtitle: "Sunday 14 March 2017",
                        buttons:[{
                          type:"element_share"
                        }
                        ]
                    }
                ]
            }
        }
    }
    }
    callSendAPI(messageData);
}

function sendTextMessage (recipientId, messageText){
  var messageData = {
    recipient : {
      id: recipientId
    },
    message:{
      text: messsageText
    }
  };
  callSendAPI(messageData);
}

function quickButtons(recipientId){
  var messageData = {
    recipient: {
      id: recipientId
    },
    message:{
    text:"Quick Action",
    quick_replies:[
      {
        content_type:"text",
        title:"Announcement",
        payload:"emergency"
      },
      {
        content_type:"text",
        title:"New sermon",
        payload:"provide_support"
      }
    ]
  }
}
callSendAPI(messageData);
}


function callSendAPI (messageData){
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: 'access_token_goes here'
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

//read request npm






app.listen(port, function(req, res){
  console.log('Bot app up and running on port: ', port);
});
