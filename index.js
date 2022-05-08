const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");
const port = process.env.PORT || 5000;
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//CONNECTING  to mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@warehouse.xnn1k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    //collection
    const inventoryCollection = client
      .db("warehouseInventory")
      .collection("inventory");
      const itemCollection = client.db('warehouseInventory').collection('item');
    

    //API
    app.get("/inventory", async (req, res) => {
      const query = {};
      const cursor = inventoryCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    //Loading an inventory by id
    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const inventory = await inventoryCollection.findOne(query);
      res.send(inventory);
      // console.log(id, query, inventory, inventoryCollection);
    });
    //update quantity decrease by one or many ...
    app.put("/inventory/:id", async (req, res) => {
      const id = req.params.id;

      const updatedInventory = req.body;

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: updatedInventory.quantity,
        },
      };
      const result = await inventoryCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    //delete inventory
    app.delete('/inventory/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await inventoryCollection.deleteOne(query);
      res.send(result);
    })

    //ITEM
    //adding item to db
    app.post('/item', async (req, res) => {
      const newItem = req.body;
      
      const result = await itemCollection.insertOne(newItem);
      res.send(result);
    })
    //loading the items
    app.get('/item', async (req, res) => {
      const email = req.query.email;
      const query = { email: email }
      const cursor = itemCollection.find(query);
      const item = await cursor.toArray();
      res.send(item);
    })
    //delete item
    app.delete('/item/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemCollection.deleteOne(query);
      res.send(result);
    })


  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Warehouse Management serverd");
});

app.listen(port, () => {
  console.log("Warehouse Management Server- ", port);
});
