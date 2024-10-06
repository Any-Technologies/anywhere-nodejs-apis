import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateAccessToken = (user: any) => {
    return jwt.sign(user, String(process.env.ACCESS_TOKEN_SECRET))
}