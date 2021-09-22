process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../app.js");
const database = require("../../db/database");
// const Docs = require("../../models/docdata");

chai.should();
chai.use(chaiHttp);

describe("docs", () => {
  before(async () => {
    await (async (resolve) => {
      const db = await database.getDb();

      db.db
        .listCollections({ name: collectionName })
        .next()
        .then(async function (info) {
          if (info) {
            await db.collection.drop();
          }
        })
        .catch(function (err) {
          console.error(err);
        })
        .finally(async function () {
          await db.client.close();
          resolve();
        });
    });
  });

  describe("GET /docs", () => {
    it("status 200", (done) => {
      chai
        .request(server)
        .get("/docs")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          console.log(res.body.data);

          done();
        });
    });
  });
});
