// ===============================
// دالة تصحيح مسار الصور (نفس المطاعم)
// ===============================
function getImageUrl(image) {
  if (!image) return "";

  if (image.startsWith("/uploads")) {
    return image;
  }

  if (image.startsWith("uploads/")) {
    return "/" + image;
  }

  return "/uploads/" + image;
}

// ===============================
// جلب العروض للزبون
// ===============================
async function loadOffers() {
  try {
    const res = await fetch("/api/offers");
    const offers = await res.json();

    const offersDiv = document.getElementById("offers");
    offersDiv.innerHTML = "";

    if (!offers.length) {
      offersDiv.innerHTML = "<p>لا توجد عروض حالياً</p>";
      return;
    }

    offers.forEach(offer => {

      // ❌ لا نعرض العروض غير الصالحة
      if (offer.isValidNow === false) return;

      // ===============================
      // تحديد السعر المعروض
      // ===============================
      let priceText = "بدون خصم";

      if (offer.displayPrice) {
        if (offer.displayPrice.type === "special") {
          priceText = `🔥 سعر خاص: ${offer.displayPrice.value} ريال`;
        }

        if (offer.displayPrice.type === "discount") {
          priceText = `🔻 خصم ${offer.displayPrice.value}%`;
        }
      } else {
        // fallback هادئ لو لم تُحسب من السيرفر
        if (offer.specialPrice) {
          priceText = `🔥 سعر خاص: ${offer.specialPrice} ريال`;
        } else if (offer.discountPercent > 0) {
          priceText = `🔻 خصم ${offer.discountPercent}%`;
        }
      }

      // ===============================
      // التواريخ
      // ===============================
      let dateText = "";

      if (offer.startDate || offer.endDate) {
        const start = offer.startDate
          ? new Date(offer.startDate).toLocaleDateString("ar-YE")
          : "";

        const end = offer.endDate
          ? new Date(offer.endDate).toLocaleDateString("ar-YE")
          : "";

        dateText = `<small>⏰ ${start} ${end ? "→ " + end : ""}</small>`;
      }

      // ===============================
      // العرض
      // ===============================
      offersDiv.innerHTML += `
        <div class="card offer-card">
          ${
            offer.image
              ? `<img src="${getImageUrl(offer.image)}" alt="${offer.title}">`
              : ""
          }
          <h3>${offer.title}</h3>
          <p>${priceText}</p>
          ${dateText}
        </div>
      `;
    });

  } catch (err) {
    console.error("❌ خطأ في تحميل العروض:", err);
  }
}

// ===============================
// تشغيل
// ===============================
document.addEventListener("DOMContentLoaded", loadOffers);