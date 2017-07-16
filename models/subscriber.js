var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    username: {
        type: int, required: true, unique
    },
    cars: {
        type: int
    },
    cash: {
        type: int,
    },
    scandals: {
        type: String
    },
    scandalsNumber: {
        type: int
    },
})

