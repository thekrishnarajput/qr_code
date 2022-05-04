const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    amount: {
        type: String,
        required: true
    }
});

// To save discount details
discountSchema.statics.saveDiscount = async (reqBody) => {
    return new Promise((resolve, reject) => {
        let discountModel = mongoose.model('discounts', discountSchema);
        let discount = discountModel({amount: reqBody});
        discount.save((error, result) => {
            if (error) {
                console.log("error in model:- ",error)
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}

// To get discount details from DB
discountSchema.statics.getDiscount = async (reqBody) => {
    return new Promise((resolve, reject) => {
        let discountModel = mongoose.model('discounts', discountSchema);
        discountModel.findOne({amount: reqBody},(error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}

module.exports = mongoose.model('discounts', discountSchema);