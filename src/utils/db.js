require("dotenv").config({path:"../config.env"});
const { MongoClient } = require("mongodb");


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2efaz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


let _db = null;

const connect = async () => {
  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    console.log("Connected to MongoDB");
    _db = client.db("realState");
  } catch (error) {
    console.log(error);
  }
};
const getDb = () => {
    return _db
}



module.exports={connect, getDb}