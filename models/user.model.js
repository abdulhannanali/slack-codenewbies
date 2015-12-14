var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  pledge: {
    type: Boolean,
    required: true,
    default: false
  },
  ignore: {
    type: Boolean,
    required: true,
    default: false
  }


})


module.exports = mongoose.model("User", userSchema);
