//Import necessary modules
import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import https from 'https';

//Import config from .env file
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", function (request, response) {
    response.sendFile(__dirname + "/index.html");
});

app.post("/login", (request,response) => {
    try {
        if (!request.body.email || !request.body.password) {
            return response.status(400).json({ message: 'Veuillez entrer des informations valides dans le formulaire.' })
        } else {
            console.log(request.body);
            console.log('Logged in with: ' + request.body.email + ' and password: ' + request.body.password);

            response.redirect('/');
        }
    }
    catch (e) {
        response.status(500).send({errorName: e.name, errorMessage: e.message});
    }
});


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