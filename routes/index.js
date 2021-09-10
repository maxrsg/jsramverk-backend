const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  const data = {
    data: {
      msg: "Index",
    },
  };

  res.json(data);
});

module.exports = router;
