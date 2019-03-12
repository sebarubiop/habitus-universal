const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')

const config = require('../config/database'); // Mongoose Config
const authController = require('./auth');

mongoose.connect(config.uri, err => {
    if (err) {
        console.error('Error! ', err)
    } else {
        console.log('Connected to mongodb: ', config.db)
    }
})

/* ================================================
 MIDDLEWARE - Used to grab user's token from headers
 ================================================ */
function verifyToken(req, res, next) {
    // const token = req.headers['authorization']; // Create token found in headers
    // // Check if token was found in headers
    // if (!token) {
    //   res.json({ success: false, message: 'No token provided' }); // Return error
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request - not headers authorization')
    }
    const token = req.headers.authorization.split(' ')[1]
    if (token === 'null') {
        return res.status(401).send('Unauthorized request - not token')

    } else {
        // Verify the token is valid
        jwt.verify(token, config.secret, (err, decoded) => {
            // Check if error is expired or invalid
            if (err) {
                res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
            } else {
                req.decoded = decoded; // Create global variable to use in any request beyond
                next(); // Exit middleware
            }
        });
    }
}

router.get('/', (req, res) => {
    res.send('From ApI route')
})

router.get('/users', verifyToken, authController.allUsers)
router.get('/user/:id', verifyToken, authController.singleUser)
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/checkEmail/:email', authController.checkEmail)
router.get('/me', verifyToken, authController.me)
router.get('/me2', verifyToken, authController.me2)
router.put('/updateuser/:id', verifyToken, authController.updateUser)

module.exports = router