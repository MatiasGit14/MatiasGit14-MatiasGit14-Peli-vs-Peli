const connection = require("../bd/conexionbd");

const control = {
    getCompetencias: (req, res) => {

        connection.query("SELECT * FROM competencias",
            (error, competencias, fields) => {
                if (error) console.error(error);
                res.json(competencias);
            })
    },
    getCompetencia: (req, res) => {
        if (!req.params.idCompetencia || isNaN(req.params.idCompetencia)) return res.status(400).send('Invalid Competencia id');
        let idCompetencia = req.params.idCompetencia;
        connection.query("SELECT * FROM competencias WHERE id = ?", [idCompetencia],
            (error, competencia, fields) => {
                if (error) console.error(error);
                console.log(req.params);
                res.json(competencia);
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

                let genero = competencias[0].competencia_genero;
                let actor = competencias[0].competencia_actor;
                let director = competencias[0].competencia_director;
                console.log(genero, actor, director);
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
                } else if (genero > 0 && actor > 0 && director > 0) {
                    console.log(genero, actor, director);
                    connection.query(
                        sqlPeli +=
                        " JOIN actor_pelicula ap ON ap.actor_id = " + actor +
                        " JOIN director_pelicula dp ON dp.director_id = " + director +
                        " WHERE p.genero_id = " + genero + " AND ap.pelicula_id = p.id AND dp.pelicula_id = p.id" +
                        " ORDER BY RAND() LIMIT 2", [idCompetencia],
                        (error, peliculas, fields) => {
                            if (error) console.error(error);
                            res.json({
                                competencia: competencias[0].nombre,
                                peliculas: peliculas
                            })
                        })
                } else if (genero == null && actor > 0 && director > 0) {
                    console.log(genero, actor, director);
                    connection.query(
                        sqlPeli +=
                        " JOIN actor_pelicula ap ON ap.actor_id = " + actor +
                        " JOIN director_pelicula dp ON dp.director_id = " + director +
                        " WHERE ap.pelicula_id = p.id AND dp.pelicula_id = p.id " +
                        " ORDER BY RAND() LIMIT 2", [idCompetencia],
                        (error, peliculas, fields) => {
                            if (error) console.error(error);
                            res.json({
                                competencia: competencias[0].nombre,
                                peliculas: peliculas
                            })
                        })
                } else if (genero > 0 && actor == null && director > 0) {
                    console.log(genero, actor, director);
                    connection.query(
                        sqlPeli +=
                        " JOIN director_pelicula dp ON dp.director_id = " + director +
                        " WHERE dp.pelicula_id = p.id AND p.genero_id = " + genero +
                        " ORDER BY RAND() LIMIT 2", [idCompetencia],
                        (error, peliculas, fields) => {
                            if (error) console.error(error);
                            res.json({
                                competencia: competencias[0].nombre,
                                peliculas: peliculas
                            })
                        })
                } else if (genero > 0 && actor > 0 && director == null) {
                    console.log(genero, actor, director);
                    connection.query(
                        sqlPeli +=
                        " JOIN actor_pelicula ap ON ap.actor_id = " + actor +
                        " WHERE ap.pelicula_id = p.id AND p.genero_id = " + genero +
                        " ORDER BY RAND() LIMIT 2", [idCompetencia],
                        (error, peliculas, fields) => {
                            if (error) console.error(error);
                            res.json({
                                competencia: competencias[0].nombre,
                                peliculas: peliculas
                            })
                        })
                } else if (genero > 0 && actor == null && director == null) {
                    console.log(genero, actor, director);
                    connection.query(
                        sqlPeli +=
                        " WHERE p.genero_id = " + genero +
                        " ORDER BY RAND() LIMIT 2", [idCompetencia],
                        (error, peliculas, fields) => {
                            if (error) console.error(error);
                            res.json({
                                competencia: competencias[0].nombre,
                                peliculas: peliculas
                            })
                        })
                } else if (genero == null && actor > 0 && director == null) {
                    console.log(genero, actor, director);
                    connection.query(
                        sqlPeli +=
                        " JOIN actor_pelicula ap ON ap.actor_id = " + actor +
                        " WHERE ap.pelicula_id = p.id" +
                        " ORDER BY RAND() LIMIT 2", [idCompetencia],
                        (error, peliculas, fields) => {
                            if (error) console.error(error);
                            res.json({
                                competencia: competencias[0].nombre,
                                peliculas: peliculas
                            })
                        })
                } else if (genero == null && actor == null && director > 0) {
                    console.log(genero, actor, director);
                    connection.query(
                        sqlPeli +=
                        " JOIN director_pelicula dp ON dp.director_id = " + director +
                        " WHERE dp.pelicula_id = p.id" +
                        " ORDER BY RAND() LIMIT 2", [idCompetencia],
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

        if (nombreComptencia == "") {
            connection.query("",
                (error, results, fields) => {
                    if (error) console.error(error);
                    if (!req.body) return res.status(400).send('Invalid body nombre');
                    res.status(422).send("Nombre obligatorio");
                })
        }
        if (generoCompetencia == 0 && actorCompetencia > 0 && directorCompetencia > 0) {
            connection.query("INSERT INTO competencias (nombre, competencia_actor, competencia_director) " +
                " VALUES (" + "'" + nombreComptencia + "' , " + actorCompetencia + " , " + directorCompetencia + ")",
                (error, results, fields) => {
                    if (error) console.error(error);
                    if (!req.body) return res.status(400).send('Invalid body nombre');
                    res.status(201).send("Creado correctamente");
                })

        } else if (actorCompetencia == 0 && directorCompetencia > 0 && generoCompetencia > 0) {
            connection.query("INSERT INTO competencias (nombre, competencia_genero, competencia_director) " +
                " VALUES (" + "'" + nombreComptencia + "' , " + generoCompetencia + " , " + directorCompetencia + ")",
                (error, results, fields) => {
                    if (error) console.error(error);
                    if (!req.body) return res.status(400).send('Invalid body nombre');
                    res.status(201).send("Creado correctamente");
                })

        } else if (directorCompetencia == 0 && actorCompetencia > 0 && generoCompetencia > 0) {
            connection.query("INSERT INTO competencias (nombre, competencia_genero, competencia_actor) " +
                " VALUES (" + "'" + nombreComptencia + "' , " + generoCompetencia + " , " + actorCompetencia + ")",
                (error, results, fields) => {
                    if (error) console.error(error);
                    if (!req.body) return res.status(400).send('Invalid body nombre');
                    res.status(201).send("Creado correctamente");
                })

        } else if (directorCompetencia > 0 && actorCompetencia > 0 && generoCompetencia > 0) {
            connection.query("INSERT INTO competencias (nombre, competencia_genero, competencia_actor, competencia_director) " +
                " VALUES (" + "'" + nombreComptencia + "' , " + generoCompetencia + " , " + actorCompetencia + " , " + directorCompetencia + ")",
                (error, results, fields) => {
                    if (error) console.error(error);
                    if (!req.body) return res.status(400).send('Invalid body nombre');
                    res.status(201).send("Creado correctamente");
                })
        } else if (directorCompetencia > 0 && actorCompetencia == 0 && generoCompetencia == 0) {
            connection.query("INSERT INTO competencias (nombre, competencia_director) " +
                " VALUES (" + "'" + nombreComptencia + "' , " + directorCompetencia + ")",
                (error, results, fields) => {
                    if (error) console.error(error);
                    if (!req.body) return res.status(400).send('Invalid body nombre');
                    res.status(201).send("Creado correctamente");
                })
        } else if (directorCompetencia == 0 && actorCompetencia > 0 && generoCompetencia == 0) {
            connection.query("INSERT INTO competencias (nombre, competencia_actor) " +
                " VALUES (" + "'" + nombreComptencia + "' , " + actorCompetencia + ")",
                (error, results, fields) => {
                    if (error) console.error(error);
                    if (!req.body) return res.status(400).send('Invalid body nombre');
                    res.status(201).send("Creado correctamente");
                })
        } else if (directorCompetencia == 0 && actorCompetencia == 0 && generoCompetencia > 0) {
            connection.query("INSERT INTO competencias (nombre, competencia_genero) " +
                " VALUES (" + "'" + nombreComptencia + "' , " + generoCompetencia + " )",
                (error, results, fields) => {
                    if (error) console.error(error);
                    if (!req.body) return res.status(400).send('Invalid body nombre');
                    res.status(201).send("Creado correctamente");
                })
        } else if (directorCompetencia == 0 && actorCompetencia == 0 && generoCompetencia == 0) {
            connection.query(" ",
                (error, results, fields) => {
                    if (error) console.error(error);
                    if (!req.body) return res.status(400).send('Invalid body nombre');
                    res.status(422).send("Ingresar algun filtro");
                })
        }
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
        let nuevoNombre = req.body.nombre;
        let sql = "UPDATE competencias SET nombre = " + "'" + nuevoNombre + "'" + " WHERE id = ? "
        connection.query(sql, [idCompetencia],
            (error, results, fields) => {
                if (error) console.error(error);
                res.status(200).send("Nombre modificado");
            })
    }
}

module.exports = control;