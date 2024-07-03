import express, { Request, Response } from "express";
import morgan from "morgan"; // HTTP request logging middleware
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());

// Dev mode logs to console
app.use(morgan("dev"));

app.use(express.json());

app.use("/", routes);

app.use(errorHandler);

app.listen(port, () => console.log(`Listening on port ${port}`));
