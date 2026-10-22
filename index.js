// @author Daniel Pérez Fernández

const app = require('./app.js');
const { port } = require('./config.js');

// Muestra el puerto de escucha de nuestra aplicación en ExpressJS
app.listen(port, () => {
    console.log(`Aplicación ejecutandose en la ruta: http://localhost:${port}`);
});
