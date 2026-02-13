const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://127.0.0.1:5500',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Create Contact Schema
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'unread' },
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Email configuration (optional)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Portfolio API is running' });
});

// Contact form endpoint
app.post('/api/contact',
    // Validation rules
    [
        body('name').notEmpty().trim().escape(),
        body('email').isEmail().normalizeEmail(),
        body('subject').notEmpty().trim().escape(),
        body('message').notEmpty().trim().escape()
    ],
    async (req, res) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    success: false, 
                    errors: errors.array() 
                });
            }

            const { name, email, subject, message } = req.body;

            console.log('📩 New Contact Form Submission:');
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Subject:', subject);
            console.log('Message:', message);

            // Save to MongoDB
            const contact = new Contact({
                name,
                email,
                subject,
                message
            });
            await contact.save();
            console.log('✅ Data saved to MongoDB');

            // Send email notification (optional)
            try {
                if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                    await transporter.sendMail({
                        from: process.env.EMAIL_USER,
                        to: process.env.EMAIL_USER,
                        subject: `New Contact Form: ${subject}`,
                        html: `
                            <h2>New Contact Form Submission</h2>
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Subject:</strong> ${subject}</p>
                            <p><strong>Message:</strong> ${message}</p>
                        `
                    });
                    console.log('✅ Email notification sent');
                }
            } catch (emailError) {
                console.log('⚠️ Email notification failed:', emailError.message);
                // Don't fail the request if email fails
            }

            // Send success response
            res.status(201).json({
                success: true,
                message: 'Thank you for your message! I will get back to you soon.',
                data: {
                    name,
                    email,
                    subject,
                    message
                }
            });

        } catch (error) {
            console.error('❌ Error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Something went wrong. Please try again later.' 
            });
        }
    }
);

// Get all contacts (for admin use - you can add authentication later)
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({ success: true, data: contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Contact form endpoint: http://localhost:${PORT}/api/contact`);
});