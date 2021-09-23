process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../app.js");
const database = require("../../db/database");
const collectionName = "editor";

chai.should();
chai.use(chaiHttp);

let _id = "";

describe("docs", () => {
  before(() => {
    return new Promise(async (resolve) => {
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

  describe("GET /docs when no documents exists", () => {
    it("should get status 200", (done) => {
      chai
        .request(server)
        .get("/docs")
        .end((err, res) => {
          console.log(res.body);
          res.should.have.status(200);
          res.body.should.be.an("object");
          done();
        });
    });
  });

  describe("POST /docs", () => {
    it("status 201 on create", (done) => {
      const document = {
        title: "post test",
        data: "post test",
      };

      chai
        .request(server)
        .post("/docs")
        .send(document)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.id.should.be.an("string");
          _id = res.body.id;

          done();
        });
    });
  });

  describe("GET /docs, when documents exists", () => {
    it("all documents should get status 200", (done) => {
      chai
        .request(server)
        .get("/docs")
        .end((err, res) => {
          console.log(res.body);
          res.should.have.status(200);
          res.body.should.be.an("object");
          done();
        });
    });

    it("specific document should get status 200", (done) => {
      chai
        .request(server)
        .get(`/docs/${_id}`)
        .end((err, res) => {
          console.log(res.body);
          res.should.have.status(200);
          res.body.should.be.an("object");
          done();
        });
    });
  });

  describe("PUT /docs", () => {
    it("should get status 200", (done) => {
      const document = {
        id: _id,
        title: "put test",
        data: "put test",
      };

      chai
        .request(server)
        .put("/docs")
        .send(document)
        .end((err, res) => {
          res.should.have.status(200);
          console.log(res.body);
          done();
        });
    });
  });

  describe("DELETE /docs/:id", () => {
    it("should get status 200", (done) => {
      chai
        .request(server)
        .delete(`/docs/${_id}`)
        .end((err, res) => {
          res.should.have.status(200);
          console.log(res.body);
          done();
        });
    });
  });
});
