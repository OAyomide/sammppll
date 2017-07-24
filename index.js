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
var randomFuncts = require('./models/funcs')
var coreFunct = require('./models/corefunct');
var stuff = require('./models/stuffs');
var davidoStuffs = require('./models/dav');
var prompts = require('./models/prompts');
var gifs = require('./models/gifs');
var recastai = require('recastai');
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

function title (event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id
    var timeOfMessage = event.timestamp;
    var message = event.message

    var messageText = message.text
    
}

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
 if (messageText.startsWith('@')){
      coreFunct.sendText(senderID, `Your tweet, ${messageText} has been posted. Send /tweet-status to see reactions`)
}

var request = new recastai.request('2408846236d39b61b4a566dd93f61bd0');

request.analyseText(messageText).then(function(res){
    var intent = res.intent();

    //we want to handle the logic of our text to see the intent and act
    if (intent.slug === 'greetings') {
        coreFunct.sendText(senderID, 'Hi to you.')
    } else if (intent.slug === 'laught') {
        randomFuncts.jokeReply(senderID)
    } else if (intent.slug === 'davido30billion') {
        randomFuncts.N30BillionTweetReply(senderID);
    } else if (intent.slug === '30billiontweetreply') {
        gifs.N30Btweetmeme(senderID);
        gifs.N30Btweetmeme2(senderID);
    }
})

if (messageText){
  switch (messageText) {
    case 'menu':
    stuff.quickButtons(senderID);
      break;
    case 'celebs':
      init(senderID);
      break;
    case '/buy':
        davidoStuffs.buyStuff(senderID);
        break;
    case '😀':
        coreFunct.sendText(senderID,'Awesome. You have a denied scandal!');
        break;
    case '/tweet-status':
        randomFuncts.tweetStatus(senderID);
        coreFunct.sendText(senderID, 'Right. Lets move on')
        prompts.fifthSend(senderID);
        break;

    case 'cont':
        coreFunct.sendText(senderID,'You have to drop a track so they\'all can you know you\'re very much still in the game! Select a type of Hip-Hop you\'ll release');
        setTimeout((err, res) => {
            if (!err) {
                trackRelease(senderID)
            }
        }, 2000);
        break;

    case 'Trap':
        coreFunct.sendText(senderID, "Awesome! The track was a success!");
        setTimeout((err, res) => {
            if (!err) {
                prompts.secondSend(senderID);
            }
        }, 2000);
        break;
  }
}
   else if (!messageAttachments === '😀') {
      coreFunct.sendText(senderID, 'That seems incorrect')
  }
  
}

function trackRelease(recipientId) {
    var messageData = {
        recipient:{
            id: recipientId
        }, message: {
            text: "Quick Menu",
            quick_replies: [
                {
                    content_type: "text",
                    title: "Trap",
                    payload: "trap"
                }, {
                    content_type: "text",
                    title: "Rap",
                    payload: "rap"
                }, {
                    content_type: "text",
                    title: "Afro-pop",
                    payload: "afro_pop"
                }
            ]
        }
    }
    callSendAPI(messageData)
}

function getUserDp (event) {
    var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;
  
  var getStuf = request({
      url: "https://graph.facebook.com/v2.6/" + senderID,
      qs: {
          access_token: fb_page_token,
          fields: "cover"
      }
  })
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
      coreFunct.sendText(senderID, message);
      //quickButtons(senderID);
     prompts.init(senderID);
    });  
}
  break;
case "contact":
    setTimeout(function(err, res) {
        if(!res) {
             prompts.init(senderID);
        }
    }, 2000) 
  coreFunct.sendText(recipientId, "Baddest! So let us see if you can live like Davido");
  break;
case "help":
  quickButtons(senderID);
  break;
case 'davido_select':

    gifs.davidoSelectedGif(senderID);
    setTimeout(function(err, res) {
        if (!err) {
            prompts.firstSend(senderID);
        }
    }, 6000)
  break;
