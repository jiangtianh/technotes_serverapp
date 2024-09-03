import rateLimit from 'express-rate-limit';
import { logEvents } from './logger.js';


const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 login requests per `window` per minute
    message: 
        { message: 'Too many login attempts from this IP, please try again after a 60 second pause' },
    handler: (req, res, next, options) => {
        logEvents(`Too Many Requests: ${options.message.message}\t${req.method}\t{req.url}\t${req.header.origin}`, 'errLog.log');
        res.status(options.statusCode).send(options.message);
    },
    standardHeader: true, // Return rate limit info in the `RateLimit-*` headers
    lagacyHeader: false, // Disable the `X-RateLimit-*` headers

});

export default loginLimiter;