// Configuración de la aplicación a partir de las variables de entorno.
// Se calcula una sola vez al arrancar y el resto de módulos la importan de aquí.

const port = process.env.PORT || 8001;

// URL pública de la web de Hotel Nube, sin barra final
const siteUrl = (process.env.SITE_URL || 'http://localhost:8000').trim().replace(/\/+$/, '');

// Orígenes que pueden llamar a la API desde el navegador. Si no se indican,
// solo se permite el origen de la propia web (SITE_URL)
function calcularOrigenesPermitidos() {
  if (process.env.ALLOWED_ORIGINS) {
    return process.env.ALLOWED_ORIGINS
      .split(',')
      .map(origen => origen.trim().replace(/\/+$/, ''))
      .filter(Boolean);
  }

  try {
    return [new URL(siteUrl).origin];
  } catch {
    return [];
  }
}

const allowedOrigins = calcularOrigenesPermitidos();

module.exports = { port, siteUrl, allowedOrigins };
