const jwt = require('jsonwebtoken');
const discountModel = require('../model/discountModel');

exports.scan = async (request, response) => {
    const reqBody = request.body;
    let amount = reqBody.amount;
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
    let url = 'localhost:3000/claim-form/'
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