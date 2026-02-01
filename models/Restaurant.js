const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: String,
  image: String,
  category: String,
});
function sendOrder() {
  fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      restaurantId,
      items: cart,
      total: document.getElementById("total").innerText
    })
  })
  .then(() => {
    alert("✅ تم إرسال الطلب");
    cart = [];
    renderCart();
  });
}
module.exports = mongoose.model("Restaurant", restaurantSchema);