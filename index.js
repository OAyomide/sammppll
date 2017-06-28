var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var schedule = require('node-schedule');
var app = express();
var schedule = require('node-schedule');
var port = process.env.PORT || 9000;
var verify_token = "sample_verify";
var feedRead = require('feed-read');
var request = require('request');
var fb_page_token = process.env.FB_ACCESS_TOKEN;
var link = 'http://feeds.feedburner.com/TechCrunch/'
//read up on node's set timeout and setInterval function

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
// function scheduleJob(event){
//   var senderID = event.sen
// var job = schedule.scheduleJob('30 * * * * *', function(){
//   sendAudioMessage(senderID);
// });
// }

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

// var job = schedule.scheduleJob('30 * * * * *', function(){
//             getArticle(function(err, res){
//             sendArticle(senderID, res);
//           });
// });

if (messageText){
  switch (messageText) {
    case 'menu':
    quickButtons(senderID);
      break;
    case 'celebs':
      init(senderID);
      break;
    case 'sermon':
      sendTextMessage(senderID,"Here is a sermon for you")
      sendAudioMessage(senderID);
      break;
    case 'banner':
      sendChurch(senderID);
      break;
    case 'video':
        sendVideoMessage(senderID);
        break;
    case 'New sermon':
        sendAudioMessage(senderID);
        break;
    case '😀':
        sendTextMessage(senderID,'I like to smile too');
        break;
    case 'download':
        download(senderID);
        break;
        case 'article':
          getArticle(function(err, res){
            sendArticle(senderID, res);
          });
          break;
    default:
      sendTextMessage(senderID, "I don't seem to understand yet");
  }
}
  else if (messageAttachments) {
    sendTextMessage(senderID, 'I cannot understand images and multimedia yet.')
  }
}




function  sendChurch(recipientId){
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
    };
    callSendAPI(messageData);
}

//we want to init our first selection from our user
function init (recipientId){
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


//to show user selects davido

function davidoSelect (recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: "http://i.imgur.com/s9bPVaK.gif"
                }
            }
        }
    }
  callSendAPI(messageData);
}

function firstSend(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        }, message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "You have N30,000,000,000 in your account. What will you buy?",
                    buttons: [
                        {
                            type: "postback",
                            title: "Buy jewelry",
                            payload: "buy_jewelry"
                        }, {
                            type: "postback",
                            title: "Buy Car",
                            payload: "buy_car"
                        }
                    ]
                }
            }
        }
    };
    callSendAPI(messageData);
};


function secondSend(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        }, message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "A fine chick wants to hang out with you!",
                    buttons: [
                        {
                            type: "postback",
                            title: "Hang out & party hard",
                            payload: "party_hard"
                        }, {
                            type: "postback",
                            title: "Turn down",
                            payload: "reject_party"
                        }
                    ]
                }
            }
        }
    };
    callSendAPI(messageData);
};

function thirdSend(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        }, message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "Looks like you've got a 'BabyMama' scandal. How would you react?",
                    buttons: [
                        {
                            type: "postback",
                            title: "Deny it",
                            payload: "deny_scandal"
                        }, {
                            type: "postback",
                            title: "Confirm it",
                            payload: "confirm_scandal"
                        },{
                            type: "postback",
                            title: "Do nothing",
                            payload: "scandal_do_nothing"
                        }
                    ]
                }
            }
        }
    };
    callSendAPI(messageData);
};





