// slack incoming api
// this api doesn't support attachments to display rich texts
var rp = require("request-promise");

module.exports = function (options) {
  var images = [
    ["http://i.imgur.com/SAWo7mM.jpg",
     "http://i.imgur.com/ie6ZUBy.jpg",
     "http://i.imgur.com/W414ECq.jpg",
     "http://i.imgur.com/D1hSPYp.jpg",
     "http://i.imgur.com/pUYHyGP.jpg",
     "http://i.imgur.com/FmLi6xB.png",
     "http://i.imgur.com/zPNErsH.jpg",
     "http://i.imgur.com/ktfJrtx.jpg"
    ]
  ]

  // the following options might be provided at the run time
  // username - default one provided in Slack API Integrations settings used if not provided
  // valid icon url will be given preference over icon emoji
  // icon url - default one provided in Slack API Integrations settings used if not provided
  // icon emoji - default one provided in Slack API Integrations settings used if not provided
    // var  {
    //       username: username,
    //       icon_emoji: icon_emoji,
    //       icon_url: icon_emoji,
    //       incomingWebhookUrl: incomingWebhookUrl
    //     } = options

  var username = options.username ? options.username : undefined ;
  var icon_emoji = options.icon_emoji ? options.icon_emoji: undefined;
  var icon_url = options.icon_url ? options.icon_url: undefined;
  var incomingWebhookUrl = options.incomingWebhookUrl ? options.incomingWebhookUrl : undefined;

  if (!incomingWebhookUrl) {
    var incomingWebhookUrl = process.env.INCOMING_WEBHOOK_URL;
  }

  function sendMessage(message, username, channel) {
    var jsonData = {};
    if (message && typeof message == "string") {
      jsonData.text = message;
    }
    if (username) {
      jsonData.username = username;
    }
    jsonData.icon_url = images[Math.floor(Math.random() * images.length)];
    // jsonData.icon_emoji = ":smiley:"
    if (channel) {
      jsonData.channel = channel;
    }

    return rp({
      method: "POST",
      uri: incomingWebhookUrl,
      resolveWithFullResponse: true,
      json: jsonData
    })
  }

  // setter web hook url
  function setWebhookUrl(url) {
    if (url) {
      incomingWebhookUrl = url;
    }
    else {
      throw new Error("No URL provided");
    }
  }

  // getter webhook url
  function getWebhookUrl(url) {
    if (incomingWebhookUrl) {
      return incomingWebhookUrl;
    }
    else {
      throw new Error("No URL set yet");
    }

  }

  return {
    getWebhookUrl: getWebhookUrl,
    setWebhookUrl: setWebhookUrl,
    sendMessage: sendMessage
  }

}
