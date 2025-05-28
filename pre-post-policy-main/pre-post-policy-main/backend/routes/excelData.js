import express from "express";
import { excelDataController } from "../controllers/excelData.js";

const router = express.Router();

router.post("/data", excelDataController);

export default router;