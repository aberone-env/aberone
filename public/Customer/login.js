const API_BASE = "https://aberone-1.onrender.com/api/whatsapp";

// عناصر الصفحة
const phoneInput = document.getElementById("phone");
const codeInput = document.getElementById("code");
const sendBtn = document.getElementById("sendCodeBtn");
const verifyBtn = document.getElementById("verifyCodeBtn");
const statusBox = document.getElementById("status");

// إرسال كود واتساب
sendBtn.addEventListener("click", async () => {
  const phone = phoneInput.value.trim();

  if (!phone) {
    statusBox.innerText = "❌ أدخل رقم الهاتف";
    return;
  }

  statusBox.innerText = "⏳ جاري إرسال الكود عبر واتساب...";

  try {
    const res = await fetch(`${API_BASE}/send-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json();

    if (data.success) {
      statusBox.innerText = "✅ تم إرسال الكود، افحص واتساب";
    } else {
      statusBox.innerText = "❌ فشل الإرسال";
    }
  } catch (err) {
    console.error(err);
    statusBox.innerText = "❌ خطأ في الاتصال بالسيرفر";
  }
});

// التحقق من الكود
verifyBtn.addEventListener("click", async () => {
  const phone = phoneInput.value.trim();
  const code = codeInput.value.trim();

  if (!phone || !code) {
    statusBox.innerText = "❌ أدخل الرقم والكود";
    return;
  }

  statusBox.innerText = "⏳ جاري التحقق...";

  try {
    const res = await fetch(`${API_BASE}/verify-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, code }),
    });

    const data = await res.json();

    if (data.success) {
      statusBox.innerText = "✅ تم تسجيل الدخول بنجاح";
      // هنا لاحقًا نوجّه المستخدم
      // window.location.href = "/customer/home.html";
    } else {
      statusBox.innerText = "❌ الكود غير صحيح";
    }
  } catch (err) {
    console.error(err);
    statusBox.innerText = "❌ خطأ في السيرفر";
  }
});