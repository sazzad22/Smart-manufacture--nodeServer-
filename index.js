const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const app = express();


const port = process.env.PORT || 5000;
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const dbConnect = require("./utils/dbConnect");
const routerProduct = require("./routes/v1/products.route");
const routerProduct2 = require("./routes/v2/products2.route");
const routerOrder = require("./routes/v2/order.route");
const routerUser = require("./routes/v2/user.route");
const viewCount = require("./middleware/viewCount");
const errorHandler = require("./middleware/errorHandler");
const { connectToServer } = require("./utils/dbConnect");




//middleware
app.use(cors());
app.use(express.json());

// app.use(viewCount);

//*connect mongoDB
connectToServer((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log(`Manufacturer listening on port ${port}`);
    
    });
  } else {
    console.log(err);
  }
})

//app using the routes
app.use('/api/v1/product', routerProduct);
app.use('/api/v2/product', routerProduct2);
app.use('/api/v2/order', routerOrder);
app.use('/api/v2/user', routerUser);


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
};




async function run() {
  try {
    // await client.connect();
    // const productCollection = client.db("manufacture").collection("products");
    // const orderCollection = client.db("manufacture").collection("order");
    // const userCollection = client.db("manufacture").collection("user");
    // const reviewCollection = client.db("manufacture").collection("reveiw");
    // const paymentCollection = client.db("manufacture").collection("payment");

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

    //* Payment
    app.post('/create-payment-intent', verifyJWT, async (req, res) => {
      const order = req.body;
      const price = order.price;
      const amount = price * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        payment_method_types: ['card']
      });
      res.send({ clientSecret: paymentIntent.client_secret })
    });

    // updating order info and storing payment info on db
    app.patch('/order/:id', verifyJWT, async (req, res) => {
      const id = req.params.id;
      const payment = req.body;
      const filter = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          paid: true,
          transactionId: payment.transactionId
        }
      }

      const result = await paymentCollection.insertOne(payment);
      const updatedBooking = await orderCollection.updateOne(filter, updatedDoc);
      res.send(updatedBooking);
    })

    // * Product

    app.get("/product", async (req, res) => {
      const query = {};
      const result = await productCollection.find(query).toArray();
      res.send(result);
    });

    //loading one product
    app.get("/product/:id", verifyJWT, async (req, res) => {
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

    // DELeting Product
    app.delete('/product/:id', verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query)
      res.send(result)
    })


    //*USER

    //Load user

    app.get('/user', verifyJWT, async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });

    //LOad One user
    app.get('/user/:email', verifyJWT, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const client = await userCollection.findOne(query);
      res.send(client)
    })

    //update user
    app.put("user/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const updatedClient = req.body;
      const filter = { email: email };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          education: updatedClient.education,
          location: updatedClient.location,
          phone: updatedClient.phone,
          profileLine: updatedClient.location,
        },
      }
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result)

    })

    //*ADMIN    
    //LOad ADMIN
    app.get('/admin/:email', verifyJWT, async (req, res) => {
      const email = req.params.email;
      const query = { email: email }
      const user = await userCollection.findOne({ email: email });
      const isAdmin = user.role === 'admin';
      res.send({ admin: isAdmin })
    })

    // Make Admin
    app.put('/user/admin/:email', verifyJWT, verifyAdmin, async (req, res) => {
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
        $set: user,
      }
      const result = await userCollection.updateOne(filter, updateDoc, options);

      const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5d' })
      res.send({ result, token })

    })


    // *Order
    //adding order
    app.post('/order', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result)
    })

    

    //Loading orders
    app.get('/order', verifyJWT, async (req, res) => {
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

    //Load Order by ID
    app.get('/order/:id', verifyJWT, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const order = await orderCollection.findOne(query);
      res.send(order);
    })

    // Delete order
    app.delete('/order/:id', verifyJWT, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query)
      res.send(result)
    })
    
    //* Review
    //add review
    app.post('/review', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result)
    })
    //load reviews
    app.get('/review', async (req, res) => {
      const reviews = await reviewCollection.find().toArray();
      res.send(reviews);
    })
  }
  finally {
    
  }
}
// run().catch(console.dir)

    app.get("/", (req, res) => {

      res.send("Hello From the smart manufacturer");
    });


app.all("*", (req, res) => {
  res.send('NO Routes Found.');
});

//Error Handler - express default - next prameter makes program to call the next middleware which is the line below, an error handler.It catch all the error from all route controllers.
app.use(errorHandler);


//Global Error handler - if error, app closes
process.on("unhandledRejection", (error) => {
  console.log(error.name, error.message);
  app.close(() => {
    process.exit(1);
  });
});
  
