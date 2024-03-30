const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri =
    'mongodb+srv://mongo_practice:xdO6HO2fY7bG6bFk@cluster0.q0gttvx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        await client.connect();

        const DB = client.db('Mongo_Practice');
        const userCollection = DB.collection('users');

        // get all data from database
        app.get('/api/v1/users', async (req, res) => {
            const users = await userCollection.find().toArray();
            if (!users) {
                return res.status(404).send({ message: 'Data not found' });
            }
            else {
                return res.send(users);
            }
        })

        // save single data in database
        app.post('/api/v1/users/createUser', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);

            if (!result) {
                return res.status(404).send({ message: 'Data not found' });
            }
            else {
                return res.send(result);
            }
        })


        await client.db('admin').command({ ping: 1 });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } finally {
        // Ensure to close the client when done
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello CRUD APPLICATION');
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
