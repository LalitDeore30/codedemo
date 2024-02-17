const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const collection = require("./config");
const bcrypt = require("bcrypt");

const app = express();
const port = 4000;

mongoose.connect("mongodb://localhost/laliDB", { useNewUrlParser: true });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "public")));

const ContactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    subject: String,
    courseType: [String],
    message: String,
});

const Contact = mongoose.model("Contact", ContactSchema);

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password,
    };

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword;

    // Use mongoose to store data in the database for signup
    // ...

    res.render("contact");
});

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        // Use mongoose to check user credentials in the database for login
        // ...

        res.render("contact");
    } catch {
        res.send("wrong Details");
    }
});

app.post("/submit", async (req, res) => {
    const formData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        subject: req.body.subject,
        courseType: Array.isArray(req.body.courseType) ? req.body.courseType : [req.body.courseType],
        message: req.body.message,
    };

    try {
        const contactData = new Contact(formData);
        await contactData.save();
        res.send("Your data has been saved successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while saving your data.");
    }
});

app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});
