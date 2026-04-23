const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Connect Database
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.error(err.message));

// Define Routes
app.get('/', (req, res) => res.send('Backend API is running successfully!'));
app.use('/api', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
