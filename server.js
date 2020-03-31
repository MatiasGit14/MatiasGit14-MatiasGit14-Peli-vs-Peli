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

app.get("/competencias", control.prueba);
//app.get("/competencias/:id/peliculas", control.prueba);
//app.get("/competencias/:idCompetencia/voto", control.prueba);
//app.get("/generos", control.prueba);
//app.get("/directores", control.prueba);
//app.get("/actores", control.prueba);
//app.get("/competencias/:id/resultados", control.prueba);

app.listen(port, () => console.log("El servidor esta activo en el puerto " + port))