import { RecipeSelection } from "../bounded_contexts/operations/domain/order/RecipeSelection";

export const vegPlans = (name: string, recipeSelection: RecipeSelection[]) => {
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
			</style><style type="text/css">
				@media only screen and (max-width: 640px){
					#imageBlock-8 img {
						max-width: 267px!important;
						width: 100%!important;
					}
				}

			</style><style type="text/css">
				@media only screen and (max-width: 640px){
					#imageBlock-12 img {
						max-width: 1120px!important;
						width: 100%!important;
					}
				}

			</style><style type="text/css">
				@media only screen and (max-width: 640px){
					#imageBlock-14 img {
						max-width: 173px!important;
						width: 100%!important;
					}
				}

			</style><title>Hola ${name}, ¡Gracias por tu compra!</title><meta name="robots" content="noindex, nofollow"></head>

<body class="mlBodyBackgroundImage" style="padding: 0; margin: 0; -webkit-font-smoothing:antialiased; background-color:#ffffff; -webkit-text-size-adjust:none;">

<!-- Make your email an accessible article. -->
<div role="article" aria-roledescription="email" aria-label="Hola+%7B%24name%7D%2C+%C2%A1Gracias+por+tu+compra%21">
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

      <!-- Content starts here -->

      

      

        <!-- BORDER RADIUS FOR CARDS LAYOUT -->
        


        <!-- BORDER RADIUS FOR DEFAULT LAYOUT -->
        

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
                  <td align="right" style="font-family: 'Lato', Arial, Helvetica, sans-serif; color: #111111; font-size: 12px; line-height: 18px;"><a style="color: #111111;" href=""></a></td>
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
  				<td class="bodyTitle" id="bodyText-6" style="font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 14px; line-height: 150%; color: #6f6f6f;"><p style="margin-top: 0px; margin-bottom: 0px; line-height: 150%;"><strong><span style="color: rgb(40, 167, 69);">Hola ${name}, ¡gracias por tu compra!</span></strong><br></p>
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
		<td align="center" style="padding: 0px 40px;" class="mlContentOuter">

			

			<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="100%">
				<tr>
					<td align="left" id="bodyText-8" style="font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 14px; line-height: 150%; color: #6f6f6f;" class="bodyText">

						<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="right" style="border-collapse: collapse;mso-table-rspace: 0pt;mso-table-lspace: 6pt;" class="mlContentTable marginBottom">
							<tr>
								<!--[if !mso]><!-- -->
								<td height="1" width="25"></td>
								<!--<![endif]-->

								<!--[if mso]>
								<td height="1" width="15"></td>
								<![endif]-->
                <td align="center" id="imageBlock-8">
                  <img src="https://bucket.mlcdn.com/a/1966/1966360/images/22f821de49f7b914def1bc87fbd0e90ad9f944c8.jpeg/d9523186798aa4a6e1576df7b9cfef886c52f200.jpeg" border="0" alt="" width="267" style="display: block;">
                </td>
							</tr>
							<tr>
								<td colspan="2" height="10" class="mobileHide"></td>
							</tr>
						</table>

						
						
						<p style="margin-top: 0px; margin-bottom: 0px; font-size: 14px; line-height: 150%; color: #6f6f6f;">¡Mmmm qué buena pinta! Gracias por apuntarte a este planazo. A partir de ahora, con Let’s Cook, tu rutina y la de los tuyos será mucho más divertida y saludable. Te lo pondremos fácil para que puedas cocinar bueno y rico, aprender nuevas recetas y saborear platos con mucha chispa. ¿Pinta bien no?<br><br>Vemos que ya has elegido tus primeras recetas de tu plan para la semana que viene. ¡Qué rapidez! Se notan las ganas de iniciarse en Let’s Cook. O el hambre…</p>

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
		<td align="center" style="padding: 0px 40px;" class="mlContentOuter">

  		<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="100%">
  			<tr>
  				<td class="bodyTitle" id="bodyText-10" style="font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 14px; line-height: 150%; color: #6f6f6f;"><p style="margin-top: 0px; margin-bottom: 10px; line-height: 150%;">Estas son las recetas que has elegido:</p>
          <ul style="margin-top: 0px; margin-bottom: 10px;">${recipeSelection.map(
              (selection) => `<li style="margin-top: 0px; margin-bottom: 5px;">${selection.quantity} x ${selection.recipe.getName()}</li>`
          )}</ul>
