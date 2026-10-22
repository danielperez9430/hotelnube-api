// @author Daniel Pérez Fernández

// Importamos las librerias
const fs = require('fs');
const express = require('express');
const helmet = require("helmet");
const bodyParser = require('body-parser');
const cors = require('cors');

// ExpresJS
const app = express();
const port = process.env.PORT || 8001;

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


let datos = [];

try {
    // Comprobamos si el archivo existe y lo cargamos
    if (fs.existsSync('./data/datos.json')) {
        datos = require('./data/datos.json');
    }
} catch (err) {
    // En caso de error mostramos el mensaje por consola y seguimos con un array vacío
    console.error(err);
}


app.get('/paises', (req, res) => {
    
    res.json(datos.map(element => element.pais));
});


app.get('/buscar/:pais', (req, res) => {
    const pais = req.params.pais;
    const datos_pais = [];

    datos.forEach(element => {
        if (element.pais === pais) {
            element.provincias.forEach(element => {
                datos_pais.push(element.provincia);
            });
        }
    });

    res.json(datos_pais);
});

app.get('/buscar/:pais/:provincia', (req, res) => {
    const pais = req.params.pais;
    const provincia = req.params.provincia;
    const datos_pais = [];

    datos.forEach(element => {
        if (element.pais === pais) {
            element.provincias.forEach(element => {
                if (element.provincia === provincia) {
                    datos_pais.push(element.ciudades);
                }
            });
        }
    });

    res.json(datos_pais);
});


app.get('/email/:nombre', (req, res) => {

    const nombre = req.params.nombre.replace(/\+/g, " ");
    
    res.send(email.altaEmailTemple(nombre).html);
});

app.post('/email/reserve/', (req, res) => {
    const reserva = req.body;

    // Validamos que la reserva tenga al menos una habitación
    if (!reserva || !Array.isArray(reserva.habitaciones) || reserva.habitaciones.length === 0) {
        return res.status(400).json({ error: 'La reserva debe incluir al menos una habitación' });
    }

    res.send(email.crearEmailReserva(reserva).html);
});

// Evitamos la indexación de la API por los motores de busqueda
app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
});

// Ruta génerica cuando ningúna de las anteriores es válida mostramos el 
// archivo de error 404
app.use((req, res) => {
    res.status(404).sendFile(__dirname + '/public/404.html');
});

// Muestra el puerto de escucha de nuestra aplicación en ExpressJS
app.listen(port, () => {
    console.log(`Aplicación ejecutandose en la ruta: http://localhost:${port}`)
})