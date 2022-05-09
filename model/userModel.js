const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    mobile: {
        type: Number,
        required: true,
        unique: true,
        match: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/
    },
    address: {
        address1: {
            type: String,
            required: true
        },
        address2: {
            type: String,
        },
        city: {
            type: String,
            require: true
        },
        district: {
            type: String,
            required: true
        },
        state: {
            type: String,
            require: true
        },
        pincode: {
            type: Number,
            required: true,
            match: /^[0-9]{1,6}$/
        }
    },
    pan_card: {
        type: String,
        required: true,
        unique: true,
        min: 10,
        max: 10
    },
    bank_details: {
        account_no: String,
        ifsc_code: String,
        account_type: {
            type: String,
            default: 'S'
        },
        bank_name: {
            type: String,
        },
        branch_name: {
            type: String
        },
        ac_holder_name: {
            type: String
        },
    },
    firm_name: {
        type: String,
        required: true
    }
});

// To save user details
userSchema.statics.userDetails = async (reqBody) => {
    return new Promise((resolve, reject) => {
        reqBody.address = {
            address1: reqBody.address1,
            address2: reqBody.address2,
            city: reqBody.city,
            district: reqBody.district,
            state: reqBody.state,
            pincode: reqBody.pincode
        }
        reqBody.bank_details = {
            account_no: reqBody.account_no,
            ifsc_code: reqBody.ifsc_code,
            account_type: reqBody.account_type,
            bank_name: reqBody.bank_name,
            branch_name: reqBody.branch_name,
            ac_holder_name: reqBody.ac_holder_name
        }
        let userModel = mongoose.model('users', userSchema);
        let user = userModel(reqBody)
        user.save((error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}

module.exports = mongoose.model('users', userSchema);