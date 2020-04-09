var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var control = require("./controladores/controller");
var app = express();
const { server } = require("./ports/port");

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get("/competencias", control.getCompetencias);
app.get("/competencias/:id/peliculas", control.getPeliculas);
app.get("/competencias/:idCompetencia/resultados", control.getResultados);
app.post("/competencias/:idCompetencia/voto", control.postVotos);

//app.get("/generos", control.prueba);
//app.get("/directores", control.prueba);
//app.get("/actores", control.prueba);


app.listen(server.port, () => console.log("El servidor esta activo en el puerto " + server.port))