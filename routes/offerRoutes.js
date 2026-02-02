const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");
const upload = require("../utils/upload");

// ===============================
// إضافة عرض
// ===============================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const offer = new Offer(req.body);

    if (req.file) {
      offer.image = `uploads/${req.file.filename}`;
    }

    await offer.save();
    res.json(offer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// جلب العروض للزبون (كل العروض حالياً)
// لاحقًا يمكن فلترة حسب التاريخ
// ===============================
router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===============================
// حذف عرض
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: "تم حذف العرض" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;