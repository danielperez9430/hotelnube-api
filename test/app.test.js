const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

// La configuración se lee al cargar la app: hay que definirla antes del require
const SITE_URL = 'https://hotel.test';
process.env.SITE_URL = `${SITE_URL}/`;
delete process.env.ALLOWED_ORIGINS;

const request = require('supertest');
const app = require('../app.js');

describe('Datos geográficos', () => {
  it('GET /paises devuelve la lista de países', async () => {
    const res = await request(app).get('/paises').expect(200).expect('Content-Type', /json/);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.includes('Spain'));
    assert.ok(res.body.every(pais => typeof pais === 'string'));
  });

  it('GET /buscar/:pais devuelve las provincias del país', async () => {
    const res = await request(app).get('/buscar/Spain').expect(200);
    assert.ok(res.body.includes('A Coruna'));
    assert.ok(res.body.every(provincia => typeof provincia === 'string'));
  });

  it('GET /buscar/:pais con un país inexistente devuelve []', async () => {
    const res = await request(app).get('/buscar/Atlantida').expect(200);
    assert.deepEqual(res.body, []);
  });

  it('GET /buscar/:pais/:provincia devuelve un array con un array de ciudades', async () => {
    const res = await request(app).get('/buscar/Spain/A%20Coruna').expect(200);
    assert.equal(res.body.length, 1);
    assert.ok(Array.isArray(res.body[0]));
    assert.ok(res.body[0].includes('A Capela'));
  });

  it('GET /buscar/:pais/:provincia con una provincia inexistente devuelve []', async () => {
    const res = await request(app).get('/buscar/Spain/Nada').expect(200);
    assert.deepEqual(res.body, []);
  });
});

describe('Correo de bienvenida', () => {
  let html;

  before(async () => {
    const res = await request(app)
      .get('/email/%3Cscript%3Ealert(1)%3C%2Fscript%3EJos%C3%A9+Mu%C3%B1oz')
      .expect(200)
      .expect('Content-Type', /html/);
    html = res.text;
  });

  it('escapa las etiquetas HTML del nombre', () => {
    assert.ok(!html.includes('<script>alert(1)'));
    assert.ok(html.includes('&#60;script&#62;alert(1)&#60;/script&#62;'));
  });

  it('escapa los caracteres no ASCII y convierte los + en espacios', () => {
    assert.ok(html.includes('Jos&#233; Mu&#241;oz'));
  });

  it('construye las URLs con SITE_URL (sin barra final)', () => {
    assert.ok(html.includes(`${SITE_URL}/src/logo/hotel_nube.png`));
    assert.ok(html.includes(`${SITE_URL}/src/img/deluxe_room/cama_lateral_hab_deluxe.jpg`));
    assert.ok(html.includes(`${SITE_URL}/privacy.php`));
    assert.ok(html.includes(`${SITE_URL}/contact.php`));
    assert.ok(!html.includes('hotelnube.ml'));
    assert.ok(!html.includes('danielperez.es'));
  });
});

describe('Correo de reserva', () => {
  const reserva = {
    id: 7,
    order_date: '2021-03-01',
    nombre: 'Marcos López',
    habitaciones: [
      { room_name: 'Deluxe Room', room_img: 'img1.jpg', fecha_entrada: '2021-03-02', fecha_salida: '2021-03-04', precio: '150' },
      { room_name: 'Single Room', room_img: 'img2.jpg', fecha_entrada: '2021-03-05', fecha_salida: '2021-03-06', precio: '80.5' },
    ],
  };

  it('acepta JSON y calcula el total sumando los precios', async () => {
    const res = await request(app).post('/email/reserve').send(reserva).expect(200);
    assert.ok(res.text.includes('230.5&euro;'));
    assert.ok(res.text.includes('Marcos L&#243;pez'));
    assert.ok(res.text.includes(`${SITE_URL}/contact.php`));
  });

  it('acepta un formulario urlencoded con habitaciones anidadas', async () => {
    const res = await request(app)
      .post('/email/reserve')
      .type('form')
      .send('id=7&nombre=Marcos&order_date=2021-03-01'
        + '&habitaciones[0][room_name]=Deluxe&habitaciones[0][precio]=150'
        + '&habitaciones[1][room_name]=Single&habitaciones[1][precio]=80.5')
      .expect(200);
    assert.ok(res.text.includes('230.5&euro;'));
  });

  it('responde 400 si la reserva no tiene habitaciones', async () => {
    await request(app).post('/email/reserve').send({ id: 1, habitaciones: [] }).expect(400);
    await request(app).post('/email/reserve').send({ id: 1 }).expect(400);
  });
});

describe('Rutas inexistentes y robots.txt', () => {
  for (const metodo of ['get', 'post']) {
    it(`${metodo.toUpperCase()} a una ruta inexistente devuelve 404 con la página propia`, async () => {
      const res = await request(app)[metodo]('/no-existe').expect(404).expect('Content-Type', /html/);
      assert.ok(res.text.includes('Ups, la página que busca no existe'));
      assert.ok(res.text.includes(`data-href="${SITE_URL}/"`));
      assert.ok(!res.text.includes('{{SITE_URL}}'));
      assert.ok(!/<(script|link|lottie-player)[^>]*(src|href)="(https?:)?\/\//.test(res.text));
    });
  }

  it('la plantilla de la 404 no se puede pedir directamente', async () => {
    const res = await request(app).get('/404.html').expect(404);
    assert.ok(!res.text.includes('{{SITE_URL}}'));
  });

  it('GET /robots.txt impide la indexación', async () => {
    const res = await request(app).get('/robots.txt').expect(200).expect('Content-Type', /text\/plain/);
    assert.equal(res.text, 'User-agent: *\nDisallow: /');
  });
});

describe('CORS', () => {
  it('refleja la cabecera para un origen permitido', async () => {
    const res = await request(app).get('/paises').set('Origin', SITE_URL).expect(200);
    assert.equal(res.headers['access-control-allow-origin'], SITE_URL);
  });

  it('no envía la cabecera para un origen no permitido', async () => {
    const res = await request(app).get('/paises').set('Origin', 'https://otro.example').expect(200);
    assert.equal(res.headers['access-control-allow-origin'], undefined);
  });

  it('funciona sin cabecera Origin', async () => {
    const res = await request(app).get('/paises').expect(200);
    assert.equal(res.headers['access-control-allow-origin'], undefined);
    assert.ok(res.body.length > 0);
  });
});
