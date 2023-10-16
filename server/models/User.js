const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// import schema from Book.js
const bookSchema = require('./Book');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    // Sets savedBooks to be an array of data that adheres to the bookSchema
    savedBooks: [bookSchema],
  },
  // Sets this to use virtual below
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Hashs User password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

/*This code uses Mongoose middleware (pre('save', ...)) to hash the user's password before saving it to the database. 
It checks if the password is new or has been modified (using this.isNew and this.isModified('password')). If it's new or modified,
it hashes the password using the bcrypt library before saving it.

*/

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

/*
This code defines a custom method isCorrectPassword for the user schema. When called, it compares a plain-text password (passed as an argument) 
with the hashed password stored in the user document. It returns a boolean indicating whether the passwords match.
*/

userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});

/*
Mongoose virtual (userSchema.virtual(...)) is used to create a computed property bookCount for the user schema.
When querying a user from the database, this virtual field calculates the number of saved books
 (this.savedBooks.length) and returns it as a part of the user object. 

*/

const User = model('User', userSchema);

module.exports = User;
