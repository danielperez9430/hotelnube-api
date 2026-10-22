const { describe, it, afterEach } = require('node:test');
const assert = require('node:assert/strict');

const rutaConfig = require.resolve('../config.js');
const entornoOriginal = { ...process.env };

// Carga config.js de nuevo con las variables de entorno indicadas
function cargarConfig(entorno) {
  delete process.env.SITE_URL;
  delete process.env.ALLOWED_ORIGINS;
  Object.assign(process.env, entorno);
  delete require.cache[rutaConfig];
  return require(rutaConfig);
}

describe('config', () => {
  afterEach(() => {
    process.env = { ...entornoOriginal };
    delete require.cache[rutaConfig];
  });

  it('usa http://localhost:8000 por defecto y permite solo ese origen', () => {
    const config = cargarConfig({});
    assert.equal(config.siteUrl, 'http://localhost:8000');
    assert.deepEqual(config.allowedOrigins, ['http://localhost:8000']);
  });

  it('quita la barra final de SITE_URL y deriva el origen', () => {
    const config = cargarConfig({ SITE_URL: 'https://hotel.test/web/' });
    assert.equal(config.siteUrl, 'https://hotel.test/web');
    assert.deepEqual(config.allowedOrigins, ['https://hotel.test']);
  });

  it('lee ALLOWED_ORIGINS separada por comas', () => {
    const config = cargarConfig({ ALLOWED_ORIGINS: 'https://a.test, https://b.test/ ,' });
    assert.deepEqual(config.allowedOrigins, ['https://a.test', 'https://b.test']);
  });
});
