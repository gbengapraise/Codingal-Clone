import { Router, type IRouter } from "express";
import healthRouter from "./health";
import studentsRouter from "./students";
import openaiRouter from "./openai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(studentsRouter);
router.use(openaiRouter);

export default router;
