const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const stripe = require("stripe")(process.env.STRIPE);



// Middleware
app.use(cors());
app.use(express.json());

// Connecting MongoDB database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2efaz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect();
async function run() {
  try {
    
    const database = client.db("realState");
    const apartmentCollection = database.collection("apartments");
    const orderCollection = database.collection("orders");
    const userCollection = database.collection("users");
    const reviewCollection = database.collection("reviews");

    // GET METHOD
    // GET ALL APARTMENTS
    app.get("/apartments", async (req, res) => {
      const cursor = apartmentCollection.find({});
      const total = await cursor.toArray();
      res.send(total);
    });
    // GET AN APARTMENT BY ID
    app.get("/apartment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await apartmentCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    // GET FEATURED APARTMENTS
    app.get("/apartments/featured", async (req, res) => {
      const query = {
        Category: "Featured",
      };
      const result = await apartmentCollection.find(query).toArray();
      res.json(result);
    });
    // GET RGULAR APARTMENTS
    app.get("/apartments/regular", async (req, res) => {
      const query = {
        Category: "Regular",
      };
      const result = await apartmentCollection.find(query).toArray();
      res.json(result);
    });
    // GET RGULAR APARTMENTS
    app.get("/apartments/top", async (req, res) => {
      const query = {
        Category: "Top-Rated",
      };
      const result = await apartmentCollection.find(query).toArray();
      res.json(result);
    });
    // GET ALL ORDERS
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.json(orders);
    });
    // GET SPECIFIC USERS ORDER BY EMAIL
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const query = {
        email: email,
      };
      const result = await orderCollection.find(query).toArray();
      res.json(result);
    });
    // CHECKING USER & ADMIN ROLE
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
    // GET ALL REVIEWS
    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    // POST METHOD
    //   ADD AN APARTMENT APARTMENT COLLECTION
    app.post("/apartments", async (req, res) => {
      const apartment = req.body;
      console.log(apartment);
      const result = await apartmentCollection.insertOne(apartment);
      res.json(result);
    });
   
    //ADD AN USER
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.json(result);
    });
    // CHECK AND ADD GOOGLE USER
    app.put("/users", async (req, res) => {
      const user = req.body;
      const checkUser = { email: user.email };
      //   if not found then add user using (upsert)
      const updateUser = { $set: user };
      const option = { upsert: true };
      const result = await userCollection.updateOne(
        checkUser,
        updateUser,
        option
      );
      res.json(result);
    });
    // ADD REVIEW
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });
    // Create Stripe Payment Intent
    app.post('/payment-intent', async (req, res) => {
      const order = req.body;
      const price = order.price;
      // Conver Price in cents 
      const amount = price * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        currency: "usd",
        amount: amount,
        payment_method_types: ["card"],
      });
      res.send({ clientSecret: paymentIntent.client_secret});
    })
    
    app.post("/orders", async (req, res) => {
      const apartment = req.body;
      console.log(apartment);
       const result = await orderCollection.insertOne(apartment);
       console.log(result);
       res.json(result);
     });
    // UPDATE METHOD
    // UPDATE ORDER'S STATUS BY ID
    app.put("/order/status/:id", async (req, res) => {
      const id = req.params.id;
      const updateInfo = req.body;
      const result = await orderCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: { status: updateInfo.status } }
      );
      res.send(result);
    });

    // CHANGE USER ROLE AND MAKE ADMIN
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateUserRole = { $set: { role: "admin" } };
      const result = await userCollection.updateOne(filter, updateUserRole);
      res.json(result);
    });
    // DELETE METHOD
    //   DELETE AN APARTMENT FROM COLLECTION
    app.delete("/apartment/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await apartmentCollection.deleteOne(query);
      res.json(result);
    });
    // DELETE AN ORDER 
    app.delete("/order/delete/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      console.log(result)
      res.json(result);
    });
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
