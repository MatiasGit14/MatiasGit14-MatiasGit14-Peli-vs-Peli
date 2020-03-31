var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var control = require("./controladores/controller");
var app = express();
const port = require("./ports/port");

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get("/prueba", control.prueba);

app.listen(port, () => console.log("El servidor esta activo en el puerto " + port))