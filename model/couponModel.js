const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    coupon: {
        type: String,
        required: true
    }
});

// To save coupon details
couponSchema.statics.saveCoupon = async (reqBody) => {
    return new Promise((resolve, reject) => {
        let couponModel = mongoose.model('coupons', couponSchema);
        let coupon = couponModel({ amount: reqBody.amount, coupon: reqBody.coupon });
        coupon.save((error, result) => {
            if (error) {
                console.log("error in model:- ", error)
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}

// To get coupon details from DB
couponSchema.statics.getCoupon = async (reqBody) => {
    return new Promise((resolve, reject) => {
        let couponModel = mongoose.model('coupons', couponSchema);
        couponModel.findOne({ coupon: reqBody }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}

// To delete coupon details from DB
couponSchema.statics.deleteCoupon = async (reqBody) => {
    return new Promise((resolve, reject) => {
        let couponModel = mongoose.model('coupons', couponSchema);
        couponModel.deleteOne({ coupon: reqBody }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}

module.exports = mongoose.model('coupons', couponSchema);