const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

// MongoDB වලට Connect වීම
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("Connected to MongoDB...");

        // ඔයාට කැමති Username එකයි Password එකයි මෙතන දෙන්න
        const adminUsername = "sachinadmin";
        const adminPassword = "sachinpassword123";

        // Password එක Encrypt කිරීම (ආරක්ෂා කිරීම)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // අලුත් Admin කෙනෙක් හැදීම
        const newAdmin = new User({
            username: adminUsername,
            password: hashedPassword
        });

        await newAdmin.save();
        console.log("✅ Admin account created successfully!");
        
        mongoose.connection.close();
    })
    .catch(err => console.log(err));