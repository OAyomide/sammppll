var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var schedule = require('node-schedule');
var port = process.env.PORT || 9000;
var verify_token = "sample_verify"
var fb_page_token = process.env.FB_ACCESS_TOKEN;

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.get('/', function(req, res){
  res.send('This is a node web app');
})

//we are simply setting the URL to the webhook in the route to our node/express app

app.get('/webhook/', function(req, res){
  if (req.query['hub.verify_token']===verify_token) {
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
  var messageText = message.text;
  var messageAttachments = message.attachments;


if (messageText){
  switch (messageText) {
    case 'Buttons':
    quickButtons(senderID);
      break;
    case 'sermon':
      sendAudioMessage(senderID);
      break;
    case 'generic':
      sendChurch(senderID);
      break;
    case 'video':
        sendVideoMessage(senderID);
    default:
      sendTextMessage(senderID, messageText);
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

function sendAudioMessage(recipientId, messageText){
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment:{
                type:"audio",
                payload: {
                    url: "https://allhealthtips.000webhostapp.com/wp-content/uploads/2017/05/YOUNG-MA-OOOUUU.mp3"
                }
            }
        }
    }
    callSendAPI(messageData);
}

function sendVideoMessage(recipientId, messageText){
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment:{
                type:"audio",
                payload: {
                    url: "https://allhealthtips.000webhostapp.com/wp-content/uploads/2017/05/YOUNG-MA-OOOUUU.mp3"
                }
            }
        }
    }
    callSendAPI(messageData);
}



function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a field we put to trigger an action
  var payload = event.postback.payload;
  if(payload === "intro"){
       request({
      url: "https://graph.facebook.com/v2.6/" + senderID,
      qs: {
        access_token: fb_page_token,
        fields: "first_name"
      },
      method: "GET"
    }, function(error, response, body) {
      var greeting = "";
      if (error) {
        console.log("Error getting user's name: " +  error);
      } else {
        var bodyObj = JSON.parse(body);
        name = bodyObj.first_name;
        greeting = "Greetings " + name + ". ";
      }
      var message = greeting + "I am the sanctuary bot demo. I will automatically get you church sermons everu sunday, and send you announcements";
      sendTextMessage(senderID, message);
     // questionButtons(senderID);
     quickButtons(senderID);

    });

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to
  // let them know it was successful
  //quickButtons(senderID);
}
callSendAPI(messageData);
}
































function sendTextMessage (recipientId, messageText){
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

//read request npm






app.listen(port, function(req, res){
  console.log('Bot app up and running on port: ', port);
});
