// var User = require("../models/user.model");

module.exports = function () {
  function* requestVerification (next) {
    if (this.request.body &&
        this.request.body.token == process.env.OUTGOING_TOKEN) {
          console.log("Verified Slack Request")
          this.user = this.request.body;
          yield next;
    }
    else {
      console.log("Request not verified");
      yield next;
    }
  }

  function* getOutgoing (next) {
    if (!this.user || this.user.user_name == "100daysofcodebot") {
      yield next;
    }
    else {
      console.log("Should out go probably");
      this.body = {text: `Welcome ${this.user.user_name}! How is your progress with 100daysofcode pledge going today`}
    }

  }

  function checkPledge(user) {
    if (user.text) {
      return user.text.includes("!pledge");
    }
  }



  return {
    requestVerification: requestVerification,
    getOutgoing: getOutgoing
  }
}
