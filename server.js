require("dotenv").config();
const session = require("express-session");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const adminAuth = require("./middleware/adminAuth");
const restaurantRoutes = require("./routes/restaurantRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const offerRoutes = require("./routes/offerRoutes");
const storeRoutes = require("./routes/storeRoutes");
const productRoutes = require("./routes/productRoutes");
const driverRoutes = require("./routes/driverRoutes");
const driverAuth = require("./middleware/driverAuth");
const whatsappRoutes = require("./routes/whatsapp");



const app = express();

/* ======================
   Middleware
====================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false
  })
);

/* ======================
   Static folders
====================== */
app.use(express.static(path.join(__dirname, "public")));

/* ======================
   MongoDB
====================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* ======================
   API Routes
====================== */
app.use("/api/driver", driverRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/whatsapp", whatsappRoutes);
/* ======================
   Pages
====================== */

// صفحة الزبون
app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "Customer", "index.html")
  );
});

// صفحة السلة
app.get("/cart", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "Customer", "cart.html")
  );
});

// تسجيل دخول المدير
app.get("/admin", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "admin", "login.html")
  );
});

// لوحة تحكم المدير (محمية)
app.get("/admin/dashboard", adminAuth, (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "admin", "dashboard.html")
  );
});
//جمايه صفحه السائق
app.get("/driver/dashboard.html", driverAuth, (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "driver", "dashboard.html")
  );
});

/* ======================
   Fallback
====================== */
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

/* ======================
   Server
====================== */
const PORT = process.env.PORT || 5000;



app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
