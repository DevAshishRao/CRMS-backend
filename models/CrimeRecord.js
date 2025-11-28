// importing mongoose
import mongoose from 'mongoose';

const crimeSchema = new mongoose.Schema({ 

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        required: true    
    },

    crimeType: {
        type: String,
        required: true,
    },

    criminalName: {
        type: String,
        required: true
    },

    recordType: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    createdAt: {
        type: String,
    }

})

// exporting the schema
const CrimeRecord = mongoose.model('CrimeRecord',crimeSchema);
export default CrimeRecord;