case 'buy_car':
new Promise(function(resolve, reject) {
    gifs.carBought(senderID);
}).then(setTimeout(function(err, res){
    if (!err) {
        coreFunct.sendText(senderID, "Niiccee");
        prompts.secondSend(senderID);
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
         coreFunct.sendText(senderID, "Okey Dokey! Seems you have a taste for exquisite rides. A car 🚗 has been added to your \
        garage");
        var newGarage = cars.length + 1;
        cars.push(newGarage);
        var tots = cars.length
        console.log(`HE NOW HAS ${tots} car(s)`);
        
            if (tots === 1){
                coreFunct.sendText(senderID,`You have one new car!`)
            }

            //when the tots is more than one
            else if (tots === 5) {
                 coreFunct.sendText(senderID, `Cool!! People be thinkin' you chillin' \
                 at the office park with more than ${tots} cars!`);
            }    
        
    }
}, 6000)
});
break;

case 'buy_jewelry':
    setTimeout((err, res) => {
        if(err) {
            coreFunct.sendText(senderID, 'Oops! Try buying again!')
        }
        else if (!err) {
            gifs.jewelryBought(senderID)
        }
    }, 6000);
    coreFunct.sendText(senderID, 'How is your new chain? please send \'cont\' continue the game');
    break;
  case 'party_hard':
  coreFunct.sendText(senderID, 'LETS PAAAARRRRTTTTTYYYYY!!!');
    setTimeout(function(err, res) {
        if (!err) {
            gifs.partyGif(senderID);
        }
    }, 3000);

    setTimeout(function(err, res) {
        if(!err) {
            
        }
        prompts.thirdSend(senderID);
    }, 5000)
    break;

    case 'reject_party':
        prompts.partyRejected(senderID);
        break;

    case 'meet_meek' :
    setTimeout((err, res) => {
        if (err) {
            coreFunct.sendText(senderID, "Sorry, please try again.")
        } else if (!err) {
             gifs.davidoHangoutWithMeekMill(senderID)
        }
    }, 6000);
    coreFunct.sendText(senderID, 'This was from your music video!');
    setTimeout((err, res) => {
        if (err) {
            coreFunct.sendText(senderID, "Oh No!! Try again!");

        }
        else if (!err) {
             coreFunct.sendText(senderID, 'At this juncture, you have to tweet this! Because it is awesome!');
        }
    }, 7000);
        break;
       
    case 'deny_scandal':
        coreFunct.sendText(senderID, 'Congrats on your first scandal denial \
        Send 😀 to claim your achievement 🏆. If you send the wrong one or don\'t send any, you are going lose the trophy but not the \
        scandal (of course!)');
        break;

    case 'confirm_scandal':
        setTimeout((err, res) => {
            if (err) {
                console.log('Eroor');
                coreFunct.sendText(senderID, 'Please try again!')
            }
            else if (!err) {
                gifs.confirmScandalGif(senderID);
            }
        }, 8000);
        setTimeout((err, res) => {
            if(err) {
                coreFunct.sendText(senderID, 'Please try again');
            } else if(!err) {
                coreFunct.sendText(senderID, 'Okay! Lets move on!');
                 prompts.fourthSend(senderID);
            }
        }, 10000)
       
        break;

    case 'emergency':
        coreFunct.sendText(senderID, 'Quick reply callback payload')
        break;


    case 'scandal_do_nothing':
        prompts.fourthSend(senderID);
        break;


    case 'collabo_initial_accept':
        coreFunct.sendText(senderID,'That didn\'t turn out well! But you have another artiste owe you!');
        coreFunct.sendText(senderID, 'Send 😎😎😎 to continue');
        break;
    
    case 'collabo_initial_reject':
        coreFunct.sendText(senderID, 'If you heard that your album was burnt due to low quality, what are you going to tweet');
        coreFunct.sendText(senderID, 'type: @tweet- befor you type your tweet so I can understand you are tweeting');
        break;
}

  console.log("Received postback for user %d and page %d with payload '%s' " + 
    "at %d", senderID, recipientID, payload, timeOfPostback);
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





app.listen(port, function(req, res){
  console.log('Bot app up and running on port: ', port);
});
