<p align="center">
  <img src=".github/banner.png" alt="Hotel Nube API — Geographic data · Email templates" width="100%">
</p>

# ☁️ Hotel Nube API

[![CI](https://github.com/danielperez9430/hotelnube-api/actions/workflows/ci.yml/badge.svg)](https://github.com/danielperez9430/hotelnube-api/actions/workflows/ci.yml)

API auxiliar de **[Hotel Nube](https://github.com/danielperez9430/hotel-nube-proyecto)**. Se encarga de dos cosas:

- 🌍 **Datos geográficos**: países, provincias y ciudades para los formularios de registro y de ajustes de cuenta.
- ✉️ **Plantillas de correo**: genera el HTML de los correos de bienvenida y de confirmación de reserva con [MJML](https://mjml.io).

> [!NOTE]
> Esta API solo la consume Hotel Nube. La web la usa desde `public/src/js/login.js`, `public/src/js/userAccountSettings.js` y `php/Email/email.php`.

## 📑 Índice

- [🧰 Tecnologías](#-tecnologías)
- [✅ Requisitos](#-requisitos)
- [🚀 Puesta en marcha](#-puesta-en-marcha)
- [⚙️ Configuración](#️-configuración)
- [🐳 Docker](#-docker)
- [📡 Endpoints](#-endpoints)
  - [🌍 Datos geográficos](#-datos-geográficos)
  - [✉️ Correos](#️-correos)
  - [🤖 Otros](#-otros)
- [🧪 Tests y lint](#-tests-y-lint)
- [🗂️ Estructura del proyecto](#️-estructura-del-proyecto)
- [🎨 Identidad visual](#-identidad-visual)
- [🔒 Seguridad](#-seguridad)
- [🤝 Contribuir](#-contribuir)
- [📄 Licencia](#-licencia)

## 🧰 Tecnologías

| Paquete | Uso |
| ------- | --- |
| [Express 5](https://expressjs.com) | Servidor HTTP y rutas |
| [Helmet 8](https://helmetjs.github.io) | Cabeceras de seguridad |
| [cors](https://github.com/expressjs/cors) | Permite llamadas desde el navegador de los dominios autorizados |
| [MJML 5](https://mjml.io) | Compilación de las plantillas de correo a HTML compatible con clientes de email |

## ✅ Requisitos

- 🟢 **Node.js 18** o superior
- 📦 **npm**

## 🚀 Puesta en marcha

```bash
# 1. Clona el repositorio
git clone https://github.com/danielperez9430/hotelnube-api.git
cd hotelnube-api

# 2. Instala las dependencias exactas del package-lock.json
npm ci

# 3. Arranca la API
npm start
```

Verás en la consola:

```
Aplicación ejecutandose en la ruta: http://localhost:8001
```

## ⚙️ Configuración

| Variable | Por defecto | Descripción |
| -------- | ----------- | ----------- |
| `PORT` | `8001` | Puerto en el que escucha la API |
| `SITE_URL` | `http://localhost:8000` | URL pública de la web de Hotel Nube (sin barra final; si la lleva se quita). Se usa en los enlaces e imágenes de los correos y en el botón **Regresar** de la página 404 |
| `ALLOWED_ORIGINS` | origen de `SITE_URL` | Orígenes separados por comas que pueden llamar a la API desde el navegador (CORS) |

```bash
PORT=3000 SITE_URL=https://hotelnube.example.com npm start

# Varios orígenes permitidos
ALLOWED_ORIGINS="https://hotelnube.example.com,http://localhost:8000" npm start
```

## 🐳 Docker

El [`Dockerfile`](Dockerfile) genera una imagen `node:24-alpine` con solo las dependencias de producción, que se ejecuta con el usuario sin privilegios `node` y escucha en el puerto `8001`.

```bash
docker build -t hotelnube-api .
docker run --rm -p 8001:8001 -e SITE_URL=http://localhost:8000 hotelnube-api
```

La web de Hotel Nube puede construirla directamente desde el repositorio en su `docker-compose.yml`:

```yaml
services:
  api:
    build: https://github.com/danielperez9430/hotelnube-api.git#master
    environment:
      SITE_URL: http://localhost:8000
    ports:
      - "8001:8001"
```

## 📡 Endpoints

### 🌍 Datos geográficos

Los datos se leen de [`data/datos.json`](data/datos.json) al arrancar.

| Método | Ruta | Respuesta |
| ------ | ---- | --------- |
| `GET` | `/paises` | Array con los nombres de los países |
| `GET` | `/buscar/:pais` | Array con las provincias del país |
| `GET` | `/buscar/:pais/:provincia` | Array que contiene **un** array con las ciudades de la provincia |

Si el país o la provincia no existen, la respuesta es un array vacío `[]`.

<details>
<summary>📋 Ejemplos</summary>

```bash
curl http://localhost:8001/paises
# ["Russian Federation","United States","Spain", ...]

curl http://localhost:8001/buscar/Spain
# ["A Coruna","Alacant","Alava", ...]

curl "http://localhost:8001/buscar/Spain/A%20Coruna"
# [["A Bana","A Capela","A Coruna", ...]]
```

</details>

### ✉️ Correos

Ambas rutas devuelven el **HTML completo** del correo, listo para enviarlo. Todos los datos recibidos se escapan antes de insertarlos en la plantilla.

Los enlaces del correo (botón Booking, redes sociales, Privacy Policy y Contact) y las imágenes (logo y fondo) apuntan a la web indicada en `SITE_URL`:

| Elemento | URL |
| -------- | --- |
| 🖼️ Logo | `${SITE_URL}/src/logo/hotel_nube.png` |
| 🛏️ Imagen de fondo | `${SITE_URL}/src/img/deluxe_room/cama_lateral_hab_deluxe.jpg` |
| 🔗 Booking y redes sociales | `${SITE_URL}/` |
| 🔒 Privacy Policy | `${SITE_URL}/privacy.php` |
| 📝 Contact | `${SITE_URL}/contact.php` |

#### 👋 `GET /email/:nombre` — Correo de bienvenida

Los `+` del nombre se convierten en espacios.

```bash
curl "http://localhost:8001/email/Jos%C3%A9+Mu%C3%B1oz"
```

#### 🛏️ `POST /email/reserve` — Confirmación de reserva

Acepta JSON o formulario (`application/x-www-form-urlencoded`). El total del pedido se calcula sumando el `precio` de todas las habitaciones.

```json
{
  "id": 1,
  "order_date": "2021-03-01",
  "nombre": "Marcos López",
  "habitaciones": [
    {
      "room_name": "Deluxe Room",
      "room_img": "http://localhost:8000/src/img/carousel/1.jpg",
      "fecha_entrada": "2021-03-02",
      "fecha_salida": "2021-03-04",
      "precio": "150"
    }
  ]
}
```

| Código | Cuándo |
| ------ | ------ |
| `200` | HTML del correo |
| `400` | La reserva no incluye ninguna habitación |

### 🤖 Otros

| Método | Ruta | Respuesta |
| ------ | ---- | --------- |
| `GET` | `/robots.txt` | Impide la indexación de la API en buscadores |
| `*` | Cualquier otra ruta | `404` con la página [`views/404.html`](views/404.html) |

La página 404 no carga nada de fuera: el reproductor [lottie-player](https://github.com/LottieFiles/lottie-player) 2.0.12 (licencia MIT) está en `public/vendor/lottie-player/` y la animación en `public/animations/404.json`.

## 🧪 Tests y lint

Los tests usan el runner nativo de Node ([`node:test`](https://nodejs.org/api/test.html)) y [supertest](https://github.com/ladjs/supertest), sin levantar el servidor. El lint usa [ESLint](https://eslint.org) con la configuración recomendada.

```bash
npm ci          # instala también las dependencias de desarrollo
npm test        # ejecuta los tests de test/
npm run lint    # revisa el código con ESLint
```

> [!NOTE]
> Las herramientas de desarrollo (ESLint 10) necesitan **Node.js 20.19, 22.13 o 24** en adelante; para ejecutar la API basta con Node.js 18.

🤖 **Integración continua**: [GitHub Actions](.github/workflows/ci.yml) ejecuta `npm run lint` y `npm test` con Node 22 y 24 en cada push y pull request a `master`.

## 🗂️ Estructura del proyecto

```
hotelnube-api/
├── 📄 app.js                   # Aplicación Express y definición de rutas
├── 📄 index.js                 # Arranque del servidor
├── ⚙️ config.js                # Configuración a partir de variables de entorno
├── 📁 functions/
│   └── emailTemples.js         # Plantillas MJML de los correos
├── 📁 data/
│   └── datos.json              # Países, provincias y ciudades
├── 📁 views/
│   └── 404.html                # Plantilla de la 404 ({{SITE_URL}} se sustituye al arrancar)
├── 📁 public/                  # Contenido estático
│   ├── css/                    # Estilos de la página 404
│   ├── animations/             # Animación de la página 404
│   └── vendor/lottie-player/   # Reproductor de animaciones (copia local)
├── 📁 test/                    # Tests (node:test + supertest)
├── 📁 .github/                 # Integración continua y banner del README
├── 🐳 Dockerfile
├── 🧹 eslint.config.js
├── 📦 package.json
└── 🔒 package-lock.json
```

## 🎨 Identidad visual

Los correos y la página 404 siguen la paleta de lujo de Hotel Nube: carbón `#1F2929`, oro `#DCB004` y marfil `#F5EFE0`. Las imágenes de los correos (logo y fotos de las habitaciones) se sirven desde la web de Hotel Nube (`SITE_URL`).

## 🔒 Seguridad

- 🪖 **Helmet** añade cabeceras de seguridad. La CSP está desactivada porque la API devuelve HTML de correos.
- 🧼 **Escapado de datos**: todo lo que se inserta en las plantillas pasa por `escaparHtml()`, que evita inyectar HTML o scripts en los correos.
- 🌐 **CORS restringido**: solo los orígenes de `ALLOWED_ORIGINS` (o, si no se define, el de `SITE_URL`) reciben la cabecera `Access-Control-Allow-Origin`; el navegador bloquea al resto. Las peticiones sin cabecera `Origin`, como las del servidor PHP o `curl`, funcionan igual.
- 📦 **Sin recursos de terceros en la página 404**: el script y la animación se sirven desde la propia API, con la versión fijada.

## 🤝 Contribuir

1. 🌿 Crea una rama con un prefijo descriptivo: `feat/`, `hotfix/`, `chore/`, `docs/`...
2. ✍️ Escribe los commits siguiendo [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/):
   ```
   fix(email): calcula el total real de la reserva
   build(deps): actualiza mjml a 5.4.1
   ```
3. ✅ Comprueba que `npm run lint` y `npm test` pasan.
4. 🔀 Abre un Pull Request contra `master` explicando el cambio y cómo se ha probado.

## 📄 Licencia

ISC © Daniel Pérez Fernández
