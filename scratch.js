//we create the js variable to create the instance of the 
// var Clarifai = require('clarifai');

  
//   // initialize with your clientId and clientSecret
  
//   var app = new Clarifai.App(
//     'T3pAJD5fVzpqX2GZf6rNjvt9xPmI3KETZPJyZfMr',
//     'hPlyg9-k2GUSEwA8UU9cfhNIpDdLRDAbWa21M0tj'
//   );

//   app.getToken();

//   app.models.predict(Clarifai.GENERAL_MODEL, "https://samples.clarifai.com/metro-north.jpg").then(
//     function(response) {
//         console.log(response);
//       // do something with response
//     },
//     function(err) {
//         throw err;
//       console.log('There is an error training the dataset');
//     }
//   );var request = new recastai.request('YOUR_TOKEN')
var recastai = require('recastai');

var request = new recastai.request('2408846236d39b61b4a566dd93f61bd0')

request.analyseText('hi')
  .then(function(res) {
    var intent = res.intent()

    if (intent.slug === 'greetings') {
      console.log('Hi to you toos')
    }
    console.log(intent)
  })

