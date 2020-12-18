const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const cors = require('cors');
const creds = require('./config');
const axios = require('axios');
const qs = require('querystring');

const transport = {
    host: creds.SERVER,
    port: 587,
    auth: {
    user: creds.USER,
    pass: creds.PASS
  }
}

const transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/send', async (req, res, next) => {
  const name = req.body.name
  const email = req.body.email
  const to = "starsinmypockets@gmail.com"
  const title = req.body.title
  const message = req.body.message
  const content = `name: ${name} \n email: ${email} \n title: ${title} \n message: ${message} `

  const mail = {
    from: name,
    to: to, 
    subject: 'New Message from Contact Form',
    text: content
  }
  const data = qs.stringify({
    secret: creds.RECAPCHA_SECRET_KEY,
    response: req.body.capcha
  })

  const capchaRes = await axios({
    method: "post",
    url: "https://www.google.com/recaptcha/api/siteverify",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  });

  const capchaBody = await capchaRes.data;

  console.log("Capcha RES", capchaBody);

  if (capchaBody.success) {
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        res.json({
          status: 'fail',
          error: err
        })
      } else {
        res.json({
         status: 'success'
        })
      }
    })
  } else {
    res.json({
      status: 'spam'
    })
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: 'fail',
        error: err
      })
    } else {
      res.json({
       status: 'success'
      })
    }
  })
})

const app = express()
app.use(cors())
app.use(express.json())
app.use('/', router)
app.listen(3002)
