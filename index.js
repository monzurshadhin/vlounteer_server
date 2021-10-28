const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2qgnz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


async function run() {
    try {
      await client.connect();
      const database = client.db("volunteerNetwork");
      const serviceCollection = database.collection("services");
      const registerCollection = database.collection("register_event");

      
     

      console.log('db connected successfully');

      
    //   const result = await serviceCollection.insertOne(doc);

      // get all api data 
      app.get('/services',async(req,res)=>{
        // console.log('post hitted');
        const page = req.query.page;
        const size = parseInt(req.query.size);
        const cursor = serviceCollection.find({});
        const count = await cursor.count();
        let services;
        if(page){
            services = await cursor.skip(page*size).limit(size).toArray();
        }
        else{
            services = await cursor.toArray();
        }
        res.send({
            count,
            services
        })
      });

    //   get single service 
    app.get('/details/:id',async(req,res)=>{
        const id = req.params.id;
        // console.log(id);
        const query = {_id:ObjectId(id)};
        const result = await serviceCollection.findOne(query);
        // console.log(result);
        res.send(result);
    })
    // insert registration data 
    app.post('/register',async(req,res)=>{
        const register = req.body;
        const result = await registerCollection.insertOne(register);
        res.json(result);
      })
     
    //   get events by email 
    app.post('/register/events', async(req,res)=>{
        email = req.body.email;
        
        // console.log(typeof email)
        const query = {email:email}
        // console.log(query);
        const appointments = await registerCollection.find(query).toArray();
        // console.log(appointments);
        res.json(appointments)
      })

    //   delete Events 
    app.delete('/event/delete/:id',async(req,res)=>{
        id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await registerCollection.deleteOne(query);
        res.json(result);
    })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Volunteer running");
  });
  app.listen(port, () => {
    console.log("volunteer running on port number:", port);
  });
  