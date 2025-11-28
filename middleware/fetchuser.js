// importing the required module
import jwt from 'jsonwebtoken';

// jwt secret string
const JWT_STRING = "WebTokenStringSecure";

// method/function for authentication
const fetchUser = (req,res,next) => {

    // json format
    const token = req.header('auth-token');
    if(!token) return res.status(401).send({ error : "Please authenticate using a validate token !" });             // if token doesn't exist

    try {
        const verifiedString = jwt.verify(token,JWT_STRING);
        req.user = verifiedString.user;

        next();         // moving forward for further data transfer

    } catch(error){
        res.status(401).send({ error : "Please authenticate using a valid token !" });
    }

}

// exporting the function
export default fetchUser;