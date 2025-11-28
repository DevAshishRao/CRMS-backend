// importing mongoose
import mongoose from 'mongoose';

// defining user schema
const userSchema = new mongoose.Schema({

    username: {
        type: String,
        unique: true,
        required: true
    },

    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        unique: true
    },

    category: {
        type: String
    },

    createdAt: {
        type: String,
        requried: true,
    }

})

// exporting the model
const User = mongoose.model('User',userSchema);
export default User;