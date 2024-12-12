import { Router } from "express";
import { expenses } from "../controllers/expense.controller";

const router = Router();

router.get('/list', expenses);

export default router;