import jwt from "jsonwebtoken";
import config from "../config/default.json";

// middleware is a function which have access to
// request , response, and the next functions to go after run completed.

const authMiddleware = (req, res, next) => {
  // get the token from the header
  const token = req.header("x-auth-token");
  if(!token){
      return res.status(401).json({msg:"No Token, authorisation denied"})
  }

  //verify token
  try{
    const decoded = jwt.verify(token,config.jwttoken)
    req.user = decoded.user
    next()
  }catch(err){
    return res.status(401).json({msg:"Token not valid"})
  }
};

export default authMiddleware
