var Slack = require("slack-node");

var incoming = process.env.INCOMING_WEBHOOK;

var slack = new Slack({options: {uri: incoming}});
slack.setWebhook(incoming);

slack.webhook({
  channel: "#advice",
  username: "tomandjerrybot",
  icon_emoji: ":ghost:",
  text: "remember those cartoon. Yeah the cat and the mice, I hated them.. lel"
}, function (error, response) {
  console.log(error);
})
