var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var schedule = require('node-schedule');
var path = require('path');
var app = express();
var schedule = require('node-schedule');
var port = process.env.PORT || 9000;
var verify_token = "sample_verify";
var feedRead = require('feed-read');
var request = require('request');
var promiseDelay = require('promise-delay');
var cars = [];

var URL = process.env.SERVER_URL;
var fb_page_token = process.env.FB_ACCESS_TOKEN;


app.use(express.static('public'));
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
    case '/buy':
        buyStuffs(senderID);
        break;
    case '😀':
        sendTextMessage(senderID,'Awesome. You have a denied scandal!');
        break;
    default:
      sendTextMessage(senderID, "I don't seem to understand yet");
  }
}
   else if (!messageAttachments === '😀') {
      sendTextMessage(senderID, 'That seems incorrect')
  }
}


function buyStuffs(recipientId){
   sendTextMessage(recipientId,"Buy yourself any of the below to celebrate your recent success");
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
                    url: URL+"/images/congrats.gif"
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
}



function partyRejected(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        }, message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "Unfortunately, Meek mill was at the party. You missed a chance to talk to him. Your manager set up another meeting on your behalf.",
                    buttons: [
                        {
                            type: "postback",
                            title: "Meet Up",
                            payload: "meet_meek"
                        }
                    ]
                }
            }
        }
    };
    callSendAPI(messageData);
};

//an attachment showing a recording session/ or hanging out pics of Davido and Meek Mill goes here.
function davidoHangoutWithMeek(recipientId) {
    
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "image",
                payload: {
                    url: URL+"/images/meekhangout.gif"
                }
            }
        }
    } 
  callSendAPI(messageData);
}



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

//we go back to the outcome of the hangout with meek mill. As expected, it means that
//a track is gon drop
function sixthSend(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        }, message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "Finally!! Your collabo with Meek mill was a hit and it won an award.*award emoji goes here* Keep it safe. You will need it",
                    buttons: [
                        {
                            type: "postback",
                            title: "Accept award",
                            payload: "award_accept"
                        }
                    ]
                }
            }
        }
    };
    callSendAPI(messageData);
};

function fourthSend(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        }, message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "You were approcahed for a manager.",
                    buttons: [
                        {
                            type: "postback",
                            title: "Go for it",
                            payload: "collabo_initial_accept"
                        }, {
                            type: "postback",
                            title: "Turn down",
                            payload: "collabo_initial_reject"
                        }
                    ]
                }
            }
        }
    };
    callSendAPI(messageData);
};

//here we want the user to buy something for him or herself so we present him or her with an array of stuffs to buy
function buyStuffs(recipientId, articles){
    sendTextMessage(recipientId,"Buy yourself any of the below to celebrate your recent success");
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
                          payload: "buy_car_extra",
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
        greeting = "Hey " + name + "! ";
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
    setTimeout(function(err, res) {
        if(!res) {
             init(senderID);
        }
    }, 2000)
  
  sendTextMessage(recipientId, "Baddest! So let us see if you can live like Davido");
  break;
case "help":
  quickButtons(senderID);
  break;
case 'davido_select':

    davidoSelect(senderID);
    setTimeout(function(err, res) {
        if (!err) {
            firstSend(senderID)
        }
    }, 6000)
  break;
case 'buy_car':
new Promise(function(resolve, reject) {
    carBought(senderID)
}).then(setTimeout(function(err, res){
    if (!err) {
        sendTextMessage(senderID, "Niiccee");
        secondSend(senderID);
    }
}, 6000))

  break;
  case 'buy_car_extra':
new Promise((resolve, reject)=> {

setTimeout((err, res) => {
    if(err) {
        console.log('Timeout setting error');
    }
    else if (!err) {
         sendTextMessage(senderID, "Okey Dokey! Seems you have a taste for exquisite rides. A car 🚗 added to your \
        garage");
        var newGarage = cars.length + 1;
        cars.push(newGarage);
        var tots = cars.length
        console.log(`HE NOW HAS ${tots} car(s)`);
        
            if (tots === 1){
                sendTextMessage(senderID,`You have one new car!`)
            }

            //when the tots is more than one
            else if (tots > 1) {
                 sendTextMessage(senderID, `You now have ${tots} new cars \
            added to your garage`)
            }
            //when our celeb has more than Five cars, we want to greet him
            else if (tots >=5 )
            sendTextMessage(senderID, `Cool!! People be thinkin' you chillin' \
            at the office park with more than ${tots} cars!`);
            break;
        
    }
}, 6000)
});
break;
  case 'party_hard':
  sendTextMessage(senderID, 'LETS PAAAARRRRTTTTTYYYYY!!!');
    setTimeout(function(err, res) {
        if (!err) {
            party(senderID);
        }
    }, 3000);

    setTimeout(function(err, res) {
        if(!err) {
            
        }
        thirdSend(senderID);
    }, 5000)
    break;

    case 'deny_scandal':
        sendTextMessage(senderID, 'Congrats on your first scandal denial \
        Send 😀 to claim your achievement 🏆. If you send the wrong one or don\'t, you would lose the trophy but not the \
        scandal (of course!)');
        break;

    case 'emergency':
        sendTextMessage(senderID, 'Quick reply callback payload')
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
