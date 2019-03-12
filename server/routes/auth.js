
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const config = require('../config/database'); // Mongoose Config

exports.allUsers = function (req, res) {
  // Search database for all users
  User.find({}, (err, users) => {
    // Check if error was found or not
    if (err) {
      res.json({ success: false, message: err }); // Return error message
    } else {
      // Check if users were found in database
      if (!users) {
        res.json({ success: false, message: 'NO se encuentran users.' }); // Return error of no users found
      } else {
        res.json({ success: true, value: users }); // Return success and users array
      }
    }
  })
    .sort({ '_id': -1 }); // Sort ofertas from newest to oldest
};

exports.register = function (req, res) {
  // Check if email was provided
  if (!req.body.email) {
    res.json({ success: false, message: 'Debe proporcionar un e-mail' }); // Return error
  } else {
    // Check if username was provided
    if (!req.body.name) {
      res.json({ success: false, message: 'Debe proporcionar un nombre' }); // Return error
    } else {
      // Check if password was provided
      if (!req.body.password) {
        res.json({ success: false, message: 'Debe proporcionar una contraseña' }); // Return error
      } else {
        let user
        if (!req.body.provider) {
          // Create new user object and apply user input
          user = new User({
            email: req.body.email.toLowerCase(),
            name: req.body.name,
            password: req.body.password
          });
        } else {
          user = new User({
            email: req.body.email.toLowerCase(),
            name: req.body.name,
            password: req.body.password,
            provider: req.body.provider,
            image: req.body.image
          });
        }

        // Save user to database
        user.save((err) => {
          // Check if error occured
          if (err) {
            // Check if error is an error indicating duplicate account
            if (err.code === 11000) {
              res.json({ success: false, message: 'Usuario ya existe' }); // Return error
            } else {
              // Check if error is a validation rror
              if (err.errors) {
                // Check if validation error is in the email field
                if (err.errors.email) {
                  res.json({ success: false, message: err.errors.email.message }); // Return error
                } else {
                  // Check if validation error is in the username field
                  if (err.errors.name) {
                    res.json({ success: false, message: err.errors.name.message }); // Return error
                  } else {
                    // Check if validation error is in the password field
                    if (err.errors.password) {
                      res.json({ success: false, message: err.errors.password.message }); // Return error
                    } else {
                      res.json({ success: false, message: err }); // Return any other error not already covered
                    }
                  }
                }
              } else {
                res.json({ success: false, message: 'No se pudo guardar el usuario. Error: ' + err }); // Return error if not related to validation
              }
            }
          } else {
            res.json({ success: true, message: 'Cuenta creada!' }); // Return success
          }
        });
      }
    }
  }

}

/* ============================================================
   Route to check if user's email is available for registration
============================================================ */
exports.checkEmail = function (req, res) {
  // Check if email was provided in paramaters
  if (!req.params.email) {
    res.json({ success: false, message: 'No e-mail' }); // Return error
  } else {
    // Search for user's e-mail in database;
    User.findOne({ email: req.params.email }, (err, user) => {
      if (err) {
        res.json({ success: false, message: err }); // Return connection error
      } else {
        // Check if user's e-mail is taken
        if (user) {
          res.json({ success: false, message: 'E-mail NO disponible' }); // Return as taken e-mail
        } else {
          res.json({ success: true, message: 'E-mail disponible' }); // Return as available e-mail
        }
      }
    });
  }
};

exports.login = function (req, res) {

  // Check if email was provided
  if (!req.body.email) {
    res.json({ success: false, message: 'Debe proporcionar un e-mail' }); // Return error
  } else {
    // Check if password was provided
    if (!req.body.password) {
      res.json({ success: false, message: 'Debe proporcionar una contraseña' }); // Return error
    } else {
      // Check if username exists in database
      User.findOne({ email: req.body.email }, (err, user) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: err }); // Return error
        } else {
          // Check if username was found
          if (!user) {
            res.json({ success: false, message: 'No se encuentra el usuario' }); // Return error
          } else {
            const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
            // Check if password is a match
            if (!validPassword) {
              res.json({ success: false, message: 'Contraseña inválida' }); // Return error
            } else {
              const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' }); // Create a token for client

              res.json({
                success: true,
                message: 'Bienvenido a Hazlo por mi!',
                token: token,
                value: { _id: user._id, email: user.email, image: user.image, name: user.name }
              }); // Return success and token to frontend
            }
          }
        }
      })
    }
  }
}

exports.me = function (req, res) {
  if (!req.decoded.userId) {
    res.json({ success: false, message: 'NO token on request' })
  }
  User.findOne({ _id: req.decoded.userId }, (err, user) => {
    // Check if error was found
    if (err) {
      res.json({ success: false, message: err }); // Return error message
    } else {
      // Check if user's id was found in database
      if (!user) {
        res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
      } else {
        // Return authenticated user
        res.json({ success: true, value: user }); // Return success message
      }
    }
  }).select('-salt -password')
}

exports.me2 = function (req, res) {
  if (!req.query.email) {
    res.json({ success: false, message: 'NO email' })
  } else if (!req.query.userId) {
    res.json({ success: false, message: 'NO user id' })
  } else {
    User.findOne({ _id: req.query.userId, email:  req.query.email}, (err, user) => {
      // Check if error was found
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if user's id was found in database
        if (!user) {
          res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
        } else {
          // Return authenticated user
          res.json({ success: true, value: user }); // Return success message
        }
      }
    }).select('-salt -password')
  }
}

exports.updateUser = function (req, res) {
  // Check if id is present in parameters
  if (!req.params.id) {
    res.json({ success: false, message: 'ID no fue provisto.' }); // Return error message
  } else {
    User.updateOne({ _id: req.params.id }, req.body, (err, raw) => {
      if (err) {
        res.json({ success: false, message: 'Update Error: ' + err }); // Return error message
      } else {
        res.json({ success: true, value: raw }); // Return success
      }
    })
  }
}

exports.singleUser = function (req, res) {
  // Check if id is present in parameters
  if (!req.params.id) {
    res.json({ success: false, message: 'ID no fue provisto.' }); // Return error message
  } else {
    // Check if the user id is found in database
    User.findOne({ _id: req.params.id }, (err, user) => {
      // Check if the id is a valid ID
      if (err) {
        res.json({ success: false, message: 'Error: ' + err }); // Return error message
      } else {
        // Check if user was found by id
        if (!user) {
          res.json({ success: false, message: 'No se ha encontrado user' }); // Return error message
        } else {
          res.json({ success: true, value: user }); // Return success
        }
      }
    })
  }
}