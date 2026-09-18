import { Router } from "express";
import { CSRF_COOKIE_NAME } from "../middleware/csrf";

const router = Router();

router.get("/csrf-token", (_req, res) => {
  res.json({ csrfToken: res.locals.csrfToken });
});

export default router;