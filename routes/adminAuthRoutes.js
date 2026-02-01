const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

// تسجيل الدخول
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin) {
    return res.status(401).json({ message: "بيانات غير صحيحة" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: "بيانات غير صحيحة" });
  }

  req.session.adminId = admin._id;
  res.json({ message: "تم تسجيل الدخول" });
});

// تسجيل الخروج
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "تم تسجيل الخروج" });
});

module.exports = router;