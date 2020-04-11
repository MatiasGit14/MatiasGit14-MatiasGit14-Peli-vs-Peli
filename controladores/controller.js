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
        if (!req.params.id || isNaN(req.params.id)) return res.status(400).send('Invalid Competencia id');
        let idCompetencia = req.params.id;
        let sqlCompe = "SELECT * FROM competencias AS c WHERE c.id = ? "
        let sqlPeli = " SELECT p.id, p.titulo, p.poster FROM pelicula AS p "


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
                    connection.query(sqlPeli += " LEFT JOIN director_pelicula AS dp ON dp.pelicula_id = p.id WHERE dp.director_id = 3364 ORDER BY RAND() LIMIT 2", [idCompetencia],
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
                } else if (idCompetencia > 6) {
                    connection.query(sqlPeli += " JOIN competencias C ON c.competencia_genero = p.genero_id WHERE c.id = ?  ORDER BY RAND() LIMIT 2", [idCompetencia],
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
        if (!req.params.idCompetencia || isNaN(req.params.idCompetencia)) return res.status(400).send('Invalid Competencia id');
        let idCompetencia = req.params.idCompetencia;
        let idPelicula = req.body.idPelicula;

        connection.query(
            "INSERT INTO votacion (pelicula_id, competencia_id, votos) " +
            " VALUES (" + idPelicula + ',' + idCompetencia + ',' + " 1)", [idCompetencia],
            (error, results, fields) => {
                if (error) console.error(error);
                if (!req.body) return res.status(400).send('Invalid body Pelicula ID');
                res.json(results);
            })
    },
    getResultados: (req, res) => {
        if (!req.params.idCompetencia || isNaN(req.params.idCompetencia)) return res.status(400).send('Invalid Competencia id');
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
    },
    postCompetencias: (req, res) => {
        let nombreComptencia = req.body.nombre;
        let generoCompetencia = req.body.genero;
        let actorCompetencia = req.body.actor;
        let directorCompetencia = req.body.director;

        if (!generoCompetencia || isNaN(generoCompetencia) || generoCompetencia === 0) {
            generoCompetencia = null;
        }
        connection.query("INSERT INTO competencias (nombre, competencia_genero, competencia_actor, competencia_director) " +
            " VALUES (" + "'" + nombreComptencia + "' , " + generoCompetencia + " , " + actorCompetencia + " , " + directorCompetencia + ")",
            (error, results, fields) => {
                if (error) console.error(error);
                if (!req.body) return res.status(400).send('Invalid body nombre');
                res.status(201).send("Creado correctamente");
            })
    },
    deleteVotos: (req, res) => {
        if (!req.params.idCompetencia || isNaN(req.params.idCompetencia)) return res.status(400).send('Invalid Competencia id');
        let idCompetencia = req.params.idCompetencia;
        connection.query("DELETE FROM votacion WHERE competencia_id = ? ", [idCompetencia],
            (error, results, fields) => {
                if (error) console.error(error);
                res.status(205).send("Reiniciado correctamente");
            })
    },
    getGeneros: (req, res) => {
        connection.query("SELECT * FROM genero ",
            (error, results, fields) => {
                if (error) console.error(error);
                res.json(results);
            })
    },
    getDirectores: (req, res) => {
        connection.query("SELECT * FROM director ",
            (error, results, fields) => {
                if (error) console.error(error);
                res.json(results);
            })
    },
    getActores: (req, res) => {
        connection.query("SELECT * FROM actor ",
            (error, results, fields) => {
                if (error) console.error(error);
                res.json(results);
            })
    },
    deleteCompetencia: (req, res) => {
        if (!req.params.idCompetencia || isNaN(req.params.idCompetencia)) return res.status(400).send('Invalid Competencia id');
        let idCompetencia = req.params.idCompetencia;

        connection.query("DELETE FROM competencias WHERE id = ? ", [idCompetencia],
            (error, results, fields) => {
                if (error) console.error(error);

                connection.query("DELETE FROM votacion WHERE competencia_id = ? ", [idCompetencia],
                    (error, results, fields) => {
                        if (error) console.error(error);
                        res.status(200).send("Borrado correctamente");
                    })
            })
    },
    putNombreCompetencia: (req, res) => {
        if (!req.params.idCompetencia || isNaN(req.params.idCompetencia)) return res.status(400).send('Invalid Competencia id');
        let idCompetencia = req.params.idCompetencia;
        let nuevoNombre = req.query.nombre;

        connection.query("UPDATE competencias SET nombre = " + "'" + nuevoNombre + "'" + " WHERE id = ? ", [idCompetencia],
            (error, results, fields) => {
                if (error) console.error(error);
                res.status(200).send("Nombre modificado");
            })
    }
}

module.exports = control;