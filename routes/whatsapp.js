const express = require("express");
const axios = require("axios");

const router = express.Router();

// تخزين الأكواد مؤقتًا (لاحقًا يمكن ربطها بقاعدة بيانات)
const codes = {};

// 🔐 بيانات واتساب (ثابتة عندك)
const WHATSAPP_TOKEN =
  "EAASIldhTB4QBQoK03C1Fa6580IQJiVz1xeVZAZCiZA0cuu8LLxtqReNBeNrc4YyAKUZCRTvjbhHfzfaA7HvZClAR5ORUNy3eXyWCdupznVZBenZA7NUDz8JoTiqZAZCNOE3bzGMpAXrrb3Co7N3fBrFhjw3Jg8ZBZAdrVwYOMpuwa5y2G4tEEwdWy4Snd6iVJnnkn09kcJxLeGCIaehu6bQZBSsa017yvXgodjzpc64JZAFiuxkYfAeZC5dQZDZD";

const PHONE_NUMBER_ID = "981771608349591";

// =================================================
// 📩 إرسال كود التحقق
// =================================================
router.post("/send-code", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "رقم الهاتف مطلوب" });
  }

  // توليد كود من 6 أرقام
  const code = Math.floor(100000 + Math.random() * 900000);

  // حفظ الكود
  codes[phone] = code;

  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: {
          body: `🔐 كود تسجيل الدخول الخاص بك هو:\n\n${code}\n\nلا تشارك هذا الرمز مع أي شخص.`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      message: "تم إرسال الكود بنجاح",
    });
  } catch (error) {
    console.error(
      "WhatsApp Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      error: "فشل إرسال الكود عبر واتساب",
    });
  }
});

// =================================================
// ✅ التحقق من الكود
// =================================================
router.post("/verify-code", (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({
      error: "رقم الهاتف والكود مطلوبان",
    });
  }

  if (codes[phone] && codes[phone].toString() === code.toString()) {
    // حذف الكود بعد النجاح
    delete codes[phone];

    return res.json({
      success: true,
      message: "تم التحقق بنجاح",
      user: {
        phone,
      },
    });
  } else {
    return res.status(401).json({
      success: false,
      error: "الكود غير صحيح",
    });
  }
});

module.exports = router;