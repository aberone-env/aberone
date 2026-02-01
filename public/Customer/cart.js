// ===============================
// cart.js
// ===============================

// 🔹 سعر التوصيل الثابت
const DELIVERY_COST = 500;

// عناصر الصفحة
const cartContainer = document.getElementById("cart-items");
const totalEl = document.getElementById("total");
const deliveryPriceEl = document.getElementById("delivery-price");

const noteNameInput = document.getElementById("note-name");
const notePriceInput = document.getElementById("note-price");
const addNoteBtn = document.getElementById("add-note-btn");
const notesList = document.getElementById("notes-list");

// ملاحظات إضافية (إضافات مدفوعة)
let extraNotes = [];

// ===============================
// السلة (LocalStorage)
// ===============================
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ===============================
// رابط الصورة
// ===============================
function getImageUrl(image) {
  if (!image) return "";
  if (image.startsWith("/uploads")) return image;
  if (image.startsWith("uploads/")) return "/" + image;
  return "/uploads/" + image;
}

// ===============================
// عرض السلة
// ===============================
function renderCart() {
  const cart = getCart();
  cartContainer.innerHTML = "";

  let itemsTotal = 0;
  let notesTotal = extraNotes.reduce((sum, n) => sum + n.price, 0);

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>السلة فارغة 🛒</p>";
    totalEl.textContent = "";
    if (deliveryPriceEl) deliveryPriceEl.textContent = DELIVERY_COST;
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    itemsTotal += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${getImageUrl(item.image)}">

      <div class="info">
        <h4>${item.name}</h4>

        <p>
          ${item.qty} × ${item.price} =
          <strong>${itemTotal}</strong> ريال
        </p>

        <div class="qty">
          <button onclick="changeQty(${index}, -1)">➖</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${index}, 1)">➕</button>
        </div>

        <button class="remove" onclick="removeItem(${index})">
          🗑️ حذف
        </button>
      </div>
    `;

    cartContainer.appendChild(div);
  });

  if (deliveryPriceEl) deliveryPriceEl.textContent = DELIVERY_COST;

  const finalTotal = itemsTotal + DELIVERY_COST + notesTotal;
  totalEl.textContent = `الإجمالي: ${finalTotal} ريال`;
}

// ===============================
// تعديل الكمية
// ===============================
function changeQty(index, delta) {
  const cart = getCart();
  cart[index].qty += delta;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCart();
}

// ===============================
// حذف عنصر
// ===============================
function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

// ===============================
// الإضافات / الملاحظات المدفوعة
// ===============================
addNoteBtn.addEventListener("click", () => {
  const name = noteNameInput.value.trim();
  const price = Number(notePriceInput.value);

  if (!name || !price) {
    alert("أدخل اسم الإضافة وسعرها");
    return;
  }

  extraNotes.push({ name, price });

  noteNameInput.value = "";
  notePriceInput.value = "";

  renderNotes();
  renderCart();
});

function renderNotes() {
  notesList.innerHTML = "";

  extraNotes.forEach((note, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${note.name} - ${note.price} ريال</span>
      <button onclick="removeNote(${index})">🗑️</button>
    `;
    notesList.appendChild(li);
  });
}

function removeNote(index) {
  extraNotes.splice(index, 1);
  renderNotes();
  renderCart();
}

// ===============================
// تشغيل
// ===============================
document.addEventListener("DOMContentLoaded", renderCart);

// ===============================
// إرسال الطلب
// ===============================
async function submitOrder() {
  const cart = getCart();

  if (!cart.length) {
    alert("السلة فارغة");
    return;
  }

  const phone = document.getElementById("phone").value.trim();
  const location = document.getElementById("location").value.trim();
  const notesText = document.getElementById("notes").value.trim();

  if (!phone || !location) {
    alert("يرجى إدخال رقم الهاتف والموقع");
    return;
  }

  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
  });

  extraNotes.forEach(n => {
    total += n.price;
  });

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        location,
        delivery: DELIVERY_COST,
        total,
        notes: notesText,
        extras: extraNotes,
        items: cart.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.qty // ✅ التصحيح المهم
        }))
      })
    });

    if (!res.ok) {
      alert("فشل إرسال الطلب");
      return;
    }

    alert("✅ تم إرسال الطلب بنجاح");

    localStorage.removeItem("cart");
    window.location.href = "/Customer/index.html";

  } catch (err) {
    alert("خطأ في الاتصال بالسيرفر");
  }
}