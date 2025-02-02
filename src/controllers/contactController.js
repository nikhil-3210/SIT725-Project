const Contact = require("../models/Contact");

// @desc    Save contact form data
// @route   POST /api/contact
// @access  Public
exports.submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();

    res.status(201).json({ message: "Your message has been received!", contact });
  } catch (error) {
    console.error("Error saving contact form:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};