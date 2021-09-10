const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  const data = {
    data: {
      msg: "Docs",
    },
  };

  res.json(data);
});

module.exports = router;
