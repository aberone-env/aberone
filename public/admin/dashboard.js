// ===============================
// أدوات مساعدة
// ===============================
function getImageUrl(image) {
  if (!image) return "";
  if (image.startsWith("/uploads")) return image;
  if (image.startsWith("uploads/")) return "/" + image;
  return "/uploads/" + image;
}

// ===============================
// عناصر الصفحة
// ===============================
const restaurantForm = document.getElementById("addRestaurantForm");
const foodForm = document.getElementById("addFoodForm");
const restaurantsDiv = document.getElementById("restaurants");
const foodsDiv = document.getElementById("foods");
const restaurantSelect = document.getElementById("restaurantSelect");
const foodsRestaurantSelect = document.getElementById("foodsRestaurantSelect");

// ===============================
// تحميل المطاعم
// ===============================
async function loadRestaurants() {
  const res = await fetch("/api/restaurants");
  const restaurants = await res.json();

  restaurantsDiv.innerHTML = "";
  restaurantSelect.innerHTML = `<option value="">اختر مطعم</option>`;
  foodsRestaurantSelect.innerHTML = `<option value="">اختر مطعم</option>`;

  restaurants.forEach(r => {
    restaurantsDiv.innerHTML += `
      <div>
        <h4>${r.name}</h4>
        <img src="${getImageUrl(r.image)}" width="120"><br>
        <button onclick="deleteRestaurant('${r._id}')">حذف المطعم</button>
        <hr>
      </div>
    `;

    restaurantSelect.innerHTML += `<option value="${r._id}">${r.name}</option>`;
    foodsRestaurantSelect.innerHTML += `<option value="${r._id}">${r.name}</option>`;
  });
}

// إضافة مطعم
restaurantForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(restaurantForm);
  await fetch("/api/restaurants", { method: "POST", body: formData });
  restaurantForm.reset();
  loadRestaurants();
});

// حذف مطعم
async function deleteRestaurant(id) {
  await fetch(`/api/restaurants/${id}`, { method: "DELETE" });
  foodsDiv.innerHTML = "";
  loadRestaurants();
}

// ===============================
// الأكلات حسب المطعم
// ===============================
foodsRestaurantSelect.addEventListener("change", async () => {
  const restaurantId = foodsRestaurantSelect.value;
  if (!restaurantId) return (foodsDiv.innerHTML = "");

  const res = await fetch(`/api/foods/by-restaurant/${restaurantId}`);
  const foods = await res.json();
  foodsDiv.innerHTML = "";

  foods.forEach(food => {
    foodsDiv.innerHTML += `
      <div>
        <img src="${getImageUrl(food.image)}" width="80">
        <h4>${food.name}</h4>
        <p>${food.price}</p>
        <button onclick="deleteFood('${food._id}', '${restaurantId}')">حذف</button>
        <hr>
      </div>
    `;
  });
});

// إضافة أكلة
foodForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(foodForm);

  const res = await fetch("/api/foods", {
    method: "POST",
    body: formData
  });

  if (!res.ok) return alert("خطأ في إضافة الأكلة");

  foodForm.reset();
  foodsRestaurantSelect.dispatchEvent(new Event("change"));
});

// حذف أكلة
async function deleteFood(id, restaurantId) {
  await fetch(`/api/foods/${id}`, { method: "DELETE" });
  foodsRestaurantSelect.dispatchEvent(new Event("change"));
}

// ===============================
// المنتجات (خضار / فواكه)
// ===============================
const productForm = document.getElementById("addProductForm");
const productsDiv = document.getElementById("products");

async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();
  productsDiv.innerHTML = "";

  products.forEach(p => {
    productsDiv.innerHTML += `
      <div>
        <img src="${getImageUrl(p.image)}" width="80"><br>
        <strong>${p.name}</strong><br>
        السعر: ${p.price} / ${p.unit}<br>
        <button onclick="deleteProduct('${p._id}')">حذف</button>
        <hr>
      </div>
    `;
  });
}

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(productForm);
  await fetch("/api/products", { method: "POST", body: formData });
  productForm.reset();
  loadProducts();
});

async function deleteProduct(id) {
  await fetch(`/api/products/${id}`, { method: "DELETE" });
  loadProducts();
}

// ===============================
// العروض (✔️ الإصلاح هنا)
// ===============================
const offerForm = document.getElementById("addOfferForm");
const offersDiv = document.getElementById("offers");

