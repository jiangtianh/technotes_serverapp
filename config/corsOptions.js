import allowedOrigins from "./allowedOrigins.js";

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            console.log(`In corsOptions.js: ${origin} is allowed`);
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

export default corsOptions;