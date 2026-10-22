# ☁️ Hotel Nube API

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
- [📡 Endpoints](#-endpoints)
  - [🌍 Datos geográficos](#-datos-geográficos)
  - [✉️ Correos](#️-correos)
  - [🤖 Otros](#-otros)
- [🗂️ Estructura del proyecto](#️-estructura-del-proyecto)
- [🔒 Seguridad](#-seguridad)
- [🤝 Contribuir](#-contribuir)
- [📄 Licencia](#-licencia)

## 🧰 Tecnologías

| Paquete | Uso |
| ------- | --- |
| [Express 5](https://expressjs.com) | Servidor HTTP y rutas |
| [Helmet 8](https://helmetjs.github.io) | Cabeceras de seguridad |
| [cors](https://github.com/expressjs/cors) | Permite llamadas desde el navegador de otros dominios |
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

```bash
PORT=3000 npm start
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
# ["A Coruna","Alava","Albacete", ...]

curl "http://localhost:8001/buscar/Spain/A%20Coruna"
# [["A Bana","A Capela","A Coruna", ...]]
```

</details>

### ✉️ Correos

Ambas rutas devuelven el **HTML completo** del correo, listo para enviarlo. Todos los datos recibidos se escapan antes de insertarlos en la plantilla.

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
      "room_img": "https://hotelnube.ml/src/img/carousel/1.jpg",
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
| `*` | Cualquier otra ruta | `404` con la página [`public/404.html`](public/404.html) |

## 🗂️ Estructura del proyecto

```
hotelnube-api/
├── 📄 index.js                 # Servidor Express y definición de rutas
├── 📁 functions/
│   └── emailTemples.js         # Plantillas MJML de los correos
├── 📁 data/
│   └── datos.json              # Países, provincias y ciudades
├── 📁 public/                  # Contenido estático (página 404 y estilos)
├── 📦 package.json
└── 🔒 package-lock.json
```

## 🔒 Seguridad

- 🪖 **Helmet** añade cabeceras de seguridad. La CSP está desactivada porque la API devuelve HTML de correos.
- 🧼 **Escapado de datos**: todo lo que se inserta en las plantillas pasa por `escaparHtml()`, que evita inyectar HTML o scripts en los correos.
- 🌐 **CORS abierto**: cualquier origen puede llamar a la API. Si se despliega en producción, conviene limitarlo al dominio de Hotel Nube.

## 🤝 Contribuir

1. 🌿 Crea una rama con un prefijo descriptivo: `feat/`, `hotfix/`, `chore/`, `docs/`...
2. ✍️ Escribe los commits siguiendo [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/):
   ```
   fix(email): calcula el total real de la reserva
   build(deps): actualiza mjml a 5.4.1
   ```
3. 🔀 Abre un Pull Request contra `master` explicando el cambio y cómo se ha probado.

## 📄 Licencia

ISC © Daniel Pérez Fernández
