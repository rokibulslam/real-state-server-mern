const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const { connect, getDb } = require("./src/utils/db");
const router = require("./src/routes/v1/api");

// Middleware
app.use(cors());
app.use(express.json());

async function run() {
  try {
    await connect();
    app.use(router);
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
    app.listen(port, () => {
      console.log(`listening at port ${port}`);
    });
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

// Checking server
