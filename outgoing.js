var koa = require("koa");
var router = require("koa-router")();
var bodyParser = require("koa-bodyparser");

var app = koa();
var server = require("http").createServer(app.callback());

var PORT = process.env.PORT || 3000;
var HOST = process.env.HOST || "0.0.0.0";
app.env = process.env.NODE_ENV || "development";

app.use(bodyParser());

var users = {};

console.log("NODE_ENV=" + app.env)
if (app.env == "development") {
  require("./config")();
}


// middleware for getting the user object and verifying it's the proper one
router.post("/", function* (next) {
  var user = this.request.body;
  // checks if the request is verified
  if (user.token == process.env.OUTGOING_TOKEN) {
    this.user = user;
    console.log("request verified")
  }
})

app.use(router.routes());

server.listen(PORT, HOST, function (error) {
  if (!error) {
    console.log(`Server is listening on PORT ${PORT} and HOST ${HOST}`);
  }
})
