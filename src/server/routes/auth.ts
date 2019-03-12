import * as jwt from 'jsonwebtoken'

import { User } from '../models/user'

export async function allUsers(req, res) {
  try {
    const users = await User.find()
      .sort({ '_id': -1 }); // Sort ofertas from newest to oldest
    // Check if error was found or not
    if (users)
      res.json({ success: true, value: users }); // Return success and users array
    else
      res.json({ success: false, message: 'NO se encuentran users.' }); // Return error of no users found
  } catch (error) {
    res.json({ success: false, message: error })
  }
}

export function register(req, res) {
  if (!req.body.email)
    res.json({ success: false, message: 'Debe proporcionar un e-mail' }); // Return error
  else if (!req.body.name)
    res.json({ success: false, message: 'Debe proporcionar un nombre' }); // Return error
  else if (!req.body.password)
    res.json({ success: false, message: 'Debe proporcionar una contraseña' }); // Return error
  else {
    let user
    if (!req.body.provider)
      user = new User({
        email: req.body.email.toLowerCase(),
        name: req.body.name,
        password: req.body.password
      });
    else // User from social login
      user = new User({
        email: req.body.email.toLowerCase(),
        name: req.body.name,
        password: req.body.password,
        provider: req.body.provider,
        image: req.body.image
      });
    // Save user to database
    user.save((err) => {
      // Check if error occured
      if (err) {
        // Check if error is an error indicating duplicate account
        if (err.code === 11000) {
          res.json({ success: false, message: 'Usuario ya existe' }); // Return error
        } else if (err.errors) {
          // Check if validation error is in the email field
          if (err.errors.email)
            res.json({ success: false, message: err.errors.email.message }); // Return error
          else if (err.errors.name)
            res.json({ success: false, message: err.errors.name.message }); // Return error
          else if (err.errors.password)
            res.json({ success: false, message: err.errors.password.message }); // Return error
          else
            res.json({ success: false, message: err }); // Return any other error not already covered
        } else {
          res.json({ success: false, message: 'No se pudo guardar el usuario. Error: ' + err }); // Return error if not related to validation
        }
      } else {
        res.json({ success: true, message: 'Cuenta creada!' }); // Return success
      }
    })
  }
}

/* ============================================================
   Route to check if user's email is available for registration
============================================================ */
export async function checkEmail(req, res) {
  if (!req.params.email) {
    res.json({ success: false, message: 'No e-mail' }); // Return error
  } else {
    try {
      const user = await User.findOne({ email: req.params.email })
      if (user)
        res.json({ success: false, message: 'E-mail NO disponible' }); // Return as taken e-mail
      else
        res.json({ success: true, message: 'E-mail disponible' }); // Return as available e-mail
    } catch (error) {
      res.json({ success: false, message: error })
    }
  }
}

export async function login(req, res) {
  if (!req.body.email)
    res.json({ success: false, message: 'Debe proporcionar un e-mail' }); // Return error
  else if (!req.body.password)
    res.json({ success: false, message: 'Debe proporcionar una contraseña' }); // Return error
  else {
    try {
      // Check if username exists in database
      const user = await User.findOne({ email: req.body.email })
      // Check if error was found
      if (user) {
        const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
        // Check if password is a match
        if (!validPassword)
          res.json({ success: false, message: 'Contraseña inválida' }); // Return error
        else {
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Create a token for client
          res.json({
            success: true,
            message: '¡Bienvenido a Partner-7!',
            token: token,
            value: { _id: user._id, email: user.email, image: user.image, name: user.name }
          }) // Return success and token to frontend
        }
      }
      else
        res.json({ success: false, message: 'No se encuentra el usuario' }); // Return error
    } catch (error) {
      res.json({ success: false, message: error })
    }
  }
}

export async function me(req, res) {
  if (!req.decoded.userId)
    res.json({ success: false, message: 'NO token on request' })
  else {
    try {
      const user = await User.findOne({ _id: req.decoded.userId })
        .select('-salt -password')
      if (user)
        res.json({ success: true, value: user }); // Return success message
      else
        res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
    } catch (error) {
      res.json({ success: false, message: error })
    }
  }
}

export async function me2(req, res) {
  if (!req.query.email)
    res.json({ success: false, message: 'NO email' })
  else if (!req.query.userId)
    res.json({ success: false, message: 'NO user id' })
  else {
    try {
      const user = await User.findOne({ _id: req.query.userId, email: req.query.email })
        .select('-salt -password')
      if (user)
        res.json({ success: true, value: user }); // Return success message
      else
        res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
    } catch (error) {
      res.json({ success: false, message: error })
    }
  }
}

export function updateUser (req, res) {
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

export function singleUser (req, res) {
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