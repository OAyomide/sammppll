var coreFict = require('../models/corefunct');
exports.tweetStatus = function tweetStatus(recipientId) {
    var responseArray = [
        'Not so good.. really not so good😑',
        'Fair',
        'Looking good. . .Tweet more!',
        'There was a lot of criticism 😮',
        'People loved it!',
        'Tons of retweets!🎉 People loved it',
        'You should try better next time 😰',
        'Uh-oh! 😰 Bad tweet. . .Watch it next time',
        'Spot on! 😎 You have more followers 🚄 because of your tweet'
    ];

    var response = Math.floor(Math.random()* (responseArray.length));
   coreFict.sendText(recipientId, responseArray[response]);
}

exports.jokeReply = (recipientId) => {
    var responseArray = [
        'I know right!',
        'I find it funny too!',
        'I know it is funny!'
    ];
    var response = Math.floor(Math.random() * (responseArray.length));
    coreFict.sendText(recipientId, responseArray[response]);
};

exports.N30Billion = (recipientId) => {
    var responseArray = [
        'Oh really??',
        'You a baller 😎! Niggas be hating right?😜😜 😜',
        'Why not buy something? Send /buy to buy something like a big ass house 🏠'
    ];
    var response = Math.floor(Math.random()* (responseArray.length));
    coreFict.sendText(recipientId, responseArray[response]);
};

exports.N30BillionTweetReply = (recipientId) => {
    var responseArray = [
        'Funny! Your tweet is trending 🚅! Send "#30BInAcct" or something similar to see trending replies',
        'Woah 😮! Its on! People love it! and it is trending! send "#30InAcct" or similar to see trending memes and funny\
        replies.',
        'Hahahahaha 😁😁!! Please type #30BInAcct to see awesome replies!'
    ]
var response = Math.floor(Math.random() * (responseArray.length));
coreFict.sendText(recipientId, responseArray[response]);
}
