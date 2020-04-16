const connection = require("../bd/conexionbd");

const control = {
    getCompetencias: (req, res) => {

        connection.query("SELECT * FROM competencias",
            (error, competencias, fields) => {
                if (error) return console.error(error);
                res.json(competencias);
            })
    },
    getCompetencia: (req, res) => {
        let idCompetencia = req.params.idCompetencia;
        connection.query("SELECT nombre, competencia_genero, competencia_actor, competencia_director FROM competencias WHERE id = ?", [idCompetencia],
            (error, competencias, fields) => {
                if (error) return console.error(error);
                if (competencias.length == 0) return res.status(404).send("Competencia inexistente");
                res.json(competencias[0]);
            })
    },
    getPeliculas: (req, res) => {
        let idCompetencia = req.params.idCompetencia;
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

                } else if (competencia.competencia_actor && competencia.competencia_director) {
                    sqlPeli += " JOIN actor_pelicula ap ON ap.actor_id = ?" +
                        " JOIN director_pelicula dp ON dp.director_id = ?" +
                        " WHERE ap.pelicula_id = p.id AND dp.pelicula_id = p.id " +
                        " ORDER BY RAND() LIMIT 2";
                    params.push(competencia.competencia_actor, competencia.competencia_director);

                } else if (competencia.competencia_genero && competencia.competencia_director) {
                    sqlPeli += " JOIN director_pelicula dp ON dp.director_id = ?" +
                        " WHERE dp.pelicula_id = p.id AND p.genero_id = ?" +
                        " ORDER BY RAND() LIMIT 2";
                    params.push(competencia.competencia_director, competencia.competencia_genero);

                } else if (competencia.competencia_actor && competencia.competencia_genero) {
                    sqlPeli += " JOIN actor_pelicula ap ON ap.actor_id = ?" +
                        " WHERE ap.pelicula_id = p.id AND p.genero_id = ?" +
                        " ORDER BY RAND() LIMIT 2",
                        params.push(competencia.competencia_actor, competencia.competencia_genero);

                } else if (competencia.competencia_genero) {
                    sqlPeli += " WHERE p.genero_id = ?" +
                        " ORDER BY RAND() LIMIT 2";
                    params.push(competencia.competencia_genero);

                } else if (competencia.competencia_actor) {
                    sqlPeli += " JOIN actor_pelicula ap ON ap.actor_id = ?" +
                        " WHERE ap.pelicula_id = p.id" +
                        " ORDER BY RAND() LIMIT 2";
                    params.push(competencia.competencia_actor);

                } else if (competencia.competencia_director) {
                    sqlPeli += " JOIN director_pelicula dp ON dp.director_id = ?" +
                        " WHERE dp.pelicula_id = p.id" +
                        " ORDER BY RAND() LIMIT 2";
                    params.push(competencia.competencia_director);

                } else {
                    sqlPeli += "WHERE p.genero_id = ? ORDER BY RAND() LIMIT 2";
                    competencias.forEach((competencia) => {
                        if (competencia.id == 1) {
                            params.push(5);
                        } else if (competencia.id == 2) {
                            params.push(10);
                        } else if (competencia.id == 3) {
                            params.push(8);
                        }
                    });
                }
                connection.query(sqlPeli, params,
                    (error, peliculas, fields) => {
                        if (error) return console.error(error);
                        res.json({
                            competencia: competencia.nombre,
                            peliculas: peliculas
                        })
                    })
            })
    },
    postVotos: (req, res) => {
        let idCompetencia = req.params.idCompetencia;

        connection.query("SELECT * FROM competencias", [idCompetencia],
            (error, competencias, fields) => {
                if (error) return console.error(error);
                if (competencias.length == 0) return res.status(404).send("Competencia inexistente");

                let idPelicula = req.body.idPelicula;

                connection.query(
                    "INSERT INTO votacion (pelicula_id, competencia_id, votos) " +
                    " VALUES ( ?, ?, 1)", [idPelicula, idCompetencia],
                    (error, results, fields) => {
                        if (error) return console.error(error);
                        if (!req.body) return res.status(400).send('Invalid body Pelicula ID');
                        res.json(results);
                    })
            })
    },
    getResultados: (req, res) => {
        let idCompetencia = req.params.idCompetencia;

        connection.query("SELECT nombre FROM competencias WHERE id = ?", [idCompetencia],
            (error, competencias, fields) => {
                if (error) return console.error(error);
                if (competencias.length == 0) return res.status(404).send("Competencia inexistente");
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
                        if (error) return console.error(error);
                        res.json({
                            competencias: competencias[0].nombre,
                            resultados: votos
                        })

                    })
            })
    },
    postCompetencias: (req, res) => {
        let nombreCompetencia = req.body.nombre;

        connection.query("SELECT nombre FROM competencias WHERE nombre = ?", [nombreCompetencia],
            (error, nombresCompetencias, fields) => {
                if (error) return console.error(error);
                if (!nombreCompetencia) return res.status(422).send('Nombre es un campo obligatorio');
                if (nombresCompetencias.length > 0) return res.status(422).send("Este nombre de competencia ya existe");

                let generoCompetencia = req.body.genero;
                let actorCompetencia = req.body.actor;
                let directorCompetencia = req.body.director;

                let insertParams = [];
                let pelisParams = [];

                let insertSql = "INSERT INTO competencias ";
                let cantPeliculas = "SELECT count(1) cantidad_peliculas FROM pelicula p ";


                if (nombreCompetencia && generoCompetencia > 0 && actorCompetencia > 0 && directorCompetencia > 0) {

                    insertSql += "(nombre, competencia_genero, competencia_actor, competencia_director) VALUES (?,?,?,?)";
                    insertParams.push(nombreCompetencia, generoCompetencia, actorCompetencia, directorCompetencia);
                    cantPeliculas += " JOIN actor_pelicula ap ON ap.pelicula_id = p.id " +
                        " JOIN director_pelicula dp ON dp.pelicula_id = p.id " +
                        " WHERE p.genero_id = ? AND ap.actor_id = ? AND dp.director_id = ?";
                    pelisParams.push(generoCompetencia, actorCompetencia, directorCompetencia);

                } else if (nombreCompetencia && actorCompetencia > 0 && directorCompetencia > 0) {

                    insertSql += "(nombre, competencia_actor, competencia_director) VALUES (?,?,?)";
                    insertParams.push(nombreCompetencia, actorCompetencia, directorCompetencia);
                    cantPeliculas += " JOIN actor_pelicula ap ON ap.pelicula_id = p.id " +
                        " JOIN director_pelicula dp ON dp.pelicula_id = p.id " +
                        " WHERE ap.actor_id = ? AND dp.director_id = ? ";
                    pelisParams.push(actorCompetencia, directorCompetencia);

                } else if (nombreCompetencia && generoCompetencia > 0 && directorCompetencia > 0) {

                    insertSql += "(nombre, competencia_genero, competencia_director) VALUES (?,?,?)";
                    insertParams.push(nombreCompetencia, generoCompetencia, directorCompetencia);
                    cantPeliculas += " JOIN director_pelicula dp ON dp.pelicula_id = p.id " +
                        " WHERE p.genero_id = ?  AND dp.director_id = ? ";
                    pelisParams.push(generoCompetencia, directorCompetencia);

                } else if (nombreCompetencia && generoCompetencia > 0 && actorCompetencia > 0) {

                    insertSql += "(nombre, competencia_genero, competencia_actor) VALUES (?,?,?)";
                    insertParams.push(nombreCompetencia, generoCompetencia, actorCompetencia);
                    cantPeliculas += " JOIN actor_pelicula ap ON ap.pelicula_id = p.id " +
                        " WHERE p.genero_id = ? AND ap.actor_id = ?";
                    pelisParams.push(generoCompetencia, actorCompetencia);

                } else if (nombreCompetencia && directorCompetencia > 0) {

                    insertSql += "(nombre, competencia_director) VALUES (?,?)";
                    insertParams.push(nombreCompetencia, directorCompetencia);
                    cantPeliculas += " JOIN director_pelicula dp ON dp.pelicula_id = p.id " +
                        " WHERE dp.director_id = ? ";
                    pelisParams.push(directorCompetencia);


                } else if (nombreCompetencia && actorCompetencia > 0) {

                    insertSql += "(nombre, competencia_actor) VALUES (?,?)";
                    insertParams.push(nombreCompetencia, actorCompetencia);
                    cantPeliculas += " JOIN actor_pelicula ap ON ap.pelicula_id = p.id " +
                        " WHERE ap.actor_id = ? ";
                    pelisParams.push(actorCompetencia);

                } else if (nombreCompetencia && generoCompetencia > 0) {

                    insertSql += "(nombre, competencia_genero) VALUES (?,?)";
                    insertParams.push(nombreCompetencia, generoCompetencia);
                    cantPeliculas += " WHERE p.genero_id = ? ";
                    pelisParams.push(generoCompetencia);

                } else {
                    return res.status(422).send("Al menos un parametro es obligatorio");
                }

                connection.query(cantPeliculas,
                    pelisParams, (error, results, fields) => {
                        if (error) return console.error(error);
                        if (results[0].cantidad_peliculas < 2) return res.status(422).json("No hay dos peliculas que cumplan esos parametros");

                        connection.query(insertSql,
                            insertParams, (error, results, fields) => {
                                if (error) return console.error(error);
                                res.json(results);
                            })
                    })
            })

    },
    deleteVotos: (req, res) => {
        let idCompetencia = req.params.idCompetencia;
        connection.query("DELETE FROM votacion WHERE competencia_id = ? ", [idCompetencia],
            (error, competencias, fields) => {
                if (error) return console.error(error);
                if (competencias.length == 0) return res.status(404).send("Competencia inexistente");
                res.status(205).send("Reiniciado correctamente");
            })
    },
    getGeneros: (req, res) => {
        connection.query("SELECT * FROM genero ",
            (error, results, fields) => {
                if (error) return console.error(error);
                res.json(results);
            })
    },
    getDirectores: (req, res) => {
        connection.query("SELECT * FROM director ",
            (error, results, fields) => {
                if (error) return console.error(error);
                res.json(results);
            })
    },
    getActores: (req, res) => {
        connection.query("SELECT * FROM actor ",
            (error, results, fields) => {
                if (error) return console.error(error);
                res.json(results);
            })
    },
    deleteCompetencia: (req, res) => {
        let idCompetencia = req.params.idCompetencia;

        connection.query("DELETE FROM votacion WHERE competencia_id = ? ", [idCompetencia],
            (error, competencias, fields) => {
                if (error) return console.error(error);
                if (competencias.length == 0) return res.status(404).send("Competencia inexistente");
                connection.query("DELETE FROM competencias WHERE id = ? ", [idCompetencia],
                    (error, results, fields) => {
                        if (error) return console.error(error);
                        res.status(200).send("Borrado correctamente");
                    })
            })
    },
    putNombreCompetencia: (req, res) => {
        let idCompetencia = req.params.idCompetencia;
        let nuevoNombre = req.body.nombre;
        let sql = "UPDATE competencias SET nombre = " + "'" + nuevoNombre + "'" + " WHERE id = ? "
        connection.query(sql, [idCompetencia],
            (error, competencias, fields) => {
                if (error) return console.error(error);
                if (competencias.length == 0) return res.status(404).send("Competencia inexistente");
                res.status(200).send("Nombre modificado");
            })
    }
}

module.exports = control;