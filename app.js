// 1 - Invocamos a Express
const express = require('express');
const app = express();

//2 - Para poder capturar los datos del formulario (sin urlencoded nos devuelve "undefined")
app.use(express.urlencoded({extended:false}));
app.use(express.json());//además le decimos a express que vamos a usar json

//3- Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env'});

//4 -seteamos el directorio de assets
app.use('/resources',express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));
app.use('/img', express.static('imagenes'));

//5 - Establecemos el motor de plantillas
app.set('view engine','ejs');

//6 -Invocamos a bcrypt
const bcrypt = require('bcryptjs');

//7- variables de session
const session = require('express-session');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


// 8 - Invocamos a la conexion de la DB
const connection = require('./database/db');

//9 - establecemos las rutas
	app.get('/login',(req, res)=>{
		res.render('login');
	})

	app.get('/register',(req, res)=>{
		res.render('register');
	})

	app.get('/ver',(req, res)=>{
		res.render('ver');
	})



//10 - Método para la REGISTRACIÓN
app.post('/register', async (req, res)=>{
	const user = req.body.user;
	const name = req.body.name;
    const rol = req.body.rol;
	const pass = req.body.pass;
	let passwordHash = await bcrypt.hash(pass, 8);
    connection.query('INSERT INTO users SET ?',{user:user, name:name, rol:rol, pass:passwordHash}, async (error, results)=>{
        if(error){
            console.log(error);
        }else{   
            res.redirect('/');           
    
        }
	});
})



//11 - Metodo para la autenticacion
app.post('/auth', async (req, res)=> {
	const user = req.body.user;
	const pass = req.body.pass;    
    let passwordHash = await bcrypt.hash(pass, 8);
	if (user && pass) {
		connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results, fields)=> {
			if( results.length == 0 || !(await bcrypt.compare(pass, results[0].pass)) ) { 
                res.send('Incorrect Username and/or Password!');	   
			
			} else {         
				//creamos una var de session y le asignamos true si INICIO SESSION       
				req.session.loggedin = true;                
				req.session.name = results[0].name;

				res.redirect('/');
			}			
			res.end();
		});
	} else {	
		res.send('Please enter user and Password!');
		res.end();
	}
});

//12 - Método para controlar que está auth en todas las páginas
app.get('/', (req, res)=> {
	if (req.session.loggedin) {
		res.render('index',{
			login: true,
			name: req.session.name			
		});		
	} else {
		res.render('index',{
			login:false,
			name:'Debe iniciar sesión',			
		});				
	}
	res.end();
});


//función para limpiar la caché luego del logout
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

 //Logout
//Destruye la sesión.
app.get('/logout', function (req, res) {
	req.session.destroy(() => {
	  res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
	})
});


const fs = require('fs');
const mime = require('mime');


const path = require('path');

// Definir la ruta del archivo
const rutaArchivo = './models/script.js';

// Obtener la ruta absoluta del archivo
const rutaAbsoluta = path.resolve(rutaArchivo);

// Verificar si el archivo existe
if (fs.existsSync(rutaAbsoluta)) {
  console.log('El archivo se encuentra en la ubicación correcta.');
} else {
  console.log('El archivo no se encuentra en la ubicación correcta.');
}

app.get('/ver', function(req, res) {
	const url = './models/script.js';
  
	fs.readFile(url, function(err, data) {
	  if (err) {
		res.writeHead(404);
		return res.end("Archivo no encontrado.");
	  }
  
	  const mimeType = mime.lookup(url);
	  res.set('Content-Type', 'text/javascript');
	  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
	  res.set('Pragma', 'no-cache');
	  res.set('Expires', '0');
	  res.writeHead(200);
	  res.end(data);
	});
  });

app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3000');
});
