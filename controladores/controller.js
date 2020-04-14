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
        connection.query("SELECT nombre, competencia_genero, competencia_actor, competencia_director FROM competencias WHERE id = ?", [idCompetencia],
            (error, competencia, fields) => {
                if (error) console.error(error);
                res.json(competencia[0]); // OBTENER NOMBRES GENEROS ETC
            })
    },
    getPeliculas: (req, res) => {
        if (!req.params.id || isNaN(req.params.id)) return res.status(400).send('Invalid Competencia id');
        let idCompetencia = req.params.id;
        let sqlCompe = "SELECT * FROM competencias AS c WHERE c.id = ? "


        connection.query(sqlCompe, [idCompetencia],
            (error, competencias, fields) => {
                if (error) return console.error(error);
                if (competencias.length == 0) return res.status(404).send();

                let competencia = competencias[0]
                let sqlPeli = " SELECT p.id, p.titulo, p.poster FROM pelicula p "

                let params = [];


                if (competencia.competencia_genero && competencia.competencia_actor && competencia.competencia_director) {
                    sqlPeli += " JOIN actor_pelicula ap ON ap.actor_id = ?" +
                        " JOIN director_pelicula dp ON dp.director_id = ?" +
                        " WHERE p.genero_id = ?" +
                        " AND ap.pelicula_id = p.id AND dp.pelicula_id = p.id" +
                        " ORDER BY RAND() LIMIT 2";
                    params.push(competencia.competencia_actor, competencia.competencia_director, competencia.competencia_genero);

                } else if (competencia.competencia_genero == null && competencia.competencia_actor && competencia.competencia_director) {
                    sqlPeli += " JOIN actor_pelicula ap ON ap.actor_id = ?" +
                        " JOIN director_pelicula dp ON dp.director_id = ?" +
                        " WHERE ap.pelicula_id = p.id AND dp.pelicula_id = p.id " +
                        " ORDER BY RAND() LIMIT 2";
                    params.push(competencia.competencia_actor, competencia.competencia_director);

                } else if (competencia.competencia_genero && competencia.competencia_actor == null && competencia.competencia_director) {
                    sqlPeli += " JOIN director_pelicula dp ON dp.director_id = ?" +
                        " WHERE dp.pelicula_id = p.id AND p.genero_id = ?" +
                        " ORDER BY RAND() LIMIT 2";
                    params.push(competencia.competencia_director, competencia.competencia_genero);

                } else if (competencia.competencia_actor && competencia.competencia_genero && competencia.competencia_director == null) {
                    sqlPeli += " JOIN actor_pelicula ap ON ap.actor_id = ?" +
                        " WHERE ap.pelicula_id = p.id AND p.genero_id = ?" +
                        " ORDER BY RAND() LIMIT 2",
                        params.push(competencia.competencia_actor, competencia.competencia_genero);

                } else if (competencia.competencia_genero && competencia.competencia_actor == null && competencia.competencia_director == null) {
                    sqlPeli += " WHERE p.genero_id = ?" +
                        " ORDER BY RAND() LIMIT 2";
                    params.push(competencia.competencia_genero);

                } else if (competencia.competencia_genero == null && competencia.competencia_actor && competencia.competencia_director == null) {
                    sqlPeli += " JOIN actor_pelicula ap ON ap.actor_id = ?" +
                        " WHERE ap.pelicula_id = p.id" +
                        " ORDER BY RAND() LIMIT 2";
                    params.push(competencia.competencia_actor);

                } else if (competencia.competencia_genero == null && competencia.competencia_actor == null && competencia.competencia_director) {
                    sqlPeli += " JOIN director_pelicula dp ON dp.director_id = ?" +
                        " WHERE dp.pelicula_id = p.id" +
                        " ORDER BY RAND() LIMIT 2";
                    params.push(competencia.competencia_director);
                }
                connection.query(sqlPeli, params,
                    (error, peliculas, fields) => {
                        if (error) return console.error(error);
                        console.log(params);
                        console.log(sqlPeli);
                        res.json({
                            competencia: competencia.nombre,
                            peliculas: peliculas
                        })
                    })
            })
    },
    postVotos: (req, res) => {
        if (!req.params.idCompetencia || isNaN(req.params.idCompetencia)) return res.status(400).send('Invalid Competencia id');
        let idCompetencia = req.params.idCompetencia;
        let idPelicula = req.body.idPelicula;
        // BUSCAR LA COMPETENCIA PARA VER SI EXISTE
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
            connection.query("SELECT nombre FROM competencias",
                (error, results, fields) => {
                    if (error) return console.error(error);
                    if (!req.body) return res.status(400).send('Invalid body nombre');
                    return res.status(422).send("Nombre es un campo obligatorio");
                })
        }
        if (nombreComptencia) {
            connection.query("SELECT nombre FROM competencias",
                (error, results, fields) => {
                    if (error) return console.error(error);
                    if (!req.body) return res.status(400).send('Invalid body nombre');
                    results.forEach((e) => {
                        if (e.nombre == nombreComptencia) {
                            return res.status(422).send("Este nombre de competencia ya existe")
                        }
                    })
                })
        }


        if (generoCompetencia == 0 && actorCompetencia > 0 && directorCompetencia > 0) {
            connection.query("INSERT INTO competencias (nombre, competencia_actor, competencia_director) " +
                " VALUES (" + "'" + nombreComptencia + "' , " + actorCompetencia + " , " + directorCompetencia + ")",
                (error, results, fields) => {
                    if (error) return console.error(error);
                    if (!req.body) return res.status(400).send('Invalid body nombre');
                    res.status(201).send("Creado correctamente");
                })

        } else if (actorCompetencia == 0 && directorCompetencia > 0 && generoCompetencia > 0) {
            connection.query("INSERT INTO competencias (nombre, competencia_genero, competencia_director) " +
                " VALUES (" + "'" + nombreComptencia + "' , " + generoCompetencia + " , " + directorCompetencia + ")",
                (error, results, fields) => {
                    if (error) return console.error(error);
                    if (!req.body) return res.status(400).send('Invalid body nombre');
                    res.status(201).send("Creado correctamente");
                })

        } else if (directorCompetencia == 0 && actorCompetencia > 0 && generoCompetencia > 0) {
            connection.query("INSERT INTO competencias (nombre, competencia_genero, competencia_actor) " +
                " VALUES (" + "'" + nombreComptencia + "' , " + generoCompetencia + " , " + actorCompetencia + ")",
                (error, results, fields) => {
                    if (error) return console.error(error);
                    if (!req.body) return res.status(400).send('Invalid body nombre');
                    res.status(201).send("Creado correctamente");
                })

        } else if (directorCompetencia > 0 && actorCompetencia > 0 && generoCompetencia > 0) {
            connection.query("INSERT INTO competencias (nombre, competencia_genero, competencia_actor, competencia_director) " +
                " VALUES (" + "'" + nombreComptencia + "' , " + generoCompetencia + " , " + actorCompetencia + " , " + directorCompetencia + ")",
                (error, results, fields) => {
                    if (error) return console.error(error);
                    if (!req.body) return res.status(400).send('Invalid body nombre');
                    res.status(201).send("Creado correctamente");
                })
        } else if (directorCompetencia > 0 && actorCompetencia == 0 && generoCompetencia == 0) {
            connection.query("INSERT INTO competencias (nombre, competencia_director) " +
                " VALUES (" + "'" + nombreComptencia + "' , " + directorCompetencia + ")",
                (error, results, fields) => {
                    if (error) return console.error(error);
                    if (!req.body) return res.status(400).send('Invalid body nombre');
                    res.status(201).send("Creado correctamente");
                })
        } else if (directorCompetencia == 0 && actorCompetencia > 0 && generoCompetencia == 0) {
            connection.query("INSERT INTO competencias (nombre, competencia_actor) " +
                " VALUES (" + "'" + nombreComptencia + "' , " + actorCompetencia + ")",
                (error, results, fields) => {
                    if (error) return console.error(error);
                    if (!req.body) return res.status(400).send('Invalid body nombre');
                    res.status(201).send("Creado correctamente");
                })
        } else if (directorCompetencia == 0 && actorCompetencia == 0 && generoCompetencia > 0) {
            connection.query("INSERT INTO competencias (nombre, competencia_genero) " +
                " VALUES (" + "'" + nombreComptencia + "' , " + generoCompetencia + " )",
                (error, results, fields) => {
                    if (error) return console.error(error);
                    if (!req.body) return res.status(400).send('Invalid body nombre');
                    res.status(201).send("Creado correctamente");
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