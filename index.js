const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.yp7cb5e.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Rent Wheels Server is running");
});

async function run() {
  try {
    // await client.connect();

    const db = client.db("rent_db");
    const productCollection = db.collection("products");
    const userCollection = db.collection("users");
    const bookingCollection = db.collection("booking");

    //Booking api:
    app.post("/booking", async (req, res) => {
      const newProduct = req.body;
      // const email = req.body.email;
      // const query = { created_by:email };
      const result = await bookingCollection.insertOne(newProduct);
      res.send(result);
    });

    app.get("/booking", async (req, res) => {
      const cursor = bookingCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingCollection.findOne(query);
      res.send(result);
    });

    app.patch("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBooking = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: { updatedBooking },
      };
      const result = await bookingCollection.updateOne(query, update);
      res.send(result);
    });

    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });

    //  Featured Cars:
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find().sort().skip(0).limit(6);

      const result = await cursor.toArray();
      res.send(result);
    });

    // app.get('/products', async(req, res) => {
    //   const id= req.params.id;
    //   const query = {_id: new ObjectId(id)}
    //   const result = await productCollection.findOne(query)
    //   res.send(result)
    // })

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();

      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const data = req.body;
      console.log("user information", data);

      const result = await userCollection.insertOne(data);
      res.send({
        success: true,
        result,
      });
    });
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Rent Wheels Server is running on port: ${port}`);
});
