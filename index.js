const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const cors = require('cors');
const creds = require('./config');

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

router.post('/send', (req, res, next) => {
  const name = req.body.name
  const email = req.body.email
  const to = req.body.to
  const title = req.body.title
  const message = req.body.message
  const content = `name: ${name} \n email: ${email} \n title: ${title} \n message: ${message} `

  const mail = {
    from: name,
    to: to, 
    subject: 'New Message from Contact Form',
    text: content
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
