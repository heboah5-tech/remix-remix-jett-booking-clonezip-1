import crypto from "crypto";
import type { RequestHandler } from "express";

export const CSRF_COOKIE_NAME = "csrfToken";
export const CSRF_HEADER_NAME = "x-csrf-token";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const TOKEN_BYTES = 32;

function createToken(): string {
  return crypto.randomBytes(TOKEN_BYTES).toString("hex");
}

function isToken(value: unknown): value is string {
  return typeof value === "string" && value.length === TOKEN_BYTES * 2;
}

function tokensMatch(expected: string, received: string | undefined): boolean {
  if (!received || expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(expected, "utf8"),
    Buffer.from(received, "utf8"),
  );
}

/**
 * Issues a readable CSRF cookie for every API client and verifies the
 * double-submit header on state-changing requests.
 */
export const csrfProtection: RequestHandler = (req, res, next) => {
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const token = isToken(cookieToken) ? cookieToken : createToken();

  if (token !== cookieToken) {
    res.cookie(CSRF_COOKIE_NAME, token, {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  res.locals.csrfToken = token;

  if (!SAFE_METHODS.has(req.method) && !tokensMatch(token, req.get(CSRF_HEADER_NAME))) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }

  return next();
};