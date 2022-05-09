const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./database');
const qr = require('qrcode');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const randomString = require('randomstring');
const userModel = require('./model/userModel');
const discountModel = require('./model/discountModel');
const couponModel = require('./model/couponModel');

require('dotenv').config();
const port = process.env.PORT || 3000


let mailTransporter = nodemailer.createTransport({
    service: 'AOL',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});


// Using the ejs (Embedded JavaScript templates) as our template engine
// and call the body parser  - middleware for parsing bodies from URL
//                           - middleware for parsing json objects

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.render("index");
});

app.get('/generator', (request, response) => {
    response.render("generator");
});

app.post('/scan', async (request, response) => {
    const reqBody = request.body;
    let amount = reqBody.amount;
    try {
        let token = jwt.sign({
            amountToken:
            {
                amount: amount
            }
        },
            process.env.TOKEN_KEY,
            {
                expiresIn: "365d",
            })
        let result = await discountModel.saveDiscount(token);
        console.log("result:-", result)
        let url = 'https://qr-discount-generator.herokuapp.com/claim-form/'
        let finalUrl = url + token
        console.log("reqBody:-", finalUrl);
        // If the input is null return "Empty Data" error
        if (reqBody.amount === 0) {
            response.send("Amount is not entered!");
        }
        qr.toDataURL(finalUrl, (err, src) => {
            console.log("err:-", err)
            if (err) response.send("Error occurred");

            console.log("src:-", src);
            // Let us return the QR code image as our response and set it to be the source used in the webpage
            response.render("scan", { src });
        });
    }
    catch (error) {
        console.log("Error in catch: ", error)
        response.render("error")
    }
});

app.get('/claim-form/:amount', async (request, response) => {
    let amount = request.params.amount;
    console.log('request.params.amount:--', request.params.amount)
    try {
        let result = await discountModel.getDiscount(amount);
        console.log("result:---", result)
        if (result) {
            let discountToken = result.amount;
            let decoded = jwt.verify(discountToken, process.env.TOKEN_KEY)
            // let decodedAmount = decoded.amountToken.amount;
            // console.log("decodedAmount: ",decodedAmount)
            request.amountToken = decoded;
            response.render("claim", { amount });
        }
        else {
            response.render("error");
        }
    }
    catch (error) {
        console.log("Error in catch: ", error)
        response.render("error")
    }
});

app.post('/registered', async (request, response) => {
    let reqBody = request.body;
    try {
        let result = await userModel.userDetails(reqBody);
        let discountResult = await discountModel.getDiscount(reqBody.token);
        // console.log("discountResult:---", discountResult.amount)
        if (discountResult) {
            let discountToken = discountResult.amount;
            let decoded = jwt.verify(discountToken, process.env.TOKEN_KEY)
            let amount = decoded.amountToken.amount;
            let removedToken = await discountModel.deleteDiscountToken(discountToken);
            console.log("removedToken:-", removedToken);
            let coupon = randomString.generate(15);
            let data = { amount: amount, coupon: coupon }

            let mailDetails = {
                from: '"Coupon" <process.env.EMAIL>', // sender address
                to: result.email, // list of receivers
                subject: "Coupon code for discount!", // Subject line
                html: "<b>Congratulations " + result.name + "! You have won the amount of Rs. " + amount + "</b>" +
                    "<h3><a href='https://qr-discount-generator.herokuapp.com'>Coupon</a></h3>" +
                    " <b>Your coupon code is: " + coupon + ".</b>" +
                    "<b><br><br><br>Regards<br><h5>Coupon Company </h5></b>"
            }
            mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.log('Error Occurs..')
                    console.log(err)
                } else {
                    console.log('Email sent successfully..')
                }
            })

            let couponResult = await couponModel.saveCoupon(data);
            response.render("success", { amount, coupon });
        }
        else {
            console.log("token not found in DB")
            response.render("alreadyUsedQR");
        }
    }
    catch (error) {
        console.log("Error in catch: ", error)
        response.render("error")
    }
});

app.get('/verify-coupon', async (request, response) => {
    try {
        response.render("verifyCoupon");
        let reqBody = request.body;
        console.log("reqBody.coupon: ", reqBody);
    }
    catch (error) {
        console.log("Error in catch: ", error)
        response.render("error")
    }
});
app.post('/success-coupon', async (request, response) => {
    let reqBody = request.body.coupon;
    try {
        let couponResult = await couponModel.getCoupon(reqBody);
        let amount = couponResult.amount;
        let deleteCouponResult = await couponModel.deleteCoupon(reqBody);
        console.log("deleteCouponResult:--", deleteCouponResult)
        response.render("verifiedCoupon", { amount });
    }
    catch (error) {
        console.log("Error in catch: ", error)
        response.render("error")
    }
});


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});