const router = require("express").Router();
const route = router;

route.get("*", (req, res) => {
  res.status(404).json({
    method: req.method,
    message: "cant find spesific endpoint, please make sure you read a documentation",
    status: false,
    code: 401,
  });
});
module.exports = router;
