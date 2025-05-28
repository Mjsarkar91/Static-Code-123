import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from './routes/auth.js'
import exceldata from './routes/excelData.js'
import fetchexceldata from './routes/fetchData.js'



const app = express();
app.use(express.json());
dotenv.config();
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);





app.use(bodyParser.json({ limit: "20mb", extended: true }));

//ROUTES
app.use('/auth',authRoute)
app.use('/excel',exceldata)
app.use('/fetch',fetchexceldata)

const port=process.env.PORT


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });