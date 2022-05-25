const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const res = require("express/lib/response");
const { decode } = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//connect mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@manufacturer.lk3jy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//jwt middleware
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: 'UnAuthorized access' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access' })
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("manufacture").collection("products");
    const orderCollection = client.db("manufacture").collection("order");
    const userCollection = client.db("manufacture").collection("user");
    const reviewCollection = client.db("manufacture").collection("reveiw");

    const verifyAdmin = async (req, res, next) => {
      const requester = req.decoded.email;
      const requesterAccount = await userCollection.findOne({ email: requester });
      if (requesterAccount.role === 'admin') {
        next();
      }
      else {
        res.status(403).send({ message: 'forbidden' });
      }
    }

    app.get("/product", async (req, res) => {
      const query = {};
      const result = await productCollection.find(query).toArray();
      res.send(result);
    });

    //loading one product
    app.get("/product/:id",verifyJWT, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });

    //adding product
    app.post('/product', verifyJWT, verifyAdmin, async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });


    //*USER

    //Load user

    app.get('/user', verifyJWT, async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });

    //*ADMIN
    
    //LOad ADMIN
    app.get('/admin/:email', verifyJWT, async (req, res) => {
      const email = req.params.email;
      const query={email:email}
      const user = await userCollection.findOne({ email: email });
      const isAdmin = user.role === 'admin';
      res.send({admin:isAdmin})
    })

    // Make Admin
    app.put('/user/admin/:email', verifyJWT,verifyAdmin, async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const updateDoc = {
        $set: { role: 'admin' },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    })


    //*genrateing jwt token and add user
    app.put('/user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email }
      const options = { upsert: true };
      const updateDoc = {
        $set:user,
      }
      const result = await userCollection.updateOne(filter, updateDoc, options);

      const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5d' })
      res.send({result,token})

    })


    // *Order
    //adding order
    app.post('/order', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result)
    })

    //Loading orders
    app.get('/order',verifyJWT, async (req, res) => {
      const email = req.query.email;
      const decodedEmail = req.decoded.email;
      if (email === decodedEmail) {
        const query = { email: email };
        const orders = await orderCollection.find(query).toArray();
        return res.send(orders)
      }
      const orders = await orderCollection.find().toArray();
      res.send(orders)
    })
    
    //* Review
    //add review
    app.post('/review',  async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result)
    })
    //load reviews
    app.get('/review', async (req, res) => {
      const reviews = await reviewCollection.find().toArray();
      res.send(reviews);
    })

    


  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From the smart manufacturer");
});

app.listen(port, () => {
  console.log(`Manufacturer listening on port ${port}`);
});
