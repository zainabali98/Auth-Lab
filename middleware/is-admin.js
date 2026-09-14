const isAdmin = (req, res, next) => {
  if (req.session.user.isAdmin) return next();
  res.redirect("/homepage");
};

module.exports = isAdmin;