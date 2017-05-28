var schedule = require('node-schedule');
var job = schedule.scheduleJob('30 * * * * *', function(){
    error();
});

function error(){
    console.error('This is a cron job function')
    var date = new Date().getDate(); 
    console.log('The date is: ', date)
}
    