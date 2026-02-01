const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const upload = require("../utils/upload");

// ======================
// إضافة أكلة
// ======================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, restaurantId } = req.body;

    const food = new Food({
      name,
      price,
      restaurantId,
      image: `/uploads/${req.file.filename}`
    });

    await food.save();
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ======================
// جلب كل الأكلات (اختياري)
// ======================
router.get("/", async (req, res) => {
  const foods = await Food.find();
  res.json(foods);
});

// ======================
// ⭐⭐ جلب الأكلات حسب المطعم ⭐⭐
// ======================
router.get("/by-restaurant/:restaurantId", async (req, res) => {
  try {
    const foods = await Food.find({
      restaurantId: req.params.restaurantId
    });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: "خطأ في جلب الأكلات" });
  }
});

// ======================
// حذف أكلة
// ======================
router.delete("/:id", async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.json({ message: "تم حذف الأكلة" });
});

module.exports = router;