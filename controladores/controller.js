const connection = require("../bd/conexionbd");

function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
}
const control = {
    getCompetencias: (req, res) => {

        connection.query("SELECT * FROM competencias",
            (error, competencias, fields) => {
                if (error) console.error(error);
                res.json(competencias);
            })
    },
    getPeliculas: (req, res) => {
        let idCompetencia = req.params.id;
        let sqlCompe = "SELECT * FROM competencias AS c WHERE c.id = ? "
        let sqlPeli = " SELECT * FROM pelicula p "
            //let randomIdPelicula = randomInt(1, 743);

        connection.query(sqlCompe, [idCompetencia],
            (error, competencias, fields) => {
                if (error) console.error(error);
                console.log(competencias[0].nombre)

                if (idCompetencia == 1) {
                    connection.query(sqlPeli += " WHERE p.genero_id =5", [idCompetencia],
                        (error, peliculas, fields) => {
                            if (error) console.error(error);
                            res.json({
                                competencia: competencias[0].nombre,
                                peliculas: peliculas
                            })
                        })
                } else if (idCompetencia == 2) {
                    connection.query(sqlPeli += " WHERE p.genero_id =10", [idCompetencia],
                        (error, peliculas, fields) => {
                            if (error) console.error(error);
                            res.json({
                                competencia: competencias[0].nombre,
                                peliculas: peliculas
                            })
                        })
                } else if (idCompetencia == 3) {
                    connection.query(sqlPeli += " JOIN director_pelicula AS dp ON dp.pelicula_id = p.id WHERE dp.director_id = 3364", [idCompetencia],
                        (error, peliculas, fields) => {
                            if (error) console.error(error);
                            res.json({
                                competencia: competencias[0].nombre,
                                peliculas: peliculas
                            })
                        })
                } else if (idCompetencia == 4) {
                    connection.query(sqlPeli += " JOIN actor_pelicula AS ap ON ap.pelicula_id = p.id WHERE ap.actor_id = 13", [idCompetencia],
                        (error, peliculas, fields) => {
                            if (error) console.error(error);
                            res.json({
                                competencia: competencias[0].nombre,
                                peliculas: peliculas
                            })
                        })
                } else if (idCompetencia == 5) {
                    connection.query(sqlPeli += "  WHERE p.genero_id =8", [idCompetencia],
                        (error, peliculas, fields) => {
                            if (error) console.error(error);
                            res.json({
                                competencia: competencias[0].nombre,
                                peliculas: peliculas
                            })
                        })
                } else if (idCompetencia == 6) {
                    connection.query(sqlPeli += "  WHERE p.genero_id =13", [idCompetencia],
                        (error, peliculas, fields) => {
                            if (error) console.error(error);
                            res.json({
                                competencia: competencias[0].nombre,
                                peliculas: peliculas
                            })
                        })
                }
            })
    },
    postVotos: (req, res) => {

        connection.query("SELECT * FROM votos",
            (error, votos, fields) => {
                if (error) console.error(error);
                res.json(votos);
            })
    },
};




module.exports = control;