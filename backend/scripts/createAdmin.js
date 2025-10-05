require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminUser = new User({
      name: "Admin User",
      email: "admin@courier-tracking.com",
      passwordHash: "admin123", // This will be hashed by the model
      role: "admin",
      phone: "1234567890",
      address: "Admin Office",
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    console.log("Email: admin@courier-tracking.com");
    console.log("Password: admin123");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdminUser();
