var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  pledge: {
    type: String,
    required: true
  },
  ignore: {
    type: String,
    required: true,
    default: false
  },
  days: [type: Number]
})


module.exports = mongoose.model("User", userSchema);
