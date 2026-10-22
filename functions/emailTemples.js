const mjml2html = require('mjml');

// Opciones de la librería mjml
var options = {
  "collapseWhitespace": true, "minifyCSS": true, "removeEmptyAttributes": true
};


/**
 * Función que compila el temple de MJML y lo devuelve compilado
 * 
 * @param {String} nombre cadena de texto con el nombre del usuario
 * @returns {Promise<Object>} promesa con el resultado de mjml ({ html, errors })
 */
async function altaEmailTemple(nombre) {
	
	var nombre_saneado = escaparHtml(nombre);

  return mjml2html(`<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <!-- Logo Hotel Nube-->
        <mj-image width="200px" src="https://danielperez.es/hotel_nube.png"></mj-image>

        <mj-divider border-color="#212529"></mj-divider>

        <mj-text font-size="25px" color="black" font-family="helvetica" padding-top="20px">Welcome ${nombre_saneado}! &#x1F44B;</mj-text>

        <mj-text font-size="20px" color="grey" font-family="helvetica" padding-top="20px" align="center" font-style="italic">&#x275d; Where your dreams will be as soft as the clouds &#x275e;</mj-text>


        <mj-text font-size="20px" color="black" font-family="helvetica" padding-top="20px">Your account was successfully created, now you can reserve rooms, get discounts ...</mj-text>
      </mj-column>
    </mj-section>

    <!-- Image -->
    <mj-section background-url="https://danielperez.es/cama_lateral_hab_deluxe.jpg" background-size="cover" background-repeat="no-repeat">
      <mj-column width="600px">
        <mj-text color="#ffffff" font-weight="bold" align="center" text-transform="uppercase" font-size="40px" letter-spacing="1px" padding-top="30px" container-background-color="rgba(0,0,0,0.3)">Soft dreams</mj-text>
        <mj-button background-color="#F63A4D" href="https://hotelnube.ml">
          Booking
        </mj-button>
      </mj-column>
    </mj-section>

    <!-- Redes sociales -->

    <mj-wrapper full-width="full-width">
      <mj-section>
        <mj-column width="100%" padding="0">
          <mj-social font-size="15px" icon-size="30px" mode="horizontal" padding="0" align="center">
            <mj-social-element name="facebook" href="https://hotelnube.ml" background-color="#A1A0A0">
            </mj-social-element>
            <mj-social-element name="google" href="https://hotelnube.ml" background-color="#A1A0A0">
            </mj-social-element>
            <mj-social-element name="twitter" href="https://hotelnube.ml" background-color="#A1A0A0">
            </mj-social-element>
            <mj-social-element name="linkedin" href="https://hotelnube.ml/" background-color="#A1A0A0">
            </mj-social-element>
          </mj-social>
        </mj-column>
      </mj-section>

      <!-- Sección Final -->
      <mj-section>
        <mj-column width="100%" padding-right="0">
          <mj-text font-size="15px" color="grey" font-family="helvetica" align="center">&#xa9; Hotel Nube 2021</mj-text>
        </mj-column>
        <mj-column>
          <mj-text font-size="15px" color="grey" font-family="helvetica" align="center"><a style="text-decoration:none" href="https://hotelnube.ml/privacy">&#x1F512; Privacy Policy</a></mj-text>
        </mj-column>
        <mj-column>
          <mj-text font-size="15px" color="grey" font-family="helvetica" align="center"><a style="text-decoration:none" href="https://hotelnube.ml/contact">&#x1F4DD; Contact</a></mj-text>
        </mj-column>
      </mj-section>

    </mj-wrapper>


  </mj-body>
</mjml>`, options);
}

/**
 * Función que crea la plantilla de las habitaciones
 * 
 * @param {Array} data recibe un array con la información de las habitaciones
 * @returns {String} cadena de texto con la plantilla de las habitaciones
 */
function crearHabitacion(data) {

  var habitaciones = "";


  data.habitaciones.forEach(element => {

    habitaciones += `<mj-section background-color="#f3f3f0">
    <mj-column>
      <mj-image width="500px" src="${escaparHtml(element.room_img)}"></mj-image>
    </mj-column>
    <mj-column padding-right="10px" padding-left="10px">
      <mj-text font-weight="bold" align="center" font-size="24px" color="#000" font-family="helvetica">${escaparHtml(element.room_name)}</mj-text>
      <mj-divider border-color="red" border-width="2px" padding="2px"></mj-divider>
      <mj-text align="justify" font-size="15px" color="#000" padding-top="20px" font-family="helvetica">&#x1F4C5; <b>Check-in:</b> ${escaparHtml(element.fecha_entrada)}</mj-text>
      <mj-text align="justify" font-size="15px" color="#000" font-family="helvetica">&#x1F4C5; <b>Check-out:</b> ${escaparHtml(element.fecha_salida)}</mj-text>
      <mj-text align="center" font-size="15px" color="#000" font-family="helvetica"><b>Price:</b> ${escaparHtml(element.precio)}&euro;</mj-text>
    </mj-column>
  </mj-section>`;
  });
  return habitaciones;
}

