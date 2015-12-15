var User = require("../models/user.model");
var codeBot = require("../lib/codeBot")();

module.exports = function () {
  function* requestVerification (next) {
    if (this.request.body &&
        this.request.body.token == process.env.OUTGOING_TOKEN &&
        this.request.body.user_name.trim() != codeBot.name) {
          console.log("Verified Slack Request")
          this.user = this.request.body;
          yield next;
    }
    else {
      console.log("Request not verified");
      yield next;
    }

  }

  // middleware to check if the command given is right and should be accepted or not
  function* textArgsSplit(next) {
    if (this.user && this.user.text) {
      var splitText = this.user.text.split(" ");
      if (splitText) {
        this.codeCommand = splitText;
      }
      yield next;

    }
    else {
      yield next;
    }
  }

  //
  function* postOutgoing(next) {

    // perform the operations according to the requirements of the user]
      if (this.userDb && !this.userDb.ignore && this.codeCommand[0] != codeBot.username) {
        try {
          this.userDb.ignore = true;
          yield this.userDb.save();
          codeBot.introductoryNotice(userDb);
        }
        catch (error) {
          codeBot.errorNotice(userDb);
          this.body = "error occured";
        }
      }
      else if( this.userDb && this.codeCommand) {
        codeBot.codeBotArgumentsParse(this.userDb, this.codeCommand);
        this.body = "response received"
      }

  }

  // userDb: a middleware to create the user in the database if not present already
  function* userDb(next) {
      if (this.user) {
        console.log(this.user);
        try {
          var user = yield User.findOne({username: this.user.user_name}).exec();
          if (user) {
            this.userDb = user;
          }
          else {
            var newUser = new User({
              username: this.user.user_name
            })
            yield newUser.save();
            this.userDb = newUser;
            yield next;

          }
        }
        catch(error) {
          console.error(error);
          this.body = "error occured";
        }
        yield next;
      }
      else {
        yield next;
      }
  }

  return {
    requestVerification: requestVerification,
    userDb: userDb,
    textArgsSplit: textArgsSplit,
    postOutgoing: postOutgoing
  }
}
