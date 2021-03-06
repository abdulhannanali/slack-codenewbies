/// Contains the code for the #100daysofcode slack bot logic
var co = require("co");
var rp = require("request-promise");
var bluebird = require("bluebird");
var fs = require("fs");
var moment = require("moment");


// assigning the variables according to the environment the code is
// working in

if (process.env.NODE_ENV == "production") {
  var username = process.env.BOT_USERNAME;
  var channel = process.env.BOT_CHANNEL;
}
else {
  var username = "testbot";
  var channel = "#testchannel";
  console.log("\n============codeBot log has started=================\n")
  console.log("codeBot is running in development mode");
  console.log(`codeBot username is ${username}`);
  console.log(`codeBot channel is ${channel}`);
  console.log("\n============codeBot log has ended===================\n")
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
    var tilInvokeString = "#todayilearned";
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
        case "verify":
          verifyTheDay(userDb);
          break;
        case "status":
          verificationStatus(userDb);
          break;
        case "delete":
          deleteMe(userDb);
          break;
        default:
          dumbBot();
          break;
      }

    }
    else if(commandArgs[0].trim().toLowerCase() == tilInvokeString) {
      todayILearnedPost(userDb, commandArgs);
    }
  }


  // saves the posts starting with tilinvokeString in the specified channel
  // the requests are saved with the user
  function todayILearnedPost(userDb, commandArgs) {
    var til = commandArgs.slice(1).join(" ");
    if (!userDb.til) {
      userDb.til = [];
    }
    userDb.til.push(til);
    userDb.save(function (error, doc) {
      if (error) {
        slackIncoming.errorNotice(userDb);
        throw error;
      }
      else {
        slackIncoming.sendMessage(`It's really cool @${userDb.username} that you are still learning. Your til is saved. If you haven't yet. Sign up for the pledge today.`);
      }
    })
  }

  function pledgeSign(userDb, commandArgs) {
    switch (commaasndArgs[2]) {
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
          throw error;
        }
        else {
          slackIncoming.sendMessage(`@${userDb.username}: Congrats! You are now signed up for CodeBuddies #100daysofcode pledge. You were assigned the id codebuddies.herokuapp.com/id/${userDb._id}`);
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
          throw error;
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
    var aboutMessage = `${todayGirl.name} \n>*About*\n>Image: ${todayGirl.image}\n>${todayGirl.description}\n>*Website*\n> ${todayGirl.website}`
    slackIncoming.sendMessage(aboutMessage);
  }

  function dumbBot() {
    var dumbnessMessage = `I can't understand what you said to me. :grin:. You can type \n>100daysofcodebot: help\nTo find out what you can say to me.`
    slackIncoming.sendMessage(dumbnessMessage);
  }

  // tells us about the 1000daysofcodebotchallenge status
  function verificationStatus(codeBot) {
    if (!codeBot.daysCoded || codeBot.daysCoded[0] == undefined ) {
      slackIncoming.sendMessage("You have never coded!");
    }
    else {
      slackIncoming.sendMessage(`You have coded ${codeBot.daysCoded.length} days.`);
    }
  }


  // verifies the day for the 100daysofcode pledge
  function verifyTheDay(userDb) {
    if (!userDb.pledge) {
      slackIncoming.sendMessage(`@${userDb.username}: Sorry! Signup before verifying your progresss in the challenge. :simple_smile:`)
      return;
    }

    if (!userDb.lastVerified) {
      userDb.lastVerified = Date.now();
    }

    var now = moment();
    var lastVerified = moment(userDb.lastVerified);
    now.subtract(1, 'day');

    if (now >= lastVerified) {
      if (!userDb.datesCoded) {
        userDb.datesCoded = [];
      }

      userDb.lastVerified = moment();
      userDb.datesCoded.push(userDb.lastVerified);

      userDb.save(function (error, doc) {
        if (error) {
          throw new Error(error);
          slackIncoming.errorNotice(userDb);
        }
        else {
          slackIncoming.sendMessage(`You are verified for today. WOW! You have coded total of *${doc.datesCoded.length}* days now. Going good in #1000daysofcode`);
        }
      })
    }
    else {
      slackIncoming.sendMessage("You are verifying before the completion of 24 hours since last verification. Wait for it!");
    }
  }

  function deleteMe (userDb) {
      userDb.remove(function (err) {
        if (!err) {
          slackIncoming.sendMessage("You have deleted yourself from the system. Bye!");
        }
      })
  }


  return {
    codeBotArgumentsParse: codeBotArgumentsParse,
    introductoryNotice: introductoryNotice,
    errorNotice:  errorNotice,
    username: username
  }

}
