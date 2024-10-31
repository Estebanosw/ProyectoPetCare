const express = require('express');
const connection = require('./db');
const app = express();

// Encargado de parsear a los json
app.use(express.json());

// Puerto de Conexión del servidor
const PORT = 3000;
app.listen(PORT, () =>{
    console.log('Servidor Corriendo');
});