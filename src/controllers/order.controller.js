const { getDb } = require("../utils/db");
const ObjectId = require("mongodb").ObjectId;
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const Stripe = require("stripe")(process.env.STRIPE);


exports.getOrders = async (req, res) => {
  const database = getDb();
  const orderCollection = database.collection("orders");
  const cursor = orderCollection.find({});
  const orders = await cursor.toArray();
  res.json(orders);
};


exports.createOrder = async (req, res) => {
  const database = getDb();
  const orderCollection = database.collection("orders");
  const orderData = req.body;
  const paymentInfo = await Stripe.charges.create(
    {
      source: orderData.token.id,
      amount: orderData.grandTotal * 100,
      currency: "USD",
      receipt_email: orderData.token.email,
    },
    {
      idempotencyKey: uuidv4(),
    }
  );
  const newOrder = {
    userEmail: orderData.userEmail,
    paymentBy: "Stripe",
    transactionId: paymentInfo.balance_transaction,
    cartItem: orderData.cart,
    totalPrice: orderData.grandTotal,
    shippingAddress: orderData.shippingAdress,
    shipping: orderData.shipping,
    status: "pending",
    date: orderData.date,
  };
  const result = await orderCollection.insertOne(newOrder);
  res.json(result);
};

exports.getAnOrder = async (req, res) => {
  const database = getDb();
    const orderCollection = database.collection("orders");
    const email = req.params.email;
    const query = {
      userEmail: email,
    };
    const result = await orderCollection.find(query).toArray();
    res.json(result);
};
exports.updateOrderStatus = async (req, res) => {
  const database = getDb();
  const orderCollection = database.collection("orders");
  const id = req.params.id;
  const updateInfo = req.body;
  const result = await orderCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: { status: updateInfo.status } }
  );
  res.send(result);
};

exports.deleteOrder = async (req, res) => {
  const database = getDb();
  const orderCollection = database.collection("orders");
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await orderCollection.deleteOne(query);
  res.json(result);
};