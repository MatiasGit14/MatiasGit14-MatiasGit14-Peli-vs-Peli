const connection = require("../bd/conexionbd");

const control = {
    getCompetencias: (req, res) => {

        connection.query("SELECT nombre FROM competencias",
            (error, results, fields) => {
                if (error) console.error(error)
                res.json({ data: results })
            });
    }
};

module.exports = control;