const nodemailer = require('nodemailer');
const ENV = require('dotenv');

ENV.config();

async function sentActivationMail(userObject) {

  var client = nodemailer.createTransport({
    service: process.env.TRANSPORT_SERVICE,
    auth: {
      user: process.env.TRANSPORT_USER,
      pass: process.env.TRANSPORT_PASS,
    }
  });

  const {
    username,
    email
  } = userObject;

  const envelope = {
    from: '"Kigali Avengers" <info@kgl-avengers.com>',
    to: email,
    subject: 'Account activation ',
    html: `<!DOCTYPE html>
      <html lang="en">

      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link href="https://fonts.googleapis.com/css?family=Nanum+Gothic" rel="stylesheet">
        <title>Activate account</title>
        <style>
          body {
            padding: 0%;
            margin: 0%;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            font-family: 'Nanum Gothic', sans-serif;
            background: linear-gradient(#38c4b0, white);
          }

          .container {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }

          .box-container {
            background: white;
            padding: 5vh;
            width: 80%;
            max-width: 400px;
            -webkit-text-size-adjust: auto;
            margin: 10% auto;
            box-shadow: 1px 2px 2px 0 rgba(0, 0, 0, 0.2);
          }

          .btn {
            height: 50px;
            border-radius: 5px;
            text-decoration: none;
          }

          .btn-block {
            display: block;
            width: 100%;
          }

          .btn-primary {
            border-color: #38c4b0;
            background: white;
            cursor: pointer;
            color: #38c4b0
          }

          .btn-primary:hover {
            border-color: none;
            background: #38c4b0;
            color: white;
          }

          .m-2 {
            margin: 2%;
          }

          .mt-5 {
            margin-top: 5vh;
          }

          .mb-2 {
            margin-bottom: 2px;
          }
        </style>
      </head>

      <body>
        <div class="container">
          <div class="box-container">
            <h1>Activate account</h1>
            <h3>Just one more step...</h3>
            <div>
              <p>
                Hey <span id="username">Jean Bosco</span>, you are almost there to start enjoying Author Haven. <br>
                Simply click the green button bellow to verify your email address.
              </p>
            </div>
            <button class="btn btn-primary btn-block mt-5" type="submit" value="submit" onclick="openUrl()">Activate your
              account now</button>
          </div>
        </div>
      </body>
      <script>
        function openUrl() {
          window.open('http://google.com', '_blank');
        }
      </script>

      </html>`,
  };
  try {
    const info = await client.sendMail(envelope);
    console.log(info);
  } catch (error) {
    return error;
  }
}


sentActivationMail({
  username: 'Jean Bosco',
  email: 'bosco7209@gmail.com'
});