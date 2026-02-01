// ===============================
// restaurant.js
// ===============================
function getImageUrl(image) {
  if (!image) return "";

  if (image.startsWith("/uploads/")) {
    return image;
  }

  if (image.startsWith("uploads/")) {
    return "/" + image;
  }

  return "/uploads/" + image;
}
// عنصر عرض الأكلات
const foodsContainer = document.getElementById("foods");

// جلب id المطعم من الرابط
const params = new URLSearchParams(window.location.search);
const restaurantId = params.get("id");

// دالة بناء رابط الصورة (نفس المنطق الناجح)

// جلب الأكلات
// جلب الأكلات
async function loadFoods() {
  if (!restaurantId) {
    foodsContainer.innerHTML = "<p>❌ مطعم غير معروف</p>";
    return;
  }

  // ====== تحميل وهمي ======
  foodsContainer.innerHTML = `
    <div class="skeleton skeleton-card"></div>
    <div class="skeleton skeleton-card"></div>
    <div class="skeleton skeleton-card"></div>
    <div class="skeleton skeleton-card"></div>
  `;

  try {
    const res = await fetch(`/api/foods/by-restaurant/${restaurantId}`);
    const foods = await res.json();

    // مسح التحميل الوهمي
    foodsContainer.innerHTML = "";

    if (!foods.length) {
      foodsContainer.innerHTML = "<p>لا توجد أكلات</p>";
      return;
    }

    foods.forEach((food) => {
      const card = document.createElement("div");
      card.className = "card";

      const img = document.createElement("img");
      img.src = getImageUrl(food.image);
      img.alt = food.name;

      const title = document.createElement("h3");
      title.textContent = food.name;

      const price = document.createElement("p");
      price.textContent = food.price + " ريال";

      const btn = document.createElement("button");
      btn.textContent = "إضافة إلى السلة";
      btn.className = "add-btn";
      btn.onclick = () => addToCart(food);

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(price);
      card.appendChild(btn);

      foodsContainer.appendChild(card);
    });

  } catch (err) {
    console.error("❌ خطأ في تحميل الأكلات:", err);
    foodsContainer.innerHTML =
      "<p>حدث خطأ في تحميل الأكلات</p>";
  }
}



document.addEventListener("DOMContentLoaded", loadFoods);
function addToCart(food) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // هل الأكلة موجودة؟
  const existing = cart.find(item => item._id === food._id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      _id: food._id,
      name: food.name,
      price: food.price,
      image: food.image,
      qty: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("✅ تم الإضافة إلى السلة");
}