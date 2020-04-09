const connection = require("../bd/conexionbd");

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


        connection.query(sqlCompe, [idCompetencia],
            (error, competencias, fields) => {
                if (error) console.error(error);

                if (idCompetencia == 1) {
                    connection.query(sqlPeli += " WHERE p.genero_id =5 ORDER BY RAND() LIMIT 2", [idCompetencia],
                        (error, peliculas, fields) => {
                            if (error) console.error(error);
                            res.json({
                                competencia: competencias[0].nombre,
                                peliculas: peliculas
                            })
                        })
                } else if (idCompetencia == 2) {
                    connection.query(sqlPeli += " WHERE p.genero_id =10 ORDER BY RAND() LIMIT 2", [idCompetencia],
                        (error, peliculas, fields) => {
                            if (error) console.error(error);
                            res.json({
                                competencia: competencias[0].nombre,
                                peliculas: peliculas
                            })
                        })
                } else if (idCompetencia == 3) {
                    connection.query(sqlPeli += " JOIN director_pelicula AS dp ON dp.pelicula_id = p.id WHERE dp.director_id = 3364 ORDER BY RAND() LIMIT 2", [idCompetencia],
                        (error, peliculas, fields) => {
                            if (error) console.error(error);
                            res.json({
                                competencia: competencias[0].nombre,
                                peliculas: peliculas
                            })
                        })
                } else if (idCompetencia == 4) {
                    connection.query(sqlPeli += " JOIN actor_pelicula AS ap ON ap.pelicula_id = p.id WHERE ap.actor_id = 13 ORDER BY RAND() LIMIT 2", [idCompetencia],
                        (error, peliculas, fields) => {
                            if (error) console.error(error);
                            res.json({
                                competencia: competencias[0].nombre,
                                peliculas: peliculas
                            })
                        })
                } else if (idCompetencia == 5) {
                    connection.query(sqlPeli += "  WHERE p.genero_id =8 ORDER BY RAND() LIMIT 2", [idCompetencia],
                        (error, peliculas, fields) => {
                            if (error) console.error(error);
                            res.json({
                                competencia: competencias[0].nombre,
                                peliculas: peliculas
                            })
                        })
                } else if (idCompetencia == 6) {
                    connection.query(sqlPeli += "  WHERE p.genero_id =13 ORDER BY RAND() LIMIT 2", [idCompetencia],
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
        let idCompetencia = req.params.idCompetencia;
        let idPelicula = req.body.idPelicula;

        connection.query(
            "INSERT INTO votacion (pelicula_id, competencia_id, votos) " +
            " VALUES (" + idPelicula + ',' + idCompetencia + ',' + " 1)", [idCompetencia],
            (error, results, fields) => {
                if (error) console.error(error);
                res.json(results);
            })
    },
    getResultados: (req, res) => {
        let idCompetencia = req.params.idCompetencia;
        connection.query("SELECT nombre FROM competencias WHERE id = ?", [idCompetencia],
            (error, competencia, fields) => {
                if (error) console.error(error);
                connection.query(
                    "SELECT cuentaVotos.pelicula_id, cuentaVotos.competencia_id, cuentaVotos.votos,  p.titulo, p.poster " +
                    " FROM " +
                    " (SELECT pelicula_id, competencia_id, SUM(votos) votos " +
                    " FROM votacion v " +
                    " WHERE v.competencia_id = ? " +
                    " GROUP BY pelicula_id, competencia_id) cuentaVotos " +
                    " JOIN pelicula p ON p.id = cuentaVotos.pelicula_id " +
                    " JOIN competencias c ON c.id = cuentaVotos.competencia_id " +
                    " ORDER BY cuentaVotos.votos DESC LIMIT 3", [idCompetencia],
                    (error, votos, fields) => {
                        if (error) console.error(error);
                        res.json({ competencia: competencia[0].nombre, resultados: votos })

                    })
            })
    }
}




module.exports = control;