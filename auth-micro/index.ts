import express, { Express, Request, Response, NextFunction } from 'express';
import cors from "cors"
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import Routes from "./routes/index"
const app: Express = express();
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}));


//route
app.use(Routes)


app.listen(port, () => {
  console.log(`Port is successfully running ${port}`);
});
