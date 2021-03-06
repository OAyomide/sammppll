var fb_page_token = process.env.FB_ACCESS_TOKEN;
var URL = process.env.SERVER_URL;
var conrefunctions = require('./corefunct')
var request = require('request');
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
                        }
                    ]
                }
            }
        }
    };
   callSendAPI(messageData);
}


exports.firstSend = function firstSend(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        }, message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "Lets get you started with some gears. What will you buy?",
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

exports.secondSend = function secondSend(recipientId) {
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

exports.partyRejected = function partyRejected(recipientId) {
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


exports.thirdSend = function thirdSend(recipientId) {
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


exports.fourthSend = function fourthSend(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        }, message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "You were approcahed for a collaboration by an upcoming artiste's manager.",
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


exports.scandalReSurfaced = function scandalRe(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        }, message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "The scandal you denied is back! People are talking. What decision are you going to take?",
                    buttons: [
                        {
                            type: "postback",
                            title: "Continue denying",
                            payload: "scandal_resurface_denial"
                        }, {
                            type: "postback",
                            title: "Finally confirm",
                            payload: "scandal_resurface_confirm"
                        }
                    ]
                }
            }
        }
    };
    callSendAPI(messageData);
};


exports.fifthSend = function fifthSend(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        }, message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "You lost the grace of your record label after your scandal denial.\
                    Your contract has been terminated.",
                    buttons: [
                        {
                            type: "postback",
                            title: "Leave label",
                            payload: "leave_label"
                        }
                    ]
                }
            }
        }
    };
    callSendAPI(messageData);
};




exports.continueSend = function continueSend(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        }, message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "Click below to continue",
                    buttons: [
                        {
                            type: "postback",
                            title: "Continue",
                            payload: "game_continue"
                        }
                    ]
                }
            }
        }
    };
    callSendAPI(messageData);
};


exports.continueGame = function continueGame(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        }, message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "Click below to continue",
                    buttons: [
                        {
                            type: "postback",
                            title: "Continue",
                            payload: "continue"
                        }
                    ]
                }
            }
        }
    };
    callSendAPI(messageData);
};

exports.funcReply = (recipientId) => {
    var responseArray = [
        'I am here to emulate how you would live as a celebrity via role playing',
        'Play a role playing game with you, where you are the celebrity!'
    ];
    var response = Math.floor(Math.random() * responseArray.length);
    corefunctions.sendText(recipientId, responseArray[response]);
};




exports.sixthSend = function sixthSend(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        }, message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "There is a deal opening at another label, Old Savage Records. Are you going to take the deal?",
                    buttons: [
                        {
                            type: "postback",
                            title: "Accept",
                            payload: "accept_label_deal"
                        },{
                            type: "postback",
                            title: "Reject",
                            payload: "accept_label_deal"
                        }
                    ]
                }
            }
        }
    };
    callSendAPI(messageData);
};






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