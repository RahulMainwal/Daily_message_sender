const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const scheduler = require("node-cron");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json()).use(cors());

app.get("/", (req, res) => {
  res.json("Hello, Server is connected ! 👋");
});
scheduler.schedule(" 0 23 19 * * * ", function () {
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error("Failed to create a testing account. " + err.message);
      return process.exit(1);
    }

    console.log("Credentials obtained, sending message...");

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      service: "gmail",
      auth: {
        user: `${process.env.ADMIN_EMAIL_ID}`,
        pass: `${process.env.ADMIN_EMAIL_PASS}`
      }
    });

    // Message object
    let message = {
      from: "Computer <computer@service.mail>",
      to: `${process.env.RECEIVER_EMAIL_ID}`,
      subject: "Special for you.",
      text: `Good Morning!`,
      html: `
        <div>
      <div style="border: 1px solid #1e90ff; border-radius: 5px;">
      <p style="font-size: 15px;">* Dear</p>
      <h1 style=" padding: 30px 0; font-size: 20px;text-align: center; color: white; background-color: #1e90ff; margin-top: 0;" >Good Morning!</h1>
      </div>
      </div>`
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log("Error occurred. " + err.message);
        return process.exit(1);
      }

      console.log("Message sent: %s", info, message.text);
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
  });
  console.log("Sending");
});

// On gère les routes 404.
app.use(({ res }) => {
  const message =
    "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
  res.status(404).json({ message });
});

app.listen(port, () =>
  console.log(
    `Notre application Node est démarrée sur : http://localhost:${port}`
  )
);
