module.exports = function (app) {
  const index = require("../controllers/indexController");
  const jwtMiddleware = require("../../config/jwtMiddleware");

  //맛집 목록 조회
  app.get("/restaurants", index.readRestaurants);

  app.post("/write", index.createReview);
};
