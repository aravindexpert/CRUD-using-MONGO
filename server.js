const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { Schema } = mongoose;

// MongoDB connection configuration
mongoose.connect('mongodb://localhost:27017/crud', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dataSchema = new Schema({
  name: String,
  email: String,
  timestamp: { type: Date, default: Date.now },
});

const Data = mongoose.model('Data', dataSchema);

app.use(express.static('public'));
app.use(express.json());

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route for fetching all data from the database
app.get('/data', async (req, res) => {
  try {
    const data = await Data.find({});
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data from the server');
  }
});

// Route for creating a new record
app.post('/data', async (req, res) => {
  const { name, email } = req.body;

  // Check if 'name' and 'email' values are not empty or null
  if (!name || !email) {
    console.error('Error: Name and email cannot be empty');
    res.status(400).send('Name and email cannot be empty');
    return;
  }

  try {
    const newData = await Data.create({ name, email });
    console.log('Data inserted successfully:', newData);
    res.json(newData);
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).send('Error creating record');
  }
});

// Route for updating a record
app.put('/data/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  // Check if 'name' and 'email' values are not empty or null
  if (!name || !email) {
    console.error('Error: Name and email cannot be empty');
    res.status(400).send('Name and email cannot be empty');
    return;
  }

  try {
    const updatedData = await Data.findByIdAndUpdate(id, { name, email }, { new: true });
    console.log('Data updated successfully:', updatedData);
    res.json(updatedData);
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).send('Error updating data');
  }
});

// Route for deleting a record
app.delete('/data/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Data.findByIdAndDelete(id);
    console.log('Data deleted successfully');
    res.send('Data deleted successfully');
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).send('Error deleting data');
  }
});

// Start the server
const port = 3006;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
