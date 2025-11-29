// importing the required modules
import express from 'express';
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// importing the required models
import User from '../models/User.js';

// importing the middleware
import fetchUser from '../middleware/fetchuser.js'

// jwt secret string
const JWT_STRING = "WebTokenStringSecure";

// using express router for creating routes
const router = express.Router();

// Route 1 : Creating a user
router.post('/createuser',[

    // validation incoming data
    body('username','Please use minimum 8 character in username with alphanumeric values !').isLength({min: 8}).isLength({min: 8}).isAlphanumeric(),
    body('fullName','You must provide yourname for accessing and adding data records !').notEmpty(),
    body('email','Email must be valide containing its proper format !').isEmail(),
    body('password','Password must be of min 8 characters, with Strong Efficiency !').isStrongPassword().isLength({ min: 8 })

], async (req,res) => {

    let success = false;                // regarding frontend validation
    const result = validationResult(req);

    // using rules of validation result
    if(!result.isEmpty()) return res.status(400).json({ result: result.array() });

    // checking further user existence
    try{

        let user = await User.findOne({ email: req.body.email });
        if(user) return res.status(400).send({ success ,message: "Warning : A user with this email already exists !" });

        // salting/securing the password
        const salt = bcrypt.genSaltSync(10);
        let securepass = await bcrypt.hash(req.body.password,salt);

        // creating user json to be stored
        user = await User.create({
            username: req.body.username,
            fullName: req.body.fullName,
            email: req.body.email,
            password: securepass,
            category: req.body.category,
            createdAt: Date.now()
        })

        // storing the data
        const data = {
            user: {id: user.id}
        }

        // sending jwttoken at frontend
        const jwtToken = jwt.sign(data,JWT_STRING);
        success = true;
        return res.json({ success, jwtToken });

    } catch(error){

        console.error(error.message);
        return res.status(500).send("Some error occured from server side !");

    }

})

// Route 2 : User Login session
router.post('/login',[

    // validation for incoming data
    body('email','Please enter already registered emails only!').isEmail(),
    body('password','You need to enter the password that already exists !').exists()

], async (req,res) => {

    let success = false;
    const result = validationResult(req);

    // checking if the result isn't empty
    if(!result.isEmpty()) return res.status(400).json({ result: result.array() });

    // fetching the email and password
    const {email,password} = req.body;                  // destructuring the data

    // checking the validation using try and catch
    try{

        let user = await User.findOne({email});
        if(!user) return res.status(400).json({ success, message : "Email doesn't exists !" });

        const userPasswordComparision = await bcrypt.compare(password,user.password);
        if(!userPasswordComparision) return res.status(400).json({ success, message : "Password you entered is wrong !" });

        const data = {
            user : { id: user.id }
        }

        // reframing the jwtToken
        const jwtToken = jwt.sign(data,JWT_STRING);
        success = true;
        res.json({ success, jwtToken })

    } catch(error) {
        console.error(error.message);
        return res.status(500).send("Some error occured from server side !");
    }

})

// Route 3 : Fetching user's details
router.post('/getuser',fetchUser,
    async(req,res,) => {
        
        let success = false;

        try{

            const userID = req.user.id;
            let user = await User.findById(userID).select("-password");
            if(!user) return res.status(400).json({ success, message: "User doesn't exists please create an account first !" });

            // user exists sendig user's details
            success = true;
            res.json({ success, user });
 
        } catch(error){
            console.error(error.message);
            return res.send(500).send("Some error occured from server side !");
        }

    }
)

// Route 4 : Deleting an account of Exisiting User
router.delete('/deleteuser',fetchUser,

    async (req,res) => {

        let success = false;

        try {

            let user = await User.findById(req.user.id);
            if(!user) return res.status(400).json({ success, message: "User doesn't exists, please create an account first !" });

            user = await User.findByIdAndDelete(req.user.id);
            success = true;
            res.json({ success, message: "User Account deleted Successfully !" });
            
        } catch(error) {
            console.error(error.message);
            return res.status(500).send("Some error occured from server side !");
        }

    }

)

export default router;