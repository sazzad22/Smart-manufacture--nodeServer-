const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//connect mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@manufacturer.lk3jy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    
    await client.connect();
    const productCollection = client.db('manufacture').collection('products');
    
    app.get('/product', async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result)
    })




  }
  finally {
    
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello From the smart manufacturer')
  })
  
  app.listen(port, () => {
    console.log(`Manufacturer listening on port ${port}`)
  })
