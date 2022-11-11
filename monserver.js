//Import necessary modules
import express, {request, response} from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import https from 'https';
import mongoose from "mongoose";
import Message from "./src/model/Message.js";
import {UserDAO} from "./src/DAO/UserDAO.js"
import cors from 'cors';
import jwt from 'jsonwebtoken';
import {Mongodb} from "./src/database/mongodb.js";
import session from "express-session";
import {mongoSession} from "./src/database/mongoSession.js";

//Import config from .env file
dotenv.config({path: `.env.${process.env.NODE_ENV}`});
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//mongoose.connect("mongodb://ceri:ceri2022@92.222.180.41:27017/test");
//Create instance to use db
const mongo = new Mongodb();
const pgsql = new UserDAO();

//TODO: Delete only used to test db connection and request
run();


async function run() {
    const data = await Message.find();
    console.log(data);

}
//ENDTODO

//Create back-end server with needed dependency
const app = express();
app.use(cors()); //Front-Back
app.use(express.json()); //Handle payload
app.use(express.urlencoded({ extended: true })); //Set URL options
app.use(express.static(__dirname + "/public")); //Define base directory for assets and content (step 1)
app.use(session(mongoSession)); //Handle mongoSession with the help of the mongoSession.js file

//Create Front-end server
const frontApp = express();
frontApp.use(express.static(__dirname + "/CERISoNet/dist/ceriso-net/")); //Define the base directory for content and assets

//Route index and get()
frontApp.get("/", function (request, response) {
    response.sendFile(__dirname + "/CERISoNet/dist/ceriso-net/index.html");
});

//Route test mongo
app.get("/mongo", (request, response) => {

})

//Route login back, handle auth from front with session and jwt
app.post("/login", async (request,response) => {
    try {
        if (!request.body.username || !request.body.password) {
            //Error 400 if payload is doesn't contain requiered data
            return response.status(400).json({ errorMessage: 'Veuillez entrer des informations valides dans le formulaire.' })
        } else {
            //Call to the psql middleware auth method to check against database if user exist and password ok
            const user = await pgsql.auth(request.body.username, request.body.password);
            if (user !== undefined)
            {
                //if user exist, create session in mongo
                request.session.isConnected = true;
                request.session.username = user._username;

                console.log('Id : ' + request.session.id + ' expire dans ' + request.session.cookie.maxAge);
                //Create a jwt token to handle the session client-side in the local storage.
                //This will come handy when dealing with redirection privileges and user management
                const token = jwt.sign({data: user}, "saltToHashToken");
                //Return with status 200 and data/token as data to the front
                response.status(200).json({data: user, token: token});
            }
            else {
                //If user not found or incorrect password return error 401
                response.status(401).json({errorMessage: "Username ou mot de passe invalide."});
            }
        }
    }
    catch (e) {
        //If connection lost / impossible with database or back-end server error, return error 500 with errorMessage
        response.status(500).send({errorName: e.name, errorMessage: e.message});
    }
});

//Test route for pgsql middleware
app.get("/users", async (request,response) => {
    try {
        const arr = await pgsql.find();
        response.status(200).json(arr);
    }
    catch (e) {
        response.status(500).send({errorName: e.name, errorMessage: e.message});
    }
});

//Instanciate back-end server with SSL and defined port
https
    .createServer(
        {
            key: fs.readFileSync(__dirname + "/ssl/server.key"),
            cert: fs.readFileSync(__dirname + "/ssl/server.cert"),
        },
        app
    )
    .listen(process.env.PORT_BACK, function () {
        console.log(
            "Example app listening on port " + process.env.PORT_BACK + "! Go to https://localhost:" + process.env.PORT_BACK +"/"
        );
    });

//Instanciate front-end server with SSL and defined port
https
    .createServer(
        {
            key: fs.readFileSync(__dirname + "/ssl/server.key"),
            cert: fs.readFileSync(__dirname + "/ssl/server.cert"),
        },
        frontApp
    )
    .listen(process.env.PORT_FRONT, function () {
        console.log(
            "Example app listening on port " + process.env.PORT_FRONT + "! Go to https://localhost:" + process.env.PORT_FRONT +"/"
        );
    });
