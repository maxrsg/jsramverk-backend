const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const socketIo = require("socket.io");
const { graphqlHTTP } = require("express-graphql");
const { GraphQLSchema } = require("graphql");

const app = express();
const port = process.env.PORT || 1337;
const httpServer = require("http").createServer(app);
const visual = true;

const index = require("./routes/index");
const docs = require("./routes/docs");
const docModel = require("./models/docdata");
const users = require("./routes/users");
const RootQueryType = require("./graphql/root.js");

const schema = new GraphQLSchema({
  query: RootQueryType,
});

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
app.use("/users", users);
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: visual,
  })
);

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

const io = socketIo(httpServer, {
  cors: {
    origin: ["https://www.student.bth.se", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.sockets.on("connection", function (socket) {
  socket.on("create", function (room) {
    socket.join(room);
    console.log("joined: " + room);
  });
  socket.on("doc", function (data) {
    console.log(data);
    socket.to(data["_id"]).emit("doc", data);
    docModel.updateDirectly(
      data._id,
      data.title,
      data.data,
      data.allowedUsers,
      data.user,
      data.creator || ""
    );
  });
});

const server = httpServer.listen(port, () =>
  console.log(`Server listening on port ${port}!`)
);

module.exports = server;
