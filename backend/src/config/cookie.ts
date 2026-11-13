import { type CookieOptions } from "express";

export const COOKIE_NAME = "token";

export const SESSION_DAYS = 30;
export const SESSION_MAX_AGE = 1000 * 60 * 60 * 24 * SESSION_DAYS;

const isProduction = process.env.NODE_ENV === "production";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};
