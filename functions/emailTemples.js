const mjml2html = require('mjml');

var options = {
  
  "collapseWhitespace": false, "minifyCSS": false, "removeEmptyAttributes": true
};

var htmlOutput;

/*
  Compile an mjml string
*/
function altaEmailTemple(nombre) {
htmlOutput = mjml2html(`
<mjml>
<mj-body>
  <mj-section>
    <mj-column>
      <!-- Logo Hotel Nube-->
      <mj-image width="200px" src="https://danielperez.es/hotel_nube.png"></mj-image>

      <mj-divider border-color="#212529"></mj-divider>

      <mj-text font-size="25px" color="black" font-family="helvetica" padding-top="20px">Welcome ${nombre}! &#x1F44B;</mj-text>

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
</mjml>
`, options);

  return JSON.parse(JSON.stringify(htmlOutput));
}

module.exports = {altaEmailTemple};
