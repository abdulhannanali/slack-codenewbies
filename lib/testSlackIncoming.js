var co = require("co");
var slack = require("./slackIncoming");

require("/home/programreneur/Programming/githubRepos/slack-codenewbies/config")();

var slackObj = slack({
  username: "abdulhannanali",
  icon_emoji : ":lollipop:",
  incomingWebhookUrl: process.env.INCOMING_WEBHOOK_URL
})

slackObj.sendMessage("YO! Slack Incoming web hook module", "iamlisteninghalseyandwanttosmokemarijuananow")
  .then(function(response) {
    console.log(response);
  });
