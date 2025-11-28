// importing mongoose
import mongoose from 'mongoose';

const crimeSchema = new mongoose.Schema({ 

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
        type: Date,
    }

})

// exporting the schema
const CrimeRecord = Schema('CrimeRecord',crimeSchema);
export default CrimeRecord;