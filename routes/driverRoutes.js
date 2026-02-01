const express = require("express");
const router = express.Router();

/* بيانات ثابتة للسائق */
const DRIVER_USER = "driver";
const DRIVER_PASS = "123456";

/* تسجيل الدخول */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === DRIVER_USER && password === DRIVER_PASS) {
    req.session.driver = true; // ✅ حفظ الجلسة
    return res.json({ success: true });
  }

  return res.status(401).json({ message: "بيانات غير صحيحة" });
});

/* تسجيل الخروج */
router.post("/logout", (req, res) => {
  req.session.driver = null;
  res.json({ success: true });
});

module.exports = router;