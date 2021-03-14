## Email API

Esta API se encargará de generar un html empleando una

| Método | URL            | Ejemplo     | Resultado          |
| ------ | -------------- | ----------- | ------------------ |
| GET    | /emai/:name    | /email/Paco | html con el correo |
| POST   | /email/reserve |             |                    |

```javascript
{
	"id": 1,
	"order_date": "1233",
	"nombre": "Marcos López",
	"habitaciones": [{
		"room_name": "Habitación Test",
		"room_img": "https://hotelnube.ml/src/img/carousel/1.jpg",
		"fecha_entrada": "2020-01-11",
		"fecha_salida": "2020-01-12",
		"precio": "10"
	}, {
		"room_name": "Casa",
		"room_img": "https://hotelnube.ml/src/img/carousel/1.jpg",
		"fecha_entrada": "2020-01-11",
		"fecha_salida": "2020-01-12",
		"precio": "10"
	}, {
		"room_name": "Casa",
		"room_img": "https://hotelnube.ml/src/img/carousel/1.jpg",
		"fecha_entrada": "2020-01-11",
		"fecha_salida": "2020-01-12",
		"precio": "10"
	}]
}
```

## Datos Paises API

| Método | URL                      | Resultado                                                                              |
| ------ | ------------------------ | -------------------------------------------------------------------------------------- |
| GET    | /paises                  | Array con los nombre de los paises                                                     |
| GET    | /buscar/:pais            | Array con las provincias del pais solicitado. Ejemplo: `/buscar/Spain`                 |
| GET    | /buscar/:pais/:provincia | Array con las ciudades del pais y provincia solicitados. Ejemplo: `/buscar/Spain/Vigo` |
