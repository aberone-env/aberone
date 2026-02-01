const Admin = require('../models/Admin');

// تسجيل دخول المدير
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'بيانات غير صحيحة' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'بيانات غير صحيحة' });
    }

    req.session.adminId = admin._id;
    res.json({ message: 'تم تسجيل الدخول بنجاح' });

  } catch (err) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};

// التحقق هل المدير مسجل دخول
exports.checkAdmin = (req, res) => {
  if (req.session.adminId) {
    return res.json({ loggedIn: true });
  }
  res.status(401).json({ loggedIn: false });
};

// تسجيل خروج
exports.logoutAdmin = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'تم تسجيل الخروج' });
  });
};