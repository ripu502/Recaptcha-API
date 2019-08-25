const express = require('express');
const app = express();
const cors = require('cors'); ``
const request = require('request');
const keys = require('./keys');

app.use(cors())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/register', (req, res, next) => {
    const username = req.body.username;
    if (req.body['g-recaptcha-response'] === undefined ||
        req.body['g-recaptcha-response'] === '' ||
        req.body['g-recaptcha-response'] === null) {
        return res.json({ "msg": "Please select captcha first" });
    }

    // capcha is selected

    const secretKey = keys.secretkey;

    const verificationURL =
        `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;

    request(verificationURL, (err, response, body) => {
        body = JSON.parse(body);
        console.log(body);

        if (body.success !== undefined && !body.success) {
            return res.json({ "msg": "Failed captcha verification" });
        }
        res.json({ "msg": "Sucess" });
        console.log('success');
    });

})

app.listen(4000, () => {
    console.log(`http://localhost:4000`);
})