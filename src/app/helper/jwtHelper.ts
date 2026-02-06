import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import config from "../../config";


// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const generateToken = (payload:any,secret: Secret,expiresIn: string) =>{

    
      const token =  jwt.sign(payload,secret,
        {
          algorithm: config.token.algorithm,
          expiresIn: config.token.expireIn,
        } as SignOptions
      );

      return token;
      
}
const verifyToken = (token: string,secret: Secret) =>{
  return jwt.verify(token,secret) as JwtPayload;
}
export const jwtHelper= {
    generateToken,
    verifyToken
}