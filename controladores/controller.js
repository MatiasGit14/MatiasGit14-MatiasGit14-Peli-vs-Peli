const connection = require("../bd/conexionbd");

const control = {
    prueba: (req, res) => {
        res.json("Esto funciona");
    }
};

module.exports = control;