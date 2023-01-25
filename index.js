const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

// middleware 
app.use(cors());
app.use(express.json());

//password:gqQN7dlS9nByl59D
//user: dbuser2


const uri = "mongodb+srv://dbuser2:gqQN7dlS9nByl59D@cluster0.p2sr91x.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollection = client.db('nodeMongoCrud').collection('users')

        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users)

        })
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        })
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result)
        })
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            // const result=await userCollection.us
            const user = req.body;
            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    block: true
                }
            }
            const result = await userCollection.updateOne(filter, updatedUser, option)
            res.send(result);
            console.log(updatedUser);
        })
        app.put('/updateUser/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            // const result=await userCollection.us
            const user = req.body;
            console.log(user)
            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phone: req.body.phone
                }
            }
            const result = await userCollection.updateOne(filter, updatedUser, option)
            res.send(result);
            console.log(updatedUser);
        })
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })
    }
    finally {

    }

}

run().catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('Hello from node mango server')
});
app.listen(port, () => {
    console.log(`Node mongo showing on ${port}`)
})