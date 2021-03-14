// @author Daniel Pérez Fernández

// Importamos las librerias
const fs = require('fs');
const express = require('express');
const helmet = require("helmet");
const bodyParser = require('body-parser');
const cors = require('cors')

// ExpresJS
const app = express();
const port = 8001;

// Body Parser
app.use(bodyParser.urlencoded({extended: true})); // This will help in encoding.
app.use(bodyParser.json()); // this will support json format

// Librería que añade una capa extra de seguridad
app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

// Permitimos el uso de cors
app.use(cors());

// Servir contenido estático
app.use(express.static('public'));

// Requerimos js
const email = require('./functions/emailTemples.js');


try {
    // Comprobamos si el archivo existe lo cargamos
    if (fs.existsSync('./data/datos.json')) {
        var datos = require('./data/datos.json');
    } else {
        // Si el archivo no existe inicializamos un array vacio
        var datos = [];
    }
} catch (err) {
    // En caso de error mostramos el mensaje por consola
    console.error(err);
}


app.get('/paises', (req, res) => {
    
    paises = [];

    datos.forEach(element => {
        paises.push(element.pais);
    });

    res.json(paises);
});


app.get('/buscar/:pais', (req, res) => {
    var pais = req.params.pais;
    datos_pais = [];

    datos.forEach(element => {
        if(element.pais === pais) {

            element.provincias.forEach(element => {
                datos_pais.push(element.provincia);
            });
            
        }
       
    });

    res.json(datos_pais);
});

app.get('/buscar/:pais/:provincia', (req, res) => {
    var pais = req.params.pais;
    var provincia = req.params.provincia;

    datos_pais = [];

    datos.forEach(element => {
        if(element.pais === pais) {

            element.provincias.forEach(element => {

                if(element.provincia === provincia) {
                    console.log("hey")
                    datos_pais.push(element.ciudades);
                }
                
            });
            
        }
       
    });

    res.json(datos_pais);
});


app.get('/email/:nombre', (req, res) => {
    var nombre = decodeURIComponent(req.params.nombre);
    
    res.send(email.altaEmailTemple(nombre).html);
});

app.post('/email/reserve/', (req, res) => {
    var reserve_data = JSON.parse(JSON.stringify(req.body));
    console.log(req.body);
    res.send(email.crearEmailReserva(reserve_data).html);
});

// Evitamos la indexación de la API por los motores de busqueda
app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
});

// Ruta génerica cuando ningúna de las anteriores es válida mostramos el 
// archivo de error 404
app.get('/*', (req, res) => {
    res.sendFile(__dirname+'/public/404.html');
});

// Muestra el puerto de escucha de nuestra aplicación en ExpressJS
app.listen(port, () => {
    console.log(`Aplicación ejecutandose en la ruta: http://localhost:${port}`)
})