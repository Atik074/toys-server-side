const express = require('express') 
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express() 
const port = process.env.PORT || 5000 ;

// midleWare
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.flztkm6.mongodb.net/?retryWrites=true&w=majority`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



 async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
   //  client.connect();

  const toysCollection = client.db('AlltoysDB').collection('toys') 

  // order datebase store in mongodb 
  const orderCollection = client.db('AlltoysDB').collection('orders') 



// add a toys in mongodb
 app.post("/alltoys" , async (req, res)=>{
         const toyDetails =  req.body 
         const result = await toysCollection.insertOne(toyDetails)
        res.json(result)
            })

  app.get("/alltoys" , async (req , res)=>{
      const result = await  toysCollection.find().toArray()
     res.json(result)
   })

   
   app.get("/alltoys/:id" , async ( req, res)=>{
      const id = req.params 
      const query = {_id : new ObjectId(id)} 
  
      const result = await toysCollection.findOne(query) 
     res.json(result)
   }) 

// order data create

app.post("/orders" , async ( req ,res)=>{
   const order = req.body 
    const result = await orderCollection.insertOne(order) 
    res.json(result)

})

// get order data by email
app.get("/orders", async (req , res)=>{ 

   let query = {} 
   if(req.query?.email){
      query = {email: req.query.email}
   }
  
 const result = await orderCollection.find(query).toArray() 
 res.json(result)

})

// get order data by id
app.get("/orders/:id" , async ( req, res)=>{
   const id = req.params 
   const query = {_id : new ObjectId(id)} 
   const result = await orderCollection.findOne(query) 
  res.json(result)
}) 

// update order data 
app.put("/orders/:id" ,async(req,res)=>{
    const id = req.params.id 
    const orderData = req.body 
     const filter = {_id : new ObjectId(id)}
     const options = {upsert : true}
     const updateDoc= {
      $set: {
         toyName : orderData.toyName,
         name:orderData.name,
          email:  orderData.email,
           category: orderData.category, 
           quantity : orderData.quantity,
           rating: orderData.rating,
           price:  orderData.price ,
          img:  orderData.img ,
          deatails: orderData.details ,
         
      },
    };

   const result = await orderCollection.updateOne(filter ,updateDoc ,options)
  res.json(result)
})
 

// delete order data
app.delete("/orders/:id" , async (req , res)=>{
   const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await orderCollection.deleteOne(query);
   res.json(result);

 
 }) 


    // Send a ping to confirm a successful connection
     await  client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   //    client.close();
  }
}
run()





app.get('/' ,async(req,res)=>{
  res.send('Hellow Toy Server')
})

app.listen(port , ()=>{
   console.log(`server runnig on port ${port}`)
})