/**
 * Función que genera el email de la reserva
 * 
 * @param {Object} reserva Objecto con la información de la reserva
 * @returns {Promise<Object>} promesa con el resultado de mjml ({ html, errors })
 */
async function crearEmailReserva(reserva) {

   var habitaciones = crearHabitacion(reserva);

   // Sumamos el precio de todas las habitaciones reservadas
   var total = reserva.habitaciones.reduce((suma, habitacion) => suma + Number(habitacion.precio), 0);
   var order_total_price = escaparHtml(Math.round(total * 100) / 100) + '&euro;';

  var emailTemple = `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <!-- Logo Hotel Nube-->
        <mj-image width="200px" src="https://danielperez.es/hotel_nube.png"></mj-image>

        <mj-divider border-color="#212529"></mj-divider>

        <mj-text font-size="25px" color="black" font-family="helvetica" padding-top="20px">Hi ${escaparHtml(reserva.nombre)}! &#x1F44B;</mj-text>

        <mj-text font-size="20px" color="grey" font-family="helvetica" padding-top="20px" align="center" font-style="italic">&#x275d; Your order was correctly registered in our system&#x275e;</mj-text>
      </mj-column>
    </mj-section>

    <!-- Order Summary -->
    <mj-section background-color="#ffffff" background-repeat="repeat" background-size="auto" padding-bottom="0px" padding-top="1px" padding="20px 0" text-align="center">
      <mj-column>
        <mj-text align="left" color="#55575d" font-family="helvetica" font-size="30px" line-height="22px" padding-bottom="10px" padding="10px 25px">
          <p style="line-height: 30px; margin: 10px 0; text-align: center; color:#151e23; font-size:30p; font-family:helvetica">- Summary of your order -</p>
        </mj-text>
      </mj-column>
    </mj-section>


    <!-- Habitaciones Reservadas -->
      ${habitaciones}

    <!-- Order data -->
    <mj-section background-color="#568feb" padding-bottom="15px">
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="Ubuntu, Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Order Number</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${escaparHtml(reserva.id)}</mj-text>
      </mj-column>
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="Ubuntu, Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Order Date</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${escaparHtml(reserva.order_date)}</mj-text>
      </mj-column>
      <mj-column>
        <mj-text align="center" color="#FFF" font-size="15px" font-family="Ubuntu, Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="0px"><strong>Total Price</strong></mj-text>
        <mj-text align="center" color="#FFF" font-size="13px" font-family="Helvetica" padding-left="25px" padding-right="25px" padding-bottom="20px" padding-top="10px">${order_total_price}</mj-text>
      </mj-column>
    </mj-section>

    <!-- Redes sociales -->

    <mj-wrapper full-width="full-width">
      <mj-section>
        <mj-column width="100%" padding="0">
          <mj-social font-size="15px" icon-size="30px" mode="horizontal" padding="0" align="center">
            <mj-social-element name="facebook" href="https://hotelnube.ml" background-color="#A1A0A0">
            </mj-social-element>
            <mj-social-element name="google" href="https://hotelnube.ml" background-color="#A1A0A0">
            </mj-social-element>
            <mj-social-element name="twitter" href="https://hotelnube.ml" background-color="#A1A0A0">
            </mj-social-element>
            <mj-social-element name="linkedin" href="https://hotelnube.ml/" background-color="#A1A0A0">
            </mj-social-element>
          </mj-social>
        </mj-column>
      </mj-section>

      <!-- Sección Final -->
      <mj-section>
        <mj-column width="100%" padding-right="0">
          <mj-text font-size="15px" color="grey" font-family="helvetica" align="center">&#xa9; Hotel Nube 2021</mj-text>
        </mj-column>
        <mj-column>
          <mj-text font-size="15px" color="grey" font-family="helvetica" align="center"><a style="text-decoration:none" href="https://hotelnube.ml/privacy">&#x1F512; Privacy Policy</a></mj-text>
        </mj-column>
        <mj-column>
          <mj-text font-size="15px" color="grey" font-family="helvetica" align="center"><a style="text-decoration:none" href="https://hotelnube.ml/contact">&#x1F4DD; Contact</a></mj-text>
        </mj-column>
      </mj-section>

    </mj-wrapper>


  </mj-body>
</mjml>`;

  return mjml2html(emailTemple, options);
}

/**
 * Función que escapa un texto para insertarlo de forma segura en la plantilla.
 * Convierte los caracteres especiales de HTML y todos los caracteres no ASCII
 * (tildes, eñes, emojis...) en entidades HTML numéricas
 * 
 * @param {*} valor valor a escapar, se convierte a cadena de texto
 * @returns {String} cadena de texto escapada
 */
function escaparHtml(valor) {
  return String(valor ?? '').replace(/[&<>"']|[^\x00-\x7F]/gu, c => `&#${c.codePointAt(0)};`);
}

module.exports = { altaEmailTemple, crearEmailReserva };
