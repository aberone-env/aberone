require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {

    const username = "admin";
    const plainPassword = "123456";

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await Admin.create({
      username,
      password: hashedPassword
    });

    console.log("✅ Admin created with encrypted password");
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit();
  });