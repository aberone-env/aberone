const express = require("express");
const axios = require("axios");

const router = express.Router();

/*
=====================================
🔐 إعدادات من Environment Variables
(توضع في Render → Environment)
=====================================
*/
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const OTP_EXPIRE_MINUTES = Number(process.env.OTP_EXPIRE_MINUTES || 5);

/*
=====================================
🧠 تخزين الأكواد مؤقتًا
(لاحقًا ننقلها إلى MongoDB)
=====================================
*/
const codes = {};

/*
=====================================
📩 إرسال كود التحقق عبر واتساب
POST /api/auth/send-code
BODY: { phone }
=====================================
*/
router.post("/send-code", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({
      success: false,
      error: "رقم الهاتف مطلوب",
    });
  }

  // توليد كود 6 أرقام
  const code = Math.floor(100000 + Math.random() * 900000);

  // حفظ الكود مع وقت الانتهاء
  codes[phone] = {
    code,
    expiresAt: Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000,
  };

  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: {
          body: `🔐 كود تسجيل الدخول الخاص بك هو:\n\n${code}\n\n⏳ صالح لمدة ${OTP_EXPIRE_MINUTES} دقائق.\n❗ لا تشارك الرمز مع أي شخص.`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({
      success: true,
      message: "تم إرسال كود التحقق بنجاح",
    });
  } catch (error) {
    console.error(
      "WhatsApp API Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      error: "فشل إرسال الكود عبر واتساب",
    });
  }
});

/*
=====================================
✅ التحقق من كود واتساب
POST /api/auth/verify-code
BODY: { phone, code }
=====================================
*/
router.post("/verify-code", (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({
      success: false,
      error: "رقم الهاتف والكود مطلوبان",
    });
  }

  const record = codes[phone];

  if (!record) {
    return res.status(401).json({
      success: false,
      error: "لا يوجد كود لهذا الرقم",
    });
  }

  // التحقق من انتهاء الصلاحية
  if (Date.now() > record.expiresAt) {
    delete codes[phone];
    return res.status(401).json({
      success: false,
      error: "انتهت صلاحية الكود",
    });
  }

  // التحقق من الكود
  if (record.code.toString() !== code.toString()) {
    return res.status(401).json({
      success: false,
      error: "الكود غير صحيح",
    });
  }

  // نجاح التحقق
  delete codes[phone];

  return res.json({
    success: true,
    message: "تم تسجيل الدخول بنجاح",
    user: {
      phone,
    },
  });
});

module.exports = router;