const express = require("express");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const router = express.Router();

// =======================
// تسجيل دخول المدير
// =======================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "بيانات غير صحيحة" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "بيانات غير صحيحة" });
    }

    // إنشاء session
    req.session.admin = true;
    req.session.adminId = admin._id;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "خطأ في السيرفر" });
  }
});

// =======================
// تسجيل الخروج
// =======================
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

module.exports = router;