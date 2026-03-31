import { Router, type IRouter } from "express";
import healthRouter from "./health";
import studentsRouter from "./students";
import openaiRouter from "./openai";
import bookingsRouter from "./bookings";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(studentsRouter);
router.use(openaiRouter);
router.use(bookingsRouter);
router.use(adminRouter);

export default router;
