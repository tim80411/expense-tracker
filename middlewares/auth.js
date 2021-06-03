module.exports = {
  authenticator(req, res, next) {
    if (!req.isAuthenticated()) {
      req.flash('error', 'Please login first')
      return res.redirect('/users/login')
    }
    return next()
  }
}