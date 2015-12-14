var fs = require("fs");

var koa = require("koa");
var router = require("koa-router")();
var bodyParser = require("koa-bodyparser");
var morgan = require("koa-morgan");

var app = koa();
var server = require("http").createServer(app.callback());

var bluebird = require("bluebird");
var mongoose = require("mongoose");


var PORT = process.env.PORT || 3000;
var HOST = process.env.HOST || "0.0.0.0";
app.env = process.env.NODE_ENV || "development";

app.use(bodyParser());


// development environment specific configurations :)
if (app.env == "development") {
  require("./config")();
  app.use(morgan.middleware("dev"));
}
else {
  app.use(morgan.middleware("combined"));
}

mongoose.connect(process.env.MONGODB_CONNECT_URI, function (error) {
  if (!error) {
    console.log("Successfully connected to the database");
  }
  else {
    console.error(error);
  }
});

// routes
require("./routes/index.router.js")(router);

app.use(router.routes());
app.use(router.allowedMethods());

server.listen(PORT, HOST, function (error) {
  if (!error) {
    console.log(`Server is listening on PORT ${PORT} and HOST ${HOST}`);
  }
})
