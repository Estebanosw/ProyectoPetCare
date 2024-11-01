const path = require('path');   // Para ejecutar desde index.html
const express = require('express');
const connection = require('./db');
const { error } = require('console');
const cors = require("cors");


const app = express();
app.use(express.json()); // Esto debe estar aquí antes de tus rutas

// Servir el archivo index.html
app.use(express.static(path.join(__dirname, 'template')));
app.use(cors());

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
            if (error.code === 'ER_DUP_ENTRY') { // Código de error para duplicado
                return res.status(409).json({ error: "El documento ya existe en el sistema." });
            } else {
                console.error("Error en la consulta:", error);
                return res.status(500).json({ error: "Error en la creación del registro." });
            }
        } else {
            res.status(201).json({ Documento: result.insertId, Documento, nombres, apellidos, correo, contrasenia });
        }
    });
});

// Ruta de login
app.post('/api/login', (req, res) => {
    const { Documento, contrasenia } = req.body;

    // Consulta SQL para verificar si el usuario existe y la contraseña es correcta
    const query = 'SELECT * FROM usuario WHERE Documento = ? AND contrasenia = ?';
    connection.query(query, [Documento, contrasenia], (error, results) => {
        if (error) {
            console.error("Error en la consulta:", error);
            res.status(500).json({ message: "Error en el servidor" });
        } else if (results.length > 0) {
            // Si se encontró un usuario que coincide, el login es exitoso
            res.status(200).json({ message: "Login exitoso. ¡Bienvenido a PetCare!" });
        } else {
            // Si no hay coincidencias, devuelve un error de autenticación
            res.status(401).json({ message: "Documento o contraseña incorrecta" });
        }
    });
});

// consulta de tipomascota
app.get('/api/obtenermascota', (req, res) => {
    const query = "select id,descripciontipom from tipomascota;";
    connection.query(query, (error, result) => {

        if (error) {
            res.status(500).json({
                success: false,
                message: "Error de recuperacion datos",
                datails: error.message
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Datos de la tabla",
                data: result
            });
            //res.json(result);
        }
    })
});

// consulta de raza
app.get('/api/obtenerraza/:tipomascotaid', (req, res) => {
    const { tipomascotaid } = req.params; // Obtener el ID de la mascota de los parámetros de la ruta
    const query = "SELECT * FROM raza WHERE tipomascotaid = ?;";

    connection.query(query, [tipomascotaid], (error, result) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: "Error de recuperación de datos",
                datails: error.message
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Datos de la tabla",
                data: result
            });
        }
    });
});

// Ruta POST para guardar el registro de mascota
app.post('/api/guardar', (req, res) => {
    const { tipomascotaid, nombre, razaid, fechanacimiento, UsuarioDocumento } = req.body;

    // Validar que los campos requeridos no estén vacíos
    if (!tipomascotaid || !nombre || !razaid || !fechanacimiento || !UsuarioDocumento) {
        return res.status(400).json({ success: false, message: 'Todos los campos son requeridos.' });
    }

    // Consulta SQL para insertar una nueva mascota
    const sql = 'INSERT INTO mascota (tipomascotaid, nombre, razaid, fechanacimiento, UsuarioDocumento) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [tipomascotaid, nombre, razaid, fechanacimiento, UsuarioDocumento], (error, result) => {
        if (error) {
            console.error('Error al insertar mascota:', error); // Registro del error en el servidor
            return res.status(500).json({ success: false, message: 'Error al guardar la mascota', error: error.message });
        } else {
            // Responder con éxito y un mensaje claro
            res.status(201).json({ 
                success: true, 
                id: result.insertId, 
                message: 'Mascota creada correctamente' // Mensaje de éxito
            });
        }
    });
});


// Puerto de Conexión del servidor
const PORT = 3000;
app.listen(PORT, () =>{
    console.log('Servidor Corriendo');
});