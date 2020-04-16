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



app.get("/competencias/:idCompetencia/peliculas", control.getPeliculas);
app.get("/competencias/:idCompetencia/resultados", control.getResultados);
app.get("/competencias/:idCompetencia", control.getCompetencia);
app.get("/competencias", control.getCompetencias);
app.get("/generos", control.getGeneros);
app.get("/directores", control.getDirectores);
app.get("/actores", control.getActores);

app.delete("/competencias/:idCompetencia/votos", control.deleteVotos);
app.delete("/competencias/:idCompetencia", control.deleteCompetencia);

app.post("/competencias/:idCompetencia/voto", control.postVotos);
app.post("/competencias", control.postCompetencias);

app.put("/competencias/:idCompetencia", control.putNombreCompetencia);





app.listen(server.port, () => console.log("El servidor esta activo en el puerto " + server.port))