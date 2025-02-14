// lib/jwtHelper.ts
import { verify } from "jsonwebtoken";

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET as string;

export const verifyToken = (token: string): boolean => {
  try {
    const decoded = verify(token, SECRET_KEY);
    return !!decoded;
  } catch (error) {
    return false;
  }
}
