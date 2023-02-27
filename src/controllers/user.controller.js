const { getDb } = require("../utils/db");

exports.getUserRole = async (req, res) => {
  const database = getDb();
  const userCollection = database.collection("users");
  const email = req.params.email;
  const query = { email: email };
  const user = await userCollection.findOne(query);
  let isAdmin = false;
  if (user && (user.role === "admin" || user.role === "superAdmin")) {
    isAdmin = true;
  }
  res.json({ admin: isAdmin });
};
exports.getUsers = async (req, res) => {
  const database = getDb();
  const userCollection = database.collection("users");
  const cursor = await userCollection.find({});
  const users = await cursor.toArray();
  res.json(users);
};

exports.createUser = async (req, res) => {
  const database = getDb();
  const userCollection = database.collection("users");
   const user = req.body;
   const newUser = {
     ...user,
     role: "user",
   };
   const result = await userCollection.insertOne(newUser);
   res.json(result);
};

exports.updateUser = async (req, res) => {
  const database = getDb();
    const userCollection = database.collection("users");
    const user = req.body;
    const newUser = {
      ...user,
    };
    const checkUser = { email: user.email };
    //   if not found then add user using (upsert)
    const updateUser = { $set: newUser };
    const option = { upsert: true };
    const result = await userCollection.updateOne(
      checkUser,
      updateUser,
      option
    );
    res.json(result);
};
    // CHANGE USER ROLE AND MAKE ADMIN
// exports.makeAdmin = async (req, res) => {
//   const database = getDb();
//   const userCollection = database.collection("users");
//   const user = req.body;
//   const filter = { email: user.email };
//   const updateUserRole = { $set: { role: "admin" } };
//   const result = await userCollection.updateOne(filter, updateUserRole);
//   res.json(result);
// };

exports.updateRole = async (req, res) => {
  const database = getDb();
  const userCollection = database.collection("users");
  const email = req.params.email;
  const role = req.body;
  const result = await userCollection.updateOne(
    { email: email },
    { $set: { role: role.role } }
  );
  res.send(result);
};