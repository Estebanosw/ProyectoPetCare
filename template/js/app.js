const path = require('path');   // Para ejecutar desde index.html
const express = require('express');
const connection = require('./db');
const { error } = require('console');
const cors = require("cors");
const bcrypt = require("bcrypt");

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

//Número de rondas para generar el hash con bcrypt
const saltRounds = 10;

// crear registro
app.post('/api/insertar', (req,res)=>{
    const { Documento, nombres, apellidos, correo, contrasenia } = req.body;
    
    //Agregando la encriptación con hash de la contraseña
    bcrypt.hash(contrasenia, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error al encriptar la contraseña",
                details: err.message
            });
        }
        const query1 = 'INSERT INTO usuario (Documento, nombres, apellidos, correo, contrasenia) VALUES (?, ?, ?, ?, ?)';
        connection.query(query1, [Documento, nombres, apellidos, correo, hashedPassword], (error, result) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') { // Código de error para duplicado
                    return res.status(409).json({ error: "El documento ya existe en el sistema." });
                } else {
                    console.error("Error en la consulta:", error);
                    return res.status(500).json({ error: "Error en la creación del registro." });
                }
            } else {
                res.status(201).json({ Documento: result.insertId, Documento, nombres, apellidos, correo });
            }
        });
    });
});

// Ruta de login
app.post('/api/login', (req, res) => {
    const { Documento, contrasenia } = req.body;

    // Consulta SQL para obtener el usuario por su documento
    const query = 'SELECT * FROM usuario WHERE Documento = ?';
    connection.query(query, [Documento], (error, results) => {
        if (error) {
            console.error("Error en la consulta:", error);
            return res.status(500).json({ message: "Error en el servidor" });
        }

        if (results.length === 0) {
            // Si no se encontró ningún usuario con el documento proporcionado
            return res.status(401).json({ message: "Documento o contraseña incorrecta" });
        }

        // Si el usuario existe, verificar la contraseña hasheada
        const usuario = results[0]; //Si la consulta encontró al menos un resultado, toma el primer usuario en el arreglo results.
        bcrypt.compare(contrasenia, usuario.contrasenia, (err, isMatch) => {
            if (err) {
                console.error("Error al comparar contraseñas:", err);
                return res.status(500).json({ message: "Error en el servidor" });
            }

            if (isMatch) {
                // Si la contraseña coincide
                return res.status(200).json({ message: "Login exitoso. ¡Bienvenido a PetCare!" });
            } else {
                // Si la contraseña no coincide
                return res.status(401).json({ message: "Documento o contraseña incorrecta" });
            }
        });
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

// Consultar los registros de la Tablamascota
app.get('/api/consultarmascota/:UsuarioDocumento/:tipoMascota/:nombreMascota', (req, res) => {
    const query = `
        SELECT m.id, tp.descripciontipom, m.nombre, r.descripcionraza, m.fechanacimiento 
        FROM mascota AS m 
        INNER JOIN tipomascota AS tp ON m.tipomascotaid = tp.id 
        INNER JOIN raza AS r ON r.id = m.razaid 
        WHERE m.UsuarioDocumento = ? 
          AND tp.descripciontipom = ? 
          AND m.nombre LIKE ?;
    `;

    const usuarioDocumento = req.params.UsuarioDocumento;
    const tipoMascota = req.params.tipoMascota;
    const nombreMascota = `%${req.params.nombreMascota}%`;

    connection.query(query, [usuarioDocumento, tipoMascota, nombreMascota], (error, result) => {
        if (error) {
            res.status(500).json({
                success: false,
                message: "Error de recuperación de datos",
                details: error.message
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

// Puerto de Conexión del servidor
const PORT = 3000;
app.listen(PORT, () =>{
    console.log('Servidor Corriendo');
});