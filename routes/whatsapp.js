const express = require("express");
const axios = require("axios");

const router = express.Router();

// تخزين الأكواد مؤقتًا (للتجربة)
const codes = {};

// ================================
// بيانات واتساب من Environment
// ================================
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_ID;

// ================================
// إرسال كود (Template تجريبي)
// ================================
router.post("/send-code", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "رقم الهاتف مطلوب" });
  }

  // توليد كود (للمرحلة القادمة)
  const code = Math.floor(100000 + Math.random() * 900000);
  codes[phone] = code;

  try {
    // ⚠️ Template افتراضي من Meta
    await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
          name: "hello_world",
          language: { code: "en_US" }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.json({
      success: true,
      message: "تم إرسال رسالة اختبار عبر واتساب"
    });

  } catch (error) {
    console.error("WhatsApp API Error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      error: "فشل الإرسال من واتساب"
    });
  }
});

// ================================
// التحقق من الكود (لاحقًا)
// ================================
router.post("/verify-code", (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ error: "البيانات ناقصة" });
  }

  if (codes[phone] && codes[phone].toString() === code.toString()) {
    delete codes[phone];
    return res.json({ success: true });
  }

  return res.status(401).json({ success: false, error: "الكود غير صحيح" });
});

module.exports = router;