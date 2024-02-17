const mongoose = require('mongoose');
//const connect = mongoose.connect("mongodb+srv://lalit302004:DljNQUljqFv9Z9Lf@cluster0.acprnw5.mongodb.net/?retryWrites=true&w=majority");
const connect = mongoose.connect("mongodb://localhost:27017/Login-tut");
// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
    .catch(() => {
        console.log("Database cannot be Connected");
    })

// Create Schema
const Loginschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// collection part
const collection = new mongoose.model("users", Loginschema);

module.exports = collection;
