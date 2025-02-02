const express = require("express");
const { submitContactForm } = require("../controllers/contactController");

const router = express.Router();

router.post("/", submitContactForm); // API endpoint for contact form

module.exports = router;