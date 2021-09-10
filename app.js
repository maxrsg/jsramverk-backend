const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const port = 1337;

const index = require("./routes/index");
const docs = require("./routes/docs");

app.use(cors());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

app.use((req, res, next) => {
  console.log(req.method);
  console.log(req.path);
  next();
});

app.use("/", index);
app.use("/docs", docs);

// 404 error
app.use((req, res, next) => {
  let err = new Error("Not found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    error: [
      {
        status: err.status,
        title: err.message,
        detail: err.message,
      },
    ],
  });
});

app.listen(port, () => console.info(`Listening on port ${port}!`));
