import { logEvents } from "./logger.js";

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errorLog.log');
    console.error(err.stack);

    const status = res.statusCode ? res.statusCode : 500; // Server Error
    res.status(status);
    res.json({ message: err.message, isError: true }); // The isError property is something that RTK query will look for
    next();
}

export default errorHandler;