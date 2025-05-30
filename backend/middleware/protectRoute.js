import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';

const protectRoute = async (req, res, next) => {
    //console.log("Received Token:", req.cookies.jwt);


    try {

        //console.log("Received Token:", req.cookies.jwt);

        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({error : "Unauthorized - No Token Provided"});
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if (!decoded){
            return res.status(401).json({error : "Unauthorized - Invalid Token"})
        }

        const user = await User.findById(decoded.userid).select("-password");
        

        if (!user){
            return res.status(404).json({error : "User Not Found"});
        }

        req.user = user;

        next();


    } catch (error) {
        console.log("Error in protectRoute Middleware", error.message);
        res.status(500).json({error : "Internal Server Error"});
    }
}

export default protectRoute;