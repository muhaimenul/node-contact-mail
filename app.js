const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const path = require('path')
const nodemailer = require('nodemailer')

const app = express()

//view engine setup
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')))

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//routes
app.get('/', (req, res) => {
    res.render('contact')
})

app.post('/send', (req, ers) => {

    const account = {
        user: 'USER_NAME',
        pass: 'USER_PASSWORD'
    }

    // console.log(account)
    const output = `
        <p> You have a new contact request</p>
        <h3> Constact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Name: ${req.body.company}</li>
            <li>Name: ${req.body.email}</li>
            <li>Name: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 465,
        secure: false, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer Contact 👻" <i.muhaimen@gmail.com>', // sender address
        to: 'muhaimenulislam@iut-dhaka.edu', // list of receivers
        subject: 'Node Contact Request ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', {msg: 'Email has been sent...'})
    });
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Server started at port '+port)
})
