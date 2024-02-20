require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 3000;
const user = process.env.user;
const login = process.env.login;
const email = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: user,
    pass: login,
  },
});

app.get("/email", async (req, res) => {
  const params = req.headers;
  if (!params.pranuesi)
    return res.status(400).send("Jep nje pranues te email-it");

  if (!params.subjekti)
    return res.status(400).send("Jep nje subjekt per email");

  if (!params.mesazhi) return res.status(400).send("Jep nje mesazh per email");

  if (
    !params.password ||
    (params?.password && params?.password !== process.env?.serverpassword)
  )
    return res
      .status(401)
      .send("Nuk jeni i autorizuar per te kryer kete veprim");

  email.sendMail(
    {
      from: `Kompania ABC <${user}>`,
      to: params.pranuesi,
      subject: params.subjekti,
      html: params.mesazhi,
    },
    function (error, info) {
      if (!error) {
        res.status(200).send("Email u dergua");
      } else {
        console.error(error);
        res.status(500).send("Email nuk u dergua");
      }
    }
  );
});

app.listen(port, function () {
  console.log(`Serveri eshte duke degjuar ne port ${port}`);
});
