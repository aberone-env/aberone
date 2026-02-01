const storesDiv = document.getElementById("stores");

function getImageUrl(image) {
  if (!image) return "";
  if (image.startsWith("/uploads")) return image;
  if (image.startsWith("uploads/")) return "/" + image;
  return "/uploads/" + image;
}

async function loadStores() {
  const res = await fetch("/api/stores");
  const stores = await res.json();

  storesDiv.innerHTML = "";

  stores.forEach(s => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${getImageUrl(s.image)}">
      <h3>${s.name}</h3>
      <p>${s.type === "supermarket" ? "🛒 سوبر ماركت" : "🌶️ بهارات"}</p>
      <p>${s.location || ""}</p>
    `;

    storesDiv.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", loadStores);