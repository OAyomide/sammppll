var coreFict = require('../models/corefunct');
exports.tweetStatus = function tweetStatus(recipientId) {
    var responseArray = [
        'Not so good',
        'Fair',
        'Looking good',
        'Thee were a lot of criticism',
        'People loved it!',
        'Tons of retweets',
        'You should try better next time',
        'Uh-oh! Bad tweet. . . ',
        'Spot on! You have more followers because of your tweet'
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
}
