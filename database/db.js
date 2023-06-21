//2 - Invocamos a MySQL y realizamos la conexion
const mysql = require('mysql');
const connection = mysql.createConnection({
    //Con variables de entorno
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DATABASE
});

connection.connect((error)=>{
    if (error) {
      console.error('El error de conexión es: ' + error);
      return;
    }
    console.log('¡Conectado a la Base de Datos!');
  });

  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    imagen VARCHAR(255) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL
  )
`;

connection.query(createTableQuery, (err, result) => {
  if (err) throw err;
  console.log('Tabla "carrito" creada exitosamente');

  
});


process.on('SIGINT', function () {
  console.log('Desconectado de la Base de Datos');
  connection.end();
  process.exit(0);
});




  module.exports = connection;