// تحميل العروض
async function loadOffers() {
  const res = await fetch("/api/offers");
  const offers = await res.json();
  offersDiv.innerHTML = "";

  offers.forEach(o => {
    offersDiv.innerHTML += `
      <div style="border:1px solid #ccc; padding:10px; margin:8px;">
        ${o.image ? `<img src="${getImageUrl(o.image)}" width="80"><br>` : ""}
        <strong>${o.title}</strong><br>
        النوع: ${o.type}<br>
        الخصم: ${o.discountPercent || "-"}%<br>
        السعر الخاص: ${o.specialPrice || "-"}<br>
        <button onclick="deleteOffer('${o._id}')">🗑️ حذف</button>
      </div>
    `;
  });
}

// إضافة عرض
offerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(offerForm);

  const res = await fetch("/api/offers", {
    method: "POST",
    body: formData
  });

  if (!res.ok) return alert("❌ فشل إضافة العرض");

  offerForm.reset();
  loadOffers();
});

// حذف عرض
async function deleteOffer(id) {
  await fetch(`/api/offers/${id}`, { method: "DELETE" });
  loadOffers();
}

// ===============================
// المتاجر
// ===============================
const storeForm = document.getElementById("addStoreForm");
const storesDiv = document.getElementById("stores");

async function loadStores() {
  const res = await fetch("/api/stores");
  const stores = await res.json();
  storesDiv.innerHTML = "";

  stores.forEach(s => {
    storesDiv.innerHTML += `
      <div>
        <img src="${getImageUrl(s.image)}" width="80"><br>
        <strong>${s.name}</strong><br>
        النوع: ${s.type}<br>
        الموقع: ${s.location || "-"}<br>
        ${s.description || ""}
        <br>
        <button onclick="deleteStore('${s._id}')">حذف</button>
        <hr>
      </div>
    `;
  });
}

storeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(storeForm);
  await fetch("/api/stores", { method: "POST", body: formData });
  storeForm.reset();
  loadStores();
});

async function deleteStore(id) {
  await fetch(`/api/stores/${id}`, { method: "DELETE" });
  loadStores();
}

// ===============================
// تسجيل الخروج
// ===============================
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await fetch("/api/admin/logout", { method: "POST" });
  window.location.href = "/admin";
});

async function loadOrders() {
  const res = await fetch("/api/orders");
  const orders = await res.json();

  const ordersDiv = document.getElementById("orders");
  ordersDiv.innerHTML = "";

  orders.forEach(o => {

    // ===============================
    // تجهيز عناصر الطلب
    // ===============================
    let itemsHtml = "";

    if (Array.isArray(o.items) && o.items.length > 0) {
      o.items.forEach(item => {

        // 🔒 حماية من undefined
        const qty =
          item.qty ??
          item.quantity ??
          item.count ??
          1;

        const price =
          item.price ??
          0;

        itemsHtml += `
          <li style="margin-bottom:6px;">
            🧾 ${item.name} × ${qty}
            — <strong>${price} ريال</strong>
          </li>
        `;
      });
    } else {
      itemsHtml = "<li>لا توجد عناصر</li>";
    }

    // ===============================
    // عرض الطلب
    // ===============================
    ordersDiv.innerHTML += `
  <div class="order-card">

    <p><strong>📞 الهاتف:</strong> ${o.phone || "-"}</p>

    <p><strong>📍 الموقع:</strong>
      ${
        typeof o.location === "string"
          ? o.location
          : (o.location?.address || "غير محدد")
      }
    </p>
     <p><strong>📝 ملاحظات الزبون:</strong> ${o.notes || "لا توجد ملاحظات"}</p>
    <div class="order-items">
      <strong>📦 محتويات الطلب:</strong>
      <ul style="list-style:none; padding:0; margin:8px 0 0 0;">
        ${itemsHtml}
      </ul>
    </div>

    <p><strong>💰 الإجمالي:</strong> ${o.total || "-"} ريال</p>

    <p class="order-status status-${o.status}">
      📌 الحالة: ${o.status}
    </p>

    <div class="order-actions">
      <button class="btn-accept" onclick="updateOrder('${o._id}', 'accepted')">قبول</button>
      <button class="btn-done" onclick="updateOrder('${o._id}', 'done')">تم</button>
      <button class="btn-cancel" onclick="updateOrder('${o._id}', 'cancelled')">إلغاء</button>
      <button class="btn-delete" onclick="deleteOrder('${o._id}')">حذف</button>
    </div>

  </div>
`;
  });
}

async function updateOrder(id, status) {
  await fetch("/api/orders/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });

  loadOrders();
}

async function deleteOrder(id) {
  const confirmDelete = confirm("هل أنت متأكد من حذف الطلب؟");
  if (!confirmDelete) return;

  await fetch("/api/orders/" + id, {
    method: "DELETE"
  });

  loadOrders(); // تحديث القائمة
}
// ===============================
// تشغيل أولي
// ===============================
loadRestaurants();
loadProducts();
loadOffers();
loadStores();
loadOrders();