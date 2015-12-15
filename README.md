# slack-codenewbies

This is a slack bot. I coded for a small but the best coding community [codebuddies.org](http://codebuddies.org).

This bot consumes the following slack APIs.

- Outgoing Webhooks
- Incoming Webhooks

In order to make the use of this bot you need to have a token for **outgoing webhook** and a url for **incoming webhook**. You don't need an outgoing webhook token per say in order to receive requests from **Slack** but we use it in order to verify that the request is coming from Slack and not from some **Cat**.

These are the environment variables you need to set whereever you want to deploy it. Whether it's on your computer or herokuapp

- INCOMING_WEBHOOK_URL
- OUTGOING_TOKEN
- MONGODB_CONNECT_URI
- BOT_USERNAME
- BOT_CHANNEL

## Reliance on MongoDB
This bot uses data persistence and that's why we use MongoDB as our DB of choice. If you want a small free mongodb shared 500mb hosting goto [mongolab](http://mongolab.com).

### LICENSE
MIT 
