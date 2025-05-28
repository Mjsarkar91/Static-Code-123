import express from "express";
import { fetchDataController } from "../controllers/fetchData.js";


const router = express.Router();

router.get("/exceldata", fetchDataController);

export default router;