const msg = document.getElementById("msg");
const codeBox = document.getElementById("codeBox");

// 🇾🇪 تحويل الرقم اليمني إلى صيغة واتساب
function formatYemenPhone(phone) {
  phone = phone.trim();

  // 777xxxxxx → 967777xxxxxx
  if (phone.startsWith("7")) {
    return "967" + phone;
  }

  // 9677xxxxxx → OK
  if (phone.startsWith("967")) {
    return phone;
  }

  return null;
}

// ===============================
// إرسال الكود
// ===============================
async function sendCode() {
  const phoneInput = document.getElementById("phone").value;
  const phone = formatYemenPhone(phoneInput);

  if (!phone) {
    msg.textContent = "❌ رقم الهاتف غير صحيح";
    return;
  }

  msg.textContent = "⏳ جاري إرسال الكود...";

  const res = await fetch("/api/auth/send-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone })
  });

  const data = await res.json();

  if (!res.ok) {
    msg.textContent = "❌ فشل إرسال الكود";
    return;
  }

  msg.textContent = "✅ تم إرسال الكود عبر واتساب";
  codeBox.style.display = "block";
}

// ===============================
// التحقق من الكود
// ===============================
async function verifyCode() {
  const phoneInput = document.getElementById("phone").value;
  const phone = formatYemenPhone(phoneInput);
  const code = document.getElementById("code").value;

  if (!code) {
    msg.textContent = "❌ أدخل الكود";
    return;
  }

  msg.textContent = "⏳ جاري التحقق...";

  const res = await fetch("/api/auth/verify-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code })
  });

  const data = await res.json();

  if (!res.ok) {
    msg.textContent = "❌ الكود غير صحيح";
    return;
  }

  msg.textContent = "✅ تم تسجيل الدخول بنجاح";

  // حفظ رقم الهاتف
  localStorage.setItem("customer_phone", phone);

  // تحويل للرئيسية
  setTimeout(() => {
    window.location.href = "/Customer/index.html";
  }, 1000);
}