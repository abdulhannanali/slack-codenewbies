// slack incoming api
// this api doesn't support attachments to display rich texts
var rp = require("request-promise");

module.exports = function (options) {

  // the following options might be provided at the run time
  // username - default one provided in Slack API Integrations settings used if not provided
  // valid icon url will be given preference over icon emoji
  // icon url - default one provided in Slack API Integrations settings used if not provided
  // icon emoji - default one provided in Slack API Integrations settings used if not provided
    // var {
    //       username: username,
    //       icon_emoji: icon_emoji,
    //       icon_url: icon_emoji,
    //       incomingWebhookUrl: incomingWebhookUrl
    //     } = options;

  var username = options.username;
  var icon_emoji = options.icon_emoji;
  var icon_url = options.icon_url;
  var incomingWebhookUrl = options.incomingWebhookUrl;

  if (!incomingWebhookUrl) {
    var incomingWebhookUrl = process.env.INCOMING_WEBHOOK_URL;
  }

  function sendMessage(message, username) {
    var jsonData = {};
    if (message && typeof message == "string") {
      jsonData.text = message;
    }
    if (username) {
      jsonData.username = username;
    }
    if (icon_emoji) {
      jsonData.icon_emoji = icon_emoji;
    }
    if (icon_url) {
      jsonData.icon_url = icon_url;
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
