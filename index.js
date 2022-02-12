const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const ObjectId = require("mongodb").ObjectId;

// Middleware
app.use(cors());
app.use(express.json());

// Connecting MongoDB database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2efaz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("realState");
    const apartmentCollection = database.collection("apartments");

    // GET METHOD
        // GET ALL APARTMENTS
      app.get('/apartments', async (req, res) => {
          const cursor = apartmentCollection.find({});
          const total = await cursor.toArray()
          res.send(total)
      })
        // GET AN APARTMENT BY ID
      app.get('/apartment/:id', async (req, res) => {
          const id = req.body.params;
          const query = { _id: ObjectId(id) }
          const result = await apartmentCollection.find(query);
          res.send(result)
      })
    // POST METHOD
        //   ADD AN APARTMENT APARTMENT COLLECTION
      app.post('/apartments', async (res, req) => {
          const apartment = req.body;
          const result = await apartmentCollection.insertOne(apartment);
          res.json(result)
      })
    // UPDATE METHOD
      
      
    // DELETE METHOD
      
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

// Checking server
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`listening at port ${port}`);
});
