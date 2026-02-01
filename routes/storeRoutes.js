const express = require("express");
const router = express.Router();
const Store = require("../models/Store");
const upload = require("../utils/upload");

// إضافة متجر
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, type, location, description } = req.body;

    const store = new Store({
      name,
      type,
      location,
      description,
      image: `/uploads/${req.file.filename}`
    });

    await store.save();
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// جلب كل المتاجر
router.get("/", async (req, res) => {
  const stores = await Store.find();
  res.json(stores);
});

// حذف متجر
router.delete("/:id", async (req, res) => {
  await Store.findByIdAndDelete(req.params.id);
  res.json({ message: "تم حذف المتجر" });
});

module.exports = router;