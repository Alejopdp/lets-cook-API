import { RecipeSelection } from "../bounded_contexts/operations/domain/order/RecipeSelection";

export const welcomeTemplate = (
    customerName: string,
    recipeSelection: RecipeSelection[],
    planName: string,
    hasRestrictionComment: boolean,
    shippingCost: number,
    firstOrderId: string,
    shippingDay: string,
    isPlanAhorro: boolean
) => {
    return `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <title>Gracias por tu compra</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <style type="text/css">
          body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
          table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
          img { -ms-interpolation-mode: bicubic; }
  
          /* RESET STYLES */
          img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
          table { border-collapse: collapse !important; }
          body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
  
          /* iOS BLUE LINKS */
          a[x-apple-data-detectors] {
              color: inherit !important;
              text-decoration: none !important;
              font-size: inherit !important;
              font-family: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
          }
  
          /* GMAIL BLUE LINKS */
          u + #body a {
              color: inherit;
              text-decoration: none;
              font-size: inherit;
              font-family: inherit;
              font-weight: inherit;
              line-height: inherit;
          }
  
          /* SAMSUNG MAIL BLUE LINKS */
          #MessageViewBody a {
              color: inherit;
              text-decoration: none;
              font-size: inherit;
              font-family: inherit;
              font-weight: inherit;
              line-height: inherit;
          }
  
          /* These rules set the link and hover states, making it clear that links are, in fact, links. */
          /* Embrace established conventions like underlines on links to keep emails accessible. */
          a { color: #B200FD; font-weight: 600; text-decoration: underline; }
          a:hover { color: #000000 !important; text-decoration: none !important; }
  
          /* These rules adjust styles for desktop devices, keeping the email responsive for users. */
          /* Some email clients don't properly apply media query-based styles, which is why we go mobile-first. */
          @media screen and (min-width:600px) {
              h1 { font-size: 48px !important; line-height: 48px !important; }
              .intro { font-size: 24px !important; line-height: 36px !important; }
          }
      </style>
    </head>
    <body style="margin: 0 !important; padding: 0 !important;background: #00a55522;">
  
      <div style="display: none; max-height: 0; overflow: hidden;">
              
      </div>
      <div style="display: none; max-height: 0px; overflow: hidden;">
      &nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;
      </div>
  
      <!--[if (gte mso 9)|(IE)]>
      <table cellspacing="0" cellpadding="0" border="0" width="600" align="center" role="presentation"><tr><td>
      <![endif]-->
      <!-- The role and aria-label attributes are added to wrap the email content as an article for screen readers. Some of them will read out the aria-label as the title of the document, so use something like "An email from Your Brand Name" to make it recognizable. -->
      <!-- Default styling of text is applied to the wrapper div. Be sure to use text that is large enough and has a high contrast with the background color for people with visual impairments. -->
      <div role="article" aria-label="Tu Baul- compra confirmada" lang="en" style="background-color: transparent ; color: #2b2b2b; font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; font-size: 18px; font-weight: 400; line-height: 28px; margin: 0 auto; max-width: 1000px; padding: 40px 16px 40px 16px;">
          
          <header>
              <!-- Since this is a purely decorative image, we can leave the alternative text blank. -->
              <!-- Linking images also helps with Gmail displaying download links next to them. -->
              <a href="https://tubaulonline.com">
                  <center><img src="https://estudiantes.tubaulonline.com/tu_baul_logo.png" alt="" height="intrinsic" width="80"></center>
              </a>
          </header>
  
          <main>
              <!-- This div is purely presentational, providing a container for the message. -->
              <div style="background-color: white; border-radius: 64px; padding: 32px 40px;">
                  <!-- This ghost table is used solely for padding in Word-based Outlook clients. -->
                  <!--[if (gte mso 9)|(IE)]>
                  <table cellspacing="0" cellpadding="0" border="0" width="600" align="center" role="presentation"><tr><td style="background-color: ghostwhite;font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; padding: 24px 48px 24px 48px;">
                  <![endif]-->
                  <h1 style="color: #00a555; font-size: 24px; font-weight: 800; line-height: 24px; margin: 48px 0;">
                      Hola ${customerName},<br>
                      ¡Gracias por tu compra!
                  </h1>
                      
                  ¡Mmmm qué buena pinta!

                  Gracias por apuntarte a este planazo. A partir de ahora, con Let’s Cook, tu rutina y la de los tuyos será mucho más divertida y saludable. Te lo pondremos fácil para que puedas cocinar bueno y rico, aprender nuevas recetas y saborear platos con mucha chispa. ¿Pinta bien no?<br><br>

                  ${
                      Array.isArray(recipeSelection) && recipeSelection.length > 0
                          ? `Vemos que ya has elegido tus primeras recetas de tu plan para la semana que viene. ¡Qué rapidez! Se notan las ganas de iniciarse en Let’s Cook. O el hambre… <br><br> Estas son las recetas que has elegido: <ul>${recipeSelection.map(
                                (selection) => `<li>${selection.quantity} x ${selection.recipe.getName()}</li>`
                            )} </ul>`
                          : `Como te has apuntado al ${planName}, lo primero que debes hacer es elegir tus recetas para la semana que viene. ¿Cuáles serán los platos con los que iniciarás tu carrera de chef en Let’s Cook?  Entra en <a href="${process.env.CUSTOMER_ORIGIN_URL}/elegir-recetas/${firstOrderId}">nuestra web</a> con tu usuario y haz clic en “ELEGIR RECETAS”, selecciona las que más te apetezcan y acepta. ¿Tienes dudas? No te preocupes, te lo explicamos en este vídeo [ENLACE aún no definido porque la web todavia no esta terminada]. Normalmente registramos las elecciones de las recetas hasta el viernes anterior a las 23.59. Si para entonces no nos has indicado nada, enviaremos las más elegidas de la semana.`
                  }

                  ${
                      hasRestrictionComment
                          ? "Si has marcado algún tipo de intolerancia o dieta especial, adaptaremos tu kit a tu perfil. Por ejemplo, sustituyendo el cuscús (gluten) por quinoa o el yogur (lactosa) por yogur sin lactosa<br><br>"
                          : "<br>"
                  }

                  Los lunes recibirás por email las recetas paso-a-paso de los kits seleccionados y también en la etiqueta de los kits encontrarás 2 códigos QR: uno con la receta paso a paso y otro con la video-receta. Como ves, enviamos las recetas digitalmente, así reducimos al máximo el papel y cuidamos de nuestro planeta. ¡En Let’s Cook nada se tira!<br><br>
                  
                  ${
                      shippingCost > 0
                          ? `En tu caso, al ser un envío de larga distancia, recibirás tu kit el ${shippingDay} y se te cobrará los gastos de envío a partir de la segunda entrega ${shippingCost}. Gracias por confiar en nosotr@s a pesar de los kilómetros que nos separan.<br><br>`
                          : `Recibirás tus kits los ${shippingDay} entre las 3 PM y las 9 PM. Te enviaremos un WhatsApp el mismo ${shippingDay} para confirmar la hora de entrega.<br><br>`
                  }
                  
                  ${
                      isPlanAhorro
                          ? ""
                          : "De cara a las próximas semanas, normalmente registramos las elecciones de las recetas hasta el viernes anterior a las 23.59. Si para entonces no nos has indicado nada, seleccionaremos las más elegidas. ¡Igual no siempre eres tan rápid@ como hoy!<br><br>"
                  }
                  
                  
                  Si quieres saltar una semana, cancelar o cambiar algo de tu plan (dirección de entrega, teléfono, tarjeta, etc), puedes hacerlo en cualquier momento antes del cobro de cada sábado por la mañana. Solo tienes que entrar con tu usuario en nuestra web y administrar tu plan.

                  ¿Alguna duda? En Let’s Cook queremos ayudarte para que puedas disfrutar al máximo de buenos y ricos momentos con los tuyos. Así que si tienes alguna duda no tengas reparos en contactar con nosotros. 
                  
                  Gracias por confiar en nosotr@s y… ¡a cocinar!
  
                  <h4 style="color: #000000; font-size: 24px; font-weight: 700; line-height: 24px; margin: 48px 0;">
  
                    </div>
          </main>
  
          <h2 style="color: #00a555; font-size: 28px; font-weight: 700; line-height: 32px; margin: 48px 0;text-align: center;">letscooknow.es</h2>
      </div>
  
      <!--[if (gte mso 9)|(IE)]>
      </td></tr></table>
      <![endif]-->
    </body>
  </html>  
    
    `;
};
