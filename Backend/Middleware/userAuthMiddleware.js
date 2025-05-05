
import jwt from 'jsonwebtoken';

import {errorHelper} from '../Helper/globalHelper.js'
import UserModel from '../Module/UserModule.js'

const userAuthMiddleware=(req, res, next)=>{
    
        const token = req.headers['authorization'];

        // console.log("Request header ==> ",req.headers);

        try{

            if(!token){
                return (errorHelper(res,{message:"Not Authenticated", status:401}));
            }
            
            const jwtPrivateKey=process.env.SECREAT_KEY;


            // console.log("Your Jwt token:- ",token);
            // console.log("Your Jwt token:- ",token.replace('Bearer ', ''));

            

            
        jwt.verify(token.replace('Bearer ', ''), jwtPrivateKey, async(err, decoded) => {
            if (err) {
                return (errorHelper(res,{message:"Invalid token", status:403}));
            }


            // -----checking user is valid or not

            const findUserInfoInstance=await UserModel.findById(decoded.userId);

if(findUserInfoInstance.isStatus === false )
{
    return (errorHelper(res,{message:"User is deactivated", status:401}));
}

            req.userId = decoded.userId;
            next();
        });
    
    }
    catch(err){
        return errorHelper(res,err);
    }
        
}

export default userAuthMiddleware