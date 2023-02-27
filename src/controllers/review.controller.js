const { getDb } = require("../utils/db");


exports.getReviews = async (req, res) => {
  const database = getDb();
    const reviewCollection = database.collection("reviews");
  const cursor = reviewCollection.find({});
  const reviews = await cursor.toArray();
  res.send(reviews);
};


exports.createReview = async (req, res) => {
  const database = getDb();
  const reviewCollection = database.collection("reviews");
 const review = req.body;
 const result = await reviewCollection.insertOne(review);
 res.json(result);
};