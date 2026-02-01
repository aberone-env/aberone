const form = document.getElementById("catForm");
const container = document.getElementById("categories");

form.onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  await fetch("/admin/categories", {
    method: "POST",
    body: formData
  });

  form.reset();
  loadCategories();
};

async function loadCategories() {
  const res = await fetch("/api/categories");
  const data = await res.json();

  container.innerHTML = "";

  data.forEach(cat => {
    container.innerHTML += `
      <div>
        <img src="${cat.image}" width="80">
        <strong>${cat.name}</strong>
        <button onclick="deleteCat('${cat._id}')">حذف</button>
      </div>
    `;
  });
}

async function deleteCat(id) {
  await fetch("/admin/categories/" + id, { method: "DELETE" });
  loadCategories();
}
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin123456") {
    window.location.href = "/admin/dashboard.html";
  } else {
    alert("❌ اسم المستخدم أو كلمة المرور خطأ");
  }
}
loadCategories();