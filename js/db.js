const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3312,
    user: 'root',
    password: '1234',
    database: 'PetCare'

});

connection.connect((error) => {
    if(error){
        console.log('Error conectando con la base de datos', error);
        return
    }else{
        console.log('Conectado a la base de datos')
    }
});

module.exports = connection;