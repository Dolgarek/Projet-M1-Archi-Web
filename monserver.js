//Import necessary modules
import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import https from 'https';

//Import config from .env file
dotenv.config();

//Define const namespace of project
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Create new express instance
const app = express();

//Specify option such as assets location et request format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//Creation de la première route à la base du site internet ("exemple.com/") en mode GET
//Retourne index.html
app.get("/", function (request, response) {
    response.sendFile(__dirname + "/index.html");
});

//Création d'une route POST /login
app.post("/login", (request,response) => {
    try {
        //If request doesn't include email and password return error 400
        if (!request.body.email || !request.body.password) {
            return response.status(400).json({ message: 'Veuillez entrer des informations valides dans le formulaire.' })
        } else {
            //Else display in console login id and pass then return index
            console.log(request.body);
            console.log('Logged in with: ' + request.body.email + ' and password: ' + request.body.password);

            response.redirect('/');
        }
    }
    catch (e) {
        //If server error return error 500
        response.status(500).send({errorName: e.name, errorMessage: e.message});
    }
});

//Create https server, specify location of .key and .cert to enable SSL in option.
//Use port specified in .env file and write in console a message on start.
https
    .createServer(
        {
            key: fs.readFileSync(__dirname + "/ssl/server.key"),
            cert: fs.readFileSync(__dirname + "/ssl/server.cert"),
        },
        app
    )
    .listen(process.env.PORT, function () {
        console.log(
            "Example app listening on port " + process.env.PORT + "! Go to https://localhost:3000/"
        );
    });
