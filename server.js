const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

const uri = "mongodb+srv://nanthu1717:Nanthu%401978@reactdb.fsk2nnq.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=ReactDB";

app.use(bodyParser.json());
app.use(cors());

MongoClient.connect(uri)
  .then(client => {
    console.log('Connected to Database');
    const db = client.db('SampleDB');
    const collection = db.collection('Data');

    // CREATE
    app.post('/items', async (req, res) => {
      try {
        const result = await collection.insertOne(req.body);
        res.status(201).json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });

    // READ
    app.get('/items', async (req, res) => {
      try {
        const items = await collection.find().toArray();
        res.status(200).json(items);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });

    // UPDATE
    app.put('/items/:id', async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: 'Invalid ID format' });
        }
        console.log(`Updating item with id: ${id}`);
        const updatedItem = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: req.body }
        );
        if (updatedItem.matchedCount === 0) {
          res.status(404).json({ error: 'Item not found' });
        } else {
          res.status(200).json(updatedItem);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });

    // DELETE
    app.delete('/items/:id', async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: 'Invalid ID format' });
        }
        console.log(`Deleting item with id: ${id}`);
        const deletedItem = await collection.deleteOne({ _id: new ObjectId(id) });
        if (deletedItem.deletedCount === 0) {
          res.status(404).json({ error: 'Item not found' });
        } else {
          res.status(200).json(deletedItem);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(error => console.error(error));
