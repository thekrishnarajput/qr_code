const jwt = require('jsonwebtoken');
const discountModel = require('../model/discountModel');

exports.claim = async (request, response) => {
    let amount = request.params.amount
    let result = await discountModel.getDiscount(amount);
    console.log("result:---", result)
    let discountToken = result.amount;
    let decoded = jwt.verify(discountToken, process.env.TOKEN_KEY)
    // let decodedAmount = decoded.amountToken.amount;
    // console.log("decodedAmount: ",decodedAmount)
    request.amountToken = decoded;
    response.render("claim", { amount });
}