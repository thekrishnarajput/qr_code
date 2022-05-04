const jwt = require('jsonwebtoken');
const randomString = require('randomstring');

exports.claimed = async (request, response) => {
    let reqBody = request.body;
    // console.log("reqBody in claimed route:---", reqBody)
    let discountToken = reqBody.token;
    let decoded = jwt.verify(discountToken, process.env.TOKEN_KEY)
    let amount = decoded.amountToken.amount;
    let coupon = randomString.generate(15);
    console.log("coupon: ",coupon)
    console.log("amount: ",amount)
    response.render("success", {amount, coupon});
}