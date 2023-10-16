//Import mongoose
const mongoose = require('mongoose');

//Mongoose to use external db if provided
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Google-books.graphql');

module.exports = mongoose.connection;
