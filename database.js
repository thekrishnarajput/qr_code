const mongoose = require('mongoose');
const db_url = "mongodb+srv://thekrishnarajput:1234@practice.h6lsp.mongodb.net/qr_code?retryWrites=true&w=majority";

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