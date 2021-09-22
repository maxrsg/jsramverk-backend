const mongo = require("mongodb").MongoClient;
const collectionName = "editor";
const config = require("./config.json");

const database = {
  getDb: async function getDb() {
    let dsn = `mongodb+srv://${config.username}:${config.password}@cluster0.kzv8b.mongodb.net/texteditor?retryWrites=true&w=majority`;

    if (process.env.NODE_ENV === "test") {
      dsn = "mongodb://localhost:27017/test";
    }

    const client = await mongo.connect(dsn, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = await client.db();
    const collection = await db.collection(collectionName);

    return {
      db: db,
      collection: collection,
      client: client,
    };
  },
};

module.exports = database;
