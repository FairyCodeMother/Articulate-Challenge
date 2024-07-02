import express, { Request, Response } from 'express';
import morgan from 'morgan'; // HTTP request logging middleware
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

// import helmet from 'helmet/index.cjs';
// import dotenv from '../node_modules/dotenv'

// dotenv.config()

const app = express();
const port = process.env.PORT || 5001;

// Security middleware
// app.use(helmet())

// Enable CORS
app.use(cors());

// Dev mode logs to console
app.use(morgan('dev'));

// JSON parsing
app.use(express.json());

// Routes
app.use('/', routes);

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => console.log(`Listening on port ${port}`)); // Listen & logs
