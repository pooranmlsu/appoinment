const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const authRoutes = require('./routes/auth');
require('dotenv').config(); 

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);

mongoose.connect('mongodb://localhost:27017/appoinmentProject', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((error) => console.log('MongoDB connection error:', error));

app.get('/', (req, res) => {
  res.send('Doctor Appointment App Backend');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
