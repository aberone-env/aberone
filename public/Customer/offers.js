// ===============================
// دالة تصحيح مسار الصور
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
    const data = await res.json();

    // دعم كل أشكال الـ API (Array أو Object)
    const offers = Array.isArray(data) ? data : data.offers || [];

    const offersDiv = document.getElementById("offers");
    offersDiv.innerHTML = "";

    if (!offers.length) {
      offersDiv.innerHTML = "<p>لا توجد عروض حالياً</p>";
      return;
    }

    offers.forEach((offer) => {

      // تجاهل العرض فقط إذا كان متأكد أنه غير صالح
      if ("isValidNow" in offer && offer.isValidNow === false) return;

      // ===============================
      // استخراج الصورة (آمن 100%)
      // ===============================
      const imagePath =
        typeof offer.image === "string"
          ? offer.image
          : offer.image?.path || offer.image?.url || "";

      const imageHtml = imagePath
  ? `<img src="${getImageUrl(imagePath)}" alt="${offer.title}"
     onerror="this.style.display='none'">`
  : "";

      // ===============================
      // السعر المعروض
      // ===============================
      let priceText = "بدون خصم";

      if (offer.displayPrice) {
        if (offer.displayPrice.type === "special") {
          priceText = `🔥 سعر خاص: ${offer.displayPrice.value} ريال`;
        } else if (offer.displayPrice.type === "discount") {
          priceText = `🔻 خصم ${offer.displayPrice.value}%`;
        }
      } else {
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

        dateText = `<small>⏰ ${start}${end ? " → " + end : ""}</small>`;
      }

      // ===============================
      // كرت العرض
      // ===============================
      offersDiv.innerHTML += `
        <div class="card offer-card">
          ${imageHtml}
          <h3>${offer.title}</h3>
          <p>${priceText}</p>
          ${dateText}
        </div>
      `;
    });

  } catch (err) {
    console.error("❌ خطأ في تحميل العروض:", err);
    document.getElementById("offers").innerHTML =
      "<p>حدث خطأ أثناء تحميل العروض</p>";
  }
}

// ===============================
// تشغيل
// ===============================
document.addEventListener("DOMContentLoaded", loadOffers);