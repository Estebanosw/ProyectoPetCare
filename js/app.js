const express = require('express');
const connection = require('./db');

const app = express();
app.use(express.json()); // Esto debe estar aquí antes de tus rutas

// Ruta Prueba
app.get('/api/PetCare', (req,res)=>{
    res.status(200).json({
        message: 'LA API RESPONDE CORRECTAMENTE',
        port: PORT,
        status: 'succes'
    });
});

// crear registro
app.post('/api/insertar', (req,res)=>{
    const { Documento, nombres, apellidos, correo, contrasenia } = req.body;
    const query1 = 'INSERT INTO usuario (Documento, nombres, apellidos, correo, contrasenia) VALUES (?, ?, ?, ?, ?)';
    connection.query(query1, [Documento, nombres, apellidos, correo, contrasenia], (error, result) => {
        if (error) {
            console.error("Error en la consulta:", error);
            res.status(500).json({ error });
        } else {
            // Cambia esto según cómo quieras devolver el ID
            res.status(201).json({ Documento: result.insertId, Documento, nombres, apellidos, correo, contrasenia});
        }
    });
});

// Puerto de Conexión del servidor
const PORT = 3000;
app.listen(PORT, () =>{
    console.log('Servidor Corriendo');
});