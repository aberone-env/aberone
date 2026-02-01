module.exports = function (req, res, next) {
  if (req.session && req.session.driver === true) {
    return next();
  }
  return res.status(401).json({ message: "غير مصرح للسائق" });
};