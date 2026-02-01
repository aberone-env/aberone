const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const upload = require("../utils/upload");

// إضافة منتج
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, unit } = req.body;

    const product = new Product({
      name,
      price,
      unit,
      image: `/uploads/${req.file.filename}`
    });

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// جلب كل المنتجات
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// حذف منتج
router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "تم حذف المنتج" });
});

module.exports = router;