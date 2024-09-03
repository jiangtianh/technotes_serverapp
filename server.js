import 'dotenv/config';
import express from 'express';
import path from 'path';
import { logger } from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import corsOptions from './config/corsOptions.js';
import connectDB from './config/dbConnection.js';
import mongoose from 'mongoose';
import { logEvents } from './middleware/logger.js';


import router from './routes/root.js';
import noteRouter from './routes/noteRoutes.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';


const app = express();
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


app.use('/', express.static('public'));
app.use('/', router);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/notes', noteRouter);


// -----------------------------------------------------
// Handles default not found routes
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.resolve('views', '404.html'));
        return;
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not found' });
        return;
    } else {
        res.type('txt').send('404 Not Found');
    }
})

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});

mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(
        `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
        'mongoErrLog.log'
    )
})

