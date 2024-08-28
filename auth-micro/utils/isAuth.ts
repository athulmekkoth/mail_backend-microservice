import jsonwebtoken from 'jsonwebtoken';
const { verify } = jsonwebtoken;
import { getUser } from './token';
import { NextFunction, Request, Response } from "express";
import { compareSync } from 'bcrypt';
interface DecodedToken {
  userId: string;
  isAdmin: boolean;
}
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken | null

    }
  }
}
const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

  const tokenCookie = req.cookies?.token;
console.log(tokenCookie)
  req.user = null;

  if (!tokenCookie) {
    return res.status(500).json({ message: "Login before " });
  }

  try {
    const data = await getUser(tokenCookie);
    
    req.user = data;
    return next();
  } catch (error) {
    // console.error("Error retrieving user data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const restrictedTo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    await isAuth(req, res, async () => {
      if (req.user?.isAdmin) {
    
        next();
      } else {
        return res.status(403).json({ message: "You are not allowed to do that" });
      }
    });
  } catch (error) {
    // console.error("Error in restrictedTo middleware:", error);
   return res.status(500).json({ message: "Internal server error" });
  }
};




// return (req: Request, res: Response, next: NextFunction) => {
//  
//   }
//
  // try {
  // //  const token=req.headers.authorization?.split(" ")[1]
  // console.log(req.cookies)
  //   const refreshToken = req.cookies.refreshToken
  
  // const decodedToken = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: string, isAdmin: boolean };
  
  //  const userId = decodedToken.userId;
  //  const isAdmin = decodedToken.isAdmin;

  //   req.user = { userId, isAdmin };
  //   next()
  // } catch (error) {
  //   console.log(error);
  //   res.status(401).json({ message: "You need to login" });
  // }

export  {isAuth,restrictedTo}
