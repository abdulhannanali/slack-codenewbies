var request = require("request");

var slackBotUrl = "https://codebuddiesmeet.slack.com/services/hooks/slackbot";
var qs = {
  token: "MrsTEkPfwDiWWk0pLSq4CrVM",
  channel: "#testchannel"
}

request(
  {
    url: slackBotUrl,
    qs: qs,
    body: `\/prowd @abdulhannanali`
  }, function (error, response, body) {
  })
