// importing the required packages here
import express from 'express'
import { body, validationResult} from 'express-validator'

// importing the model & middleware
import fetchUser from '../middleware/fetchuser.js'
import CrimeRecord from '../models/CrimeRecord.js'

const router = express.Router();

// Route 1: Getting the user's record
router.get('/getuserdata',fetchUser,

    async (req,res) => {

        let success = false;

        try{
            const records = await CrimeRecord.find({ user: req.user.id });
            if(!records || records.length == 0) return res.status(400).json({ success, message: "You don't have any record created !"});

            success = true;
            return res.json({ success, records });

        } catch(error) {
            console.error(error.message);
            return res.status(500).send("Some error occured from server side !");
        }

    }

)

// Route 2: Creating a user's record
router.post('/createrecord',fetchUser,[

    body('title',"You must need to provide a title !").notEmpty(),
    body('description',"Description must be of at least 15 words !").isLength({ min: 20 }),
    body('status',"Status must have some values !").notEmpty(),
    body('criminalType',"Crime type must be having some category !").notEmpty(),
    body('criminalName',"Criminal must be having some name !").notEmpty(),
    body('recordType','Record must have a type either public or private !').notEmpty(),
    body('location',"Crime Location must exists !").notEmpty()

],  async (req,res) => {

        let success = false;

        try {
            
            const { title, description, status, crimeType, criminalName, recordType, location } = req.body;

            if( !title || !description || !status || !crimeType || !criminalName || !recordType || !location) {
                return res.status(400).json({ success, message: "One or more fields are missing !" })
            }

            // creating the record
            const record = new CrimeRecord({
                user: req.user.id,
                title,
                description,
                status,
                crimeType,
                criminalName,
                recordType,
                location,
                createdAt: Date.now()
            })
            
            // saving the record
            const savedRecord = await record.save();
            success = true;
            res.json({ success, savedRecord });

        } catch(error) {
            console.error(error.message);
            return res.status(500).send("Some error occured from server side !");
        }

    }

)

// Route 3: Updating route for user's records
router.post('/updaterecord/:id',fetchUser,

    async (req,res) => {

        let success = false;

        try{

            let record = await CrimeRecord.findById(req.params.id);
            if(!record) return res.status(400).json({ success, message: "Crime Record not found !" });
            if(req.user.id !== record.user.toString()) return res.status(400).json({ success, message: "Your're trying to access another user's Record !" });

            // fetching data, in its proper format
            const { title, description, status, crimeType, criminalName, recordType, location } = req.body;
            const newRecord = {};

            if( !title || !description || !status || !crimeType || !criminalName || !recordType || !location) {
                return res.status(400).json({ success, message: "One or more fields are missing !" })
            }

            // adding data to new record
            if(title && description && status && crimeType && criminalName && recordType && location) {
                newRecord.title = title;
                newRecord.description = description;
                newRecord.status = status;
                newRecord.crimeType = crimeType;
                newRecord.criminalName = criminalName;
                newRecord.recordType = recordType;
                newRecord.location = location;
                newRecord.createdAt = Date.now();
            }

            // updating data of old record
            record = await CrimeRecord.findByIdAndUpdate(req.params.id,{$set: newRecord},{new: true});
            success = true;
            res.json({ success, record });

        } catch(error) {
            console.error(error.message);
            return res.status(500).send("Some error occured from server side !");
        }

    }

)

// Route 4: Deleting a particular record
router.delete('/deleterecord/:id',fetchUser,

    async(req,res) => {

        let success = false;

        try{

            let record = await CrimeRecord.findById(req.params.id);
            if(!record) return res.status(400).json({ success, message: "Crime Record not found !" });
            if(req.user.id !== record.user.toString()) return res.status(400).json({ success, message: "Your're trying to access another user's Record !" });

            record = await CrimeRecord.findByIdAndDelete(req.params.id);
            success = true;
            res.json({ success, message: "Crime Record deleted Successfully !" });

        } catch(error) {
            console.error(error.message);
            return res.status(500).send("Some error occured from server side !");
        }

    }

)

// Route 5: Getting all records that are available as public
router.get('/publicrecords',

    async(req,res) => {

        let success = false;

        try{

            // finding records those are public
            const records = await CrimeRecord.find({ recordType: "public" });
            if(!records || records.length == 0) return res.status(200).json({ success, records: [] });

            success = true;
            res.json({ success, records });             // sending available public records

        } catch(error){
            console.error(error.message);
            return res.status(500).send("Some error occured from server side !");
        }

    }

)

export default router;