<p style="margin-top: 0px; margin-bottom: 0px; line-height: 150%;"><em><span style="font-size: 10px;"><span style="color: rgb(127, 140, 141);">Si has marcado algún tipo de intolerancia o dieta especial, adaptaremos tu kit a tu perfil. Por ejemplo, sustituyendo el cuscús (gluten) por quinoa.</span></span></em></p></td>
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
		<td align="center" style="padding: 0px 40px;" class="mlContentOuter">
			

			<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="100%">
				<tr>
					<td align="left" id="bodyText-12" style="font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 14px; line-height: 150%; color: #6f6f6f;" class="bodyText">

						<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="left" style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 6pt;" class="mlContentTable marginBottom">
							<tr>
                <td align="center" id="imageBlock-12">
                  <img src="https://bucket.mlcdn.com/a/1966/1966360/images/10b9e532d45772bf473c5becb3a0d6afaa0d10eb.jpeg/f79eb4f6894e5f659b7d0d2f1bcedb78e816763b.jpeg" border="0" alt="" width="267" style="display: block;">
                </td>
								<!--[if !mso]><!-- -->
								<td height="1" width="25"></td>
								<!--<![endif]-->

								<!--[if mso]>
								<td height="1" width="15"></td>
								<![endif]-->
							</tr>
							<tr>
								<td colspan="2" height="10" class="mobileHide"></td>
							</tr>
						</table>

						
						
						<p style="margin-top: 0px; margin-bottom: 0px; font-size: 14px; line-height: 150%; color: #6f6f6f;">Los lunes recibirás por email las recetas de los kits seleccionados. Además,&nbsp;<strong>en la etiqueta de los kits encontrarás 2 códigos QR: uno con la receta paso a paso y otro con la video-receta.</strong> Como ves, enviamos las recetas digitalmente, así reducimos al máximo el papel y cuidamos de nuestro planeta.</p>

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
		<td align="center" style="padding: 0px 40px;" class="mlContentOuter">

			

			<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="100%">
				<tr>
					<td align="left" id="bodyText-14" style="font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 14px; line-height: 150%; color: #6f6f6f;" class="bodyText">

						<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="right" style="border-collapse: collapse;mso-table-rspace: 0pt;mso-table-lspace: 6pt;" class="mlContentTable marginBottom">
							<tr>
								<!--[if !mso]><!-- -->
								<td height="1" width="25"></td>
								<!--<![endif]-->

								<!--[if mso]>
								<td height="1" width="15"></td>
								<![endif]-->
                <td align="center" id="imageBlock-14">
                  <img src="https://bucket.mlcdn.com/a/1966/1966360/images/84b9ff90ca6d7a006bb2c664ddf15805a75ecb00.jpeg/2dcd701ea94ca5e34a0244ef249486c42093438c.jpeg" border="0" alt="" width="173" style="display: block;">
                </td>
							</tr>
							<tr>
								<td colspan="2" height="10" class="mobileHide"></td>
							</tr>
						</table>

						
						
						<p style="margin-top: 0px; margin-bottom: 10px; font-size: 14px; line-height: 150%; color: #6f6f6f;">De cara a las próximas semanas, si quieres saltar una semana, cancelar o cambiar algo en tu plan, puedes hacerlo antes de <strong>las 23.59 cada viernes</strong> desde tu cuenta en nuestra web. Este también es el límite para elegir tus recetas para la semana siguiente. Si para entonces no nos has indicado nada, seleccionaremos las más pedidas. ¡Igual no siempre eres tan rápid@ como hoy!</p>
<p style="margin-top: 0px; margin-bottom: 10px; font-size: 14px; line-height: 150%; color: #6f6f6f;"><em>¿Alguna duda? </em></p>
<p style="margin-top: 0px; margin-bottom: 10px; font-size: 14px; line-height: 150%; color: #6f6f6f;">En Let’s Cook queremos ayudarte para que puedas disfrutar al máximo de buenos y ricos momentos con los tuyos. Así que si tienes alguna pregunta no dudes en contactar con nosotros. </p>
<p style="margin-top: 0px; margin-bottom: 0px; font-size: 14px; line-height: 150%; color: #6f6f6f;"><br></p>

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

            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="560" style="border-radius: 0px; border-collapse: separate;" class="mlContentTable">
                <tr>
                    <td align="center" style="padding: 0 40px; border: none; border-radius: 0px;" bgcolor="#FCFCFC" class="mlContentOuter">

                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" width="100%">
                            <tr>
                                <td height="30" class="spacingHeight-40"></td>
                            </tr>
                            <tr>
                                <td class="bodyTitle" id="bodyText-16" style="font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 14px; line-height: 150%; color: #6f6f6f;"><p style="margin-top: 0px; margin-bottom: 0px; line-height: 150%; text-align: center;"><span style="color: rgb(40, 167, 69); font-size: 18px;">Gracias por confiar en nosotr@s y… ¡a cocinar!</span></p></td>
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
								<td align="left" class="bodyTitle" id="footerText-18" style="font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 12px; line-height: 100%; color: #ffffff;">
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
      					<td align="right" class="bodyTitle" id="footerUnsubscribeText-18" style="font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 12px; line-height: 100%; color: #ffffff;"><p style="margin-top: 0px; margin-bottom: 0px;"><span style="font-size: 10px;">Has recibido este correo electrónico porque te has registrado en nuestro sitio web o nos has realizado compras.</span><br></p></td>
      				</tr>
      				<tr>
      					<td height="10"></td>
      				</tr>
      				<tr>
      					<td align="right" class="bodyTitle" style="font-family: 'Lato', Arial, Helvetica, sans-serif; font-size: 12px; line-height: 100%; color: #ffffff;">
        					<a href="http://app.mailerlite.com/subscription/test_unsubscribe/43254493/1966360" style="color: #ffffff; text-decoration: underline;">
          					<span style="color: #ffffff;">Darte de baja</span>
          					
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
