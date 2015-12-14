var co = require("co");
var slack = require("./slackIncoming");

require("/home/programreneur/Programming/githubRepos/slack-codenewbies/config")();

var slackObj = slack({
  username: "abdulhannanali",
  icon_emoji : ":lollipop:",
  incomingWebhookUrl: process.env.INCOMING_WEBHOOK_URL
})

slackObj.sendMessage(`So! Guy! You are going good.
>It's your 9th day regularly coding. Yo okay?
?falkjfkldajf`, "iamlisteninghalseyandwanttosmokemarijuananow")
  .then(function(response) {
    console.log(response);
  });
