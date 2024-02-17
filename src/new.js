const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 4000;

// Connect to MongoDB (replace "laliDB" with your actual database name)
mongoose.connect("mongodb://localhost/laliDB", { useNewUrlParser: true });

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const path = require("path");

// Define the schema for the contact form data
const ContactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    subject: String,
    courseType: [String],
    message: String,
});

// Create a model based on the schema
const Contact = mongoose.model('Contact', ContactSchema);

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs"); // Set EJS as the view engine
app.use(express.static(path.join(__dirname, 'public')));

// Render the HTML form
app.get("/contact", (req, res) => {
    res.render("contact");
});

// Handle form submissions
app.post('/submit', async (req, res) => {
    const formData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        subject: req.body.subject,
        courseType: Array.isArray(req.body.courseType) ? req.body.courseType : [req.body.courseType],
        message: req.body.message,
    };

    try {
        // Create a new document using the Contact model
        const contactData = new Contact(formData);

        // Save the document to the database
        await contactData.save();

        // Respond with a success message
        res.send("Your data has been saved successfully");
    } catch (error) {
        console.error(error);
        // Respond with an error message
        res.status(500).send("An error occurred while saving your data.");
    }
});

app.listen(port, () => {
    console.log(`The application started successfully on port ${port}`);
});
