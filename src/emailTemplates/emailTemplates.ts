import { Customer } from "@src/bounded_contexts/operations/domain/customer/Customer";
import { Locale } from "@src/bounded_contexts/operations/domain/locale/Locale";
import { Subscription } from "@src/bounded_contexts/operations/domain/subscription/Subscription";
import { PaymentOrderBilledNotificationDto } from "@src/shared/notificationService/INotificationService";
import { RecipeSelection } from "../bounded_contexts/operations/domain/order/RecipeSelection";

export const welcomeTemplate = (
    customerName: string,
    recipeSelection: RecipeSelection[],
    planName: string,
    hasRestrictionComment: boolean,
    shippingCost: number,
    firstOrderId: string,
    shippingDay: string,
    isPlanAhorro: boolean,
    locale: Locale
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

export const newSubscriptionTemplate = (
    customerName: string,
    recipeSelection: RecipeSelection[],
    planName: string,
    restrictionComment: string,
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
          </header>
  
          <main>
              <!-- This div is purely presentational, providing a container for the message. -->
              <div style="background-color: white; border-radius: 64px; padding: 32px 40px;">
                  <!-- This ghost table is used solely for padding in Word-based Outlook clients. -->
                  <!--[if (gte mso 9)|(IE)]>
                  <table cellspacing="0" cellpadding="0" border="0" width="600" align="center" role="presentation"><tr><td style="background-color: ghostwhite;font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; padding: 24px 48px 24px 48px;">
                  <![endif]-->
                  <h2 style="color: #00a555; font-size: 24px; font-weight: 800; line-height: 24px; margin: 48px 0;">
                      Nueva compra
                  </h2>
                      
                    El cliente ${customerName} ha comprado un ${planName} ${
        restrictionComment ? `y ha agregado el siguiente comentario: ${restrictionComment}` : ""
    }
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

export const newSubscriptionsTemplate = (customerName: string, planNames: string[]) => {
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
        </header>

        <main>
            <!-- This div is purely presentational, providing a container for the message. -->
            <div style="background-color: white; border-radius: 64px; padding: 32px 40px;">
                <!-- This ghost table is used solely for padding in Word-based Outlook clients. -->
                <!--[if (gte mso 9)|(IE)]>
                <table cellspacing="0" cellpadding="0" border="0" width="600" align="center" role="presentation"><tr><td style="background-color: ghostwhite;font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; padding: 24px 48px 24px 48px;">
                <![endif]-->
                <h2 style="color: #00a555; font-size: 24px; font-weight: 800; line-height: 24px; margin: 48px 0;">
                    Nueva compra
                </h2>
                    
                  El cliente ${customerName} ha agregado ${
        planNames.length > 0 ? `los siguientes planes adicionales` : "el siguiente plan adicional"
    }: ${planNames.map((name) => `<p>${name}</p>`)}
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

export const newCancellationTemplate = (subscription: Subscription, locale: Locale, adminNameOrEmail?: string) => {
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
        </header>

        <main>
            <!-- This div is purely presentational, providing a container for the message. -->
            <div style="background-color: white; border-radius: 64px; padding: 32px 40px;">
                <!-- This ghost table is used solely for padding in Word-based Outlook clients. -->
                <!--[if (gte mso 9)|(IE)]>
                <table cellspacing="0" cellpadding="0" border="0" width="600" align="center" role="presentation"><tr><td style="background-color: ghostwhite;font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; padding: 24px 48px 24px 48px;">
                <![endif]-->
                <h2 style="color: #00a555; font-size: 24px; font-weight: 800; line-height: 24px; margin: 48px 0;">
                    Nueva cancelación de plan
                </h2>
                ${
                    !!adminNameOrEmail
                        ? `<p>el usuario Admin <b>${adminNameOrEmail}</b> ha cancelado el plan <b>${
                              subscription.plan.name
                          } ${subscription.getPlanVariantLabel(locale)}</b> con id ${
                              subscription.id.value
                          } del cliente <b>${subscription.customer.getFullNameOrEmail()}</b>. </p>`
                        : `<p>El cliente <b>${subscription.customer.getFullNameOrEmail()}</b> ha cancelado su <b>${
                              subscription.plan.name
                          } ${subscription.getPlanVariantLabel(locale)}</b> con id ${subscription.id.value}</p>`
                }
                <p>El motivo de la cancelación es: <b>${subscription.cancellationReason?.getHumanTitle() || ""}</b></p>
                ${
                    subscription.cancellationReason?.comment
                        ? `<p>El cliente dejó el siguiente comentario: <b>${subscription.cancellationReason?.comment || ""}</b></p>`
                        : ""
                }
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

export const planReactivationTemplate = (subscription: Subscription, locale: Locale, adminNameOrEmail?: string) => {
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
                <h2 style="color: #00a555; font-size: 24px; font-weight: 800; line-height: 24px; margin: 48px 0;">
                    Reactivación de plan
                </h2>
                <p>El cliente ${subscription.customer.email} ha reactivado su ${subscription.plan.name} ${subscription.getPlanVariantLabel(
        locale
    )} con id ${subscription.id.value}</p>
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

export const addressChangeTemplate = (customer: Customer, adminNameOrEmail?: string) => {
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
                <h2 style="color: #00a555; font-size: 24px; font-weight: 800; line-height: 24px; margin: 48px 0;">
                    Cambio de dirección
                </h2>
                ${
                    adminNameOrEmail
                        ? `<p>El administrador ${adminNameOrEmail} ha cambiado la dirección del cliente ${customer.email} a:`
                        : `<p>El cliente ${customer.email} ha cambiado su direcció a:</p>`
                }
                <ul>
                    <li>${customer.getShippingAddress().name}</li>
                    ${!!customer.getShippingAddress().details ? `<li>${customer.getShippingAddress().details}</li>` : ""}
                    <li>Con horario de preferencia de entrega ${customer.getShippingAddress().preferredShippingHour}</li>
                </ul>
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

export const restrictionChangeTemplate = (subscription: Subscription, adminNameOrEmail?: string) => {
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
                <h2 style="color: #00a555; font-size: 24px; font-weight: 800; line-height: 24px; margin: 48px 0;">
                    Cambio de restricción
                </h2>
                ${
                    !!adminNameOrEmail
                        ? `<p><p>El administrador ${adminNameOrEmail} ha cambiado la restricción  del ${subscription.plan.name} (id: ${subscription.id.value}) a ${subscription.restrictionComment}. El cliente es ${subscription.customer.email}</p>`
                        : `<p>El cliente ${subscription.customer.email} ha cambiado su restricción del ${subscription.plan.name} (id: ${subscription.id.value}) a ${subscription.restriction?.label}</p>`
                }
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

export const sendRecoverPasswordCodeTemplate = (code: string) => {
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 3.2//EN">
<html lang="es">
<head>
  <!--[if gte mso 9]>
  <xml>
    <o:OfficeDocumentsettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentsettings>
  </xml>
  <![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="address=no">
  <meta name="format-detection" content="telephone=no">
  <meta name="format-detection" content="email=no">
  <meta name="x-apple-disable-message-reformatting">
    <!--[if !mso]><!-->
  <style type="text/css">@import url("https://static.mailerlite.com/assets/plugins/groot/modules/includes/groot_fonts/import.css?version=1629979");</style>
  <!--<![endif]-->

  <!-- RSS STYLE STARTS -->
  <!--[if mso]>
  <style type="text/css">
    .content-MS .content img { width: 560px; }
  </style>
  <![endif]-->

  <!-- WINDOWS 10 HACKS FOR LINK AND BG COLOR -->
  <!--[if (mso)|(mso 16)]>
  <style type="text/css">
    .mlContentButton a { text-decoration: none; }
  </style>
  <![endif]-->

  <!--[if !mso]><!-- -->
  <style type="text/css">
    .mlBodyBackgroundImage { background-image: url(https://bucket.mlcdn.com/a/1966/1966360/images/458a3e2a9cefdfc02c5bdbe2e5648187276656c2.jpeg); }
  </style>
  <!--<![endif]-->

  <!--[if (lt mso 16)]>
  <style type="text/css" if="variable.bodyBackgroundImage.value">
    .mlBodyBackgroundImage { background-image: url(https://bucket.mlcdn.com/a/1966/1966360/images/458a3e2a9cefdfc02c5bdbe2e5648187276656c2.jpeg); }
  </style>
  <![endif]-->

  <style type="text/css">
    .ReadMsgBody { width: 100%; }
    .ExternalClass{ width: 100%; }
    .ExternalClass * { line-height: 100%; }
    .ExternalClass, .ExternalClass p, .ExternalClass td, .ExternalClass div, .ExternalClass span, .ExternalClass font { line-height:100%; }
    body { margin: 0; padding: 0; }
    body, table, td, p, a, li { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table td { border-collapse: collapse; }
    table { border-spacing: 0; border-collapse: collapse; }
    p, a, li, td, blockquote { mso-line-height-rule: exactly; }
    p, a, li, td, body, table, blockquote { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
    img, a img { border: 0; outline: none; text-decoration: none; }
    img { -ms-interpolation-mode: bicubic; }
    * img[tabindex="0"] + div { display: none !important; }
    a[href^=tel],a[href^=sms],a[href^=mailto], a[href^=date] { color: inherit; cursor: pointer; text-decoration: none; }
    a[x-apple-data-detectors]{ color: inherit!important; text-decoration: none!important; font-size: inherit!important; font-family: inherit!important; font-weight: inherit!important; line-height: inherit!important; }
    #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; }
    #MessageViewBody { width: 100% !important; }
    #MessageWebViewDiv { width: 100% !important; }

    @-moz-document url-prefix() {
      .bodyText p a, .bodyTitle p a {
        word-break: break-word;
      }
    }

    @media screen {
      body {
      font-family: 'Lato', Arial, Helvetica, sans-serif;
    }
    * {
    direction: ltr;
    }
    }

    @media only screen and (min-width:768px){
      .mlEmailContainer{
        width: 640px!important;
      }
    }

    @media only screen and (max-width: 640px) {
      .mlTemplateContainer {
        padding: 10px 10px 0 10px;
      }
    } @media only screen and (max-width: 640px) {
      .mlTemplateContainer{
        padding: 10px 10px 0 10px;
      }
    } @media only screen and (max-width: 640px) {
      .mlContentCenter{
        min-width: 10%!important;
        margin: 0!important;
        float: none!important;
      }
    } @media only screen and (max-width: 640px) {
      .mlContentTable{
        width: 100%!important;
        min-width: 10%!important;
        margin: 0!important;
        float: none!important;
      }
    } @media only screen and (max-width: 640px) {
      .mlContentBlock{
        display: block !important;
        width: 100%!important;
        min-width: 10%!important;
        margin: 0!important;
        float: none!important;
      }
    } @media only screen and (max-width: 640px) {
      .mlContentOuter{
        padding-bottom: 0px!important;
        padding-left: 15px!important;
        padding-right: 15px!important;
        padding-top: 0px!important;
      }
    } @media only screen and (max-width: 640px) {
      .mlContentOuterSmall{
        padding-bottom: 0px!important;
        padding-left: 10px!important;
        padding-right: 10px!important;
        padding-top: 0px!important;
      }
    } @media only screen and (max-width: 640px) {
      .mlMenuOuter{
        padding-bottom: 0px!important;
        padding-left: 5px!important;
        padding-right: 5px!important;
        padding-top: 0px!important;
      }
    } @media only screen and (max-width: 640px) {
      .mlContentOuterFullBig{
        padding: 30px!important;
      }
    } @media only screen and (max-width: 640px) {
      .mlContentImage img {
        height: auto!important;
        width: 100%!important;
      }
    } @media only screen and (max-width: 640px) {
      .mlContentImage160 img {
        height: auto!important;
        max-width: 160px;
        width: 100%!important;
      }
    } @media only screen and (max-width: 640px) {
      .mlContentImage260 img {
        height: auto!important;
        max-width: 260px;
        width: 100%!important;
      }
    } @media only screen and (max-width: 640px) {
      .mlContentImage{
        height: 100%!important;
        width: auto!important;
      }
    } @media only screen and (max-width: 640px) {
      .mlProductImage{
        height: auto!important;
        width: 100%!important;
      }
    } @media only screen and (max-width: 640px) {
      .mlContentButton a{
        display: block!important;
        width: auto!important;
      }
    } @media only screen and (max-width: 640px) {
      .spacingHeight-20{
        height: 10px!important;
      }
    } @media only screen and (max-width: 640px) {
      .spacingHeight-30{
        height: 15px!important;
      }
    } @media only screen and (max-width: 640px) {
      .spacingHeight-40{
        height: 20px!important;
      }
    } @media only screen and (max-width: 640px) {
      .spacingHeight-50{
        height: 25px!important;
      }
    } @media only screen and (max-width: 640px) {
      .spacingHeight-60{
        height: 30px!important;
      }
    } @media only screen and (max-width: 640px) {
      .spacingHeight-70{
        height: 35px!important;
      }
    } @media only screen and (max-width: 640px) {
      .spacingHeight-80{
        height: 40px!important;
      }
    } @media only screen and (max-width: 640px) {
      .spacingHeight-90{
        height: 45px!important;
      }
    } @media only screen and (max-width: 640px) {
      .spacingHeight-100{
        height: 50px!important;
      }
    } @media only screen and (max-width: 640px) {
      .spacingWidth-20{
        width: 10px!important;
      }
    } @media only screen and (max-width: 640px) {
      .spacingWidth-30{
        width: 15px!important;
      }
    } @media only screen and (max-width: 640px) {
      .spacingWidth-40{
        width: 20px!important;
      }
    } @media only screen and (max-width: 640px) {
      .spacingWidth-60{
        width: 30px!important;
      }
    } @media only screen and (max-width: 640px) {
      .mobileHide{
        display: none!important;
      }
    } @media only screen and (max-width: 640px) {
      .mobileShow{
        display: block!important;
      }
    } @media only screen and (max-width: 640px) {
      .alignCenter{
        height: auto!important;
        text-align: center!important;
      }
    } @media only screen and (max-width: 640px) {
      .alignCenter img{
        display: inline !important;
        text-align: center!important;
      }
    } @media only screen and (max-width: 640px) {
      .marginBottom{
        margin-bottom: 15px!important;
      }
    } @media only screen and (max-width: 640px) {
      .marginTop {
        margin-top: 10px !important;
      }
    } @media only screen and (max-width: 640px) {
      .mlContentHeight{
        height: auto!important;
      }
    } @media only screen and (max-width: 640px) {
      .mlDisplayInline {
        display: inline-block!important;
        float: none!important;
      }
    } @media only screen and (max-width: 640px) {
      .mlNoFloat{
        float: none!important;
        margin-left: auto!important;
        margin-right: auto!important;
      }
    } @media only screen and (max-width: 640px) {
      .mlContentSurvey{
        float: none!important;
        margin-bottom: 10px!important;
        width:100%!important;
      }
    } @media only screen and (max-width: 640px) {
      .mlContentSurvey td a{
        width: auto!important;
      }
    } @media only screen and (max-width: 640px) {
      .multiple-choice-item-table{
        width: 100% !important;
        margin-bottom: 20px !important;
        min-width: 10% !important;
        float: none !important;
      }
    } @media only screen and (max-width: 640px) {
      body{
        margin: 0px!important;
        padding: 0px!important;
      }
    } @media only screen and (max-width: 640px) {
      body, table, td, p, a, li, blockquote{
        -webkit-text-size-adjust: none!important;
      }
    }
    @media only screen and (max-width: 480px){
      .social-LinksTable{
        width: 100%!important;
      }
    } @media only screen and (max-width: 640px) {
      .social-LinksTable td:first-child{
        padding-left: 0px!important;
      }
    } @media only screen and (max-width: 640px) {
      .social-LinksTable td:last-child{
        padding-right: 0px!important;
      }
    } @media only screen and (max-width: 640px) {
      .social-LinksTable td{
        padding: 0 10px!important;
      }
    } @media only screen and (max-width: 640px) {
      .social-LinksTable td img{
        height: auto!important;
        max-width: 48px;
        width: 100%!important;
      }
    }

    /* Carousel style */

    @media screen and (-webkit-min-device-pixel-ratio: 0) {
      .webkit {
        display: block !important;
      }
    }  @media screen and (-webkit-min-device-pixel-ratio: 0) {
      .non-webkit {
        display: none !important;
      }
    }  @media screen and (-webkit-min-device-pixel-ratio: 0) {
      /* TARGET OUTLOOK.COM */
      [class="x_non-webkit"] {
        display: block !important;
      }
    }  @media screen and (-webkit-min-device-pixel-ratio: 0) {
      [class="x_webkit"] {
        display: none !important;
      }
    }

  </style>

  <!--[if mso]>
  <style type="text/css">
    .bodyText { font-family: Arial, Helvetica, sans-serif!important ; }
    .bodyText * { font-family: Arial, Helvetica, sans-serif!important; }
    .bodyText a { font-family: Arial, Helvetica, sans-serif!important; }
    .bodyText a span { font-family: Arial, Helvetica, sans-serif!important; }
    .bodyText span { font-family: Arial, Helvetica, sans-serif!important; }
    .bodyText p { font-family: Arial, Helvetica, sans-serif!important; }
    .bodyText ul li { font-family: Arial, Helvetica, sans-serif!important; }
    .bodyTitle { font-family: Arial, Helvetica, sans-serif!important ; }
    .bodyTitle * { font-family: Arial, Helvetica, sans-serif!important; }
    .bodyTitle a { font-family: Arial, Helvetica, sans-serif!important; }
    .bodyTitle a span { font-family: Arial, Helvetica, sans-serif!important; }
    .bodyTitle span { font-family: Arial, Helvetica, sans-serif!important; }
    .bodyTitle p { font-family: Arial, Helvetica, sans-serif!important; }
    .bodyFont { font-family: Arial, Helvetica, sans-serif!important ; }
    .bodyFont * { font-family: Arial, Helvetica, sans-serif!important; }
    .bodyFont a { font-family: Arial, Helvetica, sans-serif!important; }
    .bodyFont a span { font-family: Arial, Helvetica, sans-serif!important; }
    .bodyFont span { font-family: Arial, Helvetica, sans-serif!important; }
    .bodyFont p { font-family: Arial, Helvetica, sans-serif!important; }
    .mlContentButton { font-family: Arial, Helvetica, sans-serif!important; }
  </style>
  <![endif]-->
  
<style type="text/css">
				@media only screen and (max-width: 640px){
					#logoBlock-4 {
						max-width: 100px!important;
						width: 100%!important;
					}
				}
			</style><title>Restablecer contraseña, tu código</title><meta name="robots" content="noindex, nofollow"></head>

<body class="mlBodyBackgroundImage" style="padding: 0; margin: 0; -webkit-font-smoothing:antialiased; background-color:#ffffff; -webkit-text-size-adjust:none;">

<!-- Make your email an accessible article. -->
<div role="article" aria-roledescription="email" aria-label="Restablecer+contrase%C3%B1a%2C+tu+c%C3%B3digo">

<!--[if !mso]><!-- -->
<table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" class="mainTable mlBodyBackgroundImageTable" dir="ltr" background="https://bucket.mlcdn.com/a/1966/1966360/images/458a3e2a9cefdfc02c5bdbe2e5648187276656c2.jpeg" style="background-image: url(https://bucket.mlcdn.com/a/1966/1966360/images/458a3e2a9cefdfc02c5bdbe2e5648187276656c2.jpeg);">
  <tr>
    <td class="mlTemplateContainer" align="center">
      <!--<![endif]-->

      <!--[if mso 16]>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
        <tr>
          <td bgcolor="#ffffff" align="center">
            <!--<![endif]-->
        

      <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" class="mobileHide">
        <tr>
          <td align="center">
            
              <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" class="mlContentTable">
                <tr>
                  <td colspan="2" height="20"></td>
                </tr>
                <tr>
                  
                  <td align="left" style="font-family: 'Lato', Arial, Helvetica, sans-serif; color: #111111; font-size: 12px; line-height: 18px;">
                    
                    
                  </td>
                  <td align="right" style="font-family: 'Lato', Arial, Helvetica, sans-serif; color: #111111; font-size: 12px; line-height: 18px;"><a style="color: #111111;" href="">View in browser</a></td>
                </tr>
                <tr>
                  <td colspan="2" height="20"></td>
                </tr>
              </table>
            
          </td>
        </tr>
      </table>

      	<table align="center" border="0" cellpadding="0" cellspacing="0" class="mlContentTable" width="100%">
        <tr>
          <td>
            
  <!--  -->
  <table align="center" border="0" bgcolor="" class="mlContentTable mlContentTableDefault" cellpadding="0" cellspacing="0" width="100%">
  <tr>
    <td class="mlContentTableCardTd">

      <table align="center" bgcolor="" border="0" cellpadding="0" cellspacing="0" class="mlContentTable ml-fullwidth" style="width: 640px; min-width: 640px;" width="640">
        <tr>
          <td>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" class="mlContentTable">
	<tr>
		<td height="10" class="spacingHeight-10" style="line-height: 10px; min-height: 10px;"></td>
	</tr>
</table>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" class="mlContentTable">
	<tr>
		<td align="center" style="padding: 0px 40px;" class="mlContentOuter">

			<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="100%">
				<tr>
					<td align="center">
  					<a href="http://www.letscooknow.es/" target="_blank">
                <img src="https://bucket.mlcdn.com/a/1966/1966360/images/1a47d96190f513a9cce80f8ac6ca8031e78c3da9.png" id="logoBlock-4" border="0" alt="" width="100" style="display: block;">
              </a>
					</td>
				</tr>
			</table>
			

		</td>
	</tr>
</table>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" class="mlContentTable">
	<tr>
		<td height="20" class="spacingHeight-20" style="line-height: 20px; min-height: 20px;"></td>
	</tr>
</table>

              
          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>
  <!--  -->

  <!--  -->
  <table align="center" border="0" bgcolor="#ffffff" class="mlContentTable mlContentTableDefault" cellpadding="0" cellspacing="0" width="100%">
  <tr>
    <td class="mlContentTableCardTd">

      <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" class="mlContentTable ml-fullwidth" style="width: 640px; min-width: 640px;" width="640">
        <tr>
          <td>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" class="mlContentTable">
	<tr>
		<td height="20" class="spacingHeight-20" style="line-height: 20px; min-height: 20px;"></td>
	</tr>
</table>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" class="mlContentTable">
	<tr>
		<td align="center" style="padding: 0px 40px;" class="mlContentOuter">

  		<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="100%">
  			<tr>
  				<td class="bodyTitle" id="bodyText-6" style="font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 14px; line-height: 150%; color: #6f6f6f;"><p style="margin-top: 0px; margin-bottom: 0px; line-height: 150%;">Introduce el siguiente código para validar tu correo: ${code}</p></td>
  			</tr>
  		</table>
			

		</td>
	</tr>
</table>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" class="mlContentTable">
	<tr>
		<td height="80" class="spacingHeight-80" style="line-height: 80px; min-height: 80px;"></td>
	</tr>
</table>

              
          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>
  <!--  -->


<table align="center" border="0" bgcolor="#28a745" class="mlContentTable mlContentTableFooterDefault" cellpadding="0" cellspacing="0" width="100%">
  <tr>
    <td class="mlContentTableFooterCardTd">

      <table align="center" bgcolor="#28a745" border="0" cellpadding="0" cellspacing="0" class="mlContentTable ml-fullwidth" style="width: 640px; min-width: 640px;" width="640">
        <tr>
          <td>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" class="mlContentTable">
	<tr>
		<td height="20" class="spacingHeight-20" style="line-height: 20px; min-height: 20px;"></td>
	</tr>
</table>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" class="mlContentTable">
	<tr>
		<td align="center" style="padding: 0px 40px;" class="mlContentOuter">

			<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="100%">
				<tr>
					<td align="left" class="bodyTitle" style="font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 700; line-height: 150%; color: #ffffff;">Come bueno y rico cada semana</td>
				</tr>
			</table>

		</td>
	</tr>
</table>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" class="mlContentTable">
	<tr>
		<td height="10" class="spacingHeight-10"></td>
	</tr>
</table>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" class="mlContentTable">
	<tr>
		<td align="center" style="padding: 0px 40px;" class="mlContentOuter">

			<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="100%">
				<tr>
					<td align="center">

						<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="left" width="267" style="width: 267px; min-width: 267px;" class="mlContentTable marginBottom">
							<tr>
								<td align="left" class="bodyTitle" id="footerText-8" style="font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 12px; line-height: 100%; color: #ffffff;">
<p style="margin-top: 0px; margin-bottom: 10px;">Economiza tu tiempo</p>
<p style="margin-top: 0px; margin-bottom: 10px;">Come saludable y variado</p>
<p style="margin-top: 0px; margin-bottom: 0px;">Combate el fondwaste</p></td>
							</tr>
							<tr>
								<td height="25" class="spacingHeight-20"></td>
							</tr>
							<tr>
								<td align="center">
									<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="left">
										<tr>
											<td align="center" width="24" style="padding: 0px 5px;" ng-show="slink.link != ''">
                        <a href="https://www.instagram.com/letscook.now/" target="_blank">
													<img width="24" alt="instagram" src="https://cdn.mailerlite.com/images/icons/default/round/white/instagram.png" style="display: block;" border="0">
												</a>
											</td><td align="center" width="24" style="padding: 0px 5px;" ng-show="slink.link != ''">
                        <a href="https://www.youtube.com/channel/UCWmWuYmsvW5H2BWykUCAmZg" target="_blank">
													<img width="24" alt="youtube" src="https://cdn.mailerlite.com/images/icons/default/round/white/youtube.png" style="display: block;" border="0">
												</a>
											</td><td align="center" width="24" style="padding: 0px 5px;" ng-show="slink.link != ''">
                        <a href="https://www.facebook.com/pages/category/Foodservice-Distributor/Lets-cook-2399683106933532/" target="_blank">
													<img width="24" alt="facebook" src="https://cdn.mailerlite.com/images/icons/default/round/white/facebook.png" style="display: block;" border="0">
												</a>
											</td><td align="center" width="24" style="padding: 0px 5px;" ng-show="slink.link != ''">
                        <a href="https://www.pinterest.es/letscooknowes/" target="_blank">
													<img width="24" alt="pinterest" src="https://cdn.mailerlite.com/images/icons/default/round/white/pinterest.png" style="display: block;" border="0">
												</a>
											</td>
										</tr>
									</table>
								</td>
							</tr>
						</table>

						<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="right" width="267" style="width: 267px; min-width: 267px;" class="mlContentTable">
      				<tr>
      					<td align="right" class="bodyTitle" style="font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 12px; line-height: 100%; color: #ffffff;"><a href="tel:WhatsApp +34 653 65 05 83" style="color: #ffffff; text-decoration: none;"><span style="color: #ffffff;">WhatsApp +34 653 65 05 83</span></a></td>
      				</tr>
      				<tr>
      					<td align="right" class="bodyTitle" style="font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 12px; line-height: 100%; color: #ffffff;"><a href="mailto:info@letscooknow.es" style="color: #ffffff; text-decoration: none;"><span style="color: #ffffff;">info@letscooknow.es</span></a></td>
      				</tr>
      				<tr>
      					<td height="25" class="spacingHeight-20"></td>
      				</tr>
      				<tr>
      					<td align="right" class="bodyTitle" id="footerUnsubscribeText-8" style="font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 12px; line-height: 100%; color: #ffffff;"><p style="margin-top: 0px; margin-bottom: 0px;"><span style="font-size: 10px;">Has recibido este correo electrónico porque nos has realizado compras.</span><br></p></td>
      				</tr>
      				<tr>
      					<td height="10"></td>
      				</tr>
      				<tr>
      					<td align="right" class="bodyTitle" style="font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 12px; line-height: 100%; color: #ffffff;">
        					<a href="http://app.mailerlite.com/subscription/test_unsubscribe/43249069/1966360" style="color: #ffffff; text-decoration: none;">
          					<span style="color: #ffffff;">.</span>
          					
        					</a>
      					</td>
      				</tr>
						</table>

					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>


<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" class="mlContentTable">
	<tr>
		<td height="20" class="spacingHeight-20" style="line-height: 20px; min-height: 20px;"></td>
	</tr>
</table>

            
          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>



          </td>
        </tr>
      </table>

      <table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" class="mlContentTable">
        <tr>
          <td height="40" class="spacingHeight-20"></td>
        </tr>
        
      </table>



      <!-- Content ends here -->

      <!--[if mso 16]>
      </td>
      </tr>
      </table>
      <!--<![endif]-->

      <!--[if !mso]><!-- -->
    </td>
  </tr>
</table>
<!--<![endif]-->

</div>
</body>
</html>
    `;
};

export const ticketTemplate = (dto: PaymentOrderBilledNotificationDto) => {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 3.2//EN">
    <html lang="es">
        <head>
            <!--[if gte mso 9]>
                <xml>
                    <o:OfficeDocumentsettings>
                        <o:AllowPNG />
                        <o:PixelsPerInch>96</o:PixelsPerInch>
                    </o:OfficeDocumentsettings>
                </xml>
            <![endif]-->
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="format-detection" content="address=no" />
            <meta name="format-detection" content="telephone=no" />
            <meta name="format-detection" content="email=no" />
            <meta name="x-apple-disable-message-reformatting" />
            <!--[if !mso]><!-->
            <style type="text/css">
                @import url('https://static.mailerlite.com/assets/plugins/groot/modules/includes/groot_fonts/import.css?version=1631026');
            </style>
            <!--<![endif]-->
    
            <!-- RSS STYLE STARTS -->
            <!--[if mso]>
                <style type="text/css">
                    .content-MS .content img {
                        width: 560px;
                    }
                </style>
            <![endif]-->
    
            <!-- WINDOWS 10 HACKS FOR LINK AND BG COLOR -->
            <!--[if (mso)|(mso 16)]>
                <style type="text/css">
                    .mlContentButton a {
                        text-decoration: none;
                    }
                </style>
            <![endif]-->
    
            <!--[if !mso]><!-- -->
            <style type="text/css">
                .mlBodyBackgroundImage {
                    background-image: url(https://bucket.mlcdn.com/a/1966/1966360/images/458a3e2a9cefdfc02c5bdbe2e5648187276656c2.jpeg);
                }
            </style>
            <!--<![endif]-->
    
            <!--[if (lt mso 16)]>
                <style type="text/css" if="variable.bodyBackgroundImage.value">
                    .mlBodyBackgroundImage {
                        background-image: url(https://bucket.mlcdn.com/a/1966/1966360/images/458a3e2a9cefdfc02c5bdbe2e5648187276656c2.jpeg);
                    }
                </style>
            <![endif]-->
    
            <style type="text/css">
                .ReadMsgBody {
                    width: 100%;
                }
                .ExternalClass {
                    width: 100%;
                }
                .ExternalClass * {
                    line-height: 100%;
                }
                .ExternalClass,
                .ExternalClass p,
                .ExternalClass td,
                .ExternalClass div,
                .ExternalClass span,
                .ExternalClass font {
                    line-height: 100%;
                }
                body {
                    margin: 0;
                    padding: 0;
                }
                body,
                table,
                td,
                p,
                a,
                li {
                    -webkit-text-size-adjust: 100%;
                    -ms-text-size-adjust: 100%;
                }
                table td {
                    border-collapse: collapse;
                }
                table {
                    border-spacing: 0;
                    border-collapse: collapse;
                }
                p,
                a,
                li,
                td,
                blockquote {
                    mso-line-height-rule: exactly;
                }
                p,
                a,
                li,
                td,
                body,
                table,
                blockquote {
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                }
                img,
                a img {
                    border: 0;
                    outline: none;
                    text-decoration: none;
                }
                img {
                    -ms-interpolation-mode: bicubic;
                }
                * img[tabindex='0'] + div {
                    display: none !important;
                }
                a[href^='tel'],
                a[href^='sms'],
                a[href^='mailto'],
                a[href^='date'] {
                    color: inherit;
                    cursor: pointer;
                    text-decoration: none;
                }
                a[x-apple-data-detectors] {
                    color: inherit !important;
                    text-decoration: none !important;
                    font-size: inherit !important;
                    font-family: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                }
                #MessageViewBody a {
                    color: inherit;
                    text-decoration: none;
                    font-size: inherit;
                    font-family: inherit;
                    font-weight: inherit;
                    line-height: inherit;
                }
                #MessageViewBody {
                    width: 100% !important;
                }
                #MessageWebViewDiv {
                    width: 100% !important;
                }
    
                @-moz-document url-prefix() {
                    .bodyText p a,
                    .bodyTitle p a {
                        word-break: break-word;
                    }
                }
    
                @media screen {
                    body {
                        font-family: 'Lato', Arial, Helvetica, sans-serif;
                    }
                    * {
                        direction: ltr;
                    }
                }
    
                @media only screen and (min-width: 768px) {
                    .mlEmailContainer {
                        width: 640px !important;
                    }
                }
    
                @media only screen and (max-width: 640px) {
                    .mlTemplateContainer {
                        padding: 10px 10px 0 10px;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mlTemplateContainer {
                        padding: 10px 10px 0 10px;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mlContentCenter {
                        min-width: 10% !important;
                        margin: 0 !important;
                        float: none !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mlContentTable {
                        width: 100% !important;
                        min-width: 10% !important;
                        margin: 0 !important;
                        float: none !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mlContentBlock {
                        display: block !important;
                        width: 100% !important;
                        min-width: 10% !important;
                        margin: 0 !important;
                        float: none !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mlContentOuter {
                        padding-bottom: 0px !important;
                        padding-left: 15px !important;
                        padding-right: 15px !important;
                        padding-top: 0px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mlContentOuterSmall {
                        padding-bottom: 0px !important;
                        padding-left: 10px !important;
                        padding-right: 10px !important;
                        padding-top: 0px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mlMenuOuter {
                        padding-bottom: 0px !important;
                        padding-left: 5px !important;
                        padding-right: 5px !important;
                        padding-top: 0px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mlContentOuterFullBig {
                        padding: 30px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mlContentImage img {
                        height: auto !important;
                        width: 100% !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mlContentImage160 img {
                        height: auto !important;
                        max-width: 160px;
                        width: 100% !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mlContentImage260 img {
                        height: auto !important;
                        max-width: 260px;
                        width: 100% !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mlContentImage {
                        height: 100% !important;
                        width: auto !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mlProductImage {
                        height: auto !important;
                        width: 100% !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mlContentButton a {
                        display: block !important;
                        width: auto !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .spacingHeight-20 {
                        height: 10px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .spacingHeight-30 {
                        height: 15px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .spacingHeight-40 {
                        height: 20px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .spacingHeight-50 {
                        height: 25px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .spacingHeight-60 {
                        height: 30px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .spacingHeight-70 {
                        height: 35px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .spacingHeight-80 {
                        height: 40px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .spacingHeight-90 {
                        height: 45px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .spacingHeight-100 {
                        height: 50px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .spacingWidth-20 {
                        width: 10px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .spacingWidth-30 {
                        width: 15px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .spacingWidth-40 {
                        width: 20px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .spacingWidth-60 {
                        width: 30px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mobileHide {
                        display: none !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mobileShow {
                        display: block !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .alignCenter {
                        height: auto !important;
                        text-align: center !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .alignCenter img {
                        display: inline !important;
                        text-align: center !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .marginBottom {
                        margin-bottom: 15px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .marginTop {
                        margin-top: 10px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mlContentHeight {
                        height: auto !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mlDisplayInline {
                        display: inline-block !important;
                        float: none !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mlNoFloat {
                        float: none !important;
                        margin-left: auto !important;
                        margin-right: auto !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mlContentSurvey {
                        float: none !important;
                        margin-bottom: 10px !important;
                        width: 100% !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .mlContentSurvey td a {
                        width: auto !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .multiple-choice-item-table {
                        width: 100% !important;
                        margin-bottom: 20px !important;
                        min-width: 10% !important;
                        float: none !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    body {
                        margin: 0px !important;
                        padding: 0px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    body,
                    table,
                    td,
                    p,
                    a,
                    li,
                    blockquote {
                        -webkit-text-size-adjust: none !important;
                    }
                }
                @media only screen and (max-width: 480px) {
                    .social-LinksTable {
                        width: 100% !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .social-LinksTable td:first-child {
                        padding-left: 0px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .social-LinksTable td:last-child {
                        padding-right: 0px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .social-LinksTable td {
                        padding: 0 10px !important;
                    }
                }
                @media only screen and (max-width: 640px) {
                    .social-LinksTable td img {
                        height: auto !important;
                        max-width: 48px;
                        width: 100% !important;
                    }
                }
    
                /* Carousel style */
    
                @media screen and (-webkit-min-device-pixel-ratio: 0) {
                    .webkit {
                        display: block !important;
                    }
                }
                @media screen and (-webkit-min-device-pixel-ratio: 0) {
                    .non-webkit {
                        display: none !important;
                    }
                }
                @media screen and (-webkit-min-device-pixel-ratio: 0) {
                    /* TARGET OUTLOOK.COM */
                    [class='x_non-webkit'] {
                        display: block !important;
                    }
                }
                @media screen and (-webkit-min-device-pixel-ratio: 0) {
                    [class='x_webkit'] {
                        display: none !important;
                    }
                }
            </style>
    
            <!--[if mso]>
                <style type="text/css">
                    .bodyText {
                        font-family: Arial, Helvetica, sans-serif !important ;
                    }
                    .bodyText * {
                        font-family: Arial, Helvetica, sans-serif !important;
                    }
                    .bodyText a {
                        font-family: Arial, Helvetica, sans-serif !important;
                    }
                    .bodyText a span {
                        font-family: Arial, Helvetica, sans-serif !important;
                    }
                    .bodyText span {
                        font-family: Arial, Helvetica, sans-serif !important;
                    }
                    .bodyText p {
                        font-family: Arial, Helvetica, sans-serif !important;
                    }
                    .bodyText ul li {
                        font-family: Arial, Helvetica, sans-serif !important;
                    }
                    .bodyTitle {
                        font-family: Arial, Helvetica, sans-serif !important ;
                    }
                    .bodyTitle * {
                        font-family: Arial, Helvetica, sans-serif !important;
                    }
                    .bodyTitle a {
                        font-family: Arial, Helvetica, sans-serif !important;
                    }
                    .bodyTitle a span {
                        font-family: Arial, Helvetica, sans-serif !important;
                    }
                    .bodyTitle span {
                        font-family: Arial, Helvetica, sans-serif !important;
                    }
                    .bodyTitle p {
                        font-family: Arial, Helvetica, sans-serif !important;
                    }
                    .bodyFont {
                        font-family: Arial, Helvetica, sans-serif !important ;
                    }
                    .bodyFont * {
                        font-family: Arial, Helvetica, sans-serif !important;
                    }
                    .bodyFont a {
                        font-family: Arial, Helvetica, sans-serif !important;
                    }
                    .bodyFont a span {
                        font-family: Arial, Helvetica, sans-serif !important;
                    }
                    .bodyFont span {
                        font-family: Arial, Helvetica, sans-serif !important;
                    }
                    .bodyFont p {
                        font-family: Arial, Helvetica, sans-serif !important;
                    }
                    .mlContentButton {
                        font-family: Arial, Helvetica, sans-serif !important;
                    }
                </style>
            <![endif]-->
    
            <style type="text/css">
                @media only screen and (max-width: 640px) {
                    #logoBlock-4 {
                        max-width: 100px !important;
                        width: 100% !important;
                    }
                }
            </style>
            <style type="text/css">
                @media only screen and (max-width: 640px) {
                    #imageBlock-8 img {
                        max-width: 1120px !important;
                        width: 100% !important;
                    }
                }
            </style>
            <title>Tu ticket (Let's cook)</title>
            <meta name="robots" content="noindex, nofollow" />
        </head>
    
        <body
            class="mlBodyBackgroundImage"
            style="padding: 0; margin: 0; -webkit-font-smoothing: antialiased; background-color: #ffffff; -webkit-text-size-adjust: none"
        >
            <!-- Make your email an accessible article. -->
            <div role="article" aria-roledescription="email" aria-label="Tu+ticket+%28Let%27s+cook%29">
                <!--[if !mso]><!-- -->
                <table
                    width="100%"
                    border="0"
                    cellspacing="0"
                    cellpadding="0"
                    bgcolor="#ffffff"
                    class="mainTable mlBodyBackgroundImageTable"
                    dir="ltr"
                    background="https://bucket.mlcdn.com/a/1966/1966360/images/458a3e2a9cefdfc02c5bdbe2e5648187276656c2.jpeg"
                    style="background-image: url(https://bucket.mlcdn.com/a/1966/1966360/images/458a3e2a9cefdfc02c5bdbe2e5648187276656c2.jpeg)"
                >
                    <tr>
                        <td class="mlTemplateContainer" align="center">
                            <!--<![endif]-->
    
                            <!--[if mso 16]>
          <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
            <tr>
              <td bgcolor="#ffffff" align="center">
                <!--<![endif]-->
    
                            <table
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                align="center"
                                width="640"
                                style="width: 640px; min-width: 640px"
                                class="mobileHide"
                            >
                                <tr>
                                    <td align="center">
                                        <table
                                            cellpadding="0"
                                            cellspacing="0"
                                            border="0"
                                            align="center"
                                            width="640"
                                            style="width: 640px; min-width: 640px"
                                            class="mlContentTable"
                                        >
                                            <tr>
                                                <td colspan="2" height="20"></td>
                                            </tr>
                                            <tr>
                                                <td
                                                    align="left"
                                                    style="
                                                        font-family: 'Lato', Arial, Helvetica, sans-serif;
                                                        color: #111111;
                                                        font-size: 12px;
                                                        line-height: 18px;
                                                    "
                                                ></td>
                                                <td
                                                    align="right"
                                                    style="
                                                        font-family: 'Lato', Arial, Helvetica, sans-serif;
                                                        color: #111111;
                                                        font-size: 12px;
                                                        line-height: 18px;
                                                    "
                                                >
                                                    <a style="color: #111111" href="">View in browser</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" height="20"></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
    
                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="mlContentTable" width="100%">
                                <tr>
                                    <td>
                                        <!--  -->
                                        <table
                                            align="center"
                                            border="0"
                                            bgcolor=""
                                            class="mlContentTable mlContentTableDefault"
                                            cellpadding="0"
                                            cellspacing="0"
                                            width="100%"
                                        >
                                            <tr>
                                                <td class="mlContentTableCardTd">
                                                    <table
                                                        align="center"
                                                        bgcolor=""
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        class="mlContentTable ml-fullwidth"
                                                        style="width: 640px; min-width: 640px"
                                                        width="640"
                                                    >
                                                        <tr>
                                                            <td>
                                                                <table
                                                                    role="presentation"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    border="0"
                                                                    align="center"
                                                                    width="640"
                                                                    style="width: 640px; min-width: 640px"
                                                                    class="mlContentTable"
                                                                >
                                                                    <tr>
                                                                        <td
                                                                            height="10"
                                                                            class="spacingHeight-10"
                                                                            style="line-height: 10px; min-height: 10px"
                                                                        ></td>
                                                                    </tr>
                                                                </table>
    
                                                                <table
                                                                    role="presentation"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    border="0"
                                                                    align="center"
                                                                    width="640"
                                                                    style="width: 640px; min-width: 640px"
                                                                    class="mlContentTable"
                                                                >
                                                                    <tr>
                                                                        <td align="center" style="padding: 0px 40px" class="mlContentOuter">
                                                                            <table
                                                                                role="presentation"
                                                                                cellpadding="0"
                                                                                cellspacing="0"
                                                                                border="0"
                                                                                align="center"
                                                                                width="100%"
                                                                            >
                                                                                <tr>
                                                                                    <td align="center">
                                                                                        <a href="http://www.letscooknow.es/" target="_blank">
                                                                                            <img
                                                                                                src="https://bucket.mlcdn.com/a/1966/1966360/images/1a47d96190f513a9cce80f8ac6ca8031e78c3da9.png"
                                                                                                id="logoBlock-4"
                                                                                                border="0"
                                                                                                alt=""
                                                                                                width="100"
                                                                                                style="display: block"
                                                                                            />
                                                                                        </a>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
    
                                                                <table
                                                                    role="presentation"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    border="0"
                                                                    align="center"
                                                                    width="640"
                                                                    style="width: 640px; min-width: 640px"
                                                                    class="mlContentTable"
                                                                >
                                                                    <tr>
                                                                        <td
                                                                            height="20"
                                                                            class="spacingHeight-20"
                                                                            style="line-height: 20px; min-height: 20px"
                                                                        ></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        <!--  -->
    
                                        <!--  -->
                                        <table
                                            align="center"
                                            border="0"
                                            bgcolor="#ffffff"
                                            class="mlContentTable mlContentTableDefault"
                                            cellpadding="0"
                                            cellspacing="0"
                                            width="100%"
                                        >
                                            <tr>
                                                <td class="mlContentTableCardTd">
                                                    <table
                                                        align="center"
                                                        bgcolor="#ffffff"
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        class="mlContentTable ml-fullwidth"
                                                        style="width: 640px; min-width: 640px"
                                                        width="640"
                                                    >
                                                        <tr>
                                                            <td>
                                                                <table
                                                                    role="presentation"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    border="0"
                                                                    align="center"
                                                                    width="640"
                                                                    style="width: 640px; min-width: 640px"
                                                                    class="mlContentTable"
                                                                >
                                                                    <tr>
                                                                        <td
                                                                            height="20"
                                                                            class="spacingHeight-20"
                                                                            style="line-height: 20px; min-height: 20px"
                                                                        ></td>
                                                                    </tr>
                                                                </table>
    
                                                                <table
                                                                    role="presentation"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    border="0"
                                                                    align="center"
                                                                    width="640"
                                                                    style="width: 640px; min-width: 640px"
                                                                    class="mlContentTable"
                                                                >
                                                                    <tr>
                                                                        <td align="center" style="padding: 0px 40px" class="mlContentOuter">
                                                                            <table
                                                                                role="presentation"
                                                                                cellpadding="0"
                                                                                cellspacing="0"
                                                                                border="0"
                                                                                align="center"
                                                                                width="100%"
                                                                            >
                                                                                <tr>
                                                                                    <td
                                                                                        class="bodyTitle"
                                                                                        id="bodyText-6"
                                                                                        style="
                                                                                            font-family: 'Lato', Arial, Helvetica, sans-serif;
                                                                                            font-size: 14px;
                                                                                            line-height: 150%;
                                                                                            color: #6f6f6f;
                                                                                        "
                                                                                    >
                                                                                        <p
                                                                                            style="
                                                                                                margin-top: 0px;
                                                                                                margin-bottom: 10px;
                                                                                                line-height: 150%;
                                                                                                text-align: center;
                                                                                            "
                                                                                        >
                                                                                            <strong
                                                                                                ><span style="color: rgb(0, 0, 0)"
                                                                                                    >Tu&nbsp;ticket de Let's cook</span
                                                                                                ></strong
                                                                                            >
                                                                                        </p>
                                                                                        <p
                                                                                            style="
                                                                                                margin-top: 0px;
                                                                                                margin-bottom: 10px;
                                                                                                line-height: 150%;
                                                                                                text-align: center;
                                                                                            "
                                                                                        >
                                                                                            <span style="color: rgb(0, 0, 0)"
                                                                                                ><span style="color: rgb(127, 140, 141)"
                                                                                                    >Ticket&nbsp;<span></span></span
                                                                                            ></span>
                                                                                        </p>
                                                                                        <p
                                                                                            style="
                                                                                                margin-top: 0px;
                                                                                                margin-bottom: 10px;
                                                                                                line-height: 150%;
                                                                                            "
                                                                                        >
                                                                                            <span style="color: rgb(0, 0, 0)"
                                                                                                ><span style="color: rgb(127, 140, 141)"
                                                                                                    ><br /></span
                                                                                            ></span>
                                                                                        </p>
                                                                                        <p
                                                                                            style="
                                                                                                margin-top: 0px;
                                                                                                margin-bottom: 10px;
                                                                                                line-height: 150%;
                                                                                            "
                                                                                        >
                                                                                            <span style="color: rgb(0, 0, 0)"
                                                                                                ><span style="color: rgb(127, 140, 141)"
                                                                                                    >Resumen de&nbsp;pedido:</span
                                                                                                ></span
                                                                                            >
                                                                                        </p>
                                                                                        <div>
                                                                                        ${dto.orders.map(
                                                                                            (order) =>
                                                                                                `<p style="margin-top: 0px;margin-bottom: 10px;line-height: 150%;">
                                                                                            <span style="color: rgb(0, 0, 0)"><span style="color: rgb(127, 140, 141)">
                                                                                            <span>• ${
                                                                                                order.plan.name
                                                                                            } - ${order.getPlanVariantLabel(
                                                                                                    order.planVariantId
                                                                                                )}</span></span></span>
                                                                                        </p>`
                                                                                        )}
                                                                                        </div>
                                                                                        <p
                                                                                            style="
                                                                                                margin-top: 0px;
                                                                                                margin-bottom: 10px;
                                                                                                line-height: 150%;
                                                                                            "
                                                                                        >
                                                                                            <span style="color: rgb(127, 140, 141)"><br/></span>
                                                                                        </p>
                                                                                        <p
                                                                                            style="
                                                                                                margin-top: 0px;
                                                                                                margin-bottom: 10px;
                                                                                                line-height: 150%;
                                                                                            "
                                                                                        >
                                                                                            <span style="color: rgb(0, 0, 0)"
                                                                                                ><span style="color: rgb(127, 140, 141)"
                                                                                                    >Envío (¡Sin cargo en Barcelona y pueblos
                                                                                                    cercanos!): ${dto.shippingCost} €</span
                                                                                                ></span
                                                                                            >
                                                                                        </p>
                                                                                        <p
                                                                                        style="
                                                                                            margin-top: 0px;
                                                                                            margin-bottom: 10px;
                                                                                            line-height: 150%;
                                                                                        "
                                                                                    >
                                                                                        <span style="color: rgb(0, 0, 0)"
                                                                                            ><span style="color: rgb(127, 140, 141)"
                                                                                                >Descuento: ${dto.discountAmount} €</span
                                                                                            ></span
                                                                                        >
                                                                                    </p>
                                                                                        <p
                                                                                            style="
                                                                                                margin-top: 0px;
                                                                                                margin-bottom: 10px;
                                                                                                line-height: 150%;
                                                                                            "
                                                                                        >
                                                                                            <span style="color: rgb(0, 0, 0)"
                                                                                                ><span style="color: rgb(127, 140, 141)"
                                                                                                    >IVA (10%): ${dto.foodVAT} €</span
                                                                                                ></span
                                                                                            >
                                                                                        </p>
                                                                                        <p
                                                                                            style="
                                                                                                margin-top: 0px;
                                                                                                margin-bottom: 10px;
                                                                                                line-height: 150%;
                                                                                            "
                                                                                        >
                                                                                            <span style="color: rgb(127, 140, 141)"
                                                                                                ><strong
                                                                                                    >Total: ${dto.totalAmount} €<span
                                                                                                    ></span></strong
                                                                                                ><br
                                                                                            /></span>
                                                                                        </p>
                                                                                        <p
                                                                                            style="
                                                                                                margin-top: 0px;
                                                                                                margin-bottom: 10px;
                                                                                                line-height: 150%;
                                                                                            "
                                                                                        >
                                                                                            <span style="color: rgb(127, 140, 141)"
                                                                                                ><br
                                                                                            /></span>
                                                                                        </p>
                                                                                        <p
                                                                                            style="
                                                                                                margin-top: 0px;
                                                                                                margin-bottom: 10px;
                                                                                                line-height: 150%;
                                                                                            "
                                                                                        >
                                                                                            <span style="color: rgb(127, 140, 141)"
                                                                                                >Fecha de entrega: ${dto.shippingDate}<span
                                                                                                ></span
                                                                                            ></span>
                                                                                        </p>
                                                                                        <p
                                                                                            style="
                                                                                                margin-top: 0px;
                                                                                                margin-bottom: 10px;
                                                                                                line-height: 150%;
                                                                                            "
                                                                                        >
                                                                                            <span style="color: rgb(0, 0, 0)"
                                                                                                ><span style="color: rgb(127, 140, 141)"
                                                                                                    >Nombre y dirección de envío:</span
                                                                                                ></span
                                                                                            >
                                                                                        </p>
                                                                                        <p
                                                                                            style="
                                                                                                margin-top: 0px;
                                                                                                margin-bottom: 10px;
                                                                                                line-height: 150%;
                                                                                            "
                                                                                        >
                                                                                            <span style="color: rgb(0, 0, 0)"
                                                                                                ><span style="color: rgb(127, 140, 141)"
                                                                                                    >${dto.shippingCustomerName}</span
                                                                                                ></span
                                                                                            >
                                                                                        </p>
                                                                                        <p
                                                                                            style="
                                                                                                margin-top: 0px;
                                                                                                margin-bottom: 10px;
                                                                                                line-height: 150%;
                                                                                            "
                                                                                        >
                                                                                            <span style="color: rgb(0, 0, 0)"
                                                                                                ><span style="color: rgb(127, 140, 141)"
                                                                                                    >${dto.shippingAddressName}</span
                                                                                                ></span
                                                                                            >
                                                                                        </p>
                                                                                        <p
                                                                                            style="
                                                                                                margin-top: 0px;
                                                                                                margin-bottom: 10px;
                                                                                                line-height: 150%;
                                                                                            "
                                                                                        >
                                                                                            <span style="color: rgb(0, 0, 0)"
                                                                                                ><span style="color: rgb(127, 140, 141)"
                                                                                                    >${dto.shippingAddressCity}</span
                                                                                                ></span
                                                                                            >
                                                                                        </p>
                                                                                        <p
                                                                                            style="
                                                                                                margin-top: 0px;
                                                                                                margin-bottom: 0px;
                                                                                                line-height: 150%;
                                                                                            "
                                                                                        >
                                                                                            <span style="color: rgb(0, 0, 0)"
                                                                                                ><span style="color: rgb(127, 140, 141)"
                                                                                                    >${dto.phoneNumber}</span
                                                                                                ></span
                                                                                            ><span style="caret-color: rgb(127, 140, 141)"
                                                                                                ><br
                                                                                            /></span>
                                                                                        </p>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
    
                                                                <table
                                                                    role="presentation"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    border="0"
                                                                    align="center"
                                                                    width="640"
                                                                    style="width: 640px; min-width: 640px"
                                                                    class="mlContentTable"
                                                                >
                                                                    <tr>
                                                                        <td
                                                                            height="20"
                                                                            class="spacingHeight-20"
                                                                            style="line-height: 20px; min-height: 20px"
                                                                        ></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        <!--  -->
    
                                        <!--  -->
                                        <table
                                            align="center"
                                            border="0"
                                            bgcolor="#ffffff"
                                            class="mlContentTable mlContentTableDefault"
                                            cellpadding="0"
                                            cellspacing="0"
                                            width="100%"
                                        >
                                            <tr>
                                                <td class="mlContentTableCardTd">
                                                    <table
                                                        align="center"
                                                        bgcolor="#ffffff"
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        class="mlContentTable ml-fullwidth"
                                                        style="width: 640px; min-width: 640px"
                                                        width="640"
                                                    >
                                                        <tr>
                                                            <td>
                                                                <table
                                                                    role="presentation"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    border="0"
                                                                    align="center"
                                                                    width="640"
                                                                    style="width: 640px; min-width: 640px"
                                                                    class="mlContentTable"
                                                                >
                                                                    <tr>
                                                                        <td
                                                                            height="20"
                                                                            class="spacingHeight-20"
                                                                            style="line-height: 20px; min-height: 20px"
                                                                        ></td>
                                                                    </tr>
                                                                </table>
    
                                                                <table
                                                                    role="presentation"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    border="0"
                                                                    align="center"
                                                                    width="640"
                                                                    style="width: 640px; min-width: 640px"
                                                                    class="mlContentTable"
                                                                >
                                                                    <tr>
                                                                        <td align="center" style="padding: 0px 40px" class="mlContentOuter">
                                                                            <table
                                                                                role="presentation"
                                                                                cellpadding="0"
                                                                                cellspacing="0"
                                                                                border="0"
                                                                                align="center"
                                                                                width="100%"
                                                                            >
                                                                                <tr>
                                                                                    <td align="center">
                                                                                        <table
                                                                                            role="presentation"
                                                                                            cellpadding="0"
                                                                                            cellspacing="0"
                                                                                            border="0"
                                                                                            align="left"
                                                                                            width="267"
                                                                                            style="width: 267px; min-width: 267px"
                                                                                            class="mlContentTable marginBottom"
                                                                                        >
                                                                                            <tr>
                                                                                                <td align="center" id="imageBlock-8">
                                                                                                    <img
                                                                                                        src="https://bucket.mlcdn.com/a/1966/1966360/images/8e164349c358fe0826768e4aff2366efc33b821c.jpeg/e32f9f6eefe18973b18cbeac3851e52ba09ce6cd.jpeg"
                                                                                                        border="0"
                                                                                                        alt=""
                                                                                                        width="267"
                                                                                                        style="display: block"
                                                                                                    />
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
    
                                                                                        <!--[if mso]>
              </td>
              <td valign="top">
              <![endif]-->
    
                                                                                        <table
                                                                                            role="presentation"
                                                                                            cellpadding="0"
                                                                                            cellspacing="0"
                                                                                            border="0"
                                                                                            align="right"
                                                                                            width="267"
                                                                                            style="width: 267px; min-width: 267px"
                                                                                            class="mlContentTable"
                                                                                        >
                                                                                            <tr>
                                                                                                <td
                                                                                                    align="center"
                                                                                                    valign="top"
                                                                                                    height="178"
                                                                                                    class="mlContentHeight"
                                                                                                >
                                                                                                    <table
                                                                                                        role="presentation"
                                                                                                        cellpadding="0"
                                                                                                        cellspacing="0"
                                                                                                        border="0"
                                                                                                        align="center"
                                                                                                        width="100%"
                                                                                                    >
                                                                                                        <tr>
                                                                                                            <td
                                                                                                                align="left"
                                                                                                                class="bodyTitle"
                                                                                                                id="bodyText-8"
                                                                                                                style="
                                                                                                                    font-family: 'Lato', Arial,
                                                                                                                        Helvetica, sans-serif;
                                                                                                                    font-size: 14px;
                                                                                                                    line-height: 150%;
                                                                                                                    color: #6f6f6f;
                                                                                                                "
                                                                                                            >
                                                                                                                <p
                                                                                                                    style="
                                                                                                                        margin-top: 0px;
                                                                                                                        margin-bottom: 10px;
                                                                                                                        font-size: 14px;
                                                                                                                        line-height: 150%;
                                                                                                                        color: #6f6f6f;
                                                                                                                    "
                                                                                                                >
                                                                                                                    <em>¿Alguna duda?&nbsp;</em
                                                                                                                    ><br />
                                                                                                                </p>
                                                                                                                <p
                                                                                                                    style="
                                                                                                                        margin-top: 0px;
                                                                                                                        margin-bottom: 0px;
                                                                                                                        font-size: 14px;
                                                                                                                        line-height: 150%;
                                                                                                                        color: #6f6f6f;
                                                                                                                    "
                                                                                                                >
                                                                                                                    En Let’s Cook queremos
                                                                                                                    ayudarte para que puedas
                                                                                                                    disfrutar al máximo de
                                                                                                                    buenos y ricos momentos con
                                                                                                                    los tuyos. Así que si tienes
                                                                                                                    alguna pregunta no dudes en
                                                                                                                    contactar con
                                                                                                                    nosotros.&nbsp;
                                                                                                                </p>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
    
                                                                <table
                                                                    role="presentation"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    border="0"
                                                                    align="center"
                                                                    width="640"
                                                                    style="width: 640px; min-width: 640px"
                                                                    class="mlContentTable"
                                                                >
                                                                    <tr>
                                                                        <td
                                                                            height="20"
                                                                            class="spacingHeight-20"
                                                                            style="line-height: 20px; min-height: 20px"
                                                                        ></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        <!--  -->
    
                                        <!--  -->
                                        <table
                                            align="center"
                                            border="0"
                                            bgcolor="#ffffff"
                                            class="mlContentTable mlContentTableDefault"
                                            cellpadding="0"
                                            cellspacing="0"
                                            width="100%"
                                        >
                                            <tr>
                                                <td class="mlContentTableCardTd">
                                                    <table
                                                        align="center"
                                                        bgcolor="#ffffff"
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        class="mlContentTable ml-fullwidth"
                                                        style="width: 640px; min-width: 640px"
                                                        width="640"
                                                    >
                                                        <tr>
                                                            <td>
                                                                <table
                                                                    role="presentation"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    border="0"
                                                                    align="center"
                                                                    width="640"
                                                                    style="width: 640px; min-width: 640px"
                                                                    class="mlContentTable"
                                                                >
                                                                    <tr>
                                                                        <td
                                                                            height="20"
                                                                            class="spacingHeight-20"
                                                                            style="line-height: 20px; min-height: 20px"
                                                                        ></td>
                                                                    </tr>
                                                                </table>
    
                                                                <table
                                                                    role="presentation"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    border="0"
                                                                    align="center"
                                                                    width="640"
                                                                    style="width: 640px; min-width: 640px"
                                                                    class="mlContentTable"
                                                                >
                                                                    <tr>
                                                                        <td align="center" style="padding: 0px 40px" class="mlContentOuter">
                                                                            <table
                                                                                role="presentation"
                                                                                cellpadding="0"
                                                                                cellspacing="0"
                                                                                border="0"
                                                                                align="center"
                                                                                width="560"
                                                                                style="border-radius: 0px; border-collapse: separate"
                                                                                class="mlContentTable"
                                                                            >
                                                                                <tr>
                                                                                    <td
                                                                                        align="center"
                                                                                        style="
                                                                                            padding: 0 40px;
                                                                                            border: none;
                                                                                            border-radius: 0px;
                                                                                        "
                                                                                        bgcolor="#FCFCFC"
                                                                                        class="mlContentOuter"
                                                                                    >
                                                                                        <table
                                                                                            role="presentation"
                                                                                            cellpadding="0"
                                                                                            cellspacing="0"
                                                                                            border="0"
                                                                                            align="center"
                                                                                            width="100%"
                                                                                        >
                                                                                            <tr>
                                                                                                <td height="30" class="spacingHeight-40"></td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td
                                                                                                    class="bodyTitle"
                                                                                                    id="bodyText-10"
                                                                                                    style="
                                                                                                        font-family: 'Lato', Arial, Helvetica,
                                                                                                            sans-serif;
                                                                                                        font-size: 14px;
                                                                                                        line-height: 150%;
                                                                                                        color: #6f6f6f;
                                                                                                    "
                                                                                                >
                                                                                                    <p
                                                                                                        style="
                                                                                                            margin-top: 0px;
                                                                                                            margin-bottom: 0px;
                                                                                                            line-height: 150%;
                                                                                                            text-align: center;
                                                                                                        "
                                                                                                    >
                                                                                                        <span
                                                                                                            style="
                                                                                                                color: rgb(40, 167, 69);
                                                                                                                font-size: 18px;
                                                                                                            "
                                                                                                            >Gracias por confiar en nosotr@s y…
                                                                                                            ¡a cocinar!</span
                                                                                                        >
                                                                                                    </p>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td height="30" class="spacingHeight-40"></td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
    
                                                                <table
                                                                    role="presentation"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    border="0"
                                                                    align="center"
                                                                    width="640"
                                                                    style="width: 640px; min-width: 640px"
                                                                    class="mlContentTable"
                                                                >
                                                                    <tr>
                                                                        <td
                                                                            height="20"
                                                                            class="spacingHeight-20"
                                                                            style="line-height: 20px; min-height: 20px"
                                                                        ></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        <!--  -->
    
                                        <table
                                            align="center"
                                            border="0"
                                            bgcolor="#28a745"
                                            class="mlContentTable mlContentTableFooterDefault"
                                            cellpadding="0"
                                            cellspacing="0"
                                            width="100%"
                                        >
                                            <tr>
                                                <td class="mlContentTableFooterCardTd">
                                                    <table
                                                        align="center"
                                                        bgcolor="#28a745"
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        class="mlContentTable ml-fullwidth"
                                                        style="width: 640px; min-width: 640px"
                                                        width="640"
                                                    >
                                                        <tr>
                                                            <td>
                                                                <table
                                                                    role="presentation"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    border="0"
                                                                    align="center"
                                                                    width="640"
                                                                    style="width: 640px; min-width: 640px"
                                                                    class="mlContentTable"
                                                                >
                                                                    <tr>
                                                                        <td
                                                                            height="20"
                                                                            class="spacingHeight-20"
                                                                            style="line-height: 20px; min-height: 20px"
                                                                        ></td>
                                                                    </tr>
                                                                </table>
    
                                                                <table
                                                                    role="presentation"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    border="0"
                                                                    align="center"
                                                                    width="640"
                                                                    style="width: 640px; min-width: 640px"
                                                                    class="mlContentTable"
                                                                >
                                                                    <tr>
                                                                        <td align="center" style="padding: 0px 40px" class="mlContentOuter">
                                                                            <table
                                                                                role="presentation"
                                                                                cellpadding="0"
                                                                                cellspacing="0"
                                                                                border="0"
                                                                                align="center"
                                                                                width="100%"
                                                                            >
                                                                                <tr>
                                                                                    <td
                                                                                        align="left"
                                                                                        class="bodyTitle"
                                                                                        style="
                                                                                            font-family: 'Lato', Arial, Helvetica, sans-serif;
                                                                                            font-size: 16px;
                                                                                            font-weight: 700;
                                                                                            line-height: 150%;
                                                                                            color: #ffffff;
                                                                                        "
                                                                                    >
                                                                                        Come bueno y rico cada semana
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
    
                                                                <table
                                                                    role="presentation"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    border="0"
                                                                    align="center"
                                                                    width="640"
                                                                    style="width: 640px; min-width: 640px"
                                                                    class="mlContentTable"
                                                                >
                                                                    <tr>
                                                                        <td height="10" class="spacingHeight-10"></td>
                                                                    </tr>
                                                                </table>
    
                                                                <table
                                                                    role="presentation"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    border="0"
                                                                    align="center"
                                                                    width="640"
                                                                    style="width: 640px; min-width: 640px"
                                                                    class="mlContentTable"
                                                                >
                                                                    <tr>
                                                                        <td align="center" style="padding: 0px 40px" class="mlContentOuter">
                                                                            <table
                                                                                role="presentation"
                                                                                cellpadding="0"
                                                                                cellspacing="0"
                                                                                border="0"
                                                                                align="center"
                                                                                width="100%"
                                                                            >
                                                                                <tr>
                                                                                    <td align="center">
                                                                                        <table
                                                                                            role="presentation"
                                                                                            cellpadding="0"
                                                                                            cellspacing="0"
                                                                                            border="0"
                                                                                            align="left"
                                                                                            width="267"
                                                                                            style="width: 267px; min-width: 267px"
                                                                                            class="mlContentTable marginBottom"
                                                                                        >
                                                                                            <tr>
                                                                                                <td
                                                                                                    align="left"
                                                                                                    class="bodyTitle"
                                                                                                    id="footerText-12"
                                                                                                    style="
                                                                                                        font-family: 'Lato', Arial, Helvetica,
                                                                                                            sans-serif;
                                                                                                        font-size: 12px;
                                                                                                        line-height: 100%;
                                                                                                        color: #ffffff;
                                                                                                    "
                                                                                                >
                                                                                                    <p
                                                                                                        style="
                                                                                                            margin-top: 0px;
                                                                                                            margin-bottom: 10px;
                                                                                                        "
                                                                                                    >
                                                                                                        Economiza tu tiempo
                                                                                                    </p>
                                                                                                    <p
                                                                                                        style="
                                                                                                            margin-top: 0px;
                                                                                                            margin-bottom: 10px;
                                                                                                        "
                                                                                                    >
                                                                                                        Come saludable y variado
                                                                                                    </p>
                                                                                                    <p
                                                                                                        style="
                                                                                                            margin-top: 0px;
                                                                                                            margin-bottom: 0px;
                                                                                                        "
                                                                                                    >
                                                                                                        Combate el fondwaste
                                                                                                    </p>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td height="25" class="spacingHeight-20"></td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td align="center">
                                                                                                    <table
                                                                                                        role="presentation"
                                                                                                        cellpadding="0"
                                                                                                        cellspacing="0"
                                                                                                        border="0"
                                                                                                        align="left"
                                                                                                    >
                                                                                                        <tr>
                                                                                                            <td
                                                                                                                align="center"
                                                                                                                width="24"
                                                                                                                style="padding: 0px 5px"
                                                                                                                ng-show="slink.link != ''"
                                                                                                            >
                                                                                                                <a
                                                                                                                    href="https://www.instagram.com/letscook.now/"
                                                                                                                    target="_blank"
                                                                                                                >
                                                                                                                    <img
                                                                                                                        width="24"
                                                                                                                        alt="instagram"
                                                                                                                        src="https://cdn.mailerlite.com/images/icons/default/round/white/instagram.png"
                                                                                                                        style="display: block"
                                                                                                                        border="0"
                                                                                                                    />
                                                                                                                </a>
                                                                                                            </td>
                                                                                                            <td
                                                                                                                align="center"
                                                                                                                width="24"
                                                                                                                style="padding: 0px 5px"
                                                                                                                ng-show="slink.link != ''"
                                                                                                            >
                                                                                                                <a
                                                                                                                    href="https://www.youtube.com/channel/UCWmWuYmsvW5H2BWykUCAmZg"
                                                                                                                    target="_blank"
                                                                                                                >
                                                                                                                    <img
                                                                                                                        width="24"
                                                                                                                        alt="youtube"
                                                                                                                        src="https://cdn.mailerlite.com/images/icons/default/round/white/youtube.png"
                                                                                                                        style="display: block"
                                                                                                                        border="0"
                                                                                                                    />
                                                                                                                </a>
                                                                                                            </td>
                                                                                                            <td
                                                                                                                align="center"
                                                                                                                width="24"
                                                                                                                style="padding: 0px 5px"
                                                                                                                ng-show="slink.link != ''"
                                                                                                            >
                                                                                                                <a
                                                                                                                    href="https://www.facebook.com/pages/category/Foodservice-Distributor/Lets-cook-2399683106933532/"
                                                                                                                    target="_blank"
                                                                                                                >
                                                                                                                    <img
                                                                                                                        width="24"
                                                                                                                        alt="facebook"
                                                                                                                        src="https://cdn.mailerlite.com/images/icons/default/round/white/facebook.png"
                                                                                                                        style="display: block"
                                                                                                                        border="0"
                                                                                                                    />
                                                                                                                </a>
                                                                                                            </td>
                                                                                                            <td
                                                                                                                align="center"
                                                                                                                width="24"
                                                                                                                style="padding: 0px 5px"
                                                                                                                ng-show="slink.link != ''"
                                                                                                            >
                                                                                                                <a
                                                                                                                    href="https://www.pinterest.es/letscooknowes/"
                                                                                                                    target="_blank"
                                                                                                                >
                                                                                                                    <img
                                                                                                                        width="24"
                                                                                                                        alt="pinterest"
                                                                                                                        src="https://cdn.mailerlite.com/images/icons/default/round/white/pinterest.png"
                                                                                                                        style="display: block"
                                                                                                                        border="0"
                                                                                                                    />
                                                                                                                </a>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
    
                                                                                        <table
                                                                                            role="presentation"
                                                                                            cellpadding="0"
                                                                                            cellspacing="0"
                                                                                            border="0"
                                                                                            align="right"
                                                                                            width="267"
                                                                                            style="width: 267px; min-width: 267px"
                                                                                            class="mlContentTable"
                                                                                        >
                                                                                            <tr>
                                                                                                <td
                                                                                                    align="right"
                                                                                                    class="bodyTitle"
                                                                                                    style="
                                                                                                        font-family: 'Lato', Arial, Helvetica,
                                                                                                            sans-serif;
                                                                                                        font-size: 12px;
                                                                                                        line-height: 100%;
                                                                                                        color: #ffffff;
                                                                                                    "
                                                                                                >
                                                                                                    <a
                                                                                                        href="tel:WhatsApp +34 653 65 05 83"
                                                                                                        style="
                                                                                                            color: #ffffff;
                                                                                                            text-decoration: none;
                                                                                                        "
                                                                                                        ><span style="color: #ffffff"
                                                                                                            >WhatsApp +34 653 65 05 83</span
                                                                                                        ></a
                                                                                                    >
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td
                                                                                                    align="right"
                                                                                                    class="bodyTitle"
                                                                                                    style="
                                                                                                        font-family: 'Lato', Arial, Helvetica,
                                                                                                            sans-serif;
                                                                                                        font-size: 12px;
                                                                                                        line-height: 100%;
                                                                                                        color: #ffffff;
                                                                                                    "
                                                                                                >
                                                                                                    <a
                                                                                                        href="mailto:info@letscooknow.es"
                                                                                                        style="
                                                                                                            color: #ffffff;
                                                                                                            text-decoration: none;
                                                                                                        "
                                                                                                        ><span style="color: #ffffff"
                                                                                                            >info@letscooknow.es</span
                                                                                                        ></a
                                                                                                    >
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td height="25" class="spacingHeight-20"></td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td
                                                                                                    align="right"
                                                                                                    class="bodyTitle"
                                                                                                    id="footerUnsubscribeText-12"
                                                                                                    style="
                                                                                                        font-family: 'Lato', Arial, Helvetica,
                                                                                                            sans-serif;
                                                                                                        font-size: 12px;
                                                                                                        line-height: 100%;
                                                                                                        color: #ffffff;
                                                                                                    "
                                                                                                >
                                                                                                    <p
                                                                                                        style="
                                                                                                            margin-top: 0px;
                                                                                                            margin-bottom: 0px;
                                                                                                        "
                                                                                                    >
                                                                                                        <span style="font-size: 10px"
                                                                                                            >Has recibido este correo
                                                                                                            electrónico porque nos has realizado
                                                                                                            compras.</span
                                                                                                        ><br />
                                                                                                    </p>
                                                                                                </td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td height="10"></td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td
                                                                                                    align="right"
                                                                                                    class="bodyTitle"
                                                                                                    style="
                                                                                                        font-family: 'Lato', Arial, Helvetica,
                                                                                                            sans-serif;
                                                                                                        font-size: 12px;
                                                                                                        line-height: 100%;
                                                                                                        color: #ffffff;
                                                                                                    "
                                                                                                >
                                                                                                    <a
                                                                                                        href="http://app.mailerlite.com/subscription/test_unsubscribe/43209502/1966360"
                                                                                                        style="
                                                                                                            color: #ffffff;
                                                                                                            text-decoration: none;
                                                                                                        "
                                                                                                    >
                                                                                                        <span style="color: #ffffff">.</span>
                                                                                                    </a>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </table>
    
                                                                <table
                                                                    role="presentation"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    border="0"
                                                                    align="center"
                                                                    width="640"
                                                                    style="width: 640px; min-width: 640px"
                                                                    class="mlContentTable"
                                                                >
                                                                    <tr>
                                                                        <td
                                                                            height="20"
                                                                            class="spacingHeight-20"
                                                                            style="line-height: 20px; min-height: 20px"
                                                                        ></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
    
                            <table
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                align="center"
                                width="640"
                                style="width: 640px; min-width: 640px"
                                class="mlContentTable"
                            >
                                <tr>
                                    <td height="40" class="spacingHeight-20"></td>
                                </tr>
                            </table>
    
                            <!-- Content ends here -->
    
                            <!--[if mso 16]>
          </td>
          </tr>
          </table>
          <!--<![endif]-->
    
                            <!--[if !mso]><!-- -->
                        </td>
                    </tr>
                </table>
                <!--<![endif]-->
            </div>
        </body>
    </html>
    `;
};
