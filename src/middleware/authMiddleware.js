import { getSession } from "../models/Session/SessionModel.js";
import { getOneUser, getUserByEmail } from "../models/User/UserModel.js";
import {
  createAccessJWT,
  verifyAccessJWT,
  verifyRefreshJWT,
} from "../utils/jwt.js";
import { responseClient } from "./responseClient.js";

export const userAuthMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  let message = "Unauthorized";

  try {
    console.log("🟡 Entered userAuthMiddleware");

    if (authorization) {
      const token = authorization.startsWith("Bearer ")
        ? authorization.split(" ")[1]
        : authorization;
      console.log("🔑 Incoming token:", token);

      const decoded = await verifyAccessJWT(token);
      console.log("Decoded JWT:", decoded);

      if (decoded.email) {
        const tokenSession = await getSession({ token });
        console.log("Session in DB:", tokenSession);

        if (tokenSession?._id) {
          const user = await getUserByEmail(decoded.email);
          console.log("Fetched user:", user?.email);
          console.log("User status:", user?.status);

          if (user?._id && user.status === "active") {
            req.userInfo = user;
            console.log("✅ Auth Passed, calling next()");
            return next();
          } else {
            console.log("❌ User not active or not found");
          }
        } else {
          console.log("❌ No session found in DB");
        }
      } else {
        console.log("❌ No email in decoded token");
      }

      message = decoded === "jwt expired" ? decoded : "Unauthorized";
    } else {
      console.log("❌ No Authorization header");
    }
  } catch (err) {
    console.error("🔥 Middleware error:", err);
    message = "Server error";
  }

  console.log("🚨 Sending 401 from middleware");
  responseClient({ req, res, message, statusCode: 401 });
};

export const renewAccessJWTMiddleware = async (req, res) => {
  const { authorization } = req.headers;
  let message = "Unauthorized";

  if (authorization) {
    const token = authorization.startsWith("Bearer ")
      ? authorization.split(" ")[1]
      : authorization;

    const decoded = await verifyRefreshJWT(token);
    if (decoded.email) {
      const user = await getOneUser({
        email: decoded.email,
        refreshJWT: token,
      });
      if (user?._id) {
        const newToken = await createAccessJWT(decoded.email);
        return responseClient({
          req,
          res,
          message: "Here is the accessJWT",
          payload: newToken,
        });
      }
    }
  }

  responseClient({ req, res, message, statusCode: 401 });
};
