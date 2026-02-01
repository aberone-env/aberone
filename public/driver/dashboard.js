// ===============================
// dashboard.js - لوحة السائق
// ===============================

let lastOrderCount = 0;

const ordersDiv = document.getElementById("orders");
const notifySound = document.getElementById("notifySound");

// ===============================
// تشغيل صوت التنبيه
// ===============================
function playNotify() {
  if (notifySound) {
    notifySound.currentTime = 0;
    notifySound.play().catch(() => {});
  }
}

// ===============================
// تحميل الطلبات + حماية الصفحة
// ===============================
async function loadOrders() {
  try {
    const res = await fetch("/api/orders/driver");

    // 🔐 إذا غير مسجل دخول → رجوع لتسجيل الدخول
    if (res.status === 401 || res.status === 403) {
      window.location.href = "/driver/login.html";
      return;
    }

    const orders = await res.json();

    // 🔔 تنبيه عند وصول طلب جديد
    if (lastOrderCount !== 0 && orders.length > lastOrderCount) {
      playNotify();
    }

    lastOrderCount = orders.length;

    ordersDiv.innerHTML = "";

    if (!orders.length) {
      ordersDiv.innerHTML = "<p>لا توجد طلبات حالياً</p>";
      return;
    }

    orders.forEach(o => {
      let itemsHtml = "";

      if (Array.isArray(o.items)) {
        o.items.forEach(i => {
          itemsHtml += `<li>${i.name} × ${i.qty || i.quantity}</li>`;
        });
      }

      // ⏰ وقت الطلب
      const orderTime = o.createdAt
        ? new Date(o.createdAt).toLocaleString("ar-YE")
        : "غير معروف";

      ordersDiv.innerHTML += `
        <div class="order-card">
          <p>📞 الهاتف: <strong>${o.phone}</strong></p>
          <p>📍 الموقع: ${o.location}</p>
          <p>⏰ وقت الطلب: ${orderTime}</p>

          <p><strong>📦 محتويات الطلب:</strong></p>
          <ul>${itemsHtml || "<li>لا توجد عناصر</li>"}</ul>

          <p>💰 <strong>المجموع: ${o.total} ريال</strong></p>
          <p>📌 الحالة: ${o.status || "جديد"}</p>

          <div class="actions">
            <button class="btn-accept" onclick="updateStatus('${o._id}','accepted')">استلام</button>
            <button class="btn-delivering" onclick="updateStatus('${o._id}','delivering')">جاري</button>
            <button class="btn-done" onclick="updateStatus('${o._id}','done')">تم</button>
          </div>
        </div>
      `;
    });

  } catch (err) {
    console.error("❌ خطأ في جلب الطلبات", err);
    window.location.href = "/driver/login.html";
  }
}

// ===============================
// تحديث حالة الطلب
// ===============================
async function updateStatus(id, status) {
  await fetch("/api/orders/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });

  loadOrders();
}

// ===============================
// تسجيل الخروج
// ===============================
async function logout() {
  await fetch("/api/driver/logout", { method: "POST" });
  window.location.href = "/driver/login.html";
}

// ===============================
// تشغيل أولي + تحديث تلقائي
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  loadOrders();
  setInterval(loadOrders, 5000);
});