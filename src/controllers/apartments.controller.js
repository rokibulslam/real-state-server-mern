const { getDb } = require("../utils/db");
const ObjectId = require("mongodb").ObjectId;


exports.getApartments = async (req, res) => {
  const database = getDb();
  const apartmentCollection = database.collection("apartments");
  const cursor = apartmentCollection.find({});
  const total = await cursor.toArray();
  res.send(total);
};

exports.createApartment = async (req, res) => {
    const database = getDb();
    const apartmentCollection = database.collection("apartments");
    const apartment = req.body;
    const result = await apartmentCollection.insertOne(apartment);
    res.json(result);
}

exports.updateApartment = async (req, res) => {
    const database = getDb();
    const apartmentCollection = database.collection("apartments");
    const id = req.params.id;
    const product = req.body;
    const query = { _id: ObjectId(id) };
    const update = { $set: { ...product } };
    const result = await apartmentCollection.updateOne(query, update);
    res.send(result);
}

exports.deleteApartment = async (req, res) => {
  const database = getDb();
  const apartmentCollection = database.collection("apartments");
   const id = req.params.id;
   const query = { _id: ObjectId(id) };
   const result = await apartmentCollection.deleteOne(query);
   res.json(result);
};

exports.getAnApartment = async (req, res) => { 
    const database = getDb();
    const apartmentCollection = database.collection("apartments");
    const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await apartmentCollection.findOne(query);
      res.send(result);
}
exports.getFeaturedApartment = async (req, res) => { 
    const database = getDb();
    const apartmentCollection = database.collection("apartments");
     const query = {
       Category: "Featured",
     };
     const result = await apartmentCollection.find(query).toArray();
     res.json(result);
}

exports.getRegulardApartment = async (req, res) => {
  const database = getDb();
    const apartmentCollection = database.collection("apartments");
    const query = {
      Category: "Regular",
    };
    const result = await apartmentCollection.find(query).toArray();
    res.json(result);
};

exports.getTopApartment = async (req, res) => {
  const database = getDb();
    const apartmentCollection = database.collection("apartments");
    const query = {
      Category: "Top-Rated",
    };
    const result = await apartmentCollection.find(query).toArray();
    res.json(result);
};
// exports.getFeaturedApartment = async (req, res) => {
//   const database = getDb();
//   const apartmentCollection = database.collection("apartments");
// };