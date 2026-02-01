const productsDiv = document.getElementById("products");

function getImageUrl(image) {
  if (!image) return "";
  if (image.startsWith("/uploads")) return image;
  if (image.startsWith("uploads/")) return "/" + image;
  return "/uploads/" + image;
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i._id === product._id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1,
      unit: product.unit
    });
  }

  saveCart(cart);
  alert("✅ تم الإضافة إلى السلة");
}

async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();

  productsDiv.innerHTML = "";

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${getImageUrl(p.image)}">
      <h3>${p.name}</h3>
      <p>${p.price} ريال / ${p.unit}</p>
      <button>إضافة للسلة</button>
    `;

    div.querySelector("button").onclick = () => addToCart(p);
    productsDiv.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", loadProducts);