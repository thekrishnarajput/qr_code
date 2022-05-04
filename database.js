const mongoose = require('mongoose');
const db_url = "mongodb://localhost:27017/qr_code";

mongoose.connect(db_url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((result) => {
        console.log("DB connected")
    })
    .catch((error) => {
        console.log("DB not connected:-", error)
    })

const db = mongoose.connection;
module.exports = db;