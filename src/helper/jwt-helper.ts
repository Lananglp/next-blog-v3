import { decodeJwt, jwtVerify } from "jose";

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env["SECRET_KEY"]!)
    );
    return Boolean(payload);
  } catch (error) {
    console.log("Error verify token: ", error);
    return false;
  }
};

export const verifyRoleToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env["SECRET_KEY"]!)
    );

    if (payload.role !== "ADMIN") {
      return false;
    }

    return Boolean(payload);
    
  } catch (error) {
    console.log("Error verify token: ", error);
    return false;
  }
};

export const decodeToken = () => {
  try {
    return decodeJwt(process.env["COOKIE_NAME"]!);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

// export const decodeToken = <T>( req: NextApiRequest ) => {
//   const token = req.cookies[process.env["COOKIE_NAME"]!];
//   if (token) {
//     return decodeJwt(token) as T;
//   }
//   return null;
// };