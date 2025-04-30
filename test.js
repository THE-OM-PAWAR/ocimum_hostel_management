const mongoose = require('mongoose');

const uri = 'mongodb+srv://ompawar1512:ompawar15@ompawar.fytgc14.mongodb.net/ocimum-hostel-management?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('Connection error:', err));
