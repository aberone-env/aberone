module.exports = (req, res, next) => {
  if (req.session && req.session.admin === true) {
    next();
  } else {
    res.redirect("/admin");
  }
};