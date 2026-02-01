// ===============================
// app.js (صفحة المطاعم)
// ===============================

const restaurantsContainer = document.getElementById("restaurants");

// ===============================
// دالة بناء رابط الصورة (ذكية)
// ===============================
function getImageUrl(image) {
  if (!image) return "";

  // إذا كان الرابط جاهز (يبدأ بـ /uploads)
  if (image.startsWith("/uploads")) {
    return image;
  }

  // إذا كان اسم ملف فقط
  return "/uploads/" + image;
}

// ===============================
// جلب المطاعم
// ===============================
async function loadRestaurants() {
  try {
    const res = await fetch("/api/restaurants");
    const restaurants = await res.json();

    restaurantsContainer.innerHTML = "";

    if (!restaurants.length) {
      restaurantsContainer.innerHTML = "<p>لا توجد مطاعم</p>";
      return;
    }

    restaurants.forEach((r) => {
      console.log("IMAGE FROM DB:", r.image); // ✔️ هنا فقط

      const card = document.createElement("div");
      card.className = "card";

      const img = document.createElement("img");
      img.src = getImageUrl(r.image);
      img.alt = r.name;

      const title = document.createElement("h3");
      title.textContent = r.name;

      card.appendChild(img);
      card.appendChild(title);

      card.onclick = () => {
      window.location.href = `/Customer/restaurant.html?id=${r._id}`;
      };

      restaurantsContainer.appendChild(card);
    });

  } catch (err) {
    console.error("❌ خطأ:", err);
    restaurantsContainer.innerHTML =
      "<p>حدث خطأ في تحميل المطاعم</p>";
  }
}

// ===============================
document.addEventListener("DOMContentLoaded", loadRestaurants);