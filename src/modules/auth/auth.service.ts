import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;
  const userData = await pool.query(
    `
      SELECT * FROM users
      WHERE email = $1
      `,
    [email],
  );
  const user = userData.rows[0];
  if (!user) {
    throw new Error("Invalid Credentials!");
  }
  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("Invalid Credentials!");
  }
  //Generate JWT token
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
  };

  const accessToken = jwt.sign(jwtPayload, config.secret as string, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign(jwtPayload, config.refresh_secret as string, {
    expiresIn: "10d",
  });

  return { accessToken, refreshToken };
};

const generateRefreshToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized access!!");
  }

  const decoded = jwt.verify(
    token as string,
    config.refresh_secret as string,
  ) as JwtPayload;
  // console.log(decoded);
  const userData = await pool.query(
    `
        SELECT * FROM users
        WHERE id = $1
        `,
    [decoded.id],
  );
  // console.log(userData);
  const user = userData.rows[0];
  //   console.log(user);
  if (userData.rowCount === 0) {
    throw new Error("User not found!!");
  }
  if (!user?.is_active) {
    throw new Error("Forbidden!!");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
  };

  const accessToken = jwt.sign(jwtPayload, config.secret as string, {
    expiresIn: "1d",
  });

  return { accessToken };
};

export const authService = {
  loginUserIntoDB,
  generateRefreshToken,
};
