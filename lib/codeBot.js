/// Contains the code for the #100daysofcode slack bot logic
var co = require("co");
var rp = require("request-promise");
var bluebird = require("bluebird");
var fs = require("fs");


// assigning the variables according to the environment the code is
// working in

if (process.env.NODE_ENV == "production") {
  var username = "100daysofcodebot";
  var channel = "#100daysofcode";
}
else {
  var username = "testbot";
  var channel = "#testchannel";
  console.log("codeBot is running in development mode");
  console.log(`codeBot username is ${username}`);
  console.log(`codeBot channel is ${channel}`);
}

const helpMessage = fs.readFileSync("./commandMessages/help.md", "utf-8").trim();
const botInvokeString = "100daysofcodebot:";


var slackIncoming = require("./slackIncoming");



module.exports = function () {
  slackIncoming = slackIncoming({
    username: username,
    incomingWebhookUrl: process.env.INCOMING_WEBHOOK_URL,
    channel: channel
  })

  // index of the different woman in CS everyday
  var womenInCS = JSON.parse(fs.readFileSync("./data/womenInCS.json", "utf-8"));
  var todayWomanIndex;

  function setTodayImage() {
    todayWomanIndex = Math.floor(Math.random() * womenInCS.length);
    slackIncoming.setIconUrl(womenInCS[todayWomanIndex].image);
  }

  // calling it every 24 hours after the first time
  setTodayImage();
  setInterval(function () {
    setTodayImage();
  }, 24 * 60 * 60 * 1000);


  function introductoryNotice (userDb) {
    slackIncoming.sendMessage(`Hi @${userDb.username}! Sign up for 100daysofcode pledge today. \nTo signup type \n> \`\`\`100daysofcodebot: pledge signup\`\`\``)
  }

  function errorNotice (userDb) {
    slackIncoming.sendMessage(`@${userDb.username}: Sorry your request was not completed :cry: :cry: :cry:`)
  }

  function codeBotArgumentsParse (userDb, commandArgs) {
    // bot should be invoked in this case
    // if it starts with botInvokeString that means message is meant for it
    if (commandArgs[0] == botInvokeString) {
      console.log(commandArgs);
      switch (commandArgs[1]) {
        case "pledge":
          pledgeSign(userDb, commandArgs);
          break;
        case "help":
          helpCommand();
          break;
        case "aboutthepic":
          aboutthepic();
          break;
        default:
          dumbBot();
          break;
      }
    }
  }

  function pledgeSign(userDb, commandArgs) {
    switch (commandArgs[2]) {
      case "signup":
        signupMessage(userDb);
        break;
      case "signout":
        signoutMessage(userDb);
        break;
      default:
        signupGuidance();
        break;
    }
  }

  // in case the command args are for signup this function is executed
  function signupMessage(userDb) {
    if (userDb.pledge == true) {
      slackIncoming.sendMessage(`@${userDb.username}! You are already signed up`);
    }
    else {
      userDb.pledge = true;
      userDb.save(function (error, doc) {
        if (error) {
          errorNotice(userDb);
        }
        else {
          slackIncoming.sendMessage(`@${userDb.username}: Congrats! You are now signed up for CodeBuddies #100daysofcode pledge`);
        }
      })
    }
  }

  // in case the command args are for signout this function is executed
  function signoutMessage(userDb) {
    if (userDb.pledge == false) {
      slackIncoming.sendMessage(`@${userDb.username}: You have not signed this pledge`);
    }
    else {
      userDb.pledge = false;
      userDb.save(function (error, doc) {
        if (error) {
          errorNotice(userDb);
        }
        else {
          slackIncoming.sendMessage(`@${userDb.username}: We're not happy that you are leaving. But bye! You are now signed out of the pledge. Bye! Go away!`)
        }
      })
    }
  }

  // in case user wants to pledge but is a little unsure whether he wants to signup or signout
  function signupGuidance () {
    var guidanceMeessage = `To Signup type \n>100daysofcodebot: pledge signup\nTo signin type\n>100daysofcodebot: pledge signin`
    slackIncoming.sendMessage(guidanceMeessage);
  }

  function helpCommand() {
    slackIncoming.sendMessage(helpMessage);
  }

  function aboutthepic() {
    var todayGirl = womenInCS[todayWomanIndex];
    var aboutMessage = `${todayGirl.name} \n>*About*\n>${todayGirl.description}\n>*Website*\n> ${todayGirl.website}`
    slackIncoming.sendMessage(aboutMessage);
  }

  function dumbBot() {
    var dumbnessMessage = `I can't understand what you said to me. :grin:. You can type \n>100daysofcodebot: help\nTo find out what you can say to me.`
    slackIncoming.sendMessage(dumbnessMessage);
  }

  // a til for every day for of the 100daysofcode challenge
  function dayTIL() {
  }



  return {
    codeBotArgumentsParse: codeBotArgumentsParse,
    introductoryNotice: introductoryNotice,
    errorNotice:  errorNotice,
    username: username
  }

}