function carBought(recipientId){
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

function party(recipientId){
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








function getArticle(callback) {
    feedRead(link, function(err, articles){
        if (err){
            callback(err);
        }
        else{
               callback(null, articles)
               console.log("The shit works: ")
        }
    });

}



getArticle(function(err, res){
  if(err) console.log("We have a problem");
  console.log("Here is the stuffs: ", res[1].content)
  var sly = res[1].content.slice(212, 112);
  console.log('Sliced: ', sly);
});

function sendArticle(recipientId, articles){
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
                        image_url:"http://www.lifefellowship.org/Service-Times-POST.jpg",
                        title: articles[0].title,
                        subtitle: articles[0].published.toString().substring(0, 21),
                        item_url: articles[0].link,
                        buttons:[{
                          type:"element_share"
                        }
                        ]
                      },{
                         image_url: "http://www.lifefellowship.org/Service-Times-POST.jpg",
                        title: articles[1].title,
                        subtitle: articles[1].author,
                        item_url: articles[1].link,
                        buttons:[{
                          type:"element_share"
                        }
                        ]
                      },{
                         image_url: "http://www.lifefellowship.org/Service-Times-POST.jpg",
                        title: articles[2].title,
                        subtitle: articles[2].published.toString().substring(0, 21),
                        item_url: articles[2].link,
                        buttons:[{
                          type:"element_share"
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


function sendAudioMessage(recipientId, messageText){
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment:{
                type:"audio",
                payload: {
                    url: "https://davidabioye.files.wordpress.com/2017/05/14-bishop-david-o-abioye-understanding-the-unlimited-power-of-faith-pt-3a-280517.mp3"
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
                    url: "https://davidabioye.files.wordpress.com/2017/05/14-bishop-david-o-abioye-understanding-the-unlimited-power-of-faith-pt-3a-280517.mp3"
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

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  var payload = event.postback.payload;
  switch (payload){
  case "intro":
  {
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
        greeting = "Hey" + name + "! ";
      }
      var message = greeting + "I am ZangaBot. I am here to see how you will live like a celeb.";
      sendTextMessage(senderID, message);
      //quickButtons(senderID);
      init(senderID);
    });  
}
  break;
case "sermon":
  {
  sendTextMessage(senderID,"Here is the latest audio sermon");
  sendAudioMessage(senderID);
}
break;

case "menu":{
  sendChurch(senderID);
}
break;
case "contact":
   setTimeout(init(senderID), 2000);
  sendTextMessage(recipientId, "Baddest! So let us see if you can live like Davido");
  break;
case "help":
  quickButtons(senderID);
  break;
case 'davido_select':
  davidoSelect(senderID);
  setTimeout(firstSend(senderID), 2000);
  break;
case 'buy_car':
{
  carBought(senderID);
}{
  sendTextMessage(senderID, 'Nice ride dude!!');
}
  secondSend(senderID)
  break;
  case 'party_hard':
    setTimeout(party(senderID), 5000)
    sendTextMessage(senderID, 'LETS PAAAARRRRTTTTTYYYYY!!!');
    break;
}

  console.log("Received postback for user %d and page %d with payload '%s' " + 
    "at %d", senderID, recipientID, payload, timeOfPostback);
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

function download(recipientId){
  var messageData = {
    recipient: {
      id: recipientId
    }, message:{
      attachment:{
        type: "template",
        payload:{
          template_type: "button",
          text: "Sermon download",
           buttons:[{
      type: "web_url",
      url: "https://davidabioye.files.wordpress.com/2017/05/14-bishop-david-o-abioye-understanding-the-unlimited-power-of-faith-pt-3a-280517.mp3",
      title: "Download the sermon",
      webview_height_ratio: "full"
    }]
        }
      }
    }
  }
  callSendAPI(messageData);
}

function quickButtons(recipientId){
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

function contact(recipientId){
  var messageData = {
    recipient: {
      id: recipientId
    },
message:{
    attachment:{
      type:"template",
         payload:{
            template_type:"list",
            elements:[
              {
                title: "You can contact anybody below for whatever you need",
                subtitle:"Available contacts",
                image_url: "http://bloximages.chicago2.vip.townnews.com/tucson.com/content/tncms/assets/v3/editorial/5/ba/5ba33114-c437-50ae-8da2-a5dba111d89f/589e8794f0838.image.jpg",
              }, {
                title: "Brother Bayo",
                subtitle:"Admin. Department",
                image_url: "https://demovinhasa.files.wordpress.com/2012/06/btrix3.png",
                buttons:[{
                  type:"phone_number",
                  title:"Dial",
                  payload:"+12345678901"
                }]
              },{
                title:"Pastor Dave",
                image_url: "https://demovinhasa.files.wordpress.com/2012/06/btrix3.png",
                subtitle: "Finance department",
                buttons:[{
                  type:"phone_number",
                  title:"Report",
                  payload:"+12345678901"
                }]
              },{
                title:"Apostle Emma",
                image_url: "https://demovinhasa.files.wordpress.com/2012/06/btrix3.png",
                subtitle: "Ushering dept.",
                buttons:[{
                  type:"phone_number",
                  title:"Dial",
                  payload:"+12345678901"
              }]},
            ]
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

//we want to subscribe the user to receive the notification. For user ids that exist in the db, send them subscriptions
//read request npm

app.listen(port, function(req, res){
  console.log('Bot app up and running on port: ', port);
});
