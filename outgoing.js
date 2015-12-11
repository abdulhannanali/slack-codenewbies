var koa = require("koa");
var router = require("koa-router")();
var bodyParser = require("koa-bodyparser");

var app = koa();
var server = require("http").createServer(app.callback());

var PORT = process.env.PORT || 3000;
var HOST = process.env.HOST || "0.0.0.0";

app.use(bodyParser());

app.use(function *(next) {
  console.log(this.req.body);
})

server.listen(PORT, HOST, function (error) {
  if (!error) {
    console.log(`Server is listening on PORT ${PORT} and HOST ${HOST}`);
  }
})
