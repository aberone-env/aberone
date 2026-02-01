const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");
const Food = require("../models/Food");
const upload = require("../utils/upload");

/* =========================
   إضافة مطعم
========================= */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const restaurant = new Restaurant({
      name: req.body.name,
      image: `/uploads/${req.file.filename}`
    });

    await restaurant.save();
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   جلب كل المطاعم
========================= */
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   جلب مطعم واحد بالـ ID
========================= */
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   حذف مطعم + كل أكلاته
========================= */
router.delete("/:id", async (req, res) => {
  try {
    // حذف الأكلات المرتبطة
    await Food.deleteMany({ restaurantId: req.params.id });

    // حذف المطعم
    await Restaurant.findByIdAndDelete(req.params.id);

    res.json({ message: "تم حذف المطعم وكل الأكلات التابعة له" });
  } catch (err) {
    res.status(500).json({ message: "فشل حذف المطعم" });
  }
});

module.exports = router;