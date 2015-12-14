var indexController = require("../controllers/index.controllers")();

module.exports = function (router) {

  router.post("/",
    indexController.requestVerification,
    indexController.codeArgsSplit,
    indexController.userDb,
    indexController.postOutgoing);
}
