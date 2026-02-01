const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const driverAuth = require("../middleware/driverAuth");
// إنشاء طلب
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({
      success: true,
      message: "تم إرسال الطلب بنجاح"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// جلب كل الطلبات (للمدير)

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// جلب الطلبات للسائق
router.get("/driver", driverAuth, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});
// حذف طلب
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "تم حذف الطلب" });
  } catch (err) {
    res.status(500).json({ message: "خطأ في حذف الطلب" });
  }
});
// حذف طلب
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "تم حذف الطلب" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* طلبات السائق فقط (محمي) */
router.get("/driver", driverAuth, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});


module.exports = router;