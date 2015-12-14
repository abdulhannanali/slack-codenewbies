var rp = require("request-promise");

var User = require("../models/user.model");
var slackIncoming = require("../lib/slackIncoming")({
  username: "100daysofcodebot",
  incomingWebhookUrl: process.env.INCOMING_WEBHOOK_URL,
  icon_emoji: ":sunglasses:"
});

var botName = "slackbot";

module.exports = function () {
  function* requestVerification (next) {
    if (this.request.body &&
        this.request.body.token == process.env.OUTGOING_TOKEN &&
        this.request.body.user_name.trim() != botName) {
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
  function* codeArgsSplit(next) {
    if (this.user && this.user.text) {
      var splitText = this.user.text.trim().split(" ");
      if (splitText[0] == "100daysofcodebot:") {
        // command accepted. other args can be accepted after this
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
      if (this.userDb && !this.userDb.ignore) {
        try {
          this.userDb.ignore = true;
          yield this.userDb.save();
          yield slackIncoming.sendMessage(`Hi @${this.userDb.username}! Sign up for 100daysofcode pledge today. \nTo signup type \n> \`\`\`100daysofcodebot: pledge signup\`\`\``, "100daysafdaofcodebot", "#testchannel");
        }
        catch (error) {
          console.error(error);
        }
      }
      else if (this.codeCommand == "help") {
        yield helpCommand();
      }
  }

  function helpCommand() {
    return slackIncoming.sendMessage("hi! I am a 100daysofcode bot. I am here to help you in your coding journey. To sign up for pledge just type \n>\'\'\'100daysofcodebot: pledge signup\'\'\' \nIn order to signout of pledge type \'\'\'100daysofcodebot: pledge signout\'\'\' but you don't give up man!", "100daysofcode")
  }

  // userDb: a middleware to create the user in the database if not present already
  function* userDb(next) {
      if (this.user) {
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
    codeArgsSplit: codeArgsSplit,
    postOutgoing: postOutgoing
  }
}
