const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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
    await client.connect();

    const db = client.db("rent_db");
    const productCollection = db.collection("products");

    app.get("/products", async (req, res) => {
     const result = await productCollection.find().toArray(); //promise resolving here

      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      // const result = await productCollection.insertOne(newProduct);
      res.send({
        success: true
      });
    });

    await client.db("admin").command({ ping: 1 });
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
