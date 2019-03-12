const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
const bcrypt = require('bcrypt-nodejs'); // A native JS bcrypt library for NodeJS

// Validate Function to check e-mail length
let emailLengthChecker = (email) => {
  // Check if e-mail exists
  if (!email) {
    return false; // Return error
  } else {
    // Check the length of e-mail string
    if (email.length < 5 || email.length > 35) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid e-mail
    }
  }
};

// Validate Function to check if valid e-mail format
let validEmailChecker = (email) => {
  // Check if e-mail exists
  if (!email) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid e-mail
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(email); // Return regular expression test results (true or false)
  }
};

// Array of Email Validators
const emailValidators = [
  // First Email Validator
  {
    validator: emailLengthChecker,
    message: 'E-mail debe tener entre 5 y 35 caracteres'
  },
  // Second Email Validator
  {
    validator: validEmailChecker,
    message: 'E-mail NO válido'
  }
];

// Validate Function to check username length
let nameLengthChecker = (name) => {
  // Check if username exists
  if (!name) {
    return false; // Return error
  } else {
    // Check length of username string
    if (name.length < 2 || name.length > 50) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid username
    }
  }
};

// // Validate Function to check if valid username format
// let validName = (name) => {
//   // Check if username exists
//   if (!name) {
//     return false; // Return error
//   } else {
//     // Regular expression to test if username format is valid
//     const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
//     return regExp.test(name); // Return regular expression test result (true or false)
//   }
// };

// Array of Username validators
const nameValidators = [
  // First Username validator
  {
    validator: nameLengthChecker,
    message: 'El nombre debe tener entre 2 y 50 caracteres'
  }
  // // Second username validator
  // {
  //   validator: validName,
  //   message: 'El nombre NO debe tener caracteres especiales'

  // }
];

// Validate Function to check password length
let passwordLengthChecker = (password) => {
  // Check if password exists
  if (!password) {
    return false; // Return error
  } else {
    // Check password length
    if (password.length < 8 || password.length > 35) {
      return false; // Return error if passord length requirement is not met
    } else {
      return true; // Return password as valid
    }
  }
};

// // Validate Function to check if valid password format
// let validPassword = (password) => {
//   // Check if password exists
//   if (!password) {
//     return false; // Return error
//   } else {
//     // Regular Expression to test if password is valid format (uppercase, lowercase and digit)
//     const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d]).{8,35}$/);
//     return regExp.test(password); // Return regular expression test result (true or false)
//   }
// }

// Array of Password validators
const passwordValidators = [
  // First password validator
  {
    validator: passwordLengthChecker,
    message: 'La contraseña debe tener mínimo 8 caracteres'
  },
  // // Second password validator
  // {
  //   validator: validPassword,
  //   message: 'La contraseña debe tener al menos una mayúscula y número(s)'
  // }
];

// User Model Definition
const userSchema = new Schema({
  name: { type: String, required: true, validate: nameValidators },
  email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
  password: { type: String, required: true, validate: passwordValidators },
  provider: { type: String },
  image: { type: String },
  createdAt: { type: Date, required: true, default: Date.now() },
  active: { type: Boolean },
});

// Schema Middleware to Encrypt Password
userSchema.pre('save', function (next) {
  // Ensure password is new or modified before applying encryption
  if (!this.isModified('password'))
    return next();

  // Apply encryption
  bcrypt.hash(this.password, null, null, (err, hash) => {
    if (err) return next(err); // Ensure no errors
    this.password = hash; // Apply encryption to password
    next(); // Exit middleware
  });
});

// Methods to compare password to encrypted password upon login
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password); // Return comparison of login password to password in database (true or false)
};

// Export Module/Schema
module.exports = mongoose.model('User', userSchema, 'users');
