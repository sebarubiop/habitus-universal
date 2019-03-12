import * as express from 'express'
import * as jwt from 'jsonwebtoken'
import { 
    allUsers,
    singleUser,
    register,
    login,
    checkEmail,
    me,
    me2,
    updateUser,
} from './auth'

export const router = express.Router();

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
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
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

router.get('/', (req, res) => { res.send('From ApI route') })

router.get('/users', (req, res) => { allUsers(req,res)})
router.get('/user/:id', verifyToken, (req, res) => { singleUser(req,res)})
router.post('/register', (req, res) => { register(req,res)})
router.post('/login', (req, res) => { login(req,res)})
router.get('/checkEmail/:email', (req, res) => { checkEmail(req,res)})
router.get('/me', verifyToken, (req, res) => { me(req,res)})
router.get('/me2', verifyToken, (req, res) => { me2(req,res)})
router.put('/updateuser/:id', verifyToken, (req, res) => { updateUser(req,res)})