var koa = require("koa");
var router = require("koa-router")();
var bodyParser = require("koa-bodyparser");

var app = koa();
var server = require("http").createServer(app.callback());

var PORT = process.env.PORT || 3000;
var HOST = process.env.HOST || "0.0.0.0";

app.use(bodyParser());

var users = {};

app.use(function *(next) {
  console.log(this.request.body);
  var user = this.request.body;
  if (user.text == "!pledge") {
    if (!users[user.user_name]) {
      users[user.user_name] = true;
      this.body = {"text": "You are now registered for this pledge"}
    }
    else {
      this.body = {"text":"You are already registered for this pledge"}
    }
  }
  else {
    this.body = {"text": "let's get to the real talk. Type !pledge to take this pledge"}
  }
})

server.listen(PORT, HOST, function (error) {
  if (!error) {
    console.log(`Server is listening on PORT ${PORT} and HOST ${HOST}`);
  }
})
