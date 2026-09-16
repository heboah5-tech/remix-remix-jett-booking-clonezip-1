import { Router, type IRouter } from "express";
import bookingsRouter from "./bookings";
import healthRouter from "./health";
import trackingRouter from "./tracking";
import binRouter from "./bin";

const router: IRouter = Router();

router.use(bookingsRouter);
router.use(healthRouter);
router.use(trackingRouter);
router.use(binRouter);

export default router;
