const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const admin = require("firebase-admin");
const port = process.env.PORT || 3000;


const serviceAccount = require("./firebase-adminsdk-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});




//middleware
app.use(cors());
app.use(express.json());


// const logger = (req, res, next) =>{
//   console.log('logging information');
//   next();
// } 

// const verifyFirebseToken = (req, res, next)=>{

// }

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
    const bookingCollection = db.collection("bookings");

    //Booking api:
       app.get('/bookings', async(req, res)=>{
        const cursor = bookingCollection.find();
        const result = await cursor.toArray();
        res.send(result);
       })

       app.get("/bookings", async (req, res) => {
       console.log(req.query)
        const email = req.query.userEmail;
        const query = {};
        if (email) {
          query.userEmail = email;
        }


      const cursor = bookingCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingCollection.findOne(query);
      res.send(result);
    });

     app.post("/bookings", async (req, res) => {
       const newBooking = req.body;
       const result = await bookingCollection.insertOne(newBooking);
       res.send(result);
     });

    app.patch("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBooking = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: { updatedBooking },
      };
      const result = await bookingCollection.updateOne(query, update);
      res.send(result);
    });

    app.delete("/bookings/:id", async (req, res) => {
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

    //Users API
    app.post("/users", async (req, res) => {
      const data = req.body;
      console.log("user information", data);

      const result = await userCollection.insertOne(data);
      res.send({
        success: true,
        result,
      });
    });

    app.get("/users", async (req, res) => {
      console.log(req.query);
      const email = req.query.created_by;
      const query = {};
      if (email) {
        query.created_by = email;
      }

      const cursor = userCollection.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
    });

    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUsers = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: { updatedUsers },
      };
      const result = await userCollection.updateOne(query, update);
      res.send(result);
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
