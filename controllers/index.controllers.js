var User = require("../models/user.model");

module.exports = function () {
  function* requestVerification (next) {
    if (this.request.body &&
        this.request.body.token == process.env.OUTGOING_TOKEN &&
        this.request.body.user_name.trim() != "slackbot") {
          console.log("Verified Slack Request")
          this.user = this.request.body;
          yield next;
    }
    else {
      console.log("Request not verified");
      yield next;
    }
  }

  function* postOutgoing(next) {
    if (this.user && this.userDb) {
      this.body = this.user
    }
  }

  // createUser: a middleware to create the user in the database
  function* userDb(next) {
      if (this.user) {
        // finding mongodb for the user
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
          }
          yield next;
        }
        catch(error) {
          yield next(error);
        }
        console.log(this.userDb);
      }
      else {
        yield next;
      }
  }

  return {
    requestVerification: requestVerification,
    userDb: userDb,
    postOutgoing: postOutgoing
  }
}
