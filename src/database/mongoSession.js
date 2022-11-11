import session from "express-session";
import mongoDbStore from "connect-mongodb-session";

const mongoStore = mongoDbStore(session);

export const mongoSession = {
    secret:  process.env.MONGO_SECRET,
    saveUninitialized: false,
    resave: false,
    store : new mongoStore({
        uri: process.env.MONGO_URI,
        collection: process.env.MONGO_SESSION,
        touchAfter: (24 * 3600)
    }),
    cookie : {maxAge : (24 * 3600 * 1000